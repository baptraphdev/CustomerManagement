import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout';
import LoadingFallback from './components/LoadingFallback';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CustomerList = lazy(() => import('./pages/CustomerList'));
const CustomerForm = lazy(() => import('./pages/CustomerForm'));
const CustomerDetails = lazy(() => import('./pages/CustomerDetails'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <BrowserRouter>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard\" replace />} />
          <Route path="dashboard" element={
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="customers" element={
            <Suspense fallback={<LoadingFallback />}>
              <CustomerList />
            </Suspense>
          } />
          <Route path="customers/add" element={
            <Suspense fallback={<LoadingFallback />}>
              <CustomerForm />
            </Suspense>
          } />
          <Route path="customers/edit/:id" element={
            <Suspense fallback={<LoadingFallback />}>
              <CustomerForm />
            </Suspense>
          } />
          <Route path="customers/:id" element={
            <Suspense fallback={<LoadingFallback />}>
              <CustomerDetails />
            </Suspense>
          } />
          <Route path="*" element={
            <Suspense fallback={<LoadingFallback />}>
              <NotFound />
            </Suspense>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;