import Header from "@/components/Header"
import { Pagination } from "@/components/Pagination"
import TransactionsTable from "@/components/TransactionsTable"
import { getAccounts, getAccount } from "@/lib/actions/bank.action"
import { getLoggedInUser } from "@/lib/actions/user.action"
import { formatAmount } from "@/lib/utils"
import React from "react"

const TransactionHistoryPage = async ({ searchParams }: SearchParamProps) => {
	const currentPage = Number((await searchParams)?.page as string) || 1
	const id = ((await searchParams)?.id as string) || undefined
	const loggedInUser = await getLoggedInUser()
	const accounts = await getAccounts({ userId: loggedInUser?.$id! })

	if (!accounts) return

	const appwriteItemId = id || accounts.data[0].appwriteItemId

	const account = await getAccount({ appwriteItemId })

	const rowsPerPage = 10
	const totalPages = Math.ceil(account.transactions.length / rowsPerPage)

	const indexOfLastTransaction = currentPage * rowsPerPage
	const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage

	const currentTransactions = account.transactions.slice(
		indexOfFirstTransaction,
		indexOfLastTransaction
	)

	return (
		<section className='transactions'>
			<div className='transactions-header'>
				<Header
					subtext='See your bank details and transactions.'
					title='Transaction History'
				/>
			</div>
			<div className='space-y-6'>
				<div className='transactions-account'>
					<div className='flex flex-col gap-2'>
						<h2 className='text-18 font-bold text-white'>
							{account?.data.name}
						</h2>
						<p className='text-14 text-blue-25'>{account?.data.officialName}</p>
						<p className='text-14 font-semibold tracking-[1.1px] text-white'>
							**** **** ****{" "}
							<span className='text-16'>{account?.data.mask}</span>
						</p>
					</div>
					<div className='transactions-account-balance'>
						<p className='text-14'>Current balance</p>
						<p className='text-24 text-center font-bold'>
							{formatAmount(account?.data.currentBalance)}
						</p>
					</div>
				</div>
				<section className='flex w-full flex-col gap-6'>
					<TransactionsTable
						transactions={currentTransactions}
						page={currentPage}
					/>
					{totalPages > 1 && (
						<div className='my-4 w-full'>
							<Pagination
								page={currentPage}
								totalPages={totalPages}
							/>
						</div>
					)}
				</section>
			</div>
		</section>
	)
}

export default TransactionHistoryPage
