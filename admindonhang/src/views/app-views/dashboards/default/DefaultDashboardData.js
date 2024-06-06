import userService from 'services/UserService'
import transactionService from 'services/TransactionService';
import orderSettingService from 'services/OrderSettingService';
const currentDate = new Date();
const thirtyDaysAgo = new Date(currentDate);
thirtyDaysAgo.setDate(currentDate.getDate() - 15);
const dateList = [];
const dateIterator = new Date(thirtyDaysAgo);
while (dateIterator <= currentDate) {
	const day = dateIterator.getDate();
	const month = dateIterator.getMonth() + 1;
	const year = dateIterator.getFullYear();
	const formattedMonth = month < 10 ? `0${month}` : month;
	const formattedDay = day < 10 ? `0${day}` : day;
	const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
	dateList.push(formattedDate);
	dateIterator.setDate(dateIterator.getDate() + 1);
}

export const VisitorChartData = async () => {
	try {
		const [orderData, orderDetailsData] = await Promise.all([
			transactionService.getAllOrder(),
			orderSettingService.getAllOrderDetails()
		]);
		const orderDataResult = orderData;
		const orderDetailsResult = orderDetailsData;

		if (!orderDataResult || !Array.isArray(orderDataResult) || orderDataResult.length === 0) {
			console.log('No data available.');
			return [];
		}
		const today = new Date();
		orderDataResult.sort((a, b) => Math.abs(new Date(a.date) - today) - Math.abs(new Date(b.date) - today));
		orderDetailsResult.sort((a, b) => Math.abs(new Date(a.date) - today) - Math.abs(new Date(b.date) - today));

		const exchangeRate = 23000;

		const convertVNDToUSD = (amountVND) => {
			const amountUSD = amountVND / exchangeRate;
			return amountUSD.toFixed(2); 
		};

		const dataDeposit = (type) => {
			let closestRecords = [];
			let orderRecords = [];
			if (type === 1) {
				closestRecords = orderDataResult.slice(0, 15);
			} else {
				orderRecords = orderDetailsResult.slice(0, 15);
			}

			const dailyTotalAmounts = {};
			dateList.forEach(date => {
				dailyTotalAmounts[date] = 0;
			});
			closestRecords.forEach(record => {
				const dateKey = record.orderDate.substring(0, 10);
				dailyTotalAmounts[dateKey] += 1;
			});
			orderRecords.forEach(record => {
				const dateKey = record.orderDate.substring(0, 10);
				dailyTotalAmounts[dateKey] += convertVNDToUSD(record.price);
			});
			const seriesData = dateList.map(date => ({
				date: date,
				totalAmount: dailyTotalAmounts[date]
			}));
			const numericSeriesData = Array(dateList.length).fill(0);
			seriesData.forEach(entry => {
				const index = dateList.indexOf(entry.date);
				if (index !== -1) {
					numericSeriesData[index] = entry.totalAmount;
				}
			});
			return numericSeriesData;
		}
		return {
			series: [
				{
					name: "Doanh thu",
					data: dataDeposit(2)
				},
				{
					name: "Số đơn",
					data: dataDeposit(1)
				},
			],
			categories: dateList
		};
	} catch (error) {
		console.error("Error:", error);
		return [];
	}
};
const getAnnualStatisticData = async () => {
	try {
		const [orderData, userData, orderDat] = await Promise.all([
			transactionService.getAllTransaction(),
			userService.getCountUser(),
			orderSettingService.getAllOrderDetails()
		]);
		const orderDataResult = orderData;
		const countUser = userData;
		const OrderDetail = orderDat;

		let totalPrice = 0;
		OrderDetail.map(order => {
			totalPrice += order.price;
		});

		const formatter = new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		});
		const formattedCountTransaction = formatter.format(totalPrice);
		return [
			{
				title: 'Tổng số thành viên',
				value: countUser,
				subtitle: ''
			},
			{
				title: 'Tổng số order',
				value: orderDataResult,
				subtitle: ''
			},
			{
				title: 'Doanh thu',
				value: formattedCountTransaction,
				subtitle: ''
			},
			// {
			// 	title: 'Tổng giao dịch',
			// 	value: countTransaction,
			// 	subtitle: ''
			// }
		];
	} catch (error) {
		console.error("Error:", error);
		return [];
	}
};

export const AnnualStatisticData = getAnnualStatisticData();