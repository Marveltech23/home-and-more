import { createBrowserRouter } from 'react-router-dom';

// Layouts
import StorefrontLayout from '../layouts/StorefrontLayout';
import AdminLayout from '../layouts/AdminLayout';

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
  // STOREFRONT ROUTES
  {
    path: '/',
    element: <StorefrontLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'shop/:slug', element: <ProductDetailsPage /> },
      { path: 'category/:slug', element: <CategoryPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'blog/:slug', element: <BlogDetailsPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'search', element: <SearchResultsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // ADMIN DASHBOARD ROUTES
  {
    path: '/admin',
    element: <AdminLayout />,
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
