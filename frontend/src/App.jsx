import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import UploadContract from './pages/UploadContract.jsx';
import DocumentUpload from './pages/DocumentUpload.jsx';
import Documents from './pages/Documents.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/upload-contract" element={<ProtectedRoute><UploadContract /></ProtectedRoute>} />
      <Route path="/upload-document" element={<ProtectedRoute><DocumentUpload /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
   </Routes>

  );
}

export default App;
