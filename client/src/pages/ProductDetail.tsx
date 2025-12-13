import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Star,
  Heart,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
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

const MOCK_PRODUCT = {
  id: '1',
  slug: 'email-automation-template',
  name: 'Email Automation Template',
  price: 29.99,
  originalPrice: 49.99,
  category: 'Email',
  rating: 4.8,
  reviewCount: 124,
  downloadCount: 1543,
  shortDescription: 'Streamline your email marketing with this comprehensive automation template. Set up triggered campaigns, drip sequences, and personalized outreach in minutes.',
  description: `
    <p>Transform your email marketing strategy with our powerful Email Automation Template. This comprehensive solution provides everything you need to create sophisticated, automated email campaigns that engage your audience and drive conversions.</p>
    
    <h3>What's Included</h3>
    <ul>
      <li>Pre-built automation workflows for common use cases</li>
      <li>Customizable email templates with responsive design</li>
      <li>A/B testing framework for optimization</li>
      <li>Integration guides for popular email platforms</li>
      <li>Analytics dashboard template for tracking performance</li>
    </ul>
    
    <h3>Who Is This For?</h3>
    <p>This template is perfect for marketers, small business owners, and agencies who want to save time setting up email automation while maintaining professional quality and effectiveness.</p>
  `,
  features: [
    'Drag-and-drop workflow builder',
    'Pre-built trigger conditions',
    'Personalization tokens',
    'Multi-step sequences',
    'Conditional branching logic',
    'Performance analytics',
    'Mobile-responsive templates',
    'A/B testing support',
  ],
  faqs: [
    {
      question: 'What email platforms does this work with?',
      answer: 'This template is designed to work with major email platforms including Mailchimp, ConvertKit, ActiveCampaign, and HubSpot. Detailed integration guides are included for each platform.',
    },
    {
      question: 'Do I need coding experience?',
      answer: 'No coding experience is required. The template uses a visual workflow builder that allows you to create complex automations through a simple drag-and-drop interface.',
    },
    {
      question: 'Is there support included?',
      answer: 'Yes, your purchase includes 30 days of email support for setup questions and troubleshooting. We also provide comprehensive documentation.',
    },
    {
      question: 'Can I get a refund?',
      answer: 'We offer a 14-day money-back guarantee. If the template doesn\'t meet your needs, contact us for a full refund.',
    },
  ],
  images: [
    '/placeholder1.jpg',
    '/placeholder2.jpg',
    '/placeholder3.jpg',
    '/placeholder4.jpg',
  ],
  tags: ['automation', 'email', 'marketing'],
};

const RELATED_PRODUCTS = [
  {
    id: '2',
    slug: 'crm-integration-workflow',
    name: 'CRM Integration Workflow',
    price: 49.99,
    category: 'CRM',
    rating: 4.5,
    reviewCount: 89,
  },
  {
    id: '5',
    slug: 'lead-capture-automation',
    name: 'Lead Capture Automation',
    price: 59.99,
    originalPrice: 79.99,
    category: 'Marketing',
    rating: 4.6,
    reviewCount: 145,
  },
  {
    id: '3',
    slug: 'social-media-scheduler',
    name: 'Social Media Scheduler',
    price: 19.99,
    originalPrice: 29.99,
    category: 'Social',
    rating: 4.9,
    reviewCount: 256,
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

  const product = MOCK_PRODUCT;
  const inCart = hasItem(product.id);
  const inWishlist = isInWishlist(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `cart-${product.id}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
      });
    }
  };

  const handleToggleWishlist = () => {
    toggleItem({
      id: `wishlist-${product.id}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'w-5 h-5',
          i < Math.floor(rating) ? 'fill-foreground text-foreground' : 'text-muted-foreground'
        )}
      />
    ));
  };

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
                  {product.images.map((_, index) => (
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
                    setSelectedImage((prev) => Math.min(product.images.length - 1, prev + 1))
                  }
                  disabled={selectedImage === product.images.length - 1}
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
                  {product.category}
                </Badge>
                <h1 className="text-3xl font-bold mb-3" data-testid="text-product-name">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold" data-testid="text-price">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed" data-testid="text-short-description">
                {product.shortDescription}
              </p>

              <div className="space-y-2">
                <h3 className="font-semibold">Key Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.slice(0, 6).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-foreground flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

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
                  {product.downloadCount.toLocaleString()} downloads
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
                <TabsTrigger value="features" data-testid="tab-features">
                  Features
                </TabsTrigger>
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
              <TabsContent value="features" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.features.map((feature, index) => (
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
              <TabsContent value="faq" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible>
                      {product.faqs.map((faq, index) => (
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

          <motion.section
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6">Related Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RELATED_PRODUCTS.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
