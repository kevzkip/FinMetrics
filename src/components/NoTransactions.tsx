import React from 'react';

const NoTransactions: React.FC = () => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
				flexDirection: 'column',
				marginBottom: '2rem',
			}}>
			<img
				src='/transactions.svg'
				style={{ width: '400px', margin: '4rem' }}
			/>
			<p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
				You have no transactions
			</p>
		</div>
	);
};

export default NoTransactions;
