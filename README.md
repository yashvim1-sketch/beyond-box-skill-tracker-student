# Beyond Box Skill Tracker

> **NOTE:** This app uses localStorage to save data in the browser. Data is saved per device and is not shared between devices or browsers.

A premium, emotionally warm, parent-friendly **Skill Tracker** web app for the [Beyond Box](https://beyondbox.in) educational platform — *Humans of Science STEM Series*.

Track your child's learning journey across 11 STEM books by rating 6 key skills per book. View radar charts, personalized insights, milestone badges, and an overall growth summary.

---

## 🚀 Getting Started

### Install dependencies
```bash
npm install
```

### Run locally (development)
```bash
npm start
```
Opens at [http://localhost:3000](http://localhost:3000).

### Build for production
```bash
npm run build
```
Output goes to the `build/` folder.

### How to deploy to GitHub Pages
Make sure `package.json` contains:
```json
"homepage": "https://YOUR-GITHUB-USERNAME.github.io/beyond-box-skill-tracker"
```
*(Replace YOUR-GITHUB-USERNAME with your actual username)*

Then run:
```bash
npm run deploy
```
This will automatically build and push to the `gh-pages` branch.

---

## 📁 Folder Structure

```
beyond-box-skill-tracker/
├── public/
│   └── index.html              ← HTML shell with SEO meta tags + Google Fonts
├── src/
│   ├── components/
│   │   ├── BookCard.jsx          ← Individual book button on home page
│   │   ├── SkillRatingModal.jsx  ← Slide-up modal for rating 6 skills per book
│   │   ├── BookAnalysis.jsx      ← Radar chart + insights for one book
│   │   ├── OverallDashboard.jsx  ← Full overall analysis page component
│   │   ├── ProgressBar.jsx       ← CSS-only animated circular progress ring
│   │   ├── MilestoneBadge.jsx    ← 🌱⭐🏆 badge component based on avg score
│   │   └── SkillLegend.jsx       ← Always-visible color legend (red/orange/yellow/green)
│   ├── data/
│   │   ├── books.js              ← Book metadata + SKILLS + rating color constants
│   │   └── storage.js            ← All localStorage read/write logic
│   ├── utils/
│   │   ├── scoreUtils.js         ← Average calculations, skill comparisons, badge logic
│   │   └── insightGenerator.js   ← Auto-generates warm insight sentences + recommendations
│   ├── pages/
│   │   ├── HomePage.jsx          ← Landing page with all book cards + progress ring
│   │   ├── BookAnalysisPage.jsx  ← Analysis page after rating a book
│   │   └── OverallPage.jsx       ← Overall dashboard page
│   ├── App.jsx                   ← React Router setup (3 routes)
│   ├── App.css                   ← Full design system — no Tailwind, vanilla CSS
│   └── index.js                  ← React root entry point
├── package.json
└── README.md
```

---

## 📚 The Books

11 books from the **Humans of Science STEM Series** are included:

| # | Book | Scientist |
|---|------|-----------|
| 1 | Marie's Mysterious Rock 🪨 | Marie Curie |
| 2 | Einstein's Wonders ⚡ | Albert Einstein |
| 3 | Archimedes' Explorations 🌊 | Archimedes |
| 4 | Tesla's Dream 🔬 | Nikola Tesla |
| 5 | 'Eureka!' Says Archimedes 💡 | Archimedes |
| 6 | Katherine's Courage 🚀 | Katherine Johnson |
| 7 | Ada's Algorithm 💻 | Ada Lovelace |
| 8 | Vikram's Victory 🛸 | Vikram Sarabhai |
| 9 | Einstein: The Global Citizen 🌍 | Albert Einstein |
| 10 | Rosalind & the Secret Shot 🧬 | Rosalind Franklin |
| 11 | Marie's Legacy Lives On ⚗️ | Marie Curie |

### ➕ How to Add a New Book

Open `src/data/books.js` and add an entry to the `BOOKS` array:

```js
{
  id: "unique_snake_case_id",
  name: "Book Title",
  subtitle: "Humans of Science STEM Series",
  color: "#HEXCOLOR",
  colorDark: "#DARKERHEX",
  bgGradient: "linear-gradient(135deg, #LIGHTHEX, #MAINHEX)",
  emoji: "📗",
  description: "Short description of the book",
  scientist: "Scientist Name"
}
```

No other file needs to change — the app is fully data-driven.

---

## 🎯 The 6 Skills Rated Per Book

| Skill | Icon | What it measures |
|-------|------|-----------------|
| Cognitive | 🧠 | Solving problems by thinking deeply |
| Creative | 🎨 | Imagining and making something unique |
| Communication | 💬 | Sharing ideas or explaining clearly |
| Social-Emotional | 🤝 | Working together and understanding feelings |
| Physical | 🏃 | Using hands, tools or exploring with senses |
| Practical | 🔧 | Applying learning to real-life situations |

Rating scale: **1 = Not Yet**, **2 = Sometimes**, **3 = Mostly**, **4 = Always**

---

## 💾 Data Storage

All data is saved to **localStorage** — no backend, no account needed.

- Key format: `bb_book_{bookId}`
- Stored fields: `bookId`, `ratings`, `completedAt`, `averageScore`
- Clear all data: use `clearAll()` from `src/data/storage.js`

---

## 🎨 Design System

- **Fonts**: Inter (body) + Poppins (headings) via Google Fonts
- **Background**: `#F8F9FA` (warm light gray)
- **Cards**: White, `border-radius: 16px`, soft shadow
- **Score colors**: Red → Orange → Yellow-Green → Green
- **Styling**: Vanilla CSS (`App.css`) — no Tailwind, no UI library

---

## 🖨️ Print Report

The Overall Analysis page includes a **Print Report** button that triggers `window.print()`. Navigation and book grid are hidden in print mode.

---

## 📄 License

MIT — Free to use, modify, and distribute.
