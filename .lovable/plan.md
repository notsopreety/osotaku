
# Episode Section Enhancement Plan

## Overview
This plan restructures the episode section to be integrated into the tabs system, adds proper contributor attribution with profile links, and implements smart button logic based on episode data completeness.

---

## 1. Move Episodes to TabsList as First Tab

### Current Structure
- Episodes are displayed in a separate `<EpisodeSection>` component outside the tabs
- Tabs contain: Characters, Staff, Relations, Recommendations

### New Structure
- Episodes become the **first tab** in the TabsList with `defaultValue="episodes"`
- Tab order: **Episodes** → Characters → Staff → Relations → Recommendations
- Movies show "Movie" instead of "Episodes" in the tab label

### Implementation
Modify `src/pages/AnimeDetails.tsx`:
- Remove the standalone `<EpisodeSection>` component (lines 628-634)
- Add new "Episodes" or "Movie" tab as the first TabsTrigger
- Move episode content into a new `<TabsContent value="episodes">`

---

## 2. Episode List View Inside Tab

### Design
Create a proper **list view** UI (not just cards) with:
- Episode number, thumbnail, title, description, duration
- Audio availability badges (SUB/DUB/HLS)
- Contributor info with clickable profile link
- Proper spacing and hover states

### List Item Structure
```
┌─────────────────────────────────────────────────────────────┐
│ ┌──────────┐  E1 • I Tried Confessing              24m     │
│ │Thumbnail │  Description text goes here...               │
│ │  (16:9)  │  ┌───┐ ┌───┐ ┌───┐  Added by: @sawmer        │
│ └──────────┘  │SUB│ │DUB│ │HLS│                           │
│               └───┘ └───┘ └───┘                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Add Episode/Edit Episode Button Logic

### Smart Button States

| Condition | Button Text | Link |
|-----------|-------------|------|
| No data file exists | "Add Episode" (or "Add Movie") | GitHub `/data` directory |
| Data exists but incomplete | "Add More" | GitHub `/data/{anilistId}.json` |
| Episodes count = AniList total | "Edit Episode" | GitHub `/data/{anilistId}.json` |

### Comparison Logic
```typescript
const anilistTotalEpisodes = anime?.episodes || 0;
const localEpisodesCount = episodes.length;
const isComplete = localEpisodesCount > 0 && localEpisodesCount >= anilistTotalEpisodes;
```

### Button Placement
1. **In Tab Header**: "Add More" or "Edit Episode" button aligned right
2. **In Action Buttons Area** (alongside Watch Now, Add to List): Always show "Add Episode/Edit Episode" button
3. **Empty State**: Centered "Add Episode" with description when no episodes exist

---

## 4. AddedBy Profile Links

### Current State
`ServerSelector.tsx` shows "Added by: sawmer" as plain text

### Enhancement
- Make `addedBy` a clickable link to `/user/{addedBy}`
- Add user icon for visual clarity
- Style as inline link with hover state

### Implementation
Modify `src/components/player/ServerSelector.tsx`:
```tsx
<Link to={`/user/${selectedSource.addedBy}`} className="text-primary hover:underline">
  {selectedSource.addedBy}
