"use client"
import React from "react"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnatChart = ({ accounts }: DoughnutChartProps) => {
	const data = {
		datasets: [
			{
				label: "Banks",
				data: [3000, 2000, 1000],
				backgroundColor: ["#0747b6", "#2265d8", "#2f91fa"]
			}
		],
		labels: ["Bank 1", "Bank 2", "Bank 3"]
	}
	return (
		<Doughnut
			data={data}
			options={{ cutout: "60%", plugins: { legend: { display: false } } }}
		/>
	)
}

export default DoughnatChart
