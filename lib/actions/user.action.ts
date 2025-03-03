"use server"
import { createAdminClient, createSessionClient } from "@/lib/appwrite"
import { ID, Models, Query } from "node-appwrite"
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { appwriteConfig } from "../appwrite/config"
import { AppwriteBank, AppwriteUser } from "@/types/appwrite.types"
import {
	CountryCode,
	ProcessorTokenCreateRequest,
	ProcessorTokenCreateRequestProcessorEnum,
	Products
} from "plaid"
import { plaidClient } from "../plaid"
import { revalidatePath } from "next/cache"
import { addFundingSource, createDwollaCustomer } from "./dwolla.action"

export const handleErrors = async (error: unknown, message: string) => {
	console.log(error, message)
	throw error
}

export const getUserInfo = async ({
	userId
}: getUserInfoProps): Promise<AppwriteUser | undefined> => {
	try {
		const { database } = await createAdminClient()
		const user = await database.listDocuments(
			appwriteConfig.databaseId!,
			appwriteConfig.userCollectionId!,
			[Query.equal("userId", [userId])]
		)
		return parseStringify(user.documents[0])
	} catch (error) {
		handleErrors(error, "Failed to get user info")
	}
}

export const sendEmailOTP = async (email: string) => {
	try {
		const { account } = await createAdminClient()
		const session = await account.createEmailToken(ID.unique(), email)
		return session.userId
	} catch (error) {
		handleErrors(error, "Failed to send email OTP")
	}
}

export const createAccount = async (userData: SignUpParams) => {
	try {
		const { database, account } = await createAdminClient()
		let user: AppwriteUser | undefined
		let newUserAcc: Models.User<Models.Preferences> | undefined
		newUserAcc = await account.create(
			ID.unique(),
			userData.email,
			userData.password,
			`${userData.firstName} ${userData.lastName}`
		)

		if (!newUserAcc) throw new Error("Failed to create account")

		const dwollaCustomerUrl = await createDwollaCustomer({
			...userData,
			type: "personal"
		})

		if (!dwollaCustomerUrl) {
			// await account.deleteIdentity(newUserAcc.$id)
			throw new Error("Failed to create Dwolla customer")
		}

		const { password, ...userDataWithoutPassword } = userData
		user = await database.createDocument<AppwriteUser>(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			ID.unique(),
			{
				...userDataWithoutPassword,
				userId: newUserAcc.$id,
				dwollaCustomerId: extractCustomerIdFromUrl(dwollaCustomerUrl),
				dwollaCustomerUrl: dwollaCustomerUrl
			}
		)

		const session = await account.createEmailPasswordSession(
			userData.email,
			userData.password
		)

		;(await cookies()).set("appwrite-session", session.secret, {
			path: "/",
			httpOnly: true,
			sameSite: "strict",
			secure: true
		})

		return parseStringify(user)
	} catch (error) {
		// if (newUserAcc) await account.deleteIdentity(newUserAcc.$id)
		handleErrors(error, "Failed to create account")
	}
}

export const signOut = async () => {
	try {
		const { account } = await createSessionClient()
		await account.deleteSession("current")
		;(await cookies()).delete("appwrite-session")
	} catch (error) {
		handleErrors(error, "Failed to sign out")
	} finally {
		redirect("/sign-in")
	}
}

export const getLoggedInUser = async (): Promise<AppwriteUser | undefined> => {
	try {
		const { account } = await createSessionClient()
		const userInfo = await getUserInfo({ userId: (await account.get()).$id })
		return parseStringify(userInfo)
	} catch (error) {
		handleErrors(error, "Failed to fetch the user")
	}
}

export const signIn = async ({
	email,
	password
}: {
	email: string
	password: string
}): Promise<Models.Document | undefined> => {
	try {
		const { account, database } = await createAdminClient()
		const session = await account.createEmailPasswordSession(email, password)

		;(await cookies()).set("appwrite-session", session.secret, {
			path: "/",
			httpOnly: true,
			sameSite: "strict",
			secure: true
		})

		const user = await database.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			[Query.equal("userId", [session.userId])]
		)

		return parseStringify(user.documents[0])
	} catch (error) {
		handleErrors(error, "Failed to sign in")
	}
}

