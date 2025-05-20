import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
	Container,
	Box,
	Typography,
	TextField,
	Button,
	CircularProgress,
	Alert,
} from '@mui/material';

const Profile = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(false);

	const { currentUser, updateUserProfile } = useAuth();

	useEffect(() => {
		if (currentUser) {
			setUsername(currentUser.displayName || '');
			setEmail(currentUser.email || '');
		}
	}, [currentUser]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		setLoading(true);

		try {
			if (!username.trim()) {
				throw new Error('Username cannot be empty');
			}

			await updateUserProfile({
				username: username.trim(),
				email: email.trim(),
			});

			setSuccess('Profile updated successfully');
		} catch (err) {
			setError(err.message || 'Failed to update profile');
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
					Profile
				</Typography>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						fullWidth
						id="username"
						label="Username"
						name="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<TextField
						margin="normal"
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
						disabled={loading}
					>
						{loading ? <CircularProgress size={24} /> : 'Update Profile'}
					</Button>
					{error && <Alert severity="error">{error}</Alert>}
					{success && <Alert severity="success">{success}</Alert>}
				</Box>
			</Box>
		</Container>
	);
};

export default Profile;

