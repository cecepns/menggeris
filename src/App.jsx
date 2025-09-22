import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Landing Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import CategoryManagement from './pages/admin/CategoryManagement';
import ProductManagement from './pages/admin/ProductManagement';
import SettingsManagement from './pages/admin/SettingsManagement';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/admin/AdminLayout';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      offset: 40, // Reduced from 100px to 40px for better mobile experience
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-cream-50 overflow-x-hidden">
        <WhatsAppButton />
        <Routes>
          {/* Landing Page Routes */}
          <Route path="/" element={
            <div>
              <Navbar />
              <HomePage />
              <Footer />
            </div>
          } />
          <Route path="/about" element={
            <div>
              <Navbar />
              <AboutPage />
              <Footer />
            </div>
          } />
          <Route path="/products" element={
            <div>
              <Navbar />
              <ProductsPage />
              <Footer />
            </div>
          } />
          <Route path="/product/:id" element={
            <div>
              <Navbar />
              <ProductDetailPage />
              <Footer />
            </div>
          } />
          <Route path="/contact" element={
            <div>
              <Navbar />
              <ContactPage />
              <Footer />
            </div>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          } />
          <Route path="/admin/categories" element={
            <AdminLayout>
              <CategoryManagement />
            </AdminLayout>
          } />
          <Route path="/admin/products" element={
            <AdminLayout>
              <ProductManagement />
            </AdminLayout>
          } />
          <Route path="/admin/settings" element={
            <AdminLayout>
              <SettingsManagement />
            </AdminLayout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;