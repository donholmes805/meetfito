---
name: Meet Fito Design System
colors:
  surface: '#fff8f6'
  surface-dim: '#fbd1c4'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ed'
  surface-container: '#ffe9e3'
  surface-container-high: '#ffe2da'
  surface-container-highest: '#ffdbd0'
  on-surface: '#2c160e'
  on-surface-variant: '#524434'
  inverse-surface: '#442a22'
  inverse-on-surface: '#ffede8'
  outline: '#857462'
  outline-variant: '#d7c3ae'
  surface-tint: '#835400'
  primary: '#835400'
  on-primary: '#ffffff'
  primary-container: '#f9a825'
  on-primary-container: '#674100'
  inverse-primary: '#ffb957'
  secondary: '#386b01'
  on-secondary: '#ffffff'
  secondary-container: '#b7f481'
  on-secondary-container: '#3e7109'
  tertiary: '#00639a'
  on-tertiary: '#ffffff'
  tertiary-container: '#76bfff'
  on-tertiary-container: '#004d79'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffddb5'
  primary-fixed-dim: '#ffb957'
  on-primary-fixed: '#2a1800'
  on-primary-fixed-variant: '#643f00'
  secondary-fixed: '#b7f481'
  secondary-fixed-dim: '#9cd769'
  on-secondary-fixed: '#0d2000'
  on-secondary-fixed-variant: '#285000'
  tertiary-fixed: '#cee5ff'
  tertiary-fixed-dim: '#96ccff'
  on-tertiary-fixed: '#001d32'
  on-tertiary-fixed-variant: '#004a75'
  background: '#fff8f6'
  on-background: '#2c160e'
  surface-variant: '#ffdbd0'
typography:
  display:
    fontFamily: Lexend
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  h1:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  h2:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Lexend
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  badge-text:
    fontFamily: Lexend
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 12px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  section-gap: 32px
  card-padding: 20px
  mobile-margin: 24px
  desktop-margin: auto
  max-width: 1200px
---

## Brand & Style

The brand identity is built on the pillars of safety, accessibility, and community growth. This design system utilizes a **Modern-Tactile** aesthetic—merging the clean efficiency of modern SaaS with the soft, approachable textures of educational environments. It is designed to feel like a digital extension of a physical neighborhood community center: bright, organized, and deeply human.

The visual language avoids clinical coldness in favor of "Organic Professionalism," ensuring parents feel they are in a secure, curated space. Every interaction is designed to reduce cognitive load, prioritizing clarity for busy parents managing homeschool schedules.

## Colors

The color palette is rooted in nature and education. The **Primary Yellow** (Amber-toned) evokes optimism and energy without the harshness of neon shades. The **Secondary Green** represents growth and safety, while the **Tertiary Blue** provides a calming influence for administrative tasks.

A specific **Earth Tone** is used for typography and neutral elements instead of pure black, maintaining a "warm" visual temperature throughout the experience. Specialized tokens are included for the "Parent Verification Badge" (a trustworthy gold) and the "Fito Guide" (a soft violet to distinguish AI-assisted interactions from human ones).

## Typography

The typography system uses **Lexend**, a typeface specifically designed to reduce visual stress and improve reading proficiency. This aligns perfectly with the educational focus of the platform.

The type scale is intentionally generous. Body text is set larger than standard web defaults to ensure legibility on mobile devices while parents are on the move. Headlines use a tighter letter-spacing and heavier weight to provide a clear information hierarchy, making the interface "scannable" at a glance.

## Layout & Spacing

This design system follows a **Mobile-First Responsive** philosophy. On mobile devices, the layout uses a single-column fluid grid with wide 24px side margins to prevent "visual crowding." 

For desktop, the content is contained within a centered 1200px max-width container, transitioning to a multi-column masonry-style grid for event discovery. The spacing rhythm is based on an 8px baseline grid, using large gaps (32px+) between sections to create a "breathable" and stress-free user experience.

## Elevation & Depth

Depth is achieved through **Tonal Layers** and **Ambient Shadows** rather than harsh borders. The background uses a very subtle off-white cream color, allowing white cards to "lift" off the surface using soft, diffused shadows with a slight warm tint (#5D4037 at 5% opacity).

Interactive elements like buttons use a subtle bottom-weighted shadow to create a tactile, pressable feel. The "Fito Guide" assistant uses a unique elevation style—Glassmorphism with a soft purple backdrop blur—to signal that it exists on a different functional plane than the rest of the static content.

## Shapes

The shape language is defined by significant roundedness to evoke friendliness and safety. A base corner radius of 16px (`rounded-lg`) is applied to all primary cards and containers. Interactive components like buttons and search bars utilize a semi-pill shape (24px+) to eliminate sharp edges, reinforcing the family-safe aesthetic. Smaller elements like tags and badges use an 8px radius to maintain consistency without losing structural definition.

## Components

### Cards & Containers
Cards are the primary unit of the interface. They must feature a white background, 16px corner radius, and 20px of internal padding. For "Meetup" cards, imagery should have a top-only 16px radius.

### Buttons
Primary buttons use the Secondary Green to signal "action/go." They should be large (minimum 48px height for touch targets) with bold Lexend labels. Secondary buttons should be outlined or earth-toned to maintain hierarchy.

### Parent Verification Badge
This is a high-trust component. It consists of a gold shield icon paired with a soft yellow background fill. It should appear next to names or on profile headers, always accompanied by a "Verified Parent" label in `badge-text` styling.

### Fito Guide (AI Assistant)
The Guide should appear as a floating action button or a persistent bottom-sheet element. It uses a gradient (Violet to Blue) and a subtle pulse animation to indicate it is "active" or "thinking."

### Input Fields
Inputs use a light earth-toned border (15% opacity) that thickens and changes to Blue on focus. Labels are always visible above the field to ensure accessibility and clarity.