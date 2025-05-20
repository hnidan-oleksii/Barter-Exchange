import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItems } from '../hooks/useItems';
import { useAuth } from '../context/AuthContext';
import { useExchanges } from '../hooks/useExchanges';
import { 
	Container, 
	Typography, 
	Card, 
	CardContent, 
	Button, 
	CircularProgress, 
	TextField, 
	Box,
	Snackbar,
	Alert
} from '@mui/material';

const ItemDetails = () => {
	const { itemId } = useParams();
	const { fetchUserItems, getItem, loading: itemLoading, error: itemError } = useItems();
	const { currentUser } = useAuth();
	const { createOffer, loading: offerLoading, error: offerError } = useExchanges();
	const [item, setItem] = useState(null);
	const [message, setMessage] = useState('');
	const [userItems, setUserItems] = useState([]);
	const [offeredItemId, setOfferedItemId] = useState('');
	const navigate = useNavigate();
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState('success');

	useEffect(() => {
		const fetchDetails = async () => {
			const fetchedItem = await getItem(itemId);
			setItem(fetchedItem);
		};
		fetchDetails();
	}, [itemId, getItem]);

	useEffect(() => {
		if (!currentUser) {
			setUserItems([]);
			setOfferedItemId('');
			return;
		}
		const loadUserItems = async () => {
			const myItems = await fetchUserItems(currentUser.uid);
			const availableItems = myItems.filter(i => i.status === 'available');
			setUserItems(availableItems);
			if (!offeredItemId && availableItems.length > 0) {
				setOfferedItemId(availableItems[0].id);
			}
		};
		loadUserItems();
	}, [currentUser, fetchUserItems]);

	const handleMakeOffer = async () => {
		if (!currentUser) {
			navigate('/login');
			return;
		}
		if (!item) return;

		if (!offeredItemId) {
			setSnackbarMessage("Please select an item to offer.");
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
			return;
		}

		try {
			await createOffer(offeredItemId, item.id, message);
			setSnackbarMessage('Offer sent successfully!');
			setSnackbarSeverity('success');
			setSnackbarOpen(true);
			setMessage('');
		} catch (err) {
			setSnackbarMessage(err.message || 'Failed to send offer.');
			setSnackbarSeverity('error');
			setSnackbarOpen(true);
		}
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') return;
		setSnackbarOpen(false);
	};

	if (itemLoading) {
		return (
			<Container sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
				<CircularProgress />
			</Container>
		);
	}

	if (itemError || !item) {
		return (
			<Container sx={{ mt: 4 }}>
				<Typography color="error">Error loading item details.</Typography>
			</Container>
		);
	}

	if (item.ownerId === currentUser?.uid) {
		return (
			<Container sx={{ mt: 4 }}>
				<Typography variant="h4" gutterBottom>{item.title}</Typography>
				<Card>
					<CardContent>
						<Typography variant="h6">Description:</Typography>
						<Typography paragraph>{item.description}</Typography>
						<Typography variant="subtitle1" color="text.secondary">This is your item.</Typography>
					</CardContent>
				</Card>
			</Container>
		);
	}

	return (
		<Container sx={{ mt: 4 }}>
			<Typography variant="h4" gutterBottom>{item.title}</Typography>
			<Card>
				<CardContent>
					<Typography variant="h6">Description:</Typography>
					<Typography paragraph>{item.description}</Typography>
					<Typography variant="subtitle1">Offered by: {item.ownerName}</Typography>
				</CardContent>
				<Box sx={{ p: 2 }}>
					{userItems.length > 0 ? (
						<TextField
							select
							label="Select Item to Offer"
							value={offeredItemId}
							onChange={(e) => setOfferedItemId(e.target.value)}
							SelectProps={{ native: true }}
							fullWidth
							margin="normal"
						>
							{userItems.map(ui => (
								<option key={ui.id} value={ui.id}>
									{ui.title}
								</option>
							))}
						</TextField>
					) : (
							<Typography color="error" sx={{ mb: 2 }}>
								You have no available items to offer.
							</Typography>
						)}

					<TextField
						fullWidth
						label="Your Offer Message (Optional)"
						multiline
						rows={4}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						margin="normal"
					/>

					<Button
						variant="contained"
						color="primary"
						onClick={handleMakeOffer}
						disabled={offerLoading || userItems.length === 0}
					>
						{offerLoading ? <CircularProgress size={24} /> : 'Make Offer'}
					</Button>

					{offerError && (
						<Typography color="error" sx={{ mt: 1 }}>{offerError}</Typography>
					)}
				</Box>
			</Card>

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default ItemDetails;
