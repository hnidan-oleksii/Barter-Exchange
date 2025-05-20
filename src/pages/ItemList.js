import React, { useState } from 'react';
import { useItems } from '../hooks/useItems';
import ItemCard from '../components/items/ItemCard';
import { Container, Grid, Typography, CircularProgress, TextField } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const ItemList = () => {
	const { items, loading, error } = useItems();
	const { currentUser } = useAuth();
	const [searchTerm, setSearchTerm] = useState('');

	const filteredItems = items.filter(item => {
		const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.description?.toLowerCase().includes(searchTerm.toLowerCase());
		const notUserItem = item.ownerId !== currentUser?.uid;
		return notUserItem && matchesSearch;
	});

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
				<Typography color="error">Error loading items: {error}</Typography>
			</Container>
		);
	}

	return (
		<Container sx={{ mt: 4 }}>
			<Typography variant="h4" gutterBottom>Available Items</Typography>

			<TextField
				label="Search items"
				variant="outlined"
				fullWidth
				margin="normal"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>

			<Grid container spacing={2}>
				{filteredItems.map(item => (
					<Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
						<ItemCard item={item} />
					</Grid>
				))}
				{filteredItems.length === 0 && (
					<Grid item xs={12}>
						<Typography variant="subtitle1">No matching items found.</Typography>
					</Grid>
				)}
			</Grid>
		</Container>
	);
};

export default ItemList;
