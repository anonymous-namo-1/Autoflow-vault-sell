# Design Guidelines: Automation Template Marketplace

## Design Approach & References

**Selected Approach**: Hybrid - E-commerce Reference + Minimalist System

Drawing inspiration from:
- **Gumroad**: Clean product presentation, conversion-focused layout
- **Stripe**: Sophisticated black/white aesthetic, subtle animations
- **Linear**: Modern typography, purposeful micro-interactions

**Design Principles**:
1. Conversion-first: Every animation serves to guide user action
2. Sophisticated minimalism: Black/white creates premium feel
3. Progressive disclosure: Information revealed through interaction
4. Trust through clarity: Clean layouts build credibility

## Typography System

**Font Stack**: 
- Primary: Inter (Google Fonts) - Headings, UI elements
- Secondary: JetBrains Mono - Product codes, technical specs

**Hierarchy**:
- Hero Heading: text-6xl (60px), font-bold, tracking-tight
- Section Headings: text-4xl (36px), font-semibold
- Product Titles: text-2xl (24px), font-semibold
- Body Text: text-base (16px), font-normal, leading-relaxed
- Captions/Labels: text-sm (14px), font-medium
- Buttons: text-base, font-semibold, uppercase tracking-wide

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 8, 12, 16, 24, 32
- Component padding: p-4, p-6, p-8
- Section spacing: py-16, py-24, py-32
- Card gaps: gap-6, gap-8

**Grid System**:
- Container: max-w-7xl mx-auto px-4
- Product Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
- Content Width: max-w-6xl for sections, max-w-prose for text

## Color Palette (Black & White Theme)

**Monochrome Scale**:
- Pure White: #FFFFFF (backgrounds)
- Light Gray: #F5F5F5 (subtle backgrounds, hover states)
- Medium Gray: #E5E5E5 (borders, dividers)
- Dark Gray: #404040 (secondary text)
- Pure Black: #000000 (primary text, headers, accents)

**Application**:
- Page background: White
- Cards: White with border-gray-200, hover:shadow-2xl
- Text: Black headings, gray-700 body
- Buttons: Black background, white text, hover:bg-gray-800
- Inputs: White with black border, focus:ring-black

## Landing Page Structure

**Hero Section** (100vh):
- Large hero image/illustration showcasing automation templates in action
- Centered headline with animated fade-in
- Subheadline with staggered animation
- Dual CTA buttons (primary black, secondary white with black border)
- Animated background: Subtle floating geometric shapes or grid pattern
- Trust indicator: "Trusted by X+ developers" with animated counter

**Features Section** (py-24):
- 3-column grid showcasing key benefits
- Animated icon illustrations (on scroll trigger)
- Staggered fade-in for each card

**Product Showcase** (py-24):
- 6-8 featured templates in 3-column grid
- Animated hover effects (lift + shadow)
- "View All Templates" CTA

**Social Proof** (py-16):
- Animated testimonial cards with slide-in effect
- Star ratings with fill animation
- User avatars with subtle pulse

**Stats Section** (py-16):
- 4 key metrics in row layout
- Animated count-up on scroll into view
- Bold numbers with descriptive labels

**CTA Section** (py-24):
- Compelling headline
- Email capture form with animated submit
- Trust badges below

## Header/Navigation

**Desktop Header**:
- Sticky header with backdrop-blur on scroll
- Logo left, navigation center, cart/user icons right
- Search bar with expand animation on focus
- Cart icon with animated badge counter
- Mega menu for categories with fade-in dropdown

**Mobile Header**:
- Hamburger menu with slide-in drawer animation
- Full-screen overlay with staggered menu items

## Product Catalog Page

**Layout**:
- Sidebar filters (left, 25% width) with animated accordion sections
- Product grid (right, 75% width) in 2-3 columns
- Animated view toggle (grid/list) with smooth transitions

**Product Cards**:
- White card with border
- Product image with zoom on hover
- Title, category tag, price
- "Add to Cart" button appears on hover with slide-up
- Wishlist heart icon (top-right) with pop animation on click

## Individual Product Page

**Layout**:
- 2-column: Image gallery (left 50%), Details (right 50%)
- Image gallery with thumbnail carousel and lightbox zoom
- Sticky "Add to Cart" section with price, quantity, and CTA
- Tabbed content (Description, Features, FAQs) with animated transitions
- "Related Templates" carousel at bottom

## Shopping Cart

**Design**:
- Slide-in drawer from right (overlay)
- Cart items with thumbnail, name, price, quantity controls
- Animated removal with fade-out
- Running total with animated updates
- Sticky checkout button at bottom
- Empty state with illustrated animation

## Component Library

**Buttons**:
- Primary: Black bg, white text, rounded-lg, px-8 py-3, hover:scale-105 transition
- Secondary: White bg, black border, black text, same padding
- Icon Buttons: Circular, minimal, hover:bg-gray-100

**Input Fields**:
- Border: border-2 border-gray-300
- Focus: focus:border-black focus:ring-2 focus:ring-black/20
- Rounded: rounded-lg, px-4 py-3

**Cards**:
- White background, border border-gray-200
- Rounded: rounded-xl
- Shadow: shadow-sm, hover:shadow-2xl transition-shadow duration-300
- Padding: p-6

**Modals**:
- Centered overlay with backdrop blur
- Slide-up entrance animation
- Close button (top-right) with rotate on hover

## Animation Guidelines

**Entrance Animations** (via Framer Motion or GSAP):
- Fade + Slide Up: Landing page sections (0.5s ease-out)
- Stagger Children: Product cards (0.1s delay between items)
- Scale In: Buttons, icons (0.2s spring)

**Hover States**:
- Product Cards: transform scale-105, shadow increase (0.3s)
- Buttons: scale-105 or subtle bg color shift (0.2s)
- Images: zoom-in within container (0.4s)

**Interactive Feedback**:
- Cart Badge: Bounce animation on increment
- Wishlist Heart: Pop + fill animation (0.3s)
- Toast Notifications: Slide-in from top-right (0.4s)

**Background Animations**:
- Hero: Floating geometric shapes with parallax on scroll
- Gradient mesh: Subtle animated gradient background

**Loading States**:
- Skeleton screens: Pulse animation
- Spinners: Rotating border animation
- Progress bars: Animated width transitions

## Footer Design

**Multi-Column Layout** (4 columns):
- Company info with logo
- Quick links (Products, About, Contact)
- Legal (Privacy, Terms, Refund Policy)
- Newsletter signup with animated input

**Footer Bottom**:
- Copyright, social icons, payment badges
- All links with underline animation on hover

## Images Section

**Hero Section**: 
- Large hero image (1920x800px) showing dashboard/automation interface mockup
- Modern, clean screenshot with subtle depth/shadow
- Place behind headline text with 60% opacity overlay for text readability

**Product Cards**:
- Template preview images (600x400px)
- Clean interface screenshots or abstract representations
- Consistent aspect ratio across all cards

**Product Detail Page**:
- Multiple product screenshots in gallery (1200x800px)
- Feature highlight images showing automation workflows

All images should maintain the black/white aesthetic - prefer grayscale or monochrome visuals with high contrast.