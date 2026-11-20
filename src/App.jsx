import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ToastProvider } from './components/common/Toast';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { router } from './routes';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <StoreProvider>
            <WishlistProvider>
              <CartProvider>
                <RouterProvider router={router} />
              </CartProvider>
            </WishlistProvider>
          </StoreProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
