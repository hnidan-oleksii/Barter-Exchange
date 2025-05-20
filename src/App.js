import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ItemList from './pages/ItemList';
import ItemDetails from './pages/ItemDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreateItem from './pages/CreateItem';
import MyItems from './pages/MyItems';
import MyExchanges from './pages/MyExchanges';
import { Container } from '@mui/material';

function App() {
	return (
		<Router>
			<AuthProvider>
				<Navbar />
				<Container sx={{ py: 3, minHeight: 'calc(100vh - 112px)' }}>
					<Routes>
						<Route path="/" element={<ItemList />} />
						<Route path="/item/:itemId" element={<ItemDetails />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
						<Route path="/create-item" element={<PrivateRoute><CreateItem /></PrivateRoute>} />
						<Route path="/my-items" element={<PrivateRoute><MyItems /></PrivateRoute>} />
						<Route path="/my-exchanges" element={<PrivateRoute><MyExchanges /></PrivateRoute>} />
					</Routes>
				</Container>
				<Footer />
			</AuthProvider>
		</Router>
	);
}

export default App;
