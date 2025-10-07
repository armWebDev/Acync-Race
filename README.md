# 🏁 Async Race

## 🚀 Deployment & Score

**Live Demo:** [🔗 Add your deployed UI link here (GitHub Pages / Netlify / Vercel / etc.)]  
**Total Score:** `XXX / 400`

---

## ✅ Self-Check Checklist

### 🚀 UI Deployment

- [ ] **Deployment Platform:** Successfully deploy the UI on one of the following platforms: GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.  
  _→ 10 pts_

---

### ✅ Requirements to Commits and Repository

- [ ] **Commit guidelines compliance:** All commits follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/).  
  _→ 10 pts_
- [ ] **Checklist included in README.md**  
  _→ 5 pts_
- [ ] **Score calculation added to README.md**  
  _→ 5 pts_
- [ ] **UI Deployment link in README.md**  
  _→ 5 pts_

_Total: 25 pts_

---

### 🏗️ Basic Structure (80 pts)

- [ ] **Two Views (10 pts):** Implement “Garage” and “Winners”.
- [ ] **Garage View Content (30 pts):**  
  - [ ] Name of view  
  - [ ] Car creation and editing panel  
  - [ ] Race control panel  
  - [ ] Garage section
- [ ] **Winners View Content (10 pts):**  
  - [ ] Name of view  
  - [ ] Winners table  
  - [ ] Pagination
- [ ] **Persistent State (30 pts):** Maintain view state when navigating between views (pagination, inputs, etc.)

_Total: 80 pts_

---

### 🚗 Garage View (90 pts)

- [ ] **CRUD Operations (20 pts):** Create, update, delete cars.  
- [ ] **Color Selection (10 pts):** Car color picker and display.  
- [ ] **Random Car Creation (20 pts):** Generate 100 random cars.  
- [ ] **Car Management Buttons (10 pts):** Update/delete per car.  
- [ ] **Pagination (10 pts):** 7 cars per page.  
- [ ] **EXTRA POINTS (20 pts):**
  - [ ] Empty garage message.  
  - [ ] Auto-switch to previous page when last car removed.

_Total: 90 pts_

---

### 🏆 Winners View (50 pts)

- [ ] **Display Winners (15 pts):** Show winners with stats.  
- [ ] **Pagination (10 pts):** 10 winners per page.  
- [ ] **Winners Table (15 pts):** Show №, car, name, wins, best time.  
- [ ] **Sorting (10 pts):** Sort by wins and best time (asc/desc).

_Total: 50 pts_

---

### 🏎️ Race (170 pts)

- [ ] **Start Engine Animation (20 pts):** Start -> drive -> stop on 500 error.  
- [ ] **Stop Engine Animation (20 pts):** Return to start position.  
- [ ] **Responsive Animation (30 pts):** Works well at 500px width.  
- [ ] **Start Race Button (10 pts):** Start race for all cars on page.  
- [ ] **Reset Race Button (15 pts):** Reset all cars to start.  
- [ ] **Winner Announcement (5 pts):** Show winner name banner.  
- [ ] **Button States (20 pts):** Disable inappropriate buttons.  
- [ ] **Actions During Race (50 pts):** Handle adding/removing/editing cars and navigation during race gracefully.

_Total: 170 pts_

---

### 🎨 Prettier & ESLint (10 pts)

- [ ] **Prettier Setup (5 pts):** `format` and `ci:format` scripts.  
- [ ] **ESLint (5 pts):** Airbnb style + `lint` script in package.json.

_Total: 10 pts_

---

### 🌟 Overall Code Quality (100 pts) *(evaluated by reviewer)*

- [ ] Modular architecture (API, UI, state separated)  
- [ ] Small functions (< 40 lines), no magic numbers  
- [ ] Clear, readable naming conventions  
- [ ] Minimal duplication  
- [ ] Extra features (e.g., custom hooks, React Router, portals)

_Total: up to 100 pts (by reviewer)_

---

## 🧩 Technologies Used

- **Framework:** React 18 + TypeScript  
- **State Manager:** Redux Toolkit / Zustand / Context API *(choose one)*  
- **Router:** React Router v6  
- **Styling:** CSS Modules / Tailwind / Styled Components  
- **Build Tool:** Vite or CRA  
- **API:** [Async Race API](https://github.com/mikhama/async-race-api)

---

## ⚙️ Scripts

| Command | Description |
|----------|--------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview built app |
| `npm run lint` | Run ESLint checks |
| `npm run format` | Auto-format with Prettier |
| `npm run ci:format` | Check formatting issues |

---

## 📁 Project Structure Example

