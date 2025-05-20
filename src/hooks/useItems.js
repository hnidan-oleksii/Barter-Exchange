import { useState, useEffect } from 'react';
import { 
	collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, 
	query, where, orderBy, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export function useItems() {
	const [items, setItems] = useState([]);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState('');
	const { currentUser } = useAuth();

	useEffect(() => {
		let isCancelled = false;

		const fetchItems = async () => {
			setFetching(true);
			try {
				const itemsQuery = query(
					collection(db, "items"),
					where("status", "==", "available"),
					orderBy("createdAt", "desc")
				);

				const snapshot = await getDocs(itemsQuery);
				const itemsList = snapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data()
				}));

				if (!isCancelled) {
					setItems(itemsList);
					setError('');
				}
			} catch (err) {
				console.error("Error fetching items:", err);
				if (!isCancelled) setError('Failed to fetch items');
			} finally {
				if (!isCancelled) setFetching(false);
			}
		};

		fetchItems();

		return () => {
			isCancelled = true;
		};
	}, []);

	const fetchUserItems = async (userId = currentUser?.uid) => {
		if (!userId) return [];

		try {
			const itemsQuery = query(
				collection(db, "items"),
				where("ownerId", "==", userId),
				orderBy("createdAt", "desc")
			);

			const snapshot = await getDocs(itemsQuery);
			return snapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			}));
		} catch (err) {
			console.error("Error fetching user items:", err);
			setError('Failed to fetch your items');
			return [];
		}
	};

	const getItem = async (itemId) => {
		try {
			const itemRef = doc(db, "items", itemId);
			const snap = await getDoc(itemRef);
			return snap.exists() ? { id: snap.id, ...snap.data() } : null;
		} catch (err) {
			console.error("Error getting item:", err);
			setError('Failed to fetch item details');
			return null;
		}
	};

	const addItem = async (itemData) => {
		if (!currentUser) throw new Error("Login required");

		try {
			const newItem = {
				...itemData,
				ownerId: currentUser.uid,
				ownerName: currentUser.displayName || 'Anonymous',
				status: 'available',
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp()
			};

			const docRef = await addDoc(collection(db, "items"), newItem);
			return { id: docRef.id, ...newItem };
		} catch (err) {
			console.error("Error adding item:", err);
			setError('Failed to add item');
			throw err;
		}
	};

	const updateItem = async (itemId, updateData) => {
		if (!currentUser) throw new Error("Login required");

		try {
			const currentItem = await getItem(itemId);
			if (!currentItem) throw new Error("Item not found");
			if (currentItem.ownerId !== currentUser.uid) throw new Error("Unauthorized");

			const itemRef = doc(db, "items", itemId);
			const updatedData = {
				...updateData,
				updatedAt: serverTimestamp()
			};

			await updateDoc(itemRef, updatedData);
			return { id: itemId, ...currentItem, ...updatedData };
		} catch (err) {
			console.error("Error updating item:", err);
			setError('Failed to update item');
			throw err;
		}
	};

	const deleteItem = async (itemId) => {
		if (!currentUser) throw new Error("Login required");

		try {
			const currentItem = await getItem(itemId);
			if (!currentItem) throw new Error("Item not found");
			if (currentItem.ownerId !== currentUser.uid) throw new Error("Unauthorized");

			await deleteDoc(doc(db, "items", itemId));
			return true;
		} catch (err) {
			console.error("Error deleting item:", err);
			setError('Failed to delete item');
			throw err;
		}
	};

	return {
		items,
		loading: fetching,
		error,
		fetchUserItems,
		getItem,
		addItem,
		updateItem,
		deleteItem
	};
}
