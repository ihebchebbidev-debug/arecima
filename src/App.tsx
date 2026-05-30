import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import { useAnalyticsTracker } from "@/hooks/useAnalyticsTracker";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import FloatingActions from "@/components/FloatingActions";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import OrderDetail from "./pages/admin/OrderDetail";
import CustomersAdmin from "./pages/admin/CustomersAdmin";
import CustomerDetail from "./pages/admin/CustomerDetail";
import AnalyticsAdmin from "./pages/admin/AnalyticsAdmin";
import IntegrationsAdmin from "./pages/admin/IntegrationsAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

// Tracks visitor sessions + Facebook Pixel on route changes (skips /admin/*).
const AnalyticsBoundary = () => {
  useAnalyticsTracker();
  useFacebookPixel();
  return null;
};

// Guards admin routes — must be authenticated via the API.
const RequireAdmin = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AdminAuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <AnalyticsBoundary />
                <Routes>
                  {/* Admin Login */}
                  <Route path="/admin" element={<AdminLogin />} />

                  {/* Admin Routes (protected) */}
                  <Route
                    path="/admin"
                    element={
                      <RequireAdmin>
                        <AdminLayout />
                      </RequireAdmin>
                    }
                  >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<ProductsAdmin />} />
                    <Route path="categories" element={<CategoriesAdmin />} />
                    <Route path="orders" element={<OrdersAdmin />} />
                    <Route path="orders/:id" element={<OrderDetail />} />
                    <Route path="customers" element={<CustomersAdmin />} />
                    <Route path="customers/:id" element={<CustomerDetail />} />
                    <Route path="analytics" element={<AnalyticsAdmin />} />
                    <Route path="integrations" element={<IntegrationsAdmin />} />
                    <Route path="users" element={<UsersAdmin />} />
                  </Route>

                  {/* Storefront Routes */}
                  <Route path="/" element={<><Header /><Index /><Footer /><CartDrawer /><FloatingActions /></>} />
                  <Route path="/products" element={<><Header /><Products /><Footer /><CartDrawer /><FloatingActions /></>} />
                  <Route path="/product/:id" element={<><Header /><ProductDetail /><Footer /><CartDrawer /><FloatingActions /></>} />
                  <Route path="/favorites" element={<><Header /><Favorites /><Footer /><CartDrawer /><FloatingActions /></>} />
                  <Route path="/cart" element={<><Header /><Cart /><Footer /><CartDrawer /><FloatingActions /></>} />
                  <Route path="/checkout" element={<><Header /><Checkout /><Footer /><CartDrawer /><FloatingActions /></>} />
                  <Route path="/blog" element={<><Header /><Blog /><Footer /><CartDrawer /><FloatingActions /></>} />
                  <Route path="/blog/:id" element={<><Header /><BlogPost /><Footer /><CartDrawer /><FloatingActions /></>} />
                  <Route path="/shipping-policy" element={<><Header /><ShippingPolicy /><Footer /></>} />
                  <Route path="/return-policy" element={<><Header /><ReturnPolicy /><Footer /></>} />
                  <Route path="/faq" element={<><Header /><FAQ /><Footer /></>} />
                  <Route path="/privacy-policy" element={<><Header /><PrivacyPolicy /><Footer /></>} />
                  <Route path="/terms" element={<><Header /><Terms /><Footer /></>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </FavoritesProvider>
          </CartProvider>
        </AdminAuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
