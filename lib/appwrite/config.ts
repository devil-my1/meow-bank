export const appwriteConfig = {
	url: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
	projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
	databaseId: process.env.APPWRITE_DATABASE_ID!,
	userCollectionId: process.env.APPWRITE_USER_COLLECTION_ID!,
	bankCollectionId: process.env.APPWRITE_BANK_COLLECTION_ID!,
	transactionCollectionId: process.env.APPWRITE_TRANSACTION_COLLECTION_ID!,
	secretKey: process.env.APPWRITE_SECRET!
}
