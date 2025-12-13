import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

const quickLinks = [
  { href: '/templates', label: 'Browse Templates' },
];

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/refund-policy', label: 'Refund Policy' },
];

export default function Footer() {

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
        >
          <motion.div variants={staggerItem} className="space-y-4">
            <Link href="/" data-testid="link-footer-logo">
              <span className="text-xl font-bold">AutomateHub</span>
            </Link>
            <p className="text-sm text-background/70 leading-relaxed">
              Premium automation templates to supercharge your workflow. Save time, increase productivity, and scale your business.
            </p>
            <div className="space-y-2 text-sm text-background/70">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>123 Automation Street, Tech City</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>hello@automatehub.com</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span
                      data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-background/70 transition-colors hover:text-background"
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide">
              Legal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span
                      data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-background/70 transition-colors hover:text-background"
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-background/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/60">
              {new Date().getFullYear()} AutomateHub. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-background/40">
                Secure payments with
              </span>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-background/10 rounded text-xs font-medium">
                  Visa
                </div>
                <div className="px-2 py-1 bg-background/10 rounded text-xs font-medium">
                  Mastercard
                </div>
                <div className="px-2 py-1 bg-background/10 rounded text-xs font-medium">
                  PayPal
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
