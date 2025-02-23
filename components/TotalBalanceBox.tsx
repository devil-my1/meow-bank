import AnimatedCounter from "./AnimatedCounter"
import DoughnatChart from "./DoughnatChart"

const TotalBalanceBox = ({
	accounts = [],
	totalBanks,
	totalCurrentBalance
}: TotlaBalanceBoxProps) => {
	return (
		<section className='total-balance'>
			<div className='total-balance-chart'>
				<DoughnatChart accounts={accounts} />
			</div>
			<div className='flex flex-col gap-6'>
				<h2 className='header-2'>Bank accounts: {totalBanks}</h2>
				<div className='flex flex-col gap-2'>
					<p className='total-balance-label'>Total Current Balance</p>
					<div className='total-balance-amount items-start  justify-start'>
						<AnimatedCounter amount={totalCurrentBalance} />
					</div>
				</div>
			</div>
		</section>
	)
}

export default TotalBalanceBox
