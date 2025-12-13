import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function PrivacyPolicy() {
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
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="button-back-home">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h1 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-privacy-title">
                Privacy Policy
              </h1>
              
              <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                <p className="text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">1. Information We Collect</h2>
                  <p className="text-muted-foreground">
                    We collect information you provide directly to us, such as when you create an account, 
                    make a purchase, or contact us for support. This includes:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Email address and password for account creation</li>
                    <li>Payment information processed securely through Razorpay</li>
                    <li>Purchase history and downloaded templates</li>
                    <li>Communication preferences</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
                  <p className="text-muted-foreground">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Process your purchases and deliver digital products</li>
                    <li>Send you order confirmations and updates</li>
                    <li>Provide customer support</li>
                    <li>Improve our services and user experience</li>
                    <li>Prevent fraud and ensure security</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">3. Information Sharing</h2>
                  <p className="text-muted-foreground">
                    We do not sell, trade, or rent your personal information to third parties. 
                    We may share information with:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Payment processors (Razorpay) for transaction processing</li>
                    <li>Service providers who assist in our operations</li>
                    <li>Legal authorities when required by law</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">4. Data Security</h2>
                  <p className="text-muted-foreground">
                    We implement appropriate security measures to protect your personal information. 
                    All payment transactions are encrypted and processed through secure payment gateways. 
                    However, no method of transmission over the Internet is 100% secure.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">5. Your Rights</h2>
                  <p className="text-muted-foreground">
                    You have the right to:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your account</li>
                    <li>Opt-out of marketing communications</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">6. Cookies</h2>
                  <p className="text-muted-foreground">
                    We use cookies and similar technologies to maintain your session, 
                    remember your preferences, and improve our services. You can control 
                    cookie settings through your browser.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">7. Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy, please contact us at 
                    hello@automatehub.com.
                  </p>
                </section>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
