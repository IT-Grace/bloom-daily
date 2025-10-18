# Design Guidelines: Feminine Habit Tracker App

## Design Approach

**Hybrid Approach**: Drawing inspiration from Notion's clean information architecture and Todoist's task management patterns, customized with a warm, feminine aesthetic using the specified yellow and grey palette.

**Key Design Principles**:
- Soft, approachable interface with rounded elements
- Clean information hierarchy for quick task scanning
- Warm, encouraging visual feedback for completed habits
- Gentle transitions and minimal motion to reduce cognitive load

---

## Core Design Elements

### A. Color Palette

**Light Mode (Primary)**:
- Background Base: `0 0% 100%` (pure white)
- Background Secondary: `45 100% 97%` (soft cream)
- Primary Yellow: `45 95% 65%` (warm yellow - for accents, CTAs, completed tasks)
- Secondary Yellow: `45 100% 90%` (pale yellow - for hover states, highlights)
- Grey Dark: `0 0% 35%` (for primary text)
- Grey Medium: `0 0% 60%` (for secondary text, icons)
- Grey Light: `0 0% 90%` (for borders, dividers)
- Success Green: `140 60% 70%` (for streaks, achievements)
- Alert Coral: `15 85% 75%` (soft coral for overdue tasks)

**Dark Mode**:
- Background Base: `240 8% 12%` (deep charcoal)
- Background Secondary: `240 6% 16%` (elevated surfaces)
- Primary Yellow: `45 85% 60%` (slightly muted for dark mode)
- Grey variations adjusted for contrast

### B. Typography

**Font Families**:
- Primary: 'Inter' or 'DM Sans' via Google Fonts (clean, friendly sans-serif)
- Accent: 'Playfair Display' or 'Crimson Pro' for headers (adds feminine elegance)

**Hierarchy**:
- Page Headers: 32px, accent font, semi-bold
- Section Headers: 24px, primary font, medium
- Card Titles: 18px, primary font, medium
- Body Text: 16px, primary font, regular
- Small Labels: 14px, primary font, regular
- Timestamps: 12px, primary font, medium, grey

### C. Layout System

**Spacing Scale**: Use Tailwind units of `2, 3, 4, 6, 8, 12, 16` for consistent rhythm
- Component padding: `p-4` to `p-6`
- Section spacing: `gap-6` to `gap-8`
- Page margins: `p-8` to `p-12`
- Card spacing: `space-y-3` to `space-y-4`

**Container Widths**:
- Dashboard max-width: `max-w-6xl`
- Task lists: `max-w-3xl`
- Centered content: `max-w-2xl`

### D. Component Library

**Navigation**:
- Side navigation with rounded icons
- Active states with yellow background `bg-yellow-100`
- Soft hover states with `hover:bg-grey-50`
- Include: Dashboard, Tasks, Calendar, Reports, Settings

**Task Cards**:
- White background with subtle shadow: `shadow-sm`
- Rounded corners: `rounded-xl` (16px)
- Checkbox: Large circular checkbox (24px) with yellow fill when checked
- Time badge: Grey pill with rounded edges displaying task time
- Priority indicator: Subtle left border in yellow/coral
- Completion animation: Gentle fade with checkmark reveal

**Dashboard Widgets**:
- Today's Overview Card: Grid showing total tasks, completed, pending
- Streak Counter: Large circular progress ring in yellow
- Quick Stats: 3-column grid with icon, number, label format
- Upcoming Tasks: Scrollable list with time indicators
- All cards with `rounded-2xl` and `p-6` padding

**Progress Visualizations**:
- Calendar Heatmap: Grid of rounded squares with yellow intensity based on completion
- Progress Bars: Rounded, yellow fill with percentage label
- Monthly Chart: Simple bar chart with yellow bars on light grey background
- Statistics Cards: Soft grey background with yellow accent numbers

**Forms & Inputs**:
- Text inputs: White background, grey border, `rounded-lg`, focus state with yellow ring
- Time pickers: Custom dropdown with yellow selected state
- Frequency selectors: Pill-style buttons with yellow active state
- Submit buttons: Yellow background, white text, `rounded-full`

**Notifications**:
- Toast notifications: Top-right corner, white card with yellow left border
- Browser notifications: Standard format with yellow icon

**Modals & Overlays**:
- Task creation modal: Centered, white background, rounded corners
- End-of-day summary: Full overlay with gradient background (white to pale yellow)
- Monthly report: Full-page view with sticky header

**Empty States**:
- Friendly illustrations or icons in yellow
- Encouraging copy with "Get started" CTA
- Soft grey background for empty sections

### E. Animations

**Use Sparingly**:
- Task completion: Gentle scale + fade (200ms)
- Page transitions: Subtle slide-in for new views (150ms)
- Hover states: Smooth color transitions (100ms)
- Loading states: Soft pulse animation in yellow
- NO complex scroll animations or parallax effects

---

## Images

**Dashboard Hero/Header**:
- No large hero image needed
- Optional: Small decorative illustration in header (abstract florals or geometric patterns in yellow/grey)
- Focus on functional dashboard layout over imagery

**Empty States**:
- Simple line illustrations of planners, checkmarks, or calendars
- Warm yellow and grey color scheme
- Placed centrally in empty task lists or blank reports

**Monthly Reports**:
- Achievement badges/icons (custom designed or from icon library)
- Visual progress indicators rather than photographic images

---

## Feminine Design Elements

- **Rounded Corners**: Generous use of `rounded-lg`, `rounded-xl`, `rounded-2xl`
- **Soft Shadows**: Subtle elevation with `shadow-sm` and `shadow-md`
- **Warm Color Temperature**: Yellow as primary accent creates warmth
- **Gentle Typography**: Combination of clean sans-serif with elegant serif accents
- **Encouraging Language**: Use positive, supportive microcopy throughout
- **Subtle Patterns**: Optional light floral or dot patterns in backgrounds (very subtle, 2-3% opacity)
- **Generous Whitespace**: Don't overcrowd - let elements breathe
- **Smooth Interactions**: All state changes feel gentle and responsive