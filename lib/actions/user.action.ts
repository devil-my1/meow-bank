"use server"
import { createAdminClient, createSessionClient } from "@/lib/appwrite"
import { ID, Models, Query } from "node-appwrite"
import { parseStringify } from "../utils"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { appwriteConfig } from "../appwrite/config"
import { User } from "@/types/appwrite.types"

export const handleErrors = async (error: unknown, message: string) => {
	console.log(error, message)
	throw error
}

export const getUserInfo = async ({
	userId
}: getUserInfoProps): Promise<User | undefined> => {
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
		let user: Models.Document | undefined = undefined

		if (!user) {
			const { database, account } = await createAdminClient()
			const newUserAcc = await account.create(
				ID.unique(),
				userData.email,
				userData.password,
				`${userData.firstName} ${userData.lastName}`
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

			const { password, ...userDataWithoutPassword } = userData
			user = await database.createDocument(
				appwriteConfig.databaseId,
				appwriteConfig.userCollectionId,
				ID.unique(),
				{
					...userDataWithoutPassword,
					userId: newUserAcc.$id,
					dwollaCustomerId: ID.unique(),
					dwollaCustomerUrl: process.env.DWOLLA_BASE_URL
				}
			)
		}

		return parseStringify(user)
	} catch (error) {
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

export const getLoggedInUser = async (): Promise<User | undefined> => {
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
