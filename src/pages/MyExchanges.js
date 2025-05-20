import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExchanges } from '../hooks/useExchanges';
import { 
	Container, 
	Typography, 
	List, 
	ListItem, 
	ListItemText, 
	Button, 
	CircularProgress, 
	Alert,
	Box
} from '@mui/material';

const MyExchanges = () => {
	const { currentUser } = useAuth();
	const { getSentOffers, getReceivedOffers, acceptOffer, rejectOffer, cancelOffer, loading, error } = useExchanges();
	const [sentOffers, setSentOffers] = useState([]);
	const [receivedOffers, setReceivedOffers] = useState([]);
	const [offerActionLoading, setOfferActionLoading] = useState(null);
	const [offerActionError, setOfferActionError] = useState('');

	useEffect(() => {
		const loadOffers = async () => {
			if (currentUser) {
				const sent = await getSentOffers();
				setSentOffers(sent);
				const received = await getReceivedOffers();
				setReceivedOffers(received);
			}
		};

		loadOffers();
	}, [currentUser, getSentOffers, getReceivedOffers]);

	const handleAcceptOffer = async (offerId) => {
		setOfferActionLoading(offerId);
		setOfferActionError('');
		try {
			await acceptOffer(offerId);
			const updatedReceivedOffers = receivedOffers.filter(offer => offer.id !== offerId);
			setReceivedOffers(updatedReceivedOffers);
		} catch (err) {
			setOfferActionError(err.message);
		} finally {
			setOfferActionLoading(null);
		}
	};

	const handleRejectOffer = async (offerId) => {
		setOfferActionLoading(offerId);
		setOfferActionError('');
		try {
			await rejectOffer(offerId);
			const updatedReceivedOffers = receivedOffers.filter(offer => offer.id !== offerId);
			setReceivedOffers(updatedReceivedOffers);
		} catch (err) {
			setOfferActionError(err.message);
		} finally {
			setOfferActionLoading(null);
		}
	};

	const handleCancelOffer = async (offerId) => {
		setOfferActionLoading(offerId);
		setOfferActionError('');
		try {
			await cancelOffer(offerId);
			const updatedSentOffers = sentOffers.filter(offer => offer.id !== offerId);
			setSentOffers(updatedSentOffers);
		} catch (err) {
			setOfferActionError(err.message);
		} finally {
			setOfferActionLoading(null);
		}
	};

	if (loading) {
		return (
			<Container sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
				<CircularProgress />
			</Container>
		);
	}

	if (error) {
		return (
			<Container sx={{ mt: 4 }}>
				<Alert severity="error">Error loading exchanges: {error}</Alert>
			</Container>
		);
	}

	return (
		<Container sx={{ mt: 4 }}>
			<Typography variant="h4" gutterBottom>My Exchanges</Typography>

			<Typography variant="h6" sx={{ mt: 3 }}>Sent Offers</Typography>
			{sentOffers.length === 0 ? (
				<Typography variant="subtitle1">No offers sent yet.</Typography>
			) : (
					<List>
						{sentOffers.map(offer => (
							<ListItem key={offer.id} sx={{ borderBottom: '1px solid #eee', py: 1 }}>
								<ListItemText
									primary={`Offered: ${offer.offeredItemName} for ${offer.wantedItemName}`}
									secondary={
										<>
											{`Status: ${offer.status} | To: ${offer.receiverName}`}
											{offer.message && (
												<Typography variant="body2" color="text.secondary">
													{`Message: ${offer.message}`}
												</Typography>
											)}
										</>
									}
								/>
								{offer.status === 'pending' && (
									<Button 
										onClick={() => handleCancelOffer(offer.id)} 
										disabled={offerActionLoading === offer.id}
										color="warning"
										size="small"
									>
										{offerActionLoading === offer.id ? <CircularProgress size={16} /> : 'Cancel'}
									</Button>
								)}
							</ListItem>
						))}
					</List>
				)}

			<Typography variant="h6" sx={{ mt: 3 }}>Received Offers</Typography>
			{receivedOffers.length === 0 ? (
				<Typography variant="subtitle1">No offers received yet.</Typography>
			) : (
					<List>
						{receivedOffers.map(offer => (
							<ListItem key={offer.id} sx={{ borderBottom: '1px solid #eee', py: 1 }}>
								<ListItemText
									primary={`Offered: ${offer.offeredItemName} for ${offer.wantedItemName}`}
									secondary={
										<>
											{`Status: ${offer.status} | To: ${offer.receiverName}`}
											{offer.message && (
												<Typography variant="body2" color="text.secondary">
													{`Message: ${offer.message}`}
												</Typography>
											)}
										</>
									}
								/>
								{offer.status === 'pending' && (
									<Box>
										<Button 
											onClick={() => handleAcceptOffer(offer.id)} 
											disabled={offerActionLoading === offer.id}
											color="primary"
											size="small"
											sx={{ mr: 1 }}
										>
											{offerActionLoading === offer.id ? <CircularProgress size={16} /> : 'Accept'}
										</Button>
										<Button 
											onClick={() => handleRejectOffer(offer.id)} 
											disabled={offerActionLoading === offer.id}
											color="error"
											size="small"
										>
											{offerActionLoading === offer.id ? <CircularProgress size={16} /> : 'Reject'}
										</Button>
									</Box>
								)}
							</ListItem>
						))}
					</List>
				)}

			{offerActionError && (
				<Alert severity="error" sx={{ mt: 2 }}>{offerActionError}</Alert>
			)}
		</Container>
	);
};

export default MyExchanges;
