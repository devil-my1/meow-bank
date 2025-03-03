"use client"
import React from "react"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnatChart = ({ accounts }: DoughnutChartProps) => {
	const accountBalances = accounts.map(account => account.currentBalance)
	const accountNames = accounts.map(account => account.name)
	const data = {
		datasets: [
			{
				label: "Banks",
				data: accountBalances,
				backgroundColor: ["#0747b6", "#2265d8", "#2f91fa"]
			}
		],
		labels: accountNames
	}
	return (
		<Doughnut
			data={data}
			options={{ cutout: "60%", plugins: { legend: { display: false } } }}
		/>
	)
}

export default DoughnatChart
