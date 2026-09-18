# UI/UX & Design Guidelines

## 1. Design System (Magic Patterns)
KhedutMitra heavily relies on a predefined Magic Patterns design system to ensure a cohesive, professional, and accessible user interface.

### 1.1 Typography
- **Primary Font:** Plus Jakarta Sans
- Used globally for headings, body text, and UI elements to provide a clean, modern aesthetic.

### 1.2 Color Palette
All colors are mapped to CSS variables and Tailwind configuration:
- **Brand:**
  - `brand` (#15803d) - Primary actions, active states.
  - `brand-deep` (#0f3d24) - Headers, heavy emphasis.
  - `brand-soft` (#eef6f0) - Backgrounds for active items, subtle highlights.
- **Accent:**
  - `accent` (#b45309) - Secondary actions, warnings, notifications.
  - `accent-soft` (#fdf5e9) - Subtle warning backgrounds.
- **Neutral/Surface:**
  - `canvas` (#fdfbf7) - Main app background.
  - `surface` (#ffffff) - Card backgrounds, modals.
  - `ink` (#1c1917) - Primary text.
  - `ink-muted` (#57534e) - Secondary text, placeholders.
  - `line` (#e7e5e4) - Borders, dividers.
- **Status:**
  - `danger` (#b91c1c) - Errors, destructive actions.
  - `danger-soft` (#fdf1f1) - Error backgrounds.

## 2. Core Components
Always reuse existing components located in `src/components/`:
- `Button`: Supports variants (`primary`, `secondary`, `outline`, `ghost`).
- `Card`: Uses `shadow-card`, `bg-surface`, `border-line`.
- `Input`, `Select`: Consistent form controls.
- `EmptyState`, `ErrorState`: For edge cases.
- `LanguageToggle`: Placed in the top navigation.

## 3. Formatting
- **Currency:** Indian Numbering System (`₹1,50,000` not `$150,000`). Utilizes `Intl.NumberFormat('en-IN')`.

## 4. Animation
- **Framer Motion:** Used strictly for subtle transitions (e.g., modal fade-ins, page transitions). No excessive bouncing or spinning.
