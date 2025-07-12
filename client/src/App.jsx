import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import OtherProfilePage from './pages/OtherProfilePage';
import SwapRequestForm from './pages/SwapRequestForm';
import SwapManagementPage from './pages/SwapManagementPage';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import Chatbot from './components/Chatbot';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Chatbot /> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/profile/:id" element={<OtherProfilePage />} /> {/* ✅ fixed path */}
        <Route path="/swap-request/:id" element={<SwapRequestForm />} />
        <Route path="/swaps" element={<SwapManagementPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
