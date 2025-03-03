import { Models } from "node-appwrite"

export interface AppwriteUser extends Models.Document {
	userId: string
	lastName: string
	firstName: string
	email: string
	dwollaCustomerUrl: string
	dwollaCustomerId: string
	address: string
	city: string
	state: string
	postalCode: string
	dateOfBirth: Date
	ssn: string
}

export interface AppwriteTransaction extends Models.Document {
	id: string
	name: string
	paymentChannel: string
	type: string
	accountId: string
	amount: number
	pending: boolean
	category: string
	date: string
	image: string
	channel: string
	senderBankId: string
	receiverBankId: string
}

export interface AppwriteBank extends Models.Document {
	accountId: string
	bankId: string
	accessToken: string
	fundingSourceUrl: string
	userId: AppwriteUser
	sharableId: string
}
