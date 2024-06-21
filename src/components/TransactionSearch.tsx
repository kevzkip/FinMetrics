import React, { useState } from 'react';
import { Table, Select, Radio } from 'antd';
import { parse } from 'papaparse';
import { Transaction } from '../typescript/interface';

const { Option } = Select;
interface TransactionSearchProps {
	transactions: Transaction[];
	fetchTransactions: () => Promise<void>;
	addTransaction: (transaction: Transaction) => Promise<void>;
}

const TransactionSearch: React.FC<TransactionSearchProps> = ({
	transactions,
	addTransaction,
	fetchTransactions,
}) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedTag, setSelectedTag] = useState('');
	const [typeFilter, setTypeFilter] = useState('');
	const [sortKey, setSortKey] = useState('');

	const importFromCsv = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		try {
			if (event.target.files && event.target.files[0]) {
				parse(event.target.files[0], {
					header: true,
					complete: async function (results) {
						for (const transaction of results.data) {
							const newTransaction: Transaction = {
								...transaction,
								amount: parseInt(transaction.amount, 10),
							};
							await addTransaction(newTransaction);
						}
						console.log('All Transactions Added');
						fetchTransactions();
					},
				});
			}
			event.target.value = ''; // Clear the file input after processing
		} catch (err) {
			console.log(err);
		}
	};

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
		},
		{
			title: 'Date',
			dataIndex: 'date',
			key: 'date',
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
		},
		{
			title: 'Tag',
			dataIndex: 'tag',
			key: 'tag',
		},
	];

	const filteredTransactions = transactions.filter((transaction) => {
		const searchMatch = searchTerm
			? transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
			: true;
		const tagMatch = selectedTag ? transaction.tag === selectedTag : true;
		const typeMatch = typeFilter ? transaction.type === typeFilter : true;

		return searchMatch && tagMatch && typeMatch;
	});

	const sortedTransactions = [...filteredTransactions].sort(
		(a: Transaction, b: Transaction) => {
			if (sortKey === 'date') {
				return new Date(a.date).getTime() - new Date(b.date).getTime();
			} else if (sortKey === 'amount') {
				return Number(a.amount) - Number(b.amount);
			} else {
				return 0;
			}
		}
	);

	const dataSource = sortedTransactions.map((transaction, index) => ({
		key: index,
		...transaction,
	}));

	return (
		<div style={{ width: '100%', padding: '0rem 2rem' }}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					gap: '1rem',
					alignItems: 'center',
					marginBottom: '1rem',
				}}>
				<div className='input-flex'>
					<img
						src='/search.svg'
						width='16'
						alt='Search'
					/>
					<input
						placeholder='Search by Name'
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<Select
					className='select-input'
					onChange={(value) => setTypeFilter(value)}
					value={typeFilter}
					placeholder='Filter'
					allowClear>
					<Option value=''>All transactions</Option>
					<Option value='income'>Income</Option>
					<Option value='expense'>Expense</Option>
				</Select>
			</div>

			<Select
				style={{ width: 200, marginRight: 10 }}
				onChange={(value) => setSelectedTag(value)}
				placeholder='Filter by tag'
				allowClear>
				<Option value='food'>Food</Option>
				<Option value='education'>Education</Option>
				<Option value='office'>Office</Option>
			</Select>
			<div className='my-table'>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
						marginBottom: '1rem',
					}}>
					<h2>My Transactions</h2>

					<Radio.Group
						className='input-radio'
						onChange={(e) => setSortKey(e.target.value)}
						value={sortKey}>
						<Radio.Button value=''>No Sort</Radio.Button>
						<Radio.Button value='date'>Sort by Date</Radio.Button>
						<Radio.Button value='amount'>Sort by Amount</Radio.Button>
					</Radio.Group>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							gap: '1rem',
							width: '400px',
						}}>
						<label
							htmlFor='file-csv'
							className='btn btn-blue'>
							Import from CSV
						</label>
						<input
							onChange={importFromCsv}
							id='file-csv'
							type='file'
							accept='.csv'
							required
							style={{ display: 'none' }}
						/>
					</div>
				</div>

				<Table
					columns={columns}
					dataSource={dataSource}
				/>
			</div>
		</div>
	);
};

export default TransactionSearch;
