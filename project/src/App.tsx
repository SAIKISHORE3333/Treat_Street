import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import Storefront from './pages/Storefront';
import AdminDashboard from './pages/AdminDashboard';

function Router() {
  const [path, setPath] = useState(() => window.location.pathname);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  function navigate(to: string) {
    window.history.pushState(null, '', to);
    setPath(to);
  }

  const isAdmin = path === '/admin';

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onNavigate={navigate} currentPath={path} />
      <main className="pt-16">
        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <>
            <Storefront />
            <CartDrawer onCheckout={() => setCheckoutOpen(true)} />
            {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
          </>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router />
    </CartProvider>
  );
}
