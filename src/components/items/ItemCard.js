import React from 'react';
import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ItemCard = ({ item }) => {
	return (
		<Card sx={{ maxWidth: 345, mb: 2 }}>
			<CardContent>
				<Typography gutterBottom variant="h5" component="div">
					{item.title}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{item.description}
				</Typography>
			</CardContent>
			<CardActions>
				<Button size="small" component={RouterLink} to={`/item/${item.id}`}>View Details</Button>
			</CardActions>
		</Card>
	);
};

export default ItemCard;
