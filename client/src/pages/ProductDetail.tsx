import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Heart,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ProductCard } from '@/components/ProductCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { cn } from '@/lib/utils';
import { fadeInUp } from '@/lib/animations';
import type { Product, Category } from '@shared/schema';

const DEFAULT_FAQS = [
  {
    question: 'What platforms does this work with?',
    answer: 'This template is designed to work with major automation platforms. Detailed integration guides are included.',
  },
  {
    question: 'Do I need coding experience?',
    answer: 'No coding experience is required. The template uses a visual workflow builder that allows you to create complex automations through a simple interface.',
  },
  {
    question: 'Is there support included?',
    answer: 'Yes, your purchase includes 30 days of email support for setup questions and troubleshooting.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'We offer a 14-day money-back guarantee. If the template doesn\'t meet your needs, contact us for a full refund.',
  },
];

export default function ProductDetail() {
  const [, params] = useRoute('/products/:slug');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const { addItem, hasItem } = useCartStore();
  const { toggleItem, hasItem: isInWishlist } = useWishlistStore();

  const { data: product, isLoading } = useQuery<Product & { category?: Category }>({
    queryKey: ['/api/products', params?.slug],
    queryFn: async () => {
      const res = await fetch(`/api/products/${params?.slug}`);
      if (!res.ok) throw new Error('Product not found');
      return res.json();
    },
    enabled: !!params?.slug,
  });

  const { data: featuredProducts } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/products">
            <Button>Browse Templates</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const inCart = hasItem(product.id);
  const inWishlist = isInWishlist(product.id);
  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : undefined;
  const categoryName = product.category?.name || 'Uncategorized';

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const images = product.images?.length ? product.images : ['/placeholder1.jpg'];
  const features = product.features || [];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `cart-${product.id}`,
        productId: product.id,
        name: product.name,
        price: price,
        originalPrice: originalPrice,
      });
    }
  };

  const handleToggleWishlist = () => {
    toggleItem({
      id: `wishlist-${product.id}`,
      productId: product.id,
      name: product.name,
      price: price,
      originalPrice: originalPrice,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const relatedProducts = (featuredProducts || [])
    .filter(p => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Link href="/products">
              <Button variant="ghost" className="gap-2" data-testid="button-back">
                <ChevronLeft className="w-4 h-4" />
                Back to Templates
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="space-y-4"
            >
              <div
                className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
                data-testid="image-main"
              >
                <div
                  className={cn(
                    'w-full h-full bg-muted flex items-center justify-center transition-transform duration-200',
                    isZoomed && 'scale-150'
                  )}
                  style={
                    isZoomed
                      ? {
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        }
                      : undefined
                  }
                >
                  <ShoppingCart className="w-16 h-16 text-muted-foreground" />
                </div>
                {discount > 0 && (
                  <Badge className="absolute top-4 left-4" variant="default">
                    -{discount}%
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedImage((prev) => Math.max(0, prev - 1))}
                  disabled={selectedImage === 0}
                  data-testid="button-prev-image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1 grid grid-cols-4 gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={cn(
                        'aspect-[4/3] bg-muted rounded-md overflow-hidden border-2 transition-colors',
                        selectedImage === index ? 'border-foreground' : 'border-transparent'
                      )}
                      onClick={() => setSelectedImage(index)}
                      data-testid={`button-thumbnail-${index}`}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setSelectedImage((prev) => Math.min(images.length - 1, prev + 1))
                  }
                  disabled={selectedImage === images.length - 1}
                  data-testid="button-next-image"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <Badge variant="outline" className="mb-3" data-testid="badge-category">
                  {categoryName}
                </Badge>
                <h1 className="text-3xl font-bold mb-3" data-testid="text-product-name">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold" data-testid="text-price">
                  ₹{Math.round(price)}/-
                </span>
                {originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{Math.round(originalPrice)}/-
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed" data-testid="text-short-description">
                {product.shortDescription || product.description}
              </p>

              {features.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Key Features</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {features.slice(0, 6).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-foreground flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    data-testid="button-quantity-minus"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium" data-testid="text-quantity">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => q + 1)}
                    data-testid="button-quantity-plus"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={inCart}
                  data-testid="button-add-cart"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {inCart ? 'In Cart' : 'Add to Cart'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleToggleWishlist}
                  className={cn(inWishlist && 'text-red-500')}
                  data-testid="button-wishlist"
                >
                  <Heart className={cn('w-5 h-5', inWishlist && 'fill-current')} />
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Download className="w-4 h-4" />
                <span data-testid="text-download-count">
                  {(product.downloadCount || 0).toLocaleString()} downloads
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start" data-testid="tabs-product">
                <TabsTrigger value="description" data-testid="tab-description">
                  Description
                </TabsTrigger>
                {features.length > 0 && (
                  <TabsTrigger value="features" data-testid="tab-features">
                    Features
                  </TabsTrigger>
                )}
                <TabsTrigger value="faq" data-testid="tab-faq">
                  FAQ
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6 prose prose-sm max-w-none dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  </CardContent>
                </Card>
              </TabsContent>
              {features.length > 0 && (
                <TabsContent value="features" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <Check className="w-4 h-4" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
              <TabsContent value="faq" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible>
                      {DEFAULT_FAQS.map((faq, index) => (
                        <AccordionItem key={index} value={`faq-${index}`}>
                          <AccordionTrigger data-testid={`accordion-faq-${index}`}>
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {relatedProducts.length > 0 && (
            <motion.section
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">Related Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    slug={p.slug}
                    name={p.name}
                    price={parseFloat(p.price)}
                    originalPrice={p.originalPrice ? parseFloat(p.originalPrice) : undefined}
                    category={p.categoryId || 'Uncategorized'}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
