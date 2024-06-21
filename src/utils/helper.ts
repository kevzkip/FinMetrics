import { GoogleAuthUser, RequiredUserData } from '../typescript/interface';

function getRequiredUserData(user: GoogleAuthUser): RequiredUserData {
	const { uid, displayName, photoURL, email } = user;
	return {
		uid,
		displayName,
		photoURL,
		email,
	};
}

export { getRequiredUserData };
