import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { WishlistProvider } from './context/WishlistContext';
import { router } from './routes';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WishlistProvider>
        <RouterProvider router={router} />
      </WishlistProvider>
    </QueryClientProvider>
  );
}
