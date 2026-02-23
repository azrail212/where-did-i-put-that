# Where Did I Put That?

A calm, offline-first Android app for quickly saving where you put
things --- and finding them instantly later.

---

## 1. Project Vision

### Problem

People forget where they stored things (documents, decorations, cables,
tools, toys).

### Solution

A fast, zero-friction mobile app that answers:

> "Where did I put this?"

### Core Principle

Reduce mental load.\
No setup. No folders. No hierarchy. Just save and find.

---

## 2. Current MVP Scope (Implemented)

### Goal

Save an item + location in under 15 seconds and retrieve it instantly.

---

### Screens (Current Version)

1.  **Home (Items List)**
    - Displays items (newest first)
    - Search filtering
    - Tap to edit
    - Delete support
    - Clean card layout
2.  **Add Item**
    - Item name (required)
    - Location (required)
    - Save button
3.  **Edit Item**
    - Pre-filled item
    - Update values
    - Delete option

---

### What Exists

The app includes:

- Edit functionality
- Delete functionality
- Repository abstraction layer (`itemsRepo`)
- SQLite persistence
- Bottom Tabs navigation (Expo Router)
- Reusable UI components
- Structured folder architecture
- Documentation folder

---

### Out of Scope (v1)

- Photos
- Categories / rooms
- Cloud sync
- Accounts / login
- Dark mode toggle
- Settings screen

---

## 3. User Stories

- As a user, I can add an item with its location.
- As a user, I can search items by name.
- As a user, I see newest items first.
- As a user, I can edit an item.
- As a user, I can delete an item.
- As a user, I can use the app offline.

---

## 4. Architecture

### Pattern Used

UI → Repository Layer → SQLite

You separated: - Screens (UI logic) - Data layer (`itemsRepo.ts`) -
Database connection (`db.ts`)

This makes the project scalable and production-ready in structure.

---

## 5. Data Model

### Item

```ts
{
  id: string;
  name: string;
  location: string;
  createdAt: string;
}
```

### SQLite Schema

Table: `items`

- `id` TEXT PRIMARY KEY
- `name` TEXT NOT NULL
- `location` TEXT NOT NULL
- `createdAt` TEXT NOT NULL

---

## 6. Tech Stack

- **Platform:** Android
- **Framework:** React Native (Expo)
- **Routing:** Expo Router (file-based routing)
- **Navigation:** Tabs Layout
- **Styling:** NativeWind (Tailwind for React Native)
- **Storage:** SQLite (`expo-sqlite`)
- **Language:** TypeScript
- **Architecture style:** Repository Pattern
- **Version Control:** Git + GitHub
- **Build System:** EAS

---

## 7. Repo Structure

    where-did-i-put-that/
    ├── app/
    │   ├── _layout.tsx
    │   ├── (tabs)/
    │   │   ├── _layout.tsx
    │   │   ├── index.tsx
    │   │   └── add-item.tsx
    │   └── edit-item/
    │       └── [id].tsx
    │
    ├── components/
    │   ├── CustomButton.tsx
    │   ├── ItemCard.tsx
    │   └── ScreenHeader.tsx
    │
    ├── lib/
    │   ├── db.ts
    │   └── itemsRepo.ts
    │
    ├── docs/
    │   └── project-plan.md
    │
    ├── tailwind.config.js
    ├── babel.config.js
    └── package.json

---

## 8. Design System

### Design Goals

- Calm
- Minimal
- Soft
- Friendly
- No heavy UI noise

### Core Colors

- Background: `#F7F7F5`
- Card: `#FFFFFF`
- Primary text: `#1F2933`
- Secondary text: `#6B7280`
- Border: `#E5E7EB`
- Accent: `#4F8A8B`

### UI Rules

- Rounded corners (12--16px)
- Minimal shadows
- Accent only for actions
- Light-first design

---

## 9. Development Phases

### v0.1 -- Foundation

- Expo initialization
- NativeWind setup
- Basic screen structure

### v0.2 -- Core Data Layer

- SQLite integration
- Repository abstraction
- CRUD operations

### v0.3 -- UX Improvements

- Search
- Edit
- Delete
- Empty states
- Reusable components

### v1.0 -- MVP Release

- UI polish
- Android production build
- GitHub documentation cleanup

---

## 10. Daily Git Workflow

1.  `git pull`
2.  Work on one small task
3.  `git status`
4.  `git add <files>`
5.  `git commit -m "Add item save logic"`
6.  `git push`

Commit often. Small, clear commits.

---

## 11. Future Roadmap

- Photos per item
- Tagging / rooms
- Backup export (JSON)
- Cloud sync (Appwrite)
- Cross-platform (iOS)
- Web version
- Voice input
- AI-powered search (semantic match)
- Multi-user / family mode

---

## 12. Success Criteria

The app is successful if:

- Add flow takes \< 15 seconds
- Search feels instant
- Zero onboarding required
- Works fully offline
- Feels calmer than a Notes app
- Codebase is scalable and readable

---

This document is the single source of truth for the project.\
Update it only when scope or direction changes.
