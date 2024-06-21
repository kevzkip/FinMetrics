import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';

const Header = () => {
	const navigate = useNavigate();
	const [user] = useAuthState(auth);

	const logout = () => {
		auth.signOut();
		navigate('/');
	};

	useEffect(() => {
		user ? navigate('/dashboard') : navigate('/');
	}, [user, navigate]);

	return (
		<div className='sticky w-full px-5 py-3 bg-blue-500 flex justify-between items-center'>
			<p className='font-medium text-white text-2xl'>FinMetrics</p>
			{user && (
				<p className='text-gray-100 hover:text-white flex items-center gap-2 font-medium text-xl cursor-pointer'>
					<span>
						<img
							src={user?.photoURL ? user.photoURL : '/user.svg'}
							alt='User image'
							className={
								user
									? 'w-10 h-10 rounded-full object-cover'
									: 'w-8 h-8 rounded-full object-cover'
							}
						/>
					</span>
					<span onClick={() => logout()}>Logout</span>
				</p>
			)}
		</div>
	);
};

export default Header;
