"use client"
import CountUp from "react-countup"

const AnimatedCounter = ({ amount }: { amount: number }) => {
	return (
		<p>
			<CountUp
				end={amount}
				prefix='$'
				decimals={2}
				suffix='USD'
				className='max-sm:text-lg truncate'
			/>
		</p>
	)
}

export default AnimatedCounter
