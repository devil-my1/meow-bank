"use client"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import { transactionCategoryStyles } from "@/constants"
import {
	cn,
	formatAmount,
	formatDateTime,
	getTransactionStatus,
	removeSpecialCharacters
} from "@/lib/utils"
import { memo, useMemo } from "react"

// Memoized Badge Component
const Badge = memo(({ category }: CategoryBadgeProps) => {
	const { backgroundColor, borderColor, chipBackgroundColor, textColor } =
		transactionCategoryStyles[
			category as keyof typeof transactionCategoryStyles
		] || transactionCategoryStyles.default

	return (
		<div className={cn("category-badge", borderColor, chipBackgroundColor)}>
			<div className={cn("size-2 rounded-full", backgroundColor)} />
			<p className={cn("text-[12px] font-medium", textColor)}>{category}</p>
		</div>
	)
})

// Memoized Transaction Row Component
const TransactionRow = memo(({ transaction }: { transaction: Transaction }) => {
	const status = useMemo(
		() => getTransactionStatus(new Date(transaction.date)),
		[transaction.date]
	)
	const amount = useMemo(
		() => formatAmount(Math.round(transaction.amount)),
		[transaction.amount]
	)
	const isDebit = transaction.type === "debit"

	return (
		<TableRow
			key={transaction.$id}
			className={cn("bg-[#f6fef9] !over:bg-none !border-b-DEFAULT", {
				"bg-[#fffbfa]": isDebit || amount[0] === "-"
			})}
		>
			<TableCell className='max-w-[250px] pl-2 pr-10'>
				<div className='flex items-center gap-3'>
					<h1 className='text-14 truncate font-semibold text-[#344054]'>
						{removeSpecialCharacters(transaction.name)}
					</h1>
				</div>
			</TableCell>

			<TableCell
				className={cn("pl-2 pr-10 font-semibold text-[#039855]", {
					"text-[#f04438]": isDebit || amount[0] === "-"
				})}
			>
				{isDebit ? `-${amount}` : `${amount}`}
			</TableCell>

			<TableCell className='pl-2 pr-10'>
				<Badge category={status} />
			</TableCell>

			<TableCell className='pl-2 pr-10 min-w-32'>
				{formatDateTime(new Date(transaction.date)).dateTime}
			</TableCell>

			<TableCell className='pl-2 pr-10 capitalize min-w-24'>
				{transaction.paymentChannel}
			</TableCell>

			<TableCell className='pl-2 pr-10 max-md:hidden'>
				<Badge category={transaction.category} />
			</TableCell>
		</TableRow>
	)
})

// Main TransactionsTable Component
const TransactionsTable = ({ transactions }: TransactionHistoryTableProps) => {
	return (
		<Table>
			<TableHeader className='bg-[#f9fafb]'>
				<TableRow>
					<TableHead className='px-2'>Transaction</TableHead>
					<TableHead className='px-2'>Amount</TableHead>
					<TableHead className='px-2'>Status</TableHead>
					<TableHead className='px-2'>Date</TableHead>
					<TableHead className='px-2 max-md:hidden'>Channel</TableHead>
					<TableHead className='px-2 max-md:hidden'>Category</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{transactions?.map((transaction: Transaction) => (
					<TransactionRow
						key={transaction.$id}
						transaction={transaction}
					/>
				))}
			</TableBody>
		</Table>
	)
}

export default memo(TransactionsTable)
