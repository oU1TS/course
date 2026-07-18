# Data Mapping & Loading Reference Guide

This document explains how each section of the **UITS Course Mastery** website loads and renders content from [data.json](data.json), specifically clarifying how the Hero section and main pages are populated.

---

## 🦸 1. The Hero Section (Home View)

### How it Loads
The Hero Section is **not** defined statically in `index.html`. It is generated dynamically by the `Render.home(data)` template compiler inside [app.js](app.js).

- **Motto Text**: Loaded from the top-level `"motto"` key in `data.json`.
- **Render Logic**:
  ```javascript
  // inside app.js -> Render.home(data)
  const motto = data.motto || '';
  // ...
  return `
    <div class="hero-wrapper">
      <h1 class="hero-title">UITS <br><span class="accent-text">Course Mastery</span></h1>
      <p class="hero-motto">${escapeHTML(motto)}</p>
      ...
  `;
  ```
- **Routing & Mount**: When the hash is `#home`, [app.js](app.js) invokes `Render.home(appState)` and injects the resulting HTML string into `<main id="content-app">`.

---

## 🗺️ 2. The Methodology Roadmap (Home View)

### Data Schema
```json
// data.json
"roadmap": [
  {
    "step": 1,
    "subtitle": "Analysis",
    "title": "Question Paper Sifting",
    "summary": "We dissect the past 3 to 5 semesters...",
    "description": "Deep purpose: Question sifting helps identify key recurrences..."
  }
]
```

### Rendering & Modal Flow
1. **Grid Generation**: `Render.home()` loops over the `data.roadmap` array, generating a `.roadmap-block` element for each step and setting a `data-step-index` attribute corresponding to the array index.
2. **Event Binding**: In `app.js`, `setupViewInteractions('home')` binds click and keyboard events to these blocks.
3. **Modal Overlay Display**:
   - Clicking a block triggers `showRoadmapModal(stepIndex)`.
   - The modal controller reads the step object from the cached state (`appState.roadmap[stepIndex]`).
   - It updates the DOM elements (`#modal-tag`, `#modal-title`, `#modal-description`) and applies the `.open` class to the modal overlay container (`#roadmap-modal`) in `index.html`.

---

## 💬 3. Discussions View

### Data Schema
```json
// data.json
"discussions": [
  {
    "semester": "Autumn 2025",
    "course": "Object Oriented Programming (OOP)",
    "instructor": "Jane Doe (Senior)",
    "videoUrl": "https://youtube.com/...",
    "notesUrl": "https://drive.google.com/..."
  }
]
```

### Rendering Flow
- Invoked when the hash is `#discussions` via `Render.discussions(appState)`.
- `Render.discussions()` in `app.js` loops over the `data.discussions` array.
- Compiles card blocks with course title, semester badge, and maps `videoUrl` and `notesUrl` directly to the action button links.

---

## 📂 4. Curated Resources View

### Data Schema
```json
// data.json
"resources": [
  {
    "category": "Programming Languages",
    "description": "Recommended languages for modern software engineering.",
    "items": [
      {
        "title": "Learn JS",
        "description": "Core guide to JavaScript.",
        "url": "https://developer.mozilla.org/..."
      }
    ]
  }
]
```

### Rendering Flow
- Invoked when the hash is `#resources` via `Render.resources(appState)`.
- `Render.resources()` in `app.js` uses a **nested loop**:
  - The **outer loop** iterates over categories to create a header and description block.
  - The **inner loop** iterates over the `items` array inside each category, creating individual resource link cards.

---

## ℹ️ 5. About Us View

### Data Schema
```json
// data.json
"about": {
  "title": "About UITS Course Mastery",
  "description": "We are a collective of seniors...",
  "parentPortal": "https://ou1ts.github.io/",
  "features": [
    {
      "title": "Student-Led",
      "description": "Driven by student initiatives..."
    }
  ]
}
```

### Rendering Flow
- Invoked when the hash is `#about` via `Render.about(appState)`.
- `Render.about()` in `app.js` extracts:
  - `data.about.title` and `data.about.description` for headers.
  - `data.about.parentPortal` for the outbound portal anchor link.
  - Loops over `data.about.features` to render `.about-point-card` grid cells.

---

## 🤝 6. Join Us (Onboarding View)

### Data Schema
```json
// data.json
"join": {
  "facebook": { "url": "https://facebook.com/..." },
  "whatsapp": { "url": "https://whatsapp.com/..." },
  "instructions": [
    {
      "title": "Verify Student Status",
      "description": "To maintain student privacy..."
    }
  ]
}
```

### Rendering Flow
- Invoked when the hash is `#join` via `Render.join(appState)`.
- `Render.join()` in `app.js`:
  - Loops over the `data.join.instructions` timeline array.
  - Renders a Privacy Policy & student data protection note box underneath the timeline to address data lifecycle guidelines.
  - Binds `data.join.facebook.url` and `data.join.whatsapp.url` to the respective onboarding channel action button links.
