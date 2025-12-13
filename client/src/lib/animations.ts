import { Variants } from 'framer-motion';

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const slideUp: Variants = {
  initial: { y: 100 },
  animate: { y: 0 },
  exit: { y: 100 },
};

export const slideDown: Variants = {
  initial: { y: -100 },
  animate: { y: 0 },
  exit: { y: -100 },
};

export const slideInLeft: Variants = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
};

export const slideInRight: Variants = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
};

export const scaleIn: Variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export const popIn: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    },
  },
  exit: { scale: 0, opacity: 0 },
};

export const pulse: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.3,
    },
  },
};

export const shake: Variants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
    },
  },
};

export const expandWidth: Variants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: 'auto', opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

export const badgePop: Variants = {
  initial: { scale: 0 },
  animate: { 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 15,
    },
  },
};

export const hoverLift = {
  scale: 1.02,
  y: -4,
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 20,
  },
};

export const tapScale = {
  scale: 0.98,
};

export const defaultTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 25,
};

export const smoothTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
};
