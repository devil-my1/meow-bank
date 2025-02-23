"use client"
import Header from "@/components/Header"
import RightSideBar from "@/components/RightSideBar"
import TotalBalanceBox from "@/components/TotalBalanceBox"
import Image from "next/image"

export default function Home() {
	const loggedInUser = {
		firstName: "Amir",
		lastName: "ProgFa"
	}
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
						accounts={[]}
						totalBanks={1}
						totalCurrentBalance={3000}
					/>
				</header>
			</div>
			<RightSideBar
				user={loggedInUser}
				transactions={[]}
				banks={[{ currentBalance: 250.15 }, { currentBalance: 500.25 }]}
			/>
		</section>
	)
}
