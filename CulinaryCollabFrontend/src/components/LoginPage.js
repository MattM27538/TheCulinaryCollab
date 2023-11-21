import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [profilePic, setProfilePic] = useState('')
	const navigate = useNavigate();

	const handleLogin = async () => {
		let loginInput = email.toLowerCase();

		if (!loginInput.includes('@')) {
			try {
				const usernameRef = doc(firestore, 'usernames', loginInput);
				const usernameDoc = await getDoc(usernameRef);
				if (usernameDoc.exists()) {
					loginInput = usernameDoc.data().email;
					loginInput = loginInput.toLowerCase();
				} else {
					console.error('Username not found');
					return;
				}
			} catch (error) {
				console.error('Error fetching username: ', error);
				return;
			}
		}

		try {
			await signInWithEmailAndPassword(auth, loginInput, password);
			const userRef = doc(firestore, 'users', auth.currentUser.uid);
			const userSnap = await getDoc(userRef);
			if (userSnap.exists()) {
				const userData = userSnap.data();
				const profilePicUrl = userData.profilePic || 'default-profile-pic-url';
				setProfilePic(profilePicUrl);
			}
			navigate('/workshop');
		} catch (error) {
			console.error('Error during login: ', error);
		}
	};
	return (
		<div className="login-page">
		<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email/Username" />
		<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
		<button onClick={handleLogin}>Login</button>
		<button onClick={() => navigate('/register')}>Create Account</button>
		</div>
	);
};

export default LoginPage;

