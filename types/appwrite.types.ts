import { Models } from "node-appwrite"

export interface User extends Models.Document {
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

export interface Transaction extends Models.Document {
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

export interface Bank extends Models.Document {
	accountId: string
	bankId: string
	accessToken: string
	fundingSourceUrl: string
	userId: string
	sharableId: string
}
