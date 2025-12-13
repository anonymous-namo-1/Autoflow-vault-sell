import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ShoppingBag, Lock, Shield, CreditCard, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { items, subtotal, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const cartSubtotal = subtotal();
  const discount = 0;
  const total = cartSubtotal - discount;

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/orders/create', {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.razorpayOrderId) {
        initiateRazorpayPayment(data);
      }
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create order. Please try again.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: async (paymentData: {
      orderId: string;
      razorpayPaymentId: string;
      razorpayOrderId: string;
      razorpaySignature: string;
    }) => {
      const response = await apiRequest('POST', '/api/orders/verify-payment', paymentData);
      return response.json();
    },
    onSuccess: (data) => {
      clearCart();
      setLocation(`/order/${data.orderId}`);
    },
    onError: () => {
      toast({
        title: 'Payment verification failed',
        description: 'Please contact support if you were charged.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    },
  });

  const initiateRazorpayPayment = (orderData: {
    orderId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
  }) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'AutomateHub',
      description: 'Automation Templates Purchase',
      order_id: orderData.razorpayOrderId,
      handler: function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        verifyPaymentMutation.mutate({
          orderId: orderData.orderId,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        });
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
      },
      theme: {
        color: '#000000',
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handlePayment = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please login',
        description: 'You need to be logged in to complete the purchase.',
        variant: 'destructive',
      });
      setLocation('/login');
      return;
    }

    if (items.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add some items to your cart before checkout.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    createOrderMutation.mutate();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-center px-4"
          >
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2" data-testid="text-empty-checkout-title">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-6">
              Add some templates to your cart to proceed with checkout.
            </p>
            <Link href="/products">
              <Button data-testid="button-browse-templates">Browse Templates</Button>
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="mb-8"
          >
            <Link href="/products">
              <Button variant="ghost" className="mb-4" data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <h1 className="text-3xl font-bold" data-testid="text-checkout-title">Checkout</h1>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground text-sm">
                      Complete your purchase securely using Razorpay. We accept all major cards, UPI, and net banking.
                    </p>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handlePayment}
                      disabled={isProcessing}
                      data-testid="button-pay-razorpay"
                    >
                      {isProcessing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="mr-2"
                          >
                            <Lock className="h-4 w-4" />
                          </motion.div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Pay ${total.toFixed(2)} with Razorpay
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-6 pt-4 border-t">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Lock className="h-4 w-4" />
                        <span>SSL Secured</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Shield className="h-4 w-4" />
                        <span>Safe Payment</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div variants={staggerItem} initial="initial" animate="animate">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-3"
                        data-testid={`checkout-item-${item.productId}`}
                      >
                        <div className="w-12 h-12 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span data-testid="text-checkout-subtotal">${cartSubtotal.toFixed(2)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>Discount</span>
                        <span data-testid="text-checkout-discount">-${discount.toFixed(2)}</span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span data-testid="text-checkout-total">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