export const createBankAccount = async ({
	userId,
	bankId,
	accessToken,
	accountId,
	fundingSourceUrl,
	sharableId
}: createBankAccountProps): Promise<AppwriteBank | undefined> => {
	try {
		const { database } = await createAdminClient()
		const bankAccount = await database.createDocument<AppwriteBank>(
			appwriteConfig.databaseId,
			appwriteConfig.bankCollectionId,
			ID.unique(),
			{
				userId,
				bankId,
				accessToken,
				accountId,
				fundingSourceUrl,
				sharableId
			}
		)

		return parseStringify(bankAccount)
	} catch (error) {
		handleErrors(error, "Failed to create bank account")
	}
}

export const createLinkToken = async (user: User) => {
	try {
		const tokenParams = {
			user: {
				client_user_id: user.userId
			},
			client_name: `${user.lastName}  ${user.firstName}`,
			products: ["auth", "transactions"] as Products[],
			language: "en",
			country_codes: ["US"] as CountryCode[]
		}

		const response = await plaidClient.linkTokenCreate(tokenParams)

		return parseStringify({ linkToken: response.data.link_token })
	} catch (error) {
		handleErrors(error, "Failed to create link token")
	}
}

export const exchangeToken = async ({
	publicToken,
	user
}: exchangePublicTokenProps) => {
	try {
		const response = await plaidClient.itemPublicTokenExchange({
			public_token: publicToken
		})

		const accessToken = response.data.access_token
		const itemId = response.data.item_id

		const accountResponse = await plaidClient.accountsGet({
			access_token: accessToken
		})

		const accData = accountResponse.data.accounts[0]

		const request: ProcessorTokenCreateRequest = {
			access_token: accessToken,
			account_id: accData.account_id,
			processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum
		}

		const processorTokenResponse =
			await plaidClient.processorTokenCreate(request)
		const processorToken = processorTokenResponse.data.processor_token

		const fundingSourceUrl = await addFundingSource({
			dwollaCustomerId: user.dwollaCustomerId,
			processorToken,
			bankName: accData.name
		})

		if (!fundingSourceUrl) {
			throw new Error("Failed to add funding source")
		}
		await createBankAccount({
			userId: user.$id,
			bankId: itemId,
			accessToken,
			fundingSourceUrl,
			accountId: accData.account_id,
			sharableId: encryptId(accData.account_id)
		})

		revalidatePath("/")

		return parseStringify({ publicTokenexchange: "complete" })
	} catch (error) {
		handleErrors(error, "Failed to exchange token")
	}
}

export const getBanks = async ({
	userId
}: getBanksProps): Promise<AppwriteBank[] | null> => {
	try {
		const { database } = await createAdminClient()

		const banks = await database.listDocuments<AppwriteBank>(
			appwriteConfig.databaseId!,
			appwriteConfig.bankCollectionId!,
			[Query.equal("userId", [userId])]
		)

		return parseStringify(banks.documents)
	} catch (error) {
		console.error("Error", error)
		return null
	}
}

// get specific bank from bank collection by document id
export const getBank = async ({
	documentId
}: getBankProps): Promise<AppwriteBank | null> => {
	try {
		const { database } = await createAdminClient()

		const bank = await database.listDocuments(
			appwriteConfig.databaseId!,
			appwriteConfig.bankCollectionId!,
			[Query.equal("$id", [documentId])]
		)

		if (bank.total !== 1) return null

		return parseStringify(bank.documents[0])
	} catch (error) {
		console.error("Error", error)
		return null
	}
}

// get specific bank from bank collection by account id
export const getBankByAccountId = async ({
	accountId
}: getBankByAccountIdProps) => {
	try {
		const { database } = await createAdminClient()

		const bank = await database.listDocuments(
			appwriteConfig.databaseId!,
			appwriteConfig.bankCollectionId!,
			[Query.equal("accountId", [accountId])]
		)

		if (bank.total !== 1) return null

		return parseStringify(bank.documents[0])
	} catch (error) {
		console.error("Error", error)
		return null
	}
}
