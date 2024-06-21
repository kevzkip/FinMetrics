export interface GoogleAuthUser {
	uid: string;
	displayName: string | null;
	photoURL: string | null;
	email: string | null;
	[key: string]: any;
}

export interface RequiredUserData {
	uid: string;
	displayName: string | null;
	photoURL: string | null;
	email: string | null;
}

export interface Transaction {
	name: string;
	type: string;
	date: string;
	amount: number | string;
	tag: string;
}
