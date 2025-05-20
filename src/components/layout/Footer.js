import React from 'react';
import {
	Box,
	Container,
	Typography,
	Link,
	Grid,
	Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { SwapHoriz } from '@mui/icons-material';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<Box
			component="footer"
			sx={{
				py: 3,
				px: 2,
				mt: 'auto',
				backgroundColor: (theme) => theme.palette.grey[100]
			}}
		>
			<Container maxWidth="lg">
				<Grid container spacing={3}>
					<Grid item xs={12} sm={4}>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
							<SwapHoriz sx={{ mr: 1, color: 'primary.main' }} />
							<Typography
								variant="h6"
								color="text.primary"
								gutterBottom
								component={RouterLink}
								to="/"
								sx={{ 
									textDecoration: 'none', 
									color: 'primary.main',
									fontWeight: 700 
								}}
							>
								Barter Exchange
							</Typography>
						</Box>
						<Typography variant="body2" color="text.secondary">
							Trade items you don't need for things you want.
							No money involved, just a simple exchange of goods.
						</Typography>
					</Grid>

					<Grid item xs={12} sm={4}>
						<Typography variant="h6" color="text.primary" gutterBottom>
							Quick Links
						</Typography>
						<Link component={RouterLink} to="/" color="inherit" display="block" sx={{ mb: 1 }}>
							Home
						</Link>
						<Link component={RouterLink} to="/register" color="inherit" display="block" sx={{ mb: 1 }}>
							Register
						</Link>
						<Link component={RouterLink} to="/login" color="inherit" display="block">
							Login
						</Link>
					</Grid>

					<Grid item xs={12} sm={4}>
						<Typography variant="h6" color="text.primary" gutterBottom>
							About Us
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Barter Exchange is a platform designed to help people exchange their unused items
							for things they actually need, promoting sustainability and reducing waste.
						</Typography>
					</Grid>
				</Grid>

				<Divider sx={{ my: 2 }} />

				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
					<Typography variant="body2" color="text.secondary">
						© {currentYear} Barter Exchange. All rights reserved.
					</Typography>
					<Box>
						<Link href="#" color="inherit" sx={{ pl: 1 }}>
							Privacy Policy
						</Link>
						<Link href="#" color="inherit" sx={{ pl: 1 }}>
							Terms of Service
						</Link>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;
