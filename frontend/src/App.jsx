import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Core Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import EventDetails from './pages/EventDetails';
import Contact from './pages/Contact';
import Login from './pages/Login';
// Protected Customer Pages
import Booking from './pages/Booking';
import BookingHistory from './pages/BookingHistory';
import Register from './pages/Register';

// Protected Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminScanner from './pages/AdminScanner';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-white text-black">
          {/* Main Navigation Panel */}
          <Navbar />

          {/* Viewport content mount */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/event" element={<EventDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/booking" element={<Booking />} />

              {/* Attendee Routes */}
              <Route
                path="/history"
                element={<BookingHistory />}
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/scanner"
                element={
                  <AdminRoute>
                    <AdminScanner />
                  </AdminRoute>
                }
              />

              {/* Fallback route: Redirect to Home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          {/* Futuristic Footer Widgets */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
