import { useState } from 'react';
import {
	collection, addDoc, updateDoc, doc, getDocs, getDoc,
	query, where, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export function useExchanges() {
	const [, setSentOffers] = useState([]);
	const [, setReceivedOffers] = useState([]);
	const [error, setError] = useState('');
	const { currentUser } = useAuth();

	const safeUid = currentUser?.uid;

	const createOffer = async (offeredItemId, wantedItemId, message) => {
		console.log(13);
		if (!safeUid) throw new Error("User not authenticated");

		try {
			const offeredItemRef = doc(db, "items", offeredItemId);
			const wantedItemRef = doc(db, "items", wantedItemId);

			const existingQuery = query(
				collection(db, "exchanges"),
				where("offeredItemId", "==", offeredItemId),
				where("wantedItemId", "==", wantedItemId),
				where("status", "==", "pending")
			);

			const [offeredSnap, wantedSnap, existingSnap] = await Promise.all([
				getDoc(offeredItemRef),
				getDoc(wantedItemRef),
				getDocs(existingQuery)
			]);

			if (!offeredSnap.exists()) throw new Error("Offered item missing");
			const offeredItem = { id: offeredSnap.id, ...offeredSnap.data() };
			if (offeredItem.ownerId !== safeUid || offeredItem.status !== "available") {
				throw new Error("Invalid offered item");
			}

			if (!wantedSnap.exists()) throw new Error("Wanted item missing");
			const wantedItem = { id: wantedSnap.id, ...wantedSnap.data() };
			if (wantedItem.ownerId === safeUid || wantedItem.status !== "available") {
				throw new Error("Invalid wanted item");
			}

			if (!existingSnap.empty) throw new Error("Duplicate offer");

			const offerData = {
				offeredItemId,
				offeredItemName: offeredItem.title,
				wantedItemId,
				wantedItemName: wantedItem.title,
				senderId: safeUid,
				senderName: currentUser.displayName || 'Anonymous',
				receiverId: wantedItem.ownerId,
				receiverName: wantedItem.ownerName,
				message,
				status: 'pending',
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp()
			};

			const offerRef = await addDoc(collection(db, "exchanges"), offerData);

			return { id: offerRef.id, ...offerData };
		} catch (err) {
			console.error("Offer creation error:", err);
			setError(err.message || 'Failed to create offer');
			throw err;
		}
	};

	const getSentOffers = async () => {
		if (!safeUid) return [];

		try {
			const q = query(
				collection(db, "exchanges"),
				where("senderId", "==", safeUid),
				orderBy("createdAt", "desc")
			);
			const snap = await getDocs(q);
			const offers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
			setSentOffers(offers);
			return offers;
		} catch (err) {
			console.error("Error fetching sent offers:", err);
			setError('Failed to fetch sent offers');
			return [];
		}
	};

	const getReceivedOffers = async () => {
		if (!safeUid) return [];

		try {
			const q = query(
				collection(db, "exchanges"),
				where("receiverId", "==", safeUid),
				orderBy("createdAt", "desc")
			);
			const snap = await getDocs(q);
			const offers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
			setReceivedOffers(offers);
			return offers;
		} catch (err) {
			console.error("Error fetching received offers:", err);
			setError('Failed to fetch received offers');
			return [];
		}
	};

	const updateOfferStatus = async (offerId, status, updateItems = false) => {
		if (!safeUid) throw new Error("User not authenticated");

		const offerRef = doc(db, "exchanges", offerId);
		const offerSnap = await getDoc(offerRef);
		if (!offerSnap.exists()) throw new Error("Offer not found");

		const offer = offerSnap.data();
		if (offer.receiverId !== safeUid && status !== "cancelled") {
			throw new Error("Unauthorized to modify this offer");
		}

		await updateDoc(offerRef, { status, updatedAt: serverTimestamp() });

		if (updateItems) {
			const offeredItemRef = doc(db, "items", offer.offeredItemId);
			const wantedItemRef = doc(db, "items", offer.wantedItemId);

			const updates = [
				updateDoc(offeredItemRef, {
					status: status === "accepted" ? 'exchanged' : 'available',
					updatedAt: serverTimestamp()
				})
			];

			if (status === "accepted") {
				updates.push(updateDoc(wantedItemRef, {
					status: 'exchanged',
					updatedAt: serverTimestamp()
				}));
			}

			await Promise.all(updates);
		}

		return { id: offerId, ...offer, status };
	};

	const acceptOffer = async (offerId) => updateOfferStatus(offerId, 'accepted', true);
	const rejectOffer = async (offerId) => updateOfferStatus(offerId, 'rejected', true);
	const cancelOffer = async (offerId) => updateOfferStatus(offerId, 'cancelled', true);

	const getExchange = async (exchangeId) => {
		try {
			const ref = doc(db, "exchanges", exchangeId);
			const snap = await getDoc(ref);
			return snap.exists() ? { id: snap.id, ...snap.data() } : null;
		} catch (err) {
			console.error("Error fetching exchange:", err);
			setError('Failed to fetch exchange');
			return null;
		}
	};

	return {
		error,
		createOffer,
		getSentOffers,
		getReceivedOffers,
		acceptOffer,
		rejectOffer,
		cancelOffer,
		getExchange
	};
}
