# 🚗 Async Race App

### ✅ Score: 400 / 400 pts  
### 🌐 Deployed App: [https://jazzy-mandazi-4e0c42.netlify.app/](https://jazzy-mandazi-4e0c42.netlify.app/)

---

### 🚀 UI Deployment (25 pts)

- [x] **Deployment Platform (10 pts)** — Successfully deployed on Netlify
- [x] **Commit Guidelines Compliance (10 pts)** — All commits follow Conventional Commits format
- [x] **Checklist Included in README.md (5 pts)** — This checklist is added and updated
- [x] **Score Calculation Added (5 pts)** — Final self-assessed score shown at top
- [x] **UI Deployment Link Added (5 pts)** — Live link included at top

---

### 🧩 Basic Structure (80 pts)

- [x] **Two Views (10 pts)** — Implement "Garage" and "Winners"
- [x] **Garage View Content (30 pts)**  
  - [x] Name of view  
  - [x] Car creation and editing panel  
  - [x] Race control panel  
  - [x] Garage section
- [x] **Winners View Content (10 pts)**  
  - [x] Name of view ("Winners")  
  - [x] Winners table  
  - [x] Pagination
- [x] **Persistent State (30 pts)** — Preserve page numbers and input values when navigating between views

---

### 🚘 Garage View (90 pts)

- [x] **Car Creation and Editing (20 pts)** — CRUD operations for cars with name and color  
- [x] **Color Selection (10 pts)** — Select car color from RGB palette and display  
- [x] **Random Car Creation (20 pts)** — Generate 100 random cars per click with random names/colors  
- [x] **Car Management Buttons (10 pts)** — Update or delete buttons per car  
- [x] **Pagination (10 pts)** — 7 cars per page  
- [x] **Extra Points (20 pts)**  
  - [x] Empty garage message  
  - [x] Auto-switch to previous page when last car on page is deleted

---

### 🏆 Winners View (50 pts)

- [x] **Display Winners (15 pts)** — Show winners after each race  
- [x] **Pagination (10 pts)** — 10 winners per page  
- [x] **Winners Table (15 pts)** — Columns: №, car image, name, wins, best time  
- [x] **Sorting Functionality (10 pts)** — Sort by wins and best time (asc/desc)

---

### 🏎️ Race Functionality (170 pts)

- [x] **Start Engine Animation (20 pts)** — Animate car start, handle 500 errors properly  
- [x] **Stop Engine Animation (20 pts)** — Stop car and return to start position  
- [x] **Responsive Animation (30 pts)** — Works smoothly on screens ≥500px  
- [x] **Start Race Button (10 pts)** — Starts all cars on current page  
- [x] **Reset Race Button (15 pts)** — Resets all cars to starting positions  
- [x] **Winner Announcement (5 pts)** — Show banner with winning car’s name  
- [x] **Button States (20 pts)** — Disable Start/Stop buttons when inappropriate  
- [x] **Actions During Race (50 pts)** — Prevent edits/deletes/page changes during race or handle them gracefully

---

### 🎨 Code Style and Linting (10 pts)

- [x] **Prettier Setup (5 pts)** — `format` and `ci:format` scripts in `package.json`  
- [x] **ESLint Config (5 pts)** — Airbnb rules + TypeScript strict settings

---

### 🌟 Overall Code Quality (100 pts) *(reviewer evaluates)*

- [x] Modular architecture: API, UI, and state separated  
- [x] Functions ≤ 40 lines, no magic numbers  
- [x] Clear and readable naming conventions  
- [x] Minimal duplication  
- [x] Extra features: custom hooks, React Router, portals, etc.

---

### 🧩 Technologies Used

- **Framework:** React 18 + TypeScript  
- **State Manager:** Redux Toolkit  
- **Router:** React Router v6  
- **Styling:** Tailwind CSS  
- **Build Tool:** Vite  
- **API:** [Async Race API](https://github.com/mikhama/async-race-api)

---

### ⚙️ Scripts

| Command | Description |
|----------|--------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview built app |
| `npm run lint` | Run ESLint checks |
| `npm run format` | Auto-format with Prettier |
| `npm run ci:format` | Check formatting issues |
