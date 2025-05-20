import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../hooks/useItems';
import { Container, Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';

const CreateItem = () => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { addItem } = useItems();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setError('');
			setLoading(true);
			await addItem({ title, description });
			navigate('/');
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Typography component="h1" variant="h5">
					Add New Item
				</Typography>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						required
						fullWidth
						id="title"
						label="Title"
						name="title"
						autoComplete="title"
						autoFocus
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						id="description"
						label="Description"
						name="description"
						multiline
						rows={4}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
						disabled={loading}
					>
						{loading ? <CircularProgress size={24} /> : 'Add Item'}
					</Button>
					{error && <Alert severity="error">{error}</Alert>}
				</Box>
			</Box>
		</Container>
	);
};

export default CreateItem;
