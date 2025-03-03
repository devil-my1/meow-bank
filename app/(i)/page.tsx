import Header from "@/components/Header"
import RecentTransactions from "@/components/RecentTransactions"
import RightSideBar from "@/components/RightSideBar"
import TotalBalanceBox from "@/components/TotalBalanceBox"
import { getAccount, getAccounts } from "@/lib/actions/bank.action"
import { getLoggedInUser } from "@/lib/actions/user.action"

export default async function Home({ searchParams }: SearchParamProps) {
	const currentPage = Number((await searchParams)?.page as string) || 1
	const id = ((await searchParams)?.id as string) || undefined
	const loggedInUser = await getLoggedInUser()
	const accounts = await getAccounts({ userId: loggedInUser?.$id! })

	if (!accounts) return

	const appwriteItemId = id || accounts.data[0].appwriteItemId

	const account = await getAccount({ appwriteItemId })

	return (
		<section className='home'>
			<div className='home-content'>
				<header className='home-header'>
					<Header
						title='Welcome'
						user={loggedInUser?.firstName || "Guest"}
						type='greeting'
						subtext='Access and manage your account and transactions efficiently.'
					/>
					<TotalBalanceBox
						accounts={accounts.data}
						totalBanks={accounts.totalBanks}
						totalCurrentBalance={accounts.totalCurrentBalance}
					/>
				</header>
				<RecentTransactions
					accounts={accounts.data}
					transactions={account?.transactions}
					appwriteItemId={appwriteItemId}
					page={currentPage}
				/>
			</div>
			<RightSideBar
				user={loggedInUser}
				transactions={account?.transactions}
				banks={accounts.data?.slice(0, 2)}
			/>
		</section>
	)
}
