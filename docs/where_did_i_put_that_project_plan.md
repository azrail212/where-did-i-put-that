# Where Did I Put That?

A simple Android app to quickly save where you put things at home and find them later.

---

## 1. Project Vision

**Problem**  
Busy people (especially parents) often forget where they stored items (e.g. Christmas decorations, documents, cables, toys).

**Solution**  
A calm, fast, offline-first mobile app that answers one question:
> "Where did I put this?"

**Core principle**  
Reduce mental load. No setup, no hierarchy, no thinking.

---

## 2. MVP Definition (Smallest Possible Version)

### Goal
Save an item + its location in under 15 seconds and find it later instantly.

### Screens (MVP)
1. **Home / Search**
   - Search bar
   - List of items (newest first)
   - Tap item to see location

2. **Add Item**
   - Item name (required)
   - Location / where it is (required)
   - Save button

### Out of scope (v1)
- Rooms / boxes
- Photos
- Accounts / login
- Cloud sync
- Settings
- Dark mode

---

## 3. User Stories

- As a user, I want to add an item with its location so I can find it later.
- As a user, I want to search items by name so I can quickly locate them.
- As a user, I want to see the newest items first.
- As a user, I want to edit an item if I made a mistake.
- As a user, I want to delete an item I no longer need.

---

## 4. Data Model (Local First)

### Item
- `id`: string
- `name`: string
- `location`: string
- `createdAt`: ISO string

### Storage
- Local first (offline)
- **SQLite** via `expo-sqlite`
- Table: `items`

Proposed schema:
- `id` TEXT PRIMARY KEY
- `name` TEXT NOT NULL
- `location` TEXT NOT NULL
- `createdAt` TEXT NOT NULL

---

## 5. Tech Stack

- **Platform:** Android
- **Framework:** React Native (Expo)
- **Routing/Navigation:** Expo Router
- **Styling:** NativeWind (Tailwind-style classes)
- **Storage:** SQLite (expo-sqlite)
- **Language:** TypeScript
- **Version control:** Git + GitHub

---

## 6. Design System (v1)

### Design goals
- Calm
- Friendly
- Non-technical
- "Sticky note" feeling

### Color palette
- Background: `#F7F7F5`
- Card: `#FFFFFF`
- Primary text: `#1F2933`
- Secondary text: `#6B7280`
- Border: `#E5E7EB`
- Accent: `#4F8A8B`

### UI rules
- Rounded corners: 12–16px
- No heavy shadows
- Accent color only for actions (Add / Save)
- Light mode only (v1)

---

## 7. UI Wireframes (v1)

Lightweight wireframes were created in Figma to validate layout and UX simplicity before coding.

### Screens
1. **Home / Search**
   - Search bar
   - List of saved items (newest first)
   - Floating "Add item" button

2. **Add Item**
   - Item name input
   - Location input
   - Save button

Wireframe images are exported to `/docs/assets` for reference.

---

## 8. App Naming

**Display name:** Where Did I Put That?

**Internal/project name:** where-did-i-put-that

---

## 8. Repo Structure

```
where-did-i-put-that/
├── app/
│   ├── index.tsx        # Home / search screen
│   └── add.tsx          # Add item screen
├── components/
├── docs/
│   └── project-plan.md
├── App.tsx
├── tailwind.config.js
├── babel.config.js
└── README.md
```

---

## 9. Development Roadmap

### v0.1 – Foundation
- Initialize Expo app
- Set up NativeWind
- Basic Home screen

### v0.2 – Core functionality
- Add Item screen
- Save items to SQLite
- List items from database

### v0.3 – Usability
- Search items (SQLite query)
- Edit / delete items
- Basic empty states

### v1.0 – MVP release
- UI polish
- App icon
- Android build

---

## 10. Daily Git Workflow

1. `git pull`
2. Work on one small task
3. `git status`
4. `git add <files>`
5. `git commit -m "Add item save logic"`
6. `git push`

Commit often. Small, clear commits.

---

## 11. Future Ideas (Optional)

- Photos for items
- Voice input
- Reminders ("check in December")
- Backup/export
- Family sharing
- Cloud sync (Appwrite)

---

## 12. Success Criteria

The app is successful if:
- Adding an item takes < 15 seconds
- Searching feels instant
- App feels calm, not busy
- User opens it without hesitation

---

This document is the single source of truth for the project.
Update it only when scope or direction changes.

