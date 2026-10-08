import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerHome from './pages/CustomerHome';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './components/admin/AdminLogin';

export default function App() {
  return (
    <Routes>
      {/* Public Customer Showcase Website */}
      <Route path="/" element={<CustomerHome />} />

      {/* Private Store Owner Portal */}
      <Route path="/admin" element={<AdminLayout />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
