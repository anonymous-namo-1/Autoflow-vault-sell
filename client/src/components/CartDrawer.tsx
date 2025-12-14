import { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCartStore } from '@/stores/cartStore';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface CouponResponse {
  valid: boolean;
  discountType: string;
  discountValue: string;
  code: string;
}

export function CartDrawer() {
  const { toast } = useToast();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    itemCount,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResponse | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  const applyCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest('POST', '/api/coupons/validate', { code });
      return response.json();
    },
    onSuccess: (data: CouponResponse) => {
      if (data.valid) {
        setAppliedCoupon(data);
        toast({
          title: 'Coupon applied',
          description: `Discount of ${data.discountType === 'percentage' ? `${data.discountValue}%` : `₹${data.discountValue}/-`} applied`,
        });
      } else {
        toast({
          title: 'Invalid coupon',
          description: 'This coupon code is not valid',
          variant: 'destructive',
        });
      }
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to apply coupon',
        variant: 'destructive',
      });
    },
  });

  const handleRemoveItem = (productId: string) => {
    setRemovingItemId(productId);
    setTimeout(() => {
      removeItem(productId);
      setRemovingItemId(null);
    }, 300);
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      applyCouponMutation.mutate(couponCode.trim());
    }
  };

  const cartSubtotal = subtotal();
  const discount = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? (cartSubtotal * parseFloat(appliedCoupon.discountValue)) / 100
      : parseFloat(appliedCoupon.discountValue)
    : 0;
  const total = Math.max(0, cartSubtotal - discount);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="flex flex-col p-0 sm:max-w-md">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between gap-4">
            <SheetTitle className="flex items-center gap-2" data-testid="text-cart-title">
              <ShoppingBag className="h-5 w-5" />
              Cart ({itemCount()})
            </SheetTitle>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="flex-1 flex flex-col items-center justify-center px-6 py-12"
          >
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2" data-testid="text-empty-cart-title">
              Your cart is empty
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Discover our automation templates and add them to your cart.
            </p>
            <Link href="/products">
              <Button onClick={closeCart} data-testid="button-browse-templates">
                Browse Templates
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="py-4 space-y-4"
              >
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.productId}
                      variants={staggerItem}
                      initial="initial"
                      animate={removingItemId === item.productId ? { opacity: 0, x: 50 } : "animate"}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3 }}
                      layout
                      className="flex gap-4 p-3 rounded-lg bg-muted/50"
                      data-testid={`cart-item-${item.productId}`}
                    >
                      <div className="w-16 h-16 rounded-md bg-muted flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            data-testid={`img-cart-item-${item.productId}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate" data-testid={`text-cart-item-name-${item.productId}`}>
                          {item.name}
                        </h4>
                        <p className="text-sm font-semibold mt-1" data-testid={`text-cart-item-price-${item.productId}`}>
                          ₹{Math.round(item.price)}/-
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              data-testid={`button-decrease-${item.productId}`}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium" data-testid={`text-quantity-${item.productId}`}>
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              data-testid={`button-increase-${item.productId}`}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground"
                            onClick={() => handleRemoveItem(item.productId)}
                            data-testid={`button-remove-${item.productId}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </ScrollArea>

            <div className="border-t px-6 py-4 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="pl-9"
                    data-testid="input-coupon-code"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={handleApplyCoupon}
                  disabled={applyCouponMutation.isPending || !couponCode.trim()}
                  data-testid="button-apply-coupon"
                >
                  {applyCouponMutation.isPending ? 'Applying...' : 'Apply'}
                </Button>
              </div>

              {appliedCoupon && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between text-sm bg-muted/50 px-3 py-2 rounded-md"
                >
                  <span className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    {appliedCoupon.code}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAppliedCoupon(null)}
                    data-testid="button-remove-coupon"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span data-testid="text-subtotal">₹{Math.round(cartSubtotal)}/-</span>
                </div>

                {discount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex justify-between text-sm text-green-600 dark:text-green-400"
                  >
                    <span>Discount</span>
                    <span data-testid="text-discount">-₹{Math.round(discount)}/-</span>
                  </motion.div>
                )}

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span data-testid="text-total">₹{Math.round(total)}/-</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={closeCart}
                  data-testid="button-checkout"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
