import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../hooks/useItems';
import ItemCard from '../components/items/ItemCard';
import { Container, Grid, Typography, CircularProgress, Alert } from '@mui/material';

const MyItems = () => {
	const { currentUser } = useAuth();
	const { fetchUserItems, loading, error } = useItems();
	const [userItems, setUserItems] = useState([]);

	useEffect(() => {
		const loadUserItems = async () => {
			if (currentUser) {
				const items = await fetchUserItems(currentUser.uid);
				setUserItems(items);
			}
		};

		loadUserItems();
	}, [currentUser, fetchUserItems]);

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
				<Alert severity="error">Error loading your items: {error}</Alert>
			</Container>
		);
	}

	return (
		<Container sx={{ mt: 4 }}>
			<Typography variant="h4" gutterBottom>My Items</Typography>
			<Grid container spacing={2}>
				{userItems.map(item => (
					<Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
						<ItemCard item={item} />
					</Grid>
				))}
				{userItems.length === 0 && (
					<Grid item xs={12}>
						<Typography variant="subtitle1">You haven't added any items yet.</Typography>
					</Grid>
				)}
			</Grid>
		</Container>
	);
};

export default MyItems;
