import React from 'react';
import { Card, Row } from 'antd';

interface CardsProps {
	currentBalance: number;
	income: number;
	expenses: number;
	cardStyle: React.CSSProperties;
	showExpenseModal: () => void;
	showIncomeModal: () => void;
	reset: () => void;
}

const Cards: React.FC<CardsProps> = ({
	currentBalance,
	income,
	expenses,
	showExpenseModal,
	showIncomeModal,
	cardStyle,
	reset,
}: CardsProps) => {
	return (
		<Row className='flex flex-wrap gap-4 justify-between'>
			<Card
				bordered={true}
				style={cardStyle}>
				<h2 className='text-xl font-semibold'>Current Balance</h2>
				<p>Ksh. {currentBalance}</p>
				<div
					className='btn btn-blue m-0'
					onClick={reset}>
					Reset Balance
				</div>
			</Card>

			<Card
				bordered={true}
				style={cardStyle}>
				<h2 className='text-xl font-semibold'>Total Income</h2>
				<p>Ksh. {income}</p>
				<div
					className='btn btn-blue m-0'
					onClick={showIncomeModal}>
					Add Income
				</div>
			</Card>

			<Card
				bordered={true}
				style={cardStyle}>
				<h2 className='text-xl font-semibold'>Total Expenses</h2>
				<p>Ksh. {expenses}</p>
				<div
					className='btn btn-blue'
					onClick={showExpenseModal}>
					Add Expense
				</div>
			</Card>
		</Row>
	);
};

export default Cards;
