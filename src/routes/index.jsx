import { createBrowserRouter } from 'react-router-dom';

// Layouts
import StorefrontLayout from '../layouts/StorefrontLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import RouteErrorBoundary from '../components/common/RouteErrorBoundary';

// Storefront Pages
import HomePage from '../pages/storefront/HomePage';
import ShopPage from '../pages/storefront/ShopPage';
import ProductDetailsPage from '../pages/storefront/ProductDetailsPage';
import CategoryPage from '../pages/storefront/CategoryPage';
import AboutPage from '../pages/storefront/AboutPage';
import BlogPage from '../pages/storefront/BlogPage';
import BlogDetailsPage from '../pages/storefront/BlogDetailsPage';
import ContactPage from '../pages/storefront/ContactPage';
import WishlistPage from '../pages/storefront/WishlistPage';
import SearchResultsPage from '../pages/storefront/SearchResultsPage';
import NotFoundPage from '../pages/storefront/NotFoundPage';

// Admin Pages
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import DashboardOverview from '../pages/admin/DashboardOverview';
import ProductManagement from '../pages/admin/ProductManagement';
import CategoryManagement from '../pages/admin/CategoryManagement';
import AdvertisementManagement from '../pages/admin/AdvertisementManagement';
import BlogManagement from '../pages/admin/BlogManagement';
import MediaLibrary from '../pages/admin/MediaLibrary';
import OrdersEnquiries from '../pages/admin/OrdersEnquiries';
import TestimonialsManagement from '../pages/admin/TestimonialsManagement';
import WebsiteSettings from '../pages/admin/WebsiteSettings';

export const router = createBrowserRouter([
  // STOREFRONT ROUTES (Public for all customers)
  {
    path: '/',
    element: <StorefrontLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'shop/:slug', element: <ProductDetailsPage /> },
      { path: 'product/:slug', element: <ProductDetailsPage /> },
      { path: 'products/:slug', element: <ProductDetailsPage /> },
      { path: 'category/:slug', element: <CategoryPage /> },
      { path: 'categories/:slug', element: <CategoryPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'about-us', element: <AboutPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'blogs', element: <BlogPage /> },
      { path: 'blog/:slug', element: <BlogDetailsPage /> },
      { path: 'blogs/:slug', element: <BlogDetailsPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'contact-us', element: <ContactPage /> },
      { path: 'contactus', element: <ContactPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'search', element: <SearchResultsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // ADMIN LOGIN (Public login gateway)
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },

  // ADMIN DASHBOARD ROUTES (Protected: Only authenticated admin can access)
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <DashboardOverview /> },
      { path: 'products', element: <ProductManagement /> },
      { path: 'categories', element: <CategoryManagement /> },
      { path: 'advertisements', element: <AdvertisementManagement /> },
      { path: 'blogs', element: <BlogManagement /> },
      { path: 'media', element: <MediaLibrary /> },
      { path: 'orders', element: <OrdersEnquiries /> },
      { path: 'testimonials', element: <TestimonialsManagement /> },
      { path: 'settings', element: <WebsiteSettings /> },
    ],
  },
]);
