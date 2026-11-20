import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ToastProvider } from './components/common/Toast';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { WishlistProvider } from './context/WishlistContext';
import { router } from './routes';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <StoreProvider>
            <WishlistProvider>
              <RouterProvider router={router} />
            </WishlistProvider>
          </StoreProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
