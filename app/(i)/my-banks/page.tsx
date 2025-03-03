import BankCard from "@/components/BankCard"
import Header from "@/components/Header"
import { getAccounts } from "@/lib/actions/bank.action"
import { getLoggedInUser } from "@/lib/actions/user.action"
import React from "react"

const MyBankPage = async () => {
	const loggedInUser = await getLoggedInUser()
	const accounts = await getAccounts({ userId: loggedInUser?.$id! })
	return (
		<section className='flex'>
			<div className='my-banks'>
				<Header
					subtext='Effortlessly manage your bank accounts.'
					title='My Bank Accounts'
				/>
				<div className='space-y-4'>
					<h2 className='header-2'>Your cards</h2>
					<div className='flex flex-wrap gap-6'>
						{accounts &&
							accounts.data.map((account: Account) => (
								<BankCard
									key={account.id}
									account={account}
									showBalance
									userName={`${loggedInUser?.firstName} ${loggedInUser?.lastName}`}
								/>
							))}
					</div>
				</div>
			</div>
		</section>
	)
}

export default MyBankPage
