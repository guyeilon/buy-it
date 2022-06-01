import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useSelector } from 'react-redux';
import { selectAllProducts } from '../../features/products/productsSlice';
import { selectAllSales } from '../../features/sale/salesSlice';

import './Stats.scss';

const Stats = () => {
	const products = useSelector(selectAllProducts);
	const allSales = useSelector(selectAllSales);

	const [select, setSelect] = useState('order');

	const orderProducts =
		products.length !== 0
			? products
					.map(product => ({ name: product.name, order: product.stats.order }))
					.sort((a, b) => b.order - a.order)
					.slice(0, 5)
			: JSON.parse(localStorage.getItem('order'));
	const sales =
		allSales.length !== 0
			? allSales.slice(allSales.length - 5, allSales.length)
			: JSON.parse(localStorage.getItem('sales'));

	localStorage.setItem('order', JSON.stringify(orderProducts));
	localStorage.setItem('sales', JSON.stringify(sales));

	const uniqueOrderProducts = products
		.map(product => ({ name: product.name, order: product.stats.uniqueOrder }))
		.sort((a, b) => b.uniqueOrder - a.uniqueOrder)
		.slice(0, 5);

	const setDataForChart = {
		order: {
			labels: orderProducts.map(product => product.name),
			datasets: [
				{
					label: 'times order',
					data: orderProducts.map(product => product.order),
					backgroundColor: ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600'],
					borderColor: 'black',
					borderWidth: 2,
				},
			],
		},
		unique: {
			labels: uniqueOrderProducts.map(product => product.name),
			datasets: [
				{
					label: 'unique order',
					data: uniqueOrderProducts.map(product => product.order),
					backgroundColor: ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600'],
					borderColor: 'black',
					borderWidth: 2,
				},
			],
		},
	};

	const [chart, setChart] = useState(setDataForChart['order']);

	const handleChange = e => {
		let temp = e.target.value;
		setChart(setDataForChart[temp]);
		setSelect(temp);
		console.log(orderProducts);
	};

	const [saleData, setSaleData] = useState({
		labels: sales.map(data => data.date),
		datasets: [
			{
				label: 'total sale per day',
				data: sales.map(data => data.totalSale),
				backgroundColor: ['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600'],
				borderColor: 'black',
				borderWidth: 1,
				tension: 0.3,
				radius: 5,
			},
		],
	});

	const [PieChartOptions, setPieChartOptions] = useState({
		responsive: true,
		plugins: {
			legend: {
				display: 'top',
			},
			title: {
				display: true,
				text: 'Top 5 order products',
			},
		},
	});
	const [lineChartOptions, setLineChartOptions] = useState({
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: 'Last 5 days sales',
			},
			scales: {
				x: {
					grid: { display: false },
				},
			},
		},
	});

	return (
		<>
			<div className='app__charts-container'>
				<div className='app__pie-chart-container'>
					<Pie data={chart} options={PieChartOptions} />
					<select className='app__chart-select' onChange={handleChange} value={select}>
						<option value='order'>by order</option>
						<option value='unique'>by unique order</option>
					</select>
				</div>
				<div className='app__line-chart-container'>
					<Line data={saleData} options={lineChartOptions} />
				</div>
			</div>
		</>
	);
};

export default Stats;
