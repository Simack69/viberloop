# Nxtile Design System for Viberloop

## Overview

The Nxtile design system brings a sophisticated, sustainability-focused aesthetic to Viberloop with deep indigo-purple as the dominant color, warm cream backgrounds, and sustainability green as a secondary accent.

---

## Brand & Color Palette

### Primary Colors
- **Deep Indigo-Purple**: `--nx-primary` (#2D1B69) - Dominant brand color
- **Dark Indigo**: `--nx-primary-dark` (#1E1147) - Footer and dark variants
- **Light Primary**: `--nx-primary-light` (rgba(45, 27, 105, 0.08)) - Subtle backgrounds

### Backgrounds
- **Warm Cream**: `--nx-bg` (#F5F2EA) - Main background
- **Off-White**: `--nx-bg-alt` (#EDE9DC) - Secondary background, warm cards
- **Dark Background**: `--nx-bg-dark` (#2D1B69) - Dark card variant

### Accent Colors
- **Sustainability Green**: `--nx-green` (#3A7D44) - Use ONLY for badges, icons, labels
- **Light Green**: `--nx-green-light` (#E8F2E9) - Badge backgrounds

### Borders & Dividers
- **Border Color**: `--nx-border` (#D8D3C8) - Subtle, elegant borders
- **Border Width**: `--nx-border-width` (1px)

### Text Colors
- **Primary Text**: `--nx-text-primary` (#1A1A1A)
- **Secondary Text**: `--nx-text-secondary` (#5A5A7A)
- **Light Text**: `--nx-text-light` (rgba(255, 255, 255, 0.65)) - For dark backgrounds
- **White**: `--nx-text-white` (#FFFFFF)

---

## Typography

### Font Families
```css
--nx-font-ui: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
--nx-font-display: 'Fraunces', Georgia, serif;
```

### Usage
- **DM Sans**: All UI elements, navigation, buttons, labels, body text
- **Fraunces**: Headlines (h1, h2), emphasis text
  - Font-weight: 300
  - Use italic for special emphasis

### Logo/Wordmark
```html
<strong>Viber</strong>loop
```
- "Viber" is bold (font-weight: 700)
- "loop" is normal weight

### Font Sizes
```css
--nx-text-xs: 0.7rem     /* Labels, badges */
--nx-text-sm: 0.75rem    /* Small text */
--nx-text-base: 0.875rem /* Body text */
--nx-text-lg: 1rem       /* Large body */
--nx-text-xl: 1.25rem    /* h3 */
--nx-text-2xl: 1.5rem    /* h2 */
--nx-text-3xl: 2rem      /* h1 */
```

### Letter Spacing
```css
--nx-tracking-wide: 0.08em    /* Buttons */
--nx-tracking-wider: 0.14em   /* Section labels */
```

---

## Components

### Buttons

All buttons are **pill-shaped** with uppercase text and generous letter spacing.

#### Classes
- `.nx-btn` - Base button class
- `.nx-btn-primary` - Primary button (indigo background, white text)
- `.nx-btn-outline` - Outline button (transparent bg, indigo border)
- `.nx-btn-green` - Green button (sustainability actions)
- `.nx-btn-sm` - Small button
- `.nx-btn-lg` - Large button

#### Example
```html
<button class="nx-btn nx-btn-primary">Submit Form</button>
<button class="nx-btn nx-btn-outline">Cancel</button>
```

#### Specs
- Border-radius: `var(--nx-radius-pill)` (9999px)
- Text: UPPERCASE, font-weight 700, letter-spacing 0.08em
- Font-size: 0.8rem (0.7rem for small)
- Padding: 0.75rem 1.5rem

---

### Cards & Panels

Cards use **minimal shadows** with **1px borders** instead of heavy drop-shadows.

#### Classes
- `.nx-card` - Base card (white background, subtle border)
- `.nx-card-warm` - Warm variant (off-white background)
- `.nx-card-dark` - Dark variant (indigo background, white text)

#### Behavior
- Default: No shadow, 1px border
- Hover: Subtle shadow (`--nx-shadow-hover`)

#### Example
```html
<div class="nx-card">
    <h2>Card Title</h2>
    <p>Card content...</p>
</div>
```

---

### Badges & Status Pills

All badges are **pill-shaped** with uppercase text.

#### Classes
- `.nx-badge` - Base badge class
- `.nx-badge-progress` - In Progress (light green bg, green text)
- `.nx-badge-verified` - Verified/Complete (light indigo bg, indigo text)
- `.nx-badge-pending` - Pending (off-white bg, secondary text)
- `.nx-badge-green` - Green badge (solid green)
- `.nx-badge-primary` - Primary badge (solid indigo)

#### Example
```html
<span class="nx-badge nx-badge-progress">In Progress</span>
<span class="nx-badge nx-badge-verified">Verified</span>
```

---

### Navigation

#### Specs
- Background: White (`--nx-text-white`)
- Border-bottom: 1px solid `--nx-border`
- Links: DM Sans, 0.875rem, font-weight 500, UPPERCASE
- Active/Hover: Color `--nx-primary`

#### Classes
- `.nx-nav` - Navigation container
- `.nx-nav-link` - Navigation link
- `.nx-logo` - Logo/wordmark

#### Example
```html
<nav class="nx-nav">
    <a href="/" class="nx-logo"><strong>Viber</strong>loop</a>
    <a href="#" class="nx-nav-link active">Dashboard</a>
    <a href="#" class="nx-nav-link">Transactions</a>
</nav>
```

---

### Section Labels

Small uppercase labels above section headings (like nxtile.eu).

#### Class
- `.nx-section-label`

#### Specs
- Font-size: 0.7rem
- Font-weight: 700
- Text-transform: UPPERCASE
- Letter-spacing: 0.14em
- Color: `--nx-green` (sustainability green)

#### Example
```html
<div class="nx-section-label">OUR PROCESS</div>
<h2>How Viberloop Works</h2>
```

---

### Phase Tracker

5-phase horizontal progress indicator for tracking transaction flow.

#### Classes
- `.nx-phase-tracker` - Container
- `.nx-phase` - Individual phase
- `.nx-phase.active` - Active phase
- `.nx-phase-circle` - Circle indicator
- `.nx-phase-label` - Phase label
- `.nx-phase-line` - Connecting line

#### Specs
- Active phases: `--nx-primary` filled circles
- Inactive phases: `--nx-border` (light gray)
- Connecting line: `--nx-primary` when active, `--nx-border` when inactive
- Labels: DM Sans, 0.75rem, font-weight 500

#### Example
```html
<div class="nx-phase-tracker">
    <div class="nx-phase active">
        <div class="nx-phase-circle">1</div>
        <div class="nx-phase-label">Collection</div>
        <div class="nx-phase-line"></div>
    </div>
    <div class="nx-phase">
        <div class="nx-phase-circle">2</div>
        <div class="nx-phase-label">Processing</div>
        <div class="nx-phase-line"></div>
    </div>
    <!-- ... more phases ... -->
</div>
```

---

### Forms

All form inputs use subtle borders with rounded corners.

#### Classes
- `.nx-input` - Text input
- `.nx-select` - Select dropdown
- `.nx-textarea` - Textarea
- `.nx-label` - Form label
- `.nx-file-upload` - File upload area

#### Specs
- Border: 1.5px solid `--nx-border`
- Border-radius: 8px
- Focus: Border color changes to `--nx-primary`, box-shadow with focus ring
- Focus ring: `var(--nx-focus-ring)` (rgba(45, 27, 105, 0.10))

#### Example
```html
<label class="nx-label">Your Name</label>
<input type="text" class="nx-input" placeholder="Enter name...">
```

---

### Tables

Clean, minimal table design.

#### Class
- `.nx-table`

#### Specs
- Headers: Uppercase, 0.7rem, font-weight 700, letter-spacing 0.08em
- Borders: 1px solid `--nx-border` on rows
- Hover: Background `--nx-primary-light`

---

### Footer

Dark indigo footer with light text.

#### Class
- `.nx-footer`
- `.nx-footer-link`

#### Specs
- Background: `--nx-primary-dark` (#1E1147)
- Text: `--nx-text-light` (rgba(255, 255, 255, 0.65))
- Links: rgba(255, 255, 255, 0.55), white on hover
- Padding: 3rem 0

---

## Layout

### Container
```css
.nx-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
}
```

### Section Spacing
```css
.nx-section {
    padding: var(--nx-section-padding) 0; /* 6rem top/bottom */
}
```

### Grid
```css
.nx-grid - Base grid with 1.5rem gap
.nx-grid-2 - 2-column responsive grid
.nx-grid-3 - 3-column responsive grid
```

---

## General Rules

### ❌ DON'T
- Use purple-to-purple gradients
- Use heavy drop-shadows on cards
- Use green as a dominant color (accent only!)
- Hardcode hex values (always use CSS variables)

### ✅ DO
- Use flat `--nx-primary` (#2D1B69) as dominant color
- Use warm cream (`--nx-bg`) backgrounds
- Use 1px borders on cards
- Apply pill-shaped buttons everywhere
- Use DM Sans for UI, Fraunces for headlines
- Give sections generous padding (6rem top/bottom)
- Use CSS variables from `nxtile.css`

---

## Responsive Design

### Breakpoints
- Mobile: < 768px
  - Section padding reduces to 3rem
  - Card padding reduces to 1.5rem
  - Font sizes scale down

### Mobile Optimizations
- Phase tracker becomes horizontally scrollable
- Grid columns collapse to single column
- Navigation becomes mobile-friendly

---

## CSS Variable Reference

### Quick Reference
```css
/* Colors */
--nx-primary: #2D1B69
--nx-bg: #F5F2EA
--nx-green: #3A7D44
--nx-border: #D8D3C8

/* Typography */
--nx-font-ui: 'DM Sans'
--nx-font-display: 'Fraunces'

/* Spacing */
--nx-section-padding: 6rem
--nx-card-padding: 2rem

/* Border Radius */
--nx-radius-pill: 9999px
--nx-radius-sm: 8px
```

---

## Implementation Checklist

When applying Nxtile design system:

- [ ] Link `nxtile.css` in HTML
- [ ] Replace all green gradients with flat `--nx-primary`
- [ ] Change backgrounds to `--nx-bg` or `--nx-bg-alt`
- [ ] Apply Fraunces to all headings
- [ ] Make all buttons pill-shaped with `.nx-btn` classes
- [ ] Update cards to use `.nx-card` with borders, not heavy shadows
- [ ] Update wordmark to `<strong>Viber</strong>loop`
- [ ] Apply section labels with `.nx-section-label`
- [ ] Use CSS variables throughout (no hardcoded colors)
- [ ] Update footer to dark indigo (`--nx-primary-dark`)
- [ ] Ensure form inputs have 1.5px borders and focus rings

---

**Design System Version:** 1.0.0
**Last Updated:** March 2026
