# UI Upgrade Plan

## Scope
This plan focuses on improving the tracking experience around:

- `components/custom/info/manga-status-dropdown.tsx`
- `providers/TrackingProvider.tsx`
- `providers/ClerkClientProvider.tsx`

The goal is to deliver a cleaner, faster, and more understandable user experience for status changes, rating, and sync state.

## Product Goals

1. **Clarity:** Make status and rating states obvious at a glance.
2. **Feedback:** Surface reliable, non-spammy success/error/loading feedback.
3. **Trust:** Show clear local-vs-database sync state for signed-in users.
4. **Accessibility:** Improve keyboard navigation, labels, focus, and announcements.
5. **Polish:** Tighten spacing, hierarchy, and interaction consistency.

## UX Problems Identified

### 1) Manga status control is functionally strong, but discoverability can improve
- Current dropdown contains both status actions and an untrack action.
- Rating is adjacent but lacks explicit context text.
- Success toasts can stack during quick changes.

### 2) Sync behavior is mostly invisible
- `TrackingProvider` performs auto-sync from Convex, but the UI does not consistently expose sync lifecycle (idle/loading/synced/error).
- Users may not know whether data is local-only or cloud-backed.

### 3) Provider naming causes cognitive friction
- File name `ClerkClientProvider.tsx` exports `ConvexClientProvider`, which can confuse maintainers and future contributors.

## Upgrade Proposal

### Card Design Explorations

To explore different visual directions before implementation, we should prototype three card variants for tracking/list surfaces (e.g., library cards, continue-reading cards, and history rows).

#### Option A — Minimal Data-Dense Card
- **Layout:** Compact vertical stack with thumbnail, title, status chip, chapter progress, and micro rating.
- **Strengths:** Fast scanning for power users; fits more entries above the fold.
- **Trade-offs:** Lower emotional/visual impact; can feel utilitarian.
- **Best for:** Long lists and mobile-heavy usage.

#### Option B — Media-First Editorial Card
- **Layout:** Larger cover image with gradient overlay and key metadata pinned at the bottom.
- **Strengths:** Strong visual identity, better browsing/discovery feel.
- **Trade-offs:** Fewer items visible per viewport; risk of noisy visuals in dense pages.
- **Best for:** Home/landing recommendation modules.

#### Option C — Hybrid Action-Oriented Card (Recommended)
- **Layout:** Medium cover + right-side metadata column, dedicated action rail for status/rating/sync indicators.
- **Strengths:** Balances visual appeal with utility; explicit action affordances reduce interaction friction.
- **Trade-offs:** Slightly more implementation complexity; requires careful responsive behavior.
- **Best for:** Tracking-focused screens where users frequently update progress.

#### Shared Card Requirements Across All Variants
- Must preserve dark-theme readability and contrast.
- Must show status, progress, and sync state without opening details.
- Must support keyboard focus order and touch targets (`>=44px`).
- Must avoid any Convex logic rewrite; visual/interaction layer only.

#### Prototype & Validation Plan
1. Build low-fidelity mockups for A/B/C in Figma (or storybook-like static states).
2. Implement one coded prototype behind a feature flag for each variant.
3. Compare against baseline using:
   - time-to-update-status
   - rating completion rate
   - user preference vote (quick in-app poll)
4. Promote winning variant, then run final accessibility pass.

### Phase 1 — Interaction and Visual Refresh (Low Risk)

#### A. Status control improvements
- Keep existing Select interaction, but add contextual helper text beneath control:
  - "Tracked locally"
  - "Synced to account"
  - "Sync pending"
- Add a dedicated destructive row style for **Untrack** for stronger affordance.
- Add subtle icon transition when status changes.

#### B. Rating UX improvements
- Add explicit label: **"Your rating"**.
- Show selected score numerically (e.g., `7/10`) next to stars.
- Add hover preview text for keyboard/mouse interactions.

#### C. Toast and inline feedback policy
- Keep toasts for important outcomes, but prefer inline state badges for routine updates.
- Debounce repetitive toasts on rapid status changes.

#### D. Card variant implementation spike
- Implement Option C first as the default spike candidate.
- Keep Option A as fallback for dense views or lower-end devices.
- Define class/spacing tokens so card variants can share core primitives.

### Phase 2 — Sync Transparency (Medium Risk)

#### A. Tracking sync state model
Introduce a lightweight client sync state contract:

- `idle`
- `loading`
- `synced`
- `error`

Expose this from `TrackingProvider` with timestamp metadata for last successful sync.

#### B. UI indicators
- Add a tiny sync pill near status/rating area:
  - Gray: local only
  - Blue: syncing
  - Green: synced
  - Red: sync issue
- Add optional tooltip with exact sync meaning.

#### C. Recovery actions
- Reuse `useSyncFromDatabase()` and surface a clear "Restore from cloud" CTA when signed-in and not synced.

### Phase 3 — Accessibility and Consistency Pass (Low/Medium Risk)

- Ensure status, rating, and sync indicators are keyboard reachable.
- Add `aria-live="polite"` region for status/sync confirmations.
- Confirm color contrast for all badges and action rows in dark theme.
- Unify focus ring and motion durations with existing design tokens.

## Technical Implementation Notes

1. **Do not modify Convex business logic**; only improve presentation and state exposition.
2. Keep existing local tracker flows intact; layer UI state rather than rewriting persistence.
3. Maintain strict TypeScript typing for sync-state contracts.
4. Preserve internal import alias patterns (`@/`).

## Delivery Plan

### Sprint 1 (1–2 days)
- Add sync-state exposure in `TrackingProvider`.
- Add helper text + refined untrack row + rating label/value.
- Introduce inline status badge components.
- Produce card prototypes (Options A/B/C) and gather quick internal feedback.

### Sprint 2 (1 day)
- Add tooltip/help copy for sync states.
- Add aria-live and keyboard polish.
- Reduce noisy toasts and validate interaction edge cases.
- Ship one card variant spike behind a feature flag and compare with baseline.

### Sprint 3 (0.5–1 day)
- Provider naming alignment plan:
  - Option A: Rename file to `ConvexClientProvider.tsx`.
  - Option B: Keep filename, export alias with deprecation note.
- Final UI QA sweep on desktop/mobile.
- Select and finalize the winning card design variant.

## Success Metrics

- Reduced duplicate support questions about "did this sync?"
- Fewer repeated toasts per session.
- Faster completion of status+rating updates in usability checks.
- No regressions in tracking CRUD behavior.

## Risks and Mitigations

- **Risk:** Sync state introduces edge-case mismatch with realtime updates.
  - **Mitigation:** Keep sync state presentation-only and derive from existing query lifecycle.
- **Risk:** Added UI density near dropdown.
  - **Mitigation:** Use progressive disclosure (compact default, detail on hover/tooltip).
- **Risk:** Naming changes may break imports.
  - **Mitigation:** Use staged export aliases before hard rename.

## Acceptance Criteria

- Status dropdown presents clear current state and destructive action affordance.
- Rating control includes textual context and value.
- Signed-in users can see whether data is local, syncing, synced, or errored.
- Accessibility checks pass for keyboard navigation and live announcements.
- No functional changes to Convex mutations/queries.
- At least three card design variants are documented and one validated implementation is selected.
