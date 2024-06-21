import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, db } from '../config/firebase';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Header from '../components/Header';
import { GoogleAuthUser } from '../typescript/interface';

interface UserDataInputs {
	fullName: string;
	email: string;
	password: string;
}

const Auth: React.FC = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [flag, setFlag] = useState(true); // Flag is true on signup
	const [userInputData, setUserInputData] = useState<UserDataInputs>({
		fullName: '',
		email: '',
		password: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserInputData((current) => ({
			...current,
			[name]: value,
		}));
	};

	const createUserDocument = async (user: GoogleAuthUser) => {
		setLoading(true);
		if (!user) return;

		const userRef = doc(db, 'users', user.uid);
		const userData = await getDoc(userRef);

		if (!userData.exists()) {
			const { displayName, email, photoURL } = user;
			const createdAt = new Date();

			try {
				await setDoc(userRef, {
					name: displayName ? displayName : userInputData.fullName,
					photoURL: photoURL ? photoURL : '',
					email,
					createdAt,
				});
				console.log('Account created');
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		}
	};

	const signUpWithEmail = async (e: React.FormEvent) => {
		setLoading(true);
		e.preventDefault();
		try {
			const response = await createUserWithEmailAndPassword(
				auth,
				userInputData.email,
				userInputData.password
			);
			const user = response.user;
			if (user && typeof user.displayName === 'string') {
				await createUserDocument(user);
			}
			console.log(user);
			navigate('/dashboard');
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	const logInWithEmail = async (e: React.FormEvent) => {
		setLoading(true);
		e.preventDefault();
		try {
			const response = await signInWithEmailAndPassword(
				auth,
				userInputData.email,
				userInputData.password
			);
			const user = response.user;
			console.log(user);
			navigate('/dashboard');
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	const continueWithGoogle = async () => {
		setLoading(true);
		try {
			const response = await signInWithPopup(auth, provider);
			const user = response.user;
			await createUserDocument(user);
			console.log('Authentication successful');
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		flag ? signUpWithEmail(e) : logInWithEmail(e);
	};

	return (
		<>
			<Header />
			<div className='pt-20 w-full flex justify-center min-h-screen'>
				<div className='w-96 h-fit shadow-md p-5 rounded-md'>
					<h2 className='text-center text-xl'>
						{flag ? 'Sign up to' : 'Login to'}
						<span className='text-blue-500'> FinMetrics</span>
					</h2>
					<form
						className='flex flex-col gap-2 mt-12'
						onSubmit={handleSubmit}>
						{flag && (
							<input
								type='text'
								className='w-full h-10 rounded px-2 outline-none border border-gray-400 focus:border-blue-500 duration-200'
								placeholder='Full name'
								name='fullName'
								value={userInputData.fullName}
								onChange={handleChange}
							/>
						)}
						<input
							type='email'
							className='w-full h-10 rounded px-2 outline-none border border-gray-400 focus:border-blue-500 duration-200'
							placeholder='Email address'
							name='email'
							value={userInputData.email}
							onChange={handleChange}
						/>
						<input
							type='password'
							className='w-full h-10 rounded px-2 outline-none border border-gray-400 focus:border-blue-500 duration-200'
							placeholder='Password'
							name='password'
							value={userInputData.password}
							onChange={handleChange}
						/>
						<button
							disabled={loading}
							type='submit'
							className='w-full mt-5 rounded text-blue-500 hover:text-white text-lg h-10 border border-blue-500 hover:bg-blue-500 duration-200'>
							{loading ? 'Loading...' : flag ? 'Sign up' : 'Log in'}
						</button>
					</form>
					<p className='text-center text-sm py-3'>OR</p>
					<button
						onClick={continueWithGoogle}
						className='w-full rounded hover:text-blue-500 text-white text-lg h-10 border border-blue-500 bg-blue-500 hover:bg-white duration-200'>
						Continue With Google
					</button>
					<p className='mt-4'>
						{flag ? 'Already have an account' : "Don't have an account"}{' '}
						<span
							onClick={() => setFlag(!flag)}
							className='text-blue-500 hover:text-blue-600 hover:underline cursor-pointer duration-200 pl-1'>
							{flag ? 'Login' : 'Sign up'}
						</span>{' '}
					</p>
				</div>
			</div>
		</>
	);
};

export default Auth;
