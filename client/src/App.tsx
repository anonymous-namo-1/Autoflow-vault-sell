import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Dashboard from "@/pages/Dashboard";
import PurchaseHistory from "@/pages/PurchaseHistory";
import Downloads from "@/pages/Downloads";
import Wishlist from "@/pages/Wishlist";
import Profile from "@/pages/Profile";
import Cart from "@/pages/Cart";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import RefundPolicy from "@/pages/RefundPolicy";
import { CartDrawer } from "@/components/CartDrawer";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/products" component={Products} />
      <Route path="/templates" component={Products} />
      <Route path="/products/:slug" component={ProductDetail} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/cart" component={Cart} />
      <Route path="/order/:orderId" component={OrderConfirmation} />
      <Route path="/orders" component={PurchaseHistory} />
      <Route path="/settings" component={Profile} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms" component={Terms} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/purchases" component={PurchaseHistory} />
      <Route path="/dashboard/downloads" component={Downloads} />
      <Route path="/dashboard/wishlist" component={Wishlist} />
      <Route path="/dashboard/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <CartDrawer />
        <AppRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
