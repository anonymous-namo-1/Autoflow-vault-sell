import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Download, 
  Code, 
  Star, 
  ShoppingCart,
  ArrowRight,
  Loader2,
  Zap
} from "lucide-react";
import { useLocation } from "wouter";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { useCartStore } from "@/stores/cartStore";
import type { Product } from "@shared/schema";
import ParticleBackground from "@/components/ParticleBackground";

function FloatingShape({ 
  className, 
  delay = 0,
  duration = 20
}: { 
  className?: string; 
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      className={`absolute opacity-[0.03] ${className}`}
      animate={{
        y: [0, -20, 0],
        x: [0, 10, 0],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

function HeroSection() {
  const words = ["Automate", "Scale", "Succeed"];
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
      data-testid="section-hero"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ParticleBackground 
          particleCount={60}
          particleColor="hsl(var(--foreground))"
          maxSpeed={0.4}
          minSize={1}
          maxSize={3}
        />
        <FloatingShape 
          className="w-64 h-64 rounded-full border-2 border-foreground top-20 left-10" 
          delay={0}
        />
        <FloatingShape 
          className="w-32 h-32 border-2 border-foreground top-40 right-20 rotate-45" 
          delay={2}
        />
        <FloatingShape 
          className="w-48 h-48 rounded-full border-2 border-foreground bottom-32 left-1/4" 
          delay={4}
        />
        <FloatingShape 
          className="w-24 h-24 border-2 border-foreground bottom-40 right-1/3 rotate-12" 
          delay={1}
        />
        <FloatingShape 
          className="w-40 h-40 rounded-full border-2 border-foreground top-1/3 right-10" 
          delay={3}
        />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center"
        >
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground"
              data-testid="text-hero-title"
            >
              <span className="block md:inline">Automation Templates</span>{" "}
              <span className="block md:inline">
                to{" "}
                <span className="relative inline-block">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentWord}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="inline-block"
                    >
                      {words[currentWord]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
            </h1>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            data-testid="text-hero-subtitle"
          >
            Discover our curated collection of ready-to-use automation templates. 
            Save hours of development time and focus on what matters most.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link href="/products">
              <Button 
                size="lg" 
                className="text-base px-8"
                data-testid="button-browse-templates"
              >
                Browse Templates
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              className="text-base px-8"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-center gap-2 text-muted-foreground"
          >
            <span className="text-sm" data-testid="text-trust-indicator">
              Ready-to-use automation solutions for your business
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("animate");
    }
  }, [isInView, controls]);

  const features = [
    {
      icon: Download,
      title: "Instant Download",
      description: "Get immediate access to your purchased templates. Download and start using them right away.",
    },
    {
      icon: Code,
      title: "Easy Integration",
      description: "Our templates are designed to integrate seamlessly with your existing workflows and tools.",
    },
    {
      icon: Star,
      title: "Premium Quality",
      description: "Every template is crafted by experts and thoroughly tested to ensure reliability.",
    },
  ];

  return (
    <section 
      ref={ref}
      className="py-24 bg-background"
      data-testid="section-features"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial="initial"
          animate={controls}
          variants={staggerContainer}
        >
          <motion.div 
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              data-testid="text-features-title"
            >
              Why Choose Our Templates?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for developers who value quality and efficiency
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="h-full hover-elevate transition-all duration-300"
                  data-testid={`card-feature-${index}`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedProductsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();
  const { addItem, hasItem } = useCartStore();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isInView) {
      controls.start("animate");
    }
  }, [isInView, controls]);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
  });

  const handleAddToCart = (product: Product) => {
    addItem({
      id: `cart-${product.id}`,
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
    });
  };

  const handleBuyNow = (product: Product) => {
    if (!hasItem(product.id)) {
      addItem({
        id: `cart-${product.id}`,
        productId: product.id,
        name: product.name,
        price: parseFloat(product.price),
        originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
      });
    }
    navigate('/checkout');
  };

  return (
    <section 
      ref={ref}
      className="py-24 bg-muted/30"
      data-testid="section-featured-products"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial="initial"
          animate={controls}
          variants={staggerContainer}
        >
          <motion.div 
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              data-testid="text-featured-title"
            >
              Featured Templates
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our most popular automation templates loved by developers
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(products || []).slice(0, 6).map((product, index) => {
                const inCart = hasItem(product.id);
                return (
                  <motion.div
                    key={product.id}
                    variants={staggerItem}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="group overflow-visible hover-elevate transition-all duration-300"
                      data-testid={`card-product-${product.id}`}
                    >
                      <CardContent className="p-0">
                        <Link href={`/products/${product.slug}`}>
                          <div className="aspect-video bg-muted relative overflow-hidden rounded-t-xl cursor-pointer">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Code className="w-12 h-12 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                        </Link>
                        <div className="p-4">
                          <Link href={`/products/${product.slug}`}>
                            <h3 
                              className="font-semibold mb-1 cursor-pointer hover:underline"
                              data-testid={`text-product-name-${product.id}`}
                            >
                              {product.name}
                            </h3>
                          </Link>
                          <p 
                            className="text-lg font-bold mb-3"
                            data-testid={`text-product-price-${product.id}`}
                          >
                            ₹{Math.round(parseFloat(product.price))}/-
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1"
                              variant="outline"
                              disabled={inCart}
                              onClick={() => handleAddToCart(product)}
                              data-testid={`button-add-to-cart-${product.id}`}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              {inCart ? 'In Cart' : 'Add to Cart'}
                            </Button>
                            <Button 
                              className="flex-1"
                              onClick={() => handleBuyNow(product)}
                              data-testid={`button-buy-now-${product.id}`}
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              Buy Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          <motion.div 
            variants={fadeInUp}
            className="text-center mt-12"
          >
            <Link href="/products">
              <Button 
                variant="outline" 
                size="lg"
                data-testid="button-view-all-templates"
              >
                View All Templates
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ValuePropositionSection() {
  const highlights = [
    { label: "Instant Access", description: "Download immediately after purchase" },
    { label: "Easy Setup", description: "Clear documentation included" },
    { label: "Quality Tested", description: "All templates thoroughly verified" },
    { label: "Support Included", description: "Email support for setup questions" },
  ];

  return (
    <section 
      className="py-16 bg-foreground text-background"
      data-testid="section-value-proposition"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {highlights.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
              data-testid={`highlight-${index}`}
            >
              <div className="text-lg font-bold mb-1">
                {item.label}
              </div>
              <div className="text-sm opacity-70">{item.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <FeaturedProductsSection />
        <ValuePropositionSection />
      </main>
      <Footer />
    </div>
  );
}
