import React, { createContext, useContext, useState, useEffect } from 'react';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	async function signup(email, password, username) {
		try {
			setError('');
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);

			await updateProfile(userCredential.user, {
				displayName: username
			});

			await setDoc(doc(db, "users", userCredential.user.uid), {
				uid: userCredential.user.uid,
				email,
				username,
				createdAt: new Date(),
				rating: 0,
				totalReviews: 0,
			});

			return userCredential.user;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	}

	async function login(email, password) {
		try {
			setError('');
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			return userCredential.user;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	}

	function logout() {
		return signOut(auth);
	}

	async function getUserProfile(uid) {
		try {
			const userRef = doc(db, "users", uid);
			const userSnap = await getDoc(userRef);

			if (userSnap.exists()) {
				return userSnap.data();
			} else {
				return null; // Graceful fallback
			}
		} catch (err) {
			setError(err.message);
			throw err;
		}
	}

	async function updateUserProfile(userData) {
		if (!currentUser) throw new Error("No authenticated user");

		try {
			const userRef = doc(db, "users", currentUser.uid);
			await setDoc(userRef, userData, { merge: true });

			const updates = {};
			if (userData.username) updates.displayName = userData.username;

			if (Object.keys(updates).length > 0) {
				await updateProfile(currentUser, updates);
			}
		} catch (err) {
			setError(err.message);
			throw err;
		}
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				try {
					const userData = await getUserProfile(user.uid);
					setCurrentUser({
						uid: user.uid,
						email: user.email,
						displayName: user.displayName || '',
						...(userData || {})
					});
				} catch (err) {
					console.error("Error fetching user data:", err);
					setCurrentUser({
						uid: user.uid,
						email: user.email,
						displayName: user.displayName || '',
					});
				}
			} else {
				setCurrentUser(null);
			}
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const value = {
		currentUser,
		signup,
		login,
		logout,
		getUserProfile,
		updateUserProfile,
		error
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
