import Header from "@/components/Header"
import PaymentTransferForm from "@/components/PaymentTransferForm"
import { getAccounts } from "@/lib/actions/bank.action"
import { getLoggedInUser } from "@/lib/actions/user.action"
import React from "react"

const PaymentTransferPage = async () => {
	const loggedInUser = await getLoggedInUser()
	const accounts = await getAccounts({ userId: loggedInUser?.$id! })
	return (
		<section className='payment-transfer'>
			<Header
				title='Payment Transfer'
				subtext='Please provide the following information to transfer your payment'
			/>
			<section className='size-full pt-5'>
				<PaymentTransferForm accounts={accounts?.data} />
			</section>
			t
		</section>
	)
}

export default PaymentTransferPage
