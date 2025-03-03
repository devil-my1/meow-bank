import Link from "next/link"
import React, { useMemo } from "react"
import dynamic from "next/dynamic"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from "./BankTabItem"
import { Pagination } from "./Pagination"
import { Loader2 } from "lucide-react"

const BankInfo = dynamic(() => import("./BankInfo"), {
	loading: () => (
		<p className='w-full text-16 font-bold text-center text-white'>
			Loading bank info...
			<Loader2
				className='animate-spin'
				size={18}
			/>
		</p>
	)
})
const TransactionsTable = dynamic(() => import("./TransactionsTable"), {
	loading: () => (
		<p className='w-full text-16 font-bold text-center text-white'>
			Loading transactions...
			<Loader2
				className='animate-spin'
				size={18}
			/>
		</p>
	)
})

const RecentTransactions = ({
	accounts,
	transactions = [],
	appwriteItemId,
	page = 1
}: RecentTransactionsProps) => {
	const rowsPerPage = 10
	const totalPages = Math.ceil(transactions.length / rowsPerPage)
	const indexOfLastTransaction = page * rowsPerPage
	const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage

	const currentTransactions = useMemo(
		() => transactions.slice(indexOfFirstTransaction, indexOfLastTransaction),
		[transactions, indexOfFirstTransaction, indexOfLastTransaction]
	)

	return (
		<section className='recent-transactions'>
			<header className='flex items-center justify-between'>
				<h2 className='recent-transactions-label'>Recent Transactions</h2>
				<Link
					className='view-all-btn'
					href={`/transaction-history/?id=${appwriteItemId}`}
				>
					View all
				</Link>
			</header>
			<Tabs
				defaultValue={appwriteItemId}
				className='w-full'
			>
				<TabsList className='recent-transactions-tablist'>
					{accounts.map(account => (
						<TabsTrigger
							key={account.id}
							value={account.appwriteItemId}
						>
							<BankTabItem
								key={account.id}
								account={account}
								appwriteItemId={appwriteItemId}
							/>
						</TabsTrigger>
					))}
				</TabsList>
				{accounts.map(account => (
					<TabsContent
						className='space-y-4'
						key={account.id}
						value={account.appwriteItemId}
					>
						<BankInfo
							account={account}
							appwriteItemId={appwriteItemId}
							type='full'
						/>
						<TransactionsTable
							transactions={currentTransactions}
							page={page}
						/>
						{totalPages > 1 && (
							<div className='my-4 w-full'>
								<Pagination
									page={page}
									totalPages={totalPages}
								/>
							</div>
						)}
					</TabsContent>
				))}
			</Tabs>
		</section>
	)
}

export default RecentTransactions
