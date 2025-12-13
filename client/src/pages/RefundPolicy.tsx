import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function RefundPolicy() {
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
              <h1 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-refund-title">
                Refund Policy
              </h1>
              
              <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
                <p className="text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">Refund Eligibility</h2>
                  <p className="text-muted-foreground">
                    We offer refunds within <strong>14 days</strong> from the date of purchase 
                    under the following conditions:
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">When Refunds Are Granted</h2>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>
                      <strong>File Not Delivered:</strong> If you did not receive the download 
                      link or the file within 24 hours of purchase, you are eligible for a full refund.
                    </li>
                    <li>
                      <strong>Broken or Corrupted Files:</strong> If the downloaded file is 
                      corrupted, broken, or does not match the product description, you are 
                      eligible for a full refund.
                    </li>
                    <li>
                      <strong>Technical Issues:</strong> If you experience technical issues 
                      that prevent you from accessing or using the template, and our support 
                      team is unable to resolve the issue, you are eligible for a refund.
                    </li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">When Refunds May Be Denied</h2>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>
                      <strong>Successful Download:</strong> If you have successfully accessed 
                      and downloaded the template file, refunds may be denied as the digital 
                      product has been delivered.
                    </li>
                    <li>
                      <strong>Change of Mind:</strong> We do not offer refunds for change of 
                      mind purchases after the file has been downloaded.
                    </li>
                    <li>
                      <strong>Outside Refund Window:</strong> Refund requests made after 14 
                      days from the purchase date will not be processed.
                    </li>
                    <li>
                      <strong>Misuse:</strong> If there is evidence of misuse, fraud, or 
                      violation of our Terms of Service, refunds will be denied.
                    </li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">How to Request a Refund</h2>
                  <p className="text-muted-foreground">
                    To request a refund, please follow these steps:
                  </p>
                  <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                    <li>Email us at hello@automatehub.com with the subject line "Refund Request"</li>
                    <li>Include your order ID and the email address used for purchase</li>
                    <li>Describe the reason for your refund request</li>
                    <li>Attach any relevant screenshots if applicable</li>
                  </ol>
                  <p className="text-muted-foreground mt-4">
                    We will review your request and respond within 2-3 business days.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">Refund Processing</h2>
                  <p className="text-muted-foreground">
                    Once approved, refunds will be processed to the original payment method 
                    within 5-10 business days. The exact time may vary depending on your 
                    bank or payment provider.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold">Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about our refund policy, please contact us at 
                    hello@automatehub.com. We are here to help!
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
