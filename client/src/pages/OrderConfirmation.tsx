import { useEffect, useState } from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { Check, Download, Mail, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ConfettiAnimation } from '@/components/ConfettiAnimation';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import { useQuery } from '@tanstack/react-query';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: string;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: string;
  discount: string;
  total: string;
  createdAt: string;
  paidAt: string | null;
  items: OrderItem[];
}

function SuccessCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
      className="w-24 h-24 rounded-full bg-foreground flex items-center justify-center mx-auto"
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="w-12 h-12"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.path
          d="M5 12l5 5L20 7"
          fill="none"
          stroke="hsl(var(--background))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
      </motion.svg>
    </motion.div>
  );
}

export default function OrderConfirmation() {
  const [, params] = useRoute('/order/:orderId');
  const orderId = params?.orderId;
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: ['/api/orders', orderId],
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="max-w-2xl mx-auto px-4">
            <div className="text-center mb-8">
              <Skeleton className="w-24 h-24 rounded-full mx-auto mb-6" />
              <Skeleton className="h-8 w-64 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
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
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2" data-testid="text-order-not-found">
              Order not found
            </h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the order you're looking for.
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
      <ConfettiAnimation isActive={showConfetti} />
      <main className="flex-1 py-16">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center mb-12"
          >
            <motion.div variants={staggerItem}>
              <SuccessCheckmark />
            </motion.div>

            <motion.h1
              variants={staggerItem}
              className="text-3xl font-bold mt-8 mb-2"
              data-testid="text-thank-you"
            >
              Thank you for your purchase!
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="text-muted-foreground"
              data-testid="text-order-number"
            >
              Order #{order.orderNumber}
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerItem}
            initial="initial"
            animate="animate"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/50"
                      data-testid={`order-item-${item.productId}`}
                    >
                      <div className="flex-1">
                        <p className="font-medium" data-testid={`text-item-name-${item.productId}`}>
                          {item.productName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} x ₹{Math.round(parseFloat(item.price))}/-
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-download-${item.productId}`}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span data-testid="text-order-subtotal">
                      ₹{Math.round(parseFloat(order.subtotal))}/-
                    </span>
                  </div>

                  {parseFloat(order.discount) > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>Discount</span>
                      <span data-testid="text-order-discount">
                        -₹{Math.round(parseFloat(order.discount))}/-
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Paid</span>
                    <span data-testid="text-order-total">
                      ₹{Math.round(parseFloat(order.total))}/-
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-muted-foreground" data-testid="text-email-confirmation">
                    A confirmation email with your download links has been sent to your registered email address.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <Link href="/orders">
              <Button variant="outline" data-testid="button-view-orders">
                View All Orders
              </Button>
            </Link>
            <Link href="/products">
              <Button data-testid="button-continue-shopping">
                Continue Shopping
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
