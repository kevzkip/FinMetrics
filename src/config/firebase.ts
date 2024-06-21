import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: "AIzaSyDCewArEaH6VyL9auHDljpFqZrWOe5TYqs",
	authDomain: "finmetrics-534e2.firebaseapp.com",
	projectId: "finmetrics-534e2",
	storageBucket: "finmetrics-534e2.appspot.com",
	messagingSenderId: "355599340643",
	appId: "1:355599340643:web:82d6ab0ba458090f51d456",
	measurementId: "G-9KDWVCQTGP"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, doc, setDoc };
