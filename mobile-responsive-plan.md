# Mobile Responsive Implementation Plan

## Overview

Make the Sprite Smithy app usable on mobile/tablet devices while keeping the desktop experience (lg breakpoint, ≥1024px) unchanged.

**Strategy**:
- **Bottom tab bar** for step navigation (replacing LeftPanel on mobile)
- **Floating button + slide-up drawer** for frames/RightPanel access
- **Full-width CenterPanel** with simplified mobile header

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/ui/Sheet.tsx` | Slide-up drawer component for mobile frames |
| `src/components/layout/MobileNav.tsx` | Bottom tab bar with 7 step icons |
| `src/components/layout/MobileHeader.tsx` | Simplified top bar for mobile |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/layout/AppShell.tsx` | Add responsive layout: hide side panels on mobile, add mobile components |
| `src/components/layout/CenterPanel.tsx` | Adjust padding: `p-4 lg:p-8` |

## Implementation Details

### 1. Sheet Component (slide-up drawer)

Create a portal-based drawer following the existing Modal.tsx pattern:
- Slides up from bottom
- Backdrop click to close
- Height options: auto, half, full
- Props: `isOpen`, `onClose`, `children`, `title?`

### 2. MobileNav Component (bottom tab bar)

7 step icons using lucide-react:
1. Upload Video: `Upload`
2. Loop Selection: `RefreshCcw`
3. Frame Extraction: `LayoutGrid`
4. Background Removal: `Eraser`
5. Auto-Crop: `Crop`
6. Halo Remover: `Circle`
7. Export: `Download`

Reuse accessibility logic from LeftPanel (`isStepAccessible`, `isStepComplete`).

### 3. MobileHeader Component

Shows:
- App logo (small) + current step name
- TierBadge + UserMenu (compact)

### 4. AppShell Changes

```tsx
// Responsive structure
<div className="flex h-screen overflow-hidden bg-background">
  {/* LeftPanel - desktop only */}
  <div className="hidden lg:block w-80 border-r border-border overflow-y-auto">
    <LeftPanel />
  </div>

  {/* CenterPanel - full width on mobile */}
  <div className="flex-1 flex flex-col overflow-hidden bg-muted/20 relative">
    {/* MobileHeader - mobile only */}
    <div className="lg:hidden">
      <MobileHeader />
    </div>

    {/* Existing desktop TopBar - desktop only */}
    <div className="hidden lg:flex ...">
      {/* existing code */}
    </div>

    {/* Content with bottom padding for mobile nav */}
    <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
      <CenterPanel />
    </div>

    {/* MobileNav - mobile only */}
    <MobileNav className="lg:hidden" />

    {/* Mobile Frames FAB - mobile only */}
    <button className="lg:hidden fixed bottom-24 right-4 ...">
      Frames ({frames.raw.length})
    </button>
  </div>

  {/* RightPanel - desktop only */}
  <div className="hidden lg:block w-96 border-l border-border overflow-y-auto">
    <RightPanel />
  </div>
</div>

{/* Mobile Frames Sheet */}
<Sheet isOpen={isMobileFramesOpen} onClose={...} className="lg:hidden">
  <RightPanel />
</Sheet>
```

### 5. CenterPanel Padding Adjustment

```tsx
// Before
<div className="flex-1 flex flex-col overflow-y-auto p-8 bg-muted/20">

// After
<div className="flex-1 flex flex-col overflow-y-auto p-4 lg:p-8 bg-muted/20">
```

## Mobile UX Flow

1. **Step Navigation**: Tap step icon in bottom bar to navigate
2. **Frames Access**: Tap floating "Frames" button to see frame grid in slide-up sheet
3. **Header**: Shows current step name for context

## Verification

1. Test at 375px width (iPhone SE) - bottom nav visible, side panels hidden
2. Test at 768px width (iPad) - same mobile layout
3. Test at 1024px+ width (desktop) - original 3-panel layout unchanged
4. Verify step navigation works via bottom bar
5. Verify frames sheet opens/closes correctly
6. Verify all 7 steps render properly on mobile
