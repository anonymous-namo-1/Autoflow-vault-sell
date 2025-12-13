import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { SiTwitter, SiGithub, SiLinkedin, SiInstagram } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/animations';

const quickLinks = [
  { href: '/templates', label: 'Browse Templates' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/refund', label: 'Refund Policy' },
  { href: '/licenses', label: 'Licenses' },
];

const socialLinks = [
  { href: 'https://twitter.com', icon: SiTwitter, label: 'Twitter' },
  { href: 'https://github.com', icon: SiGithub, label: 'GitHub' },
  { href: 'https://linkedin.com', icon: SiLinkedin, label: 'LinkedIn' },
  { href: 'https://instagram.com', icon: SiInstagram, label: 'Instagram' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
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

          <motion.div variants={staggerItem} className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide">
              Newsletter
            </h4>
            <p className="text-sm text-background/70">
              Get the latest templates and updates delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                  data-testid="input-newsletter-email"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-background text-foreground shrink-0"
                  data-testid="button-newsletter-submit"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              {isSubscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-green-400"
                  data-testid="text-newsletter-success"
                >
                  Thanks for subscribing!
                </motion.p>
              )}
            </form>

            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md bg-background/10 transition-colors hover:bg-background/20"
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
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
