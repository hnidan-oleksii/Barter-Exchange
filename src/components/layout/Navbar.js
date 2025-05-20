import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
	AppBar,
	Box,
	Toolbar,
	IconButton,
	Typography,
	Menu,
	Container,
	Avatar,
	Button,
	Tooltip,
	MenuItem,
} from '@mui/material';
import { Menu as MenuIcon, SwapHoriz, Add, Logout } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
	const { currentUser, logout } = useAuth();
	const navigate = useNavigate();

	const [anchorElNav, setAnchorElNav] = useState(null);
	const [anchorElUser, setAnchorElUser] = useState(null);

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const handleLogout = async () => {
		try {
			await logout();
			navigate('/login');
		} catch (error) {
			console.error("Failed to log out", error);
		}
		handleCloseUserMenu();
	};

	return (
		<AppBar position="sticky">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					{/* Logo and title - desktop */}
					<SwapHoriz sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
					<Typography
						variant="h6"
						noWrap
						component={RouterLink}
						to="/"
						sx={{
							mr: 2,
							display: { xs: 'none', md: 'flex' },
							fontWeight: 700,
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						Barter Exchange
					</Typography>

					{/* Mobile menu */}
					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="menu"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							<MenuItem onClick={() => { handleCloseNavMenu(); navigate('/'); }}>
								<Typography textAlign="center">Browse Items</Typography>
							</MenuItem>

							{currentUser ? (
								<>
									<MenuItem onClick={() => { handleCloseNavMenu(); navigate('/my-items'); }}>
										<Typography textAlign="center">My Items</Typography>
									</MenuItem>
									<MenuItem onClick={() => { handleCloseNavMenu(); navigate('/my-exchanges'); }}>
										<Typography textAlign="center">My Exchanges</Typography>
									</MenuItem>
									<MenuItem onClick={() => { handleCloseNavMenu(); navigate('/create-item'); }}>
										<Typography textAlign="center">Add New Item</Typography>
									</MenuItem>
								</>
							) : null}
						</Menu>
					</Box>

					{/* Logo and title - mobile */}
					<SwapHoriz sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
					<Typography
						variant="h6"
						noWrap
						component={RouterLink}
						to="/"
						sx={{
							mr: 2,
							display: { xs: 'flex', md: 'none' },
							flexGrow: 1,
							fontWeight: 700,
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						Barter Exchange
					</Typography>

					{/* Desktop menu */}
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						<Button
							component={RouterLink}
							to="/"
							onClick={handleCloseNavMenu}
							sx={{ my: 2, color: 'white', display: 'block' }}
						>
							Browse Items
						</Button>

						{currentUser ? (
							<>
								<Button
									component={RouterLink}
									to="/my-items"
									onClick={handleCloseNavMenu}
									sx={{ my: 2, color: 'white', display: 'block' }}
								>
									My Items
								</Button>
								<Button
									component={RouterLink}
									to="/my-exchanges"
									onClick={handleCloseNavMenu}
									sx={{ my: 2, color: 'white', display: 'block' }}
								>
									My Exchanges
								</Button>
								<Button
									component={RouterLink}
									to="/create-item"
									onClick={handleCloseNavMenu}
									sx={{ my: 2, color: 'white' }}
									startIcon={<Add />}
								>
									Add New Item
								</Button>
							</>
						) : null}
					</Box>

					{currentUser ? (
						<Box sx={{ flexGrow: 0 }}>
							<Tooltip title="Open settings">
								<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
									<Avatar 
										alt={currentUser.displayName || "User"} 
										sx={{ bgcolor: 'secondary.main' }}
									>
										{currentUser.displayName ? currentUser.displayName[0].toUpperCase() : "U"}
									</Avatar>
								</IconButton>
							</Tooltip>
							<Menu
								sx={{ mt: '45px' }}
								id="menu-appbar"
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								<MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
									<Typography textAlign="center">Profile</Typography>
								</MenuItem>
								<MenuItem onClick={handleLogout}>
									<Typography textAlign="center" sx={{ display: 'flex', alignItems: 'center' }}>
										<Logout fontSize="small" sx={{ mr: 1 }} />
										Logout
									</Typography>
								</MenuItem>
							</Menu>
						</Box>
					) : (
							<Box sx={{ flexGrow: 0 }}>
								<Button
									component={RouterLink}
									to="/login"
									variant="outlined"
									sx={{ color: 'white', borderColor: 'white', mr: 1 }}
								>
									Login
								</Button>
								<Button
									component={RouterLink}
									to="/register"
									variant="contained"
									sx={{ 
										bgcolor: 'secondary.main',
										color: 'secondary.contrastText',
										'&:hover': {
											bgcolor: 'secondary.dark',
										} 
									}}
								>
									Sign Up
								</Button>
							</Box>
						)}
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default Navbar;
