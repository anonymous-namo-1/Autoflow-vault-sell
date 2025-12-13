import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function Terms() {
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
              <h1 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-terms-title">
                Terms of Service
              </h1>
              
              <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                <p className="text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground">
                    By accessing and using AutomateHub, you accept and agree to be bound by these 
                    Terms of Service. If you do not agree to these terms, please do not use our services.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">2. Products and Services</h2>
                  <p className="text-muted-foreground">
                    AutomateHub provides digital automation templates for purchase and download. 
                    All products are delivered digitally and are available for immediate download 
                    after successful payment.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">3. User Accounts</h2>
                  <p className="text-muted-foreground">
                    To access certain features, you must create an account. You are responsible for:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized use</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">4. Purchases and Payments</h2>
                  <p className="text-muted-foreground">
                    All prices are displayed in Indian Rupees (INR). Payments are processed 
                    securely through Razorpay. By making a purchase, you agree to provide 
                    accurate payment information.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">5. License and Usage</h2>
                  <p className="text-muted-foreground">
                    Upon purchase, you receive a personal, non-exclusive, non-transferable license 
                    to use the automation templates. You may:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Use templates for personal or commercial projects</li>
                    <li>Modify templates for your own use</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    You may NOT:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Redistribute, resell, or share templates with others</li>
                    <li>Claim ownership of the original template design</li>
                    <li>Use templates for illegal purposes</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
                  <p className="text-muted-foreground">
                    All content, including templates, designs, and branding, is owned by 
                    AutomateHub and protected by intellectual property laws. Unauthorized use 
                    is prohibited.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
                  <p className="text-muted-foreground">
                    AutomateHub provides templates "as is" without warranties of any kind. 
                    We are not liable for any damages arising from the use of our products, 
                    including but not limited to data loss or business interruption.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">8. Changes to Terms</h2>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these terms at any time. Continued use of 
                    our services after changes constitutes acceptance of the new terms.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">9. Contact</h2>
                  <p className="text-muted-foreground">
                    For questions about these Terms of Service, contact us at hello@automatehub.com.
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