</Link>
```

Also add to the episode list in the tab to show contributors.

---

## 5. Movie-Specific Terminology

### Replacements Throughout
| If Movie | Show |
|----------|------|
| "Episodes" | "Movie" |
| "Episode 1" | "Source" |
| "Add Episodes" | "Add Source" |
| "Add More Episodes" | "Edit Source" |
| "E1" | "Source" |

### Files to Update
- `src/pages/AnimeDetails.tsx` - Tab label & button text
- `src/components/anime/EpisodeSection.tsx` - Will be refactored into tab content
- `src/pages/Watch.tsx` - Already handles movie case

---

## 6. Detailed File Changes

### `src/pages/AnimeDetails.tsx`
1. **Add "Add Episode" button to action buttons area** (lines 277-322)
   - Place between "Add to List" and "Favorite" buttons
   - Dynamic text: "Add Episode" / "Edit Episode" based on completeness
   - Smaller icon button for tight spacing

2. **Restructure Tabs section** (lines 636-774)
   - Change `defaultValue` from "characters" to "episodes"
   - Add new TabsTrigger for Episodes/Movie as first tab
   - Create TabsContent with enhanced list view

3. **Remove standalone EpisodeSection** (lines 628-634)
   - Content moves into the tab

### `src/components/anime/EpisodeSection.tsx`
- **Refactor to `EpisodeTabContent`** component
- New layout optimized for tab content:
  - List view with better spacing
  - AddedBy links for each source
  - Empty state with centered "Add Episode" button
  - Header with episode count and "Add More" / "Edit Episode" button

### `src/components/player/ServerSelector.tsx`
- Make "Added by" a clickable link to `/user/{addedBy}`
- Add User icon from lucide-react

---

## 7. GitHub URL Logic

### URL Patterns
```typescript
const GITHUB_REPO_DATA = 'https://github.com/notsopreety/osotaku/tree/main/public/data';

// When no data exists - link to directory for creating new file
const addNewUrl = GITHUB_REPO_DATA;

// When data exists - link directly to the file
const editFileUrl = `${GITHUB_REPO_DATA}/${anilistId}.json`;
```

---

## 8. Implementation Order

1. **Update AnimeDetails.tsx**
   - Add "Add Episode" button to action buttons section
   - Move tabs to include Episodes as first tab
   - Remove standalone EpisodeSection

2. **Refactor EpisodeSection.tsx → EpisodeTabContent.tsx**
   - Create list view layout
   - Add contributor profile links
   - Implement smart button logic

3. **Update ServerSelector.tsx**
   - Add profile link for addedBy

4. **Update Watch.tsx**
   - Ensure movie terminology consistency

---

## 9. UI/UX Details

### Episode List View Design
- **Responsive**: Stack vertically on mobile, horizontal layout on desktop
- **Thumbnails**: 16:9 aspect ratio, 120px width on mobile, 160px on desktop
- **Hover State**: Subtle background highlight, thumbnail scale
- **Active State**: Primary color border for currently playing episode

### Button Hierarchy
```
Primary:     [Watch Now] - Full width, prominent
Secondary:   [Add to List] [Add Episode] [❤️]
             └─ Row of smaller buttons
```

### Empty State Design
```
     ┌─────────────────────────────────┐
     │         (Film icon)             │
     │                                 │
     │  No Episodes Available          │
     │                                 │
     │  Be the first to add episodes   │
     │  for this anime!                │
     │                                 │
     │     [ + Add Episode ]           │
     └─────────────────────────────────┘
```

---

## Technical Summary

### Files to Create/Modify
- **Modify**: `src/pages/AnimeDetails.tsx` (add button, restructure tabs)
- **Refactor**: `src/components/anime/EpisodeSection.tsx` (list view, smart buttons, contributor links)
- **Modify**: `src/components/player/ServerSelector.tsx` (addedBy profile link)
- **Modify**: `src/pages/Watch.tsx` (terminology consistency)

### Key Logic
```typescript
// Smart button determination
const isMovie = anime?.format === 'MOVIE';
const totalAnilistEpisodes = anime?.episodes || 0;
const localEpisodesCount = episodes.length;
const hasData = localEpisodesCount > 0;
const isComplete = hasData && localEpisodesCount >= totalAnilistEpisodes;

// Button text
const buttonText = isMovie 
  ? (hasData ? 'Edit Source' : 'Add Source')
  : (isComplete ? 'Edit Episodes' : hasData ? 'Add More' : 'Add Episodes');

// URL
const buttonUrl = hasData 
  ? `${GITHUB_REPO_DATA}/${anilistId}.json`
  : GITHUB_REPO_DATA;
```
