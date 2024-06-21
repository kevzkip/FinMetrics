import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../config/firebase';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import moment from 'moment';
import Header from '../components/Header';
import { Transaction } from '../typescript/interface';
import Cards from '../components/Cards';
import AddExpenseModal from '../components/AddExpense';
import AddIncomeModal from '../components/AddIncome';
import NoTransactions from '../components/NoTransactions';
import { Card, Row } from 'antd';
import { Line, Pie } from '@ant-design/charts';
import TransactionSearch from '../components/TransactionSearch';
import Loader from '../components/Loader';

const Dashboard: React.FC = () => {
	const [user] = useAuthState(auth);
	const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
	const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
	const [transactions, setTransactions] = useState<Transaction[]>([]); // Explicitly typed as Transaction[]
	const [loading, setLoading] = useState(false);
	const [currentBalance, setCurrentBalance] = useState(0);
	const [income, setIncome] = useState(0);
	const [expenses, setExpenses] = useState(0);

	// const sampleTransactions = [
	// {
	//   name: "Pay day",
	//   type: "income",
	//   date: "2023-01-15",
	//   amount: 2000,
	//   tag: "salary",
	// },
	// ];

	const cardStyle: React.CSSProperties = {
		boxShadow: '0px 0px 30px 8px rgba(227, 227, 227, 0.75)',
		margin: '2rem',
		borderRadius: '0.5rem',
		minWidth: '400px',
		flex: 1,
	};

	const fetchTransactions = async () => {
		setLoading(true);
		if (user) {
			const q = query(collection(db, `users/${user.uid}/transactions`));
			const querySnapshot = await getDocs(q);
			let transactionsArray: Transaction[] = [];
			querySnapshot.forEach((doc) => {
				const transaction = doc.data() as Transaction;
				transactionsArray.push(transaction);
			});
			setTransactions(transactionsArray);
			console.log('Transactions fetched');
		}
		setLoading(false);
	};

	const calculateBalance = () => {
		let incomeTotal = 0;
		let expensesTotal = 0;

		transactions.forEach((transaction) => {
			if (transaction.type === 'income') {
				incomeTotal += Number(transaction.amount);
			} else {
				expensesTotal += Number(transaction.amount);
			}
		});

		setIncome(incomeTotal);
		setExpenses(expensesTotal);
		setCurrentBalance(incomeTotal - expensesTotal);
	};

	useEffect(() => {
		fetchTransactions();
	}, []);

	useEffect(() => {
		calculateBalance();
	}, [transactions]);

	const processChartData = () => {
		const balanceData: { month: string; balance: number }[] = [];
		const spendingData: { [key: string]: number } = {};

		transactions.forEach((transaction) => {
			const monthYear = moment(transaction.date).format('MMM YYYY');
			const tag = transaction.tag;

			const existingBalanceEntry = balanceData.find(
				(data) => data.month === monthYear
			);

			if (transaction.type === 'income') {
				if (existingBalanceEntry) {
					existingBalanceEntry.balance += Number(transaction.amount);
				} else {
					balanceData.push({
						month: monthYear,
						balance: Number(transaction.amount),
					});
				}
			} else {
				if (existingBalanceEntry) {
					existingBalanceEntry.balance -= Number(transaction.amount);
				} else {
					balanceData.push({ month: monthYear, balance: -transaction.amount });
				}

				if (spendingData[tag]) {
					spendingData[tag] += Number(transaction.amount);
				} else {
					spendingData[tag] = Number(transaction.amount);
				}
			}
		});

		const spendingDataArray = Object.keys(spendingData).map((key) => ({
			category: key,
			value: spendingData[key],
		}));

		return { balanceData, spendingDataArray };
	};

	const { balanceData, spendingDataArray } = processChartData();

	const showExpenseModal = () => {
		setIsExpenseModalVisible(true);
	};

	const showIncomeModal = () => {
		setIsIncomeModalVisible(true);
	};

	const handleExpenseCancel = () => {
		setIsExpenseModalVisible(false);
	};

	const handleIncomeCancel = () => {
		setIsIncomeModalVisible(false);
	};

	function reset() {
		console.log('resetting');
	}

	const addTransaction = async (transaction) => {
		try {
			await addDoc(
				collection(db, `users/${user?.uid}/transactions`),
				transaction
			);
			console.log('Transaction Added!');
		} catch (err) {
			console.log("Couldn't add transaction");
		}
	};

	const onFinish = (
		values: {
			tag: string;
			name: string;
			date: string;
			amount: string;
		},
		type: string
	) => {
		const newTransaction = {
			type,
			tag: values.tag,
			name: values.name,
			date: moment(values.date).format('YYYY-MM-DD'),
			amount: parseFloat(values.amount),
		};

		setTransactions([...transactions, newTransaction]);
		setIsExpenseModalVisible(false);
		setIsIncomeModalVisible(false);
		addTransaction(newTransaction);
		calculateBalance();
	};

	const balanceConfig = {
		data: balanceData,
		xField: 'month',
		yField: 'balance',
	};

	const spendingConfig = {
		data: spendingDataArray,
		angleField: 'value',
		colorField: 'category',
	};

	return (
		<>
			<Header />
			{loading ? (
				<Loader />
			) : (
				<>
					<Cards
						currentBalance={currentBalance}
						income={income}
						expenses={expenses}
						showExpenseModal={showExpenseModal}
						showIncomeModal={showIncomeModal}
						cardStyle={cardStyle}
						reset={reset}
					/>
					<AddExpenseModal
						isExpenseModalVisible={isExpenseModalVisible}
						handleExpenseCancel={handleExpenseCancel}
						onFinish={onFinish}
					/>
					<AddIncomeModal
						isIncomeModalVisible={isIncomeModalVisible}
						handleIncomeCancel={handleIncomeCancel}
						onFinish={onFinish}
					/>
					{transactions.length === 0 ? (
						<NoTransactions />
					) : (
						<>
							<Row gutter={16}>
								<Card
									bordered={true}
									style={cardStyle}>
									<h2 className='text-xl'>Financial Statistics</h2>
									<Line {...{ ...balanceConfig, data: balanceData }} />
								</Card>

								<Card
									bordered={true}
									style={{ ...cardStyle, flex: 0.45 }}>
									<h2 className='text-xl'>Total Spending</h2>
									{spendingDataArray.length == 0 ? (
										<p>Seems like you haven't spent anything till now...</p>
									) : (
										<Pie {...{ ...spendingConfig, data: spendingDataArray }} />
									)}
								</Card>
							</Row>
						</>
					)}
					<TransactionSearch
						transactions={transactions}
						// exportToCsv={exportToCsv}
						fetchTransactions={fetchTransactions}
						addTransaction={addTransaction}
					/>
				</>
			)}
		</>
	);
};

export default Dashboard;
