import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Download, 
  Code, 
  Star, 
  ShoppingCart,
  Shield,
  RefreshCcw,
  Clock,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (startOnView && isInView && !hasStarted.current) {
      hasStarted.current = true;
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration, startOnView]);

  return { count, ref };
}

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
              Premium Automation Templates to{" "}
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
            <Button 
              size="lg" 
              className="text-base px-8"
              data-testid="button-browse-templates"
            >
              Browse Templates
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
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
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <Avatar key={i} className="w-8 h-8 border-2 border-background">
                  <AvatarFallback className="text-xs bg-muted">
                    {String.fromCharCode(64 + i)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-sm" data-testid="text-trust-indicator">
              Trusted by <TrustCounter /> developers
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustCounter() {
  const { count, ref } = useCountUp(10000, 2000);
  return (
    <span ref={ref} className="font-semibold text-foreground">
      {count.toLocaleString()}+
    </span>
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

  useEffect(() => {
    if (isInView) {
      controls.start("animate");
    }
  }, [isInView, controls]);

  const products = [
    { id: 1, name: "Email Automation Suite", price: 49 },
    { id: 2, name: "CRM Integration Pack", price: 79 },
    { id: 3, name: "Social Media Scheduler", price: 39 },
    { id: 4, name: "Invoice Generator Pro", price: 59 },
    { id: 5, name: "Analytics Dashboard", price: 89 },
    { id: 6, name: "Task Workflow Bundle", price: 69 },
  ];

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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
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
                    <div className="aspect-video bg-muted relative overflow-hidden rounded-t-xl">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Code className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 
                        className="font-semibold mb-1"
                        data-testid={`text-product-name-${product.id}`}
                      >
                        {product.name}
                      </h3>
                      <p 
                        className="text-lg font-bold mb-3"
                        data-testid={`text-product-price-${product.id}`}
                      >
                        ${product.price}
                      </p>
                      <Button 
                        className="w-full"
                        data-testid={`button-add-to-cart-${product.id}`}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            variants={fadeInUp}
            className="text-center mt-12"
          >
            <Button 
              variant="outline" 
              size="lg"
              data-testid="button-view-all-templates"
            >
              View All Templates
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: 10000, label: "Downloads", suffix: "+" },
    { value: 500, label: "Templates", suffix: "+" },
    { value: 4.9, label: "Rating", suffix: "", isDecimal: true },
    { value: 24, label: "Support", suffix: "/7" },
  ];

  return (
    <section 
      className="py-16 bg-foreground text-background"
      data-testid="section-stats"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem key={stat.label} {...stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({ 
  value, 
  label, 
  suffix, 
  index,
  isDecimal = false 
}: { 
  value: number; 
  label: string; 
  suffix: string; 
  index: number;
  isDecimal?: boolean;
}) {
  const { count, ref } = useCountUp(isDecimal ? Math.floor(value * 10) : value, 2000);
  const displayValue = isDecimal ? (count / 10).toFixed(1) : count.toLocaleString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="text-center"
      data-testid={`stat-${label.toLowerCase()}`}
    >
      <div className="text-3xl md:text-4xl font-bold mb-1">
        {displayValue}{suffix}
      </div>
      <div className="text-sm opacity-70">{label}</div>
    </motion.div>
  );
}

function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("animate");
    }
  }, [isInView, controls]);

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Senior Developer",
      content: "These templates saved me weeks of development time. The quality is outstanding and integration was seamless.",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      role: "Startup Founder",
      content: "Finally, automation templates that just work. No more reinventing the wheel for every project.",
      rating: 5,
    },
    {
      name: "Michael Park",
      role: "Tech Lead",
      content: "Our team productivity increased by 40% after implementing these templates. Highly recommended!",
      rating: 5,
    },
  ];

  return (
    <section 
      ref={ref}
      className="py-24 bg-background"
      data-testid="section-testimonials"
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
              data-testid="text-testimonials-title"
            >
              What Developers Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied developers using our templates
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={{
                  initial: { opacity: 0, x: index === 0 ? -50 : index === 2 ? 50 : 0, y: index === 1 ? 50 : 0 },
                  animate: { opacity: 1, x: 0, y: 0 },
                }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <Card 
                  className="h-full"
                  data-testid={`card-testimonial-${index}`}
                >
                  <CardContent className="p-6">
                    <motion.div 
                      className="flex gap-1 mb-4"
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                    >
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <Star className="w-4 h-4 fill-foreground text-foreground" />
                        </motion.div>
                      ))}
                    </motion.div>
                    <p className="text-muted-foreground mb-4 text-sm">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-muted text-sm">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-sm">{testimonial.name}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
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

function CTASection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("animate");
    }
  }, [isInView, controls]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setEmail("");
  };

  const trustBadges = [
    { icon: Shield, label: "SSL Secure" },
    { icon: RefreshCcw, label: "Money Back" },
    { icon: Clock, label: "Instant Access" },
    { icon: CheckCircle2, label: "Quality Guaranteed" },
  ];

  return (
    <section 
      ref={ref}
      className="py-24 bg-muted/30"
      data-testid="section-cta"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial="initial"
          animate={controls}
          variants={staggerContainer}
          className="text-center"
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold mb-4"
            data-testid="text-cta-title"
          >
            Ready to Automate?
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            className="text-muted-foreground mb-8 max-w-xl mx-auto"
          >
            Subscribe to our newsletter and get exclusive discounts, early access to new templates, and automation tips.
          </motion.p>

          <motion.form 
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-12"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              data-testid="input-newsletter-email"
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              disabled={isSubmitting || isSubmitted}
              data-testid="button-newsletter-submit"
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"
                  />
                ) : isSubmitted ? (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Subscribe
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.form>

          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-6"
          >
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
                data-testid={`badge-${badge.label.toLowerCase().replace(' ', '-')}`}
              >
                <badge.icon className="w-4 h-4" />
                <span>{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen" data-testid="page-home">
      <HeroSection />
      <FeaturesSection />
      <FeaturedProductsSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
