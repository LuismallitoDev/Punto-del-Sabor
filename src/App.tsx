import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

export default function App() {
  return (
    <CartProvider>
      <ToastProvider> 
        <Layout>
          <Home />
        </Layout>
      </ToastProvider>
    </CartProvider>
  );
}