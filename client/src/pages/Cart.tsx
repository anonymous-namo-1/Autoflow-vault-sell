import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Trash2, ShoppingCart, Code } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { useCartStore } from "@/stores/cartStore";

export default function Cart() {
  const { items, removeItem, clearCart, getTotal } = useCartStore();

  const formatPrice = (price: number) => {
    return `₹${Math.round(price)}/-`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <Link href="/products">
                <Button variant="ghost" size="sm" data-testid="button-back-products">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h1 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-cart-title">
                Shopping Cart
              </h1>

              {items.length === 0 ? (
                <Card data-testid="card-empty-cart">
                  <CardContent className="py-16 text-center">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-6">
                      Looks like you haven't added any templates yet.
                    </p>
                    <Link href="/products">
                      <Button data-testid="button-browse-templates">
                        Browse Templates
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div key={item.id} variants={staggerItem}>
                        <Card data-testid={`card-cart-item-${item.productId}`}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                                <Code className="w-8 h-8 text-muted-foreground/50" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold truncate" data-testid={`text-item-name-${item.productId}`}>
                                  {item.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-lg font-bold" data-testid={`text-item-price-${item.productId}`}>
                                    {formatPrice(item.price)}
                                  </span>
                                  {item.originalPrice && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      {formatPrice(item.originalPrice)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.productId)}
                                data-testid={`button-remove-item-${item.productId}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <Card data-testid="card-cart-summary">
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                        <span className="font-semibold" data-testid="text-cart-subtotal">
                          {formatPrice(getTotal())}
                        </span>
                      </div>
                      <div className="border-t pt-4 flex items-center justify-between">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-xl font-bold" data-testid="text-cart-total">
                          {formatPrice(getTotal())}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 pt-4">
                        <Link href="/checkout">
                          <Button className="w-full" size="lg" data-testid="button-checkout">
                            Proceed to Checkout
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          onClick={clearCart}
                          data-testid="button-clear-cart"
                        >
                          Clear Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
