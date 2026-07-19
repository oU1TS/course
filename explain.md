# Data Mapping & Loading Reference Guide

This document explains how each section of the **UITS Course Mastery** website loads and renders content from `data.json`, `lecture.json`, and `resource.json`, explaining how database structures map to the rendered UI.

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
   - It updates the DOM elements (`#modal-tag`, `#modal-title`, `#modal-description`, and dynamic `#modal-links` buttons if any exist) and applies the `.open` class to the modal overlay container (`#roadmap-modal`) in `index.html`.

---

## 💬 3. Discussions View (Collapsible Course Accordions)

### Data Schema
```json
// lecture.json
{
  "courses": [
    {
      "courseId": "cse-211-oop",
      "courseName": "Object Oriented Programming (OOP)",
      "lectures": [
        {
          "lectureId": "cse-211-oop-l1",
          "semester": "Autumn 2025",
          "title": "OOP Basics & Class Layouts",
          "instructor": "Jane Doe (Senior)",
          "videoUrl": "https://youtube.com/...",
          "notesUrl": "https://drive.google.com/..."
        }
      ]
    }
  ]
}
```

### Rendering & Interaction Flow
- **Data Load**: Invoked when the hash is `#discussions` via `Render.discussions(lecturesState)` (fetching `lecture.json` first if uncached).
- **Course Groupings**: The renderer creates a collapsible accordion panel `.course-accordion-item` for each course. Inside each accordion is a `.lectures-grid` listing the lecture card items.
- **Copy Course Link**: A small link button `.btn-copy-id` (with `data-copy-type="course"`) is attached to each accordion header wrapper. Clicking it copies `#discussions?course=COURSE_ID` to the clipboard.
- **Copy Lecture Link**: Each lecture card has a `.btn-copy-id` (with `data-copy-type="lecture"`) that copies `#discussions?lecture=LECTURE_ID` to the clipboard.
- **Auto-expansion & Focus Redirects**: If a user visits the discussions route with query parameters (e.g. `?course=cse-211-oop` or `?lecture=cse-211-oop-l1`), `setupViewInteractions` automatically sets the target accordion wrapper height (`maxHeight = scrollHeight`), expands the panel, scrolls to the element, and pulses it with a `.highlight-flash` animation.

---

## 📂 4. Curated Resources View

### Data Schema
```json
// resource.json
{
  "resources": [
    {
      "category": "Academic Toolkit",
      "description": "Central repositories and archives collected by UITS students.",
      "items": [
        {
          "resourceId": "uits-exam-repo",
          "title": "UITS Exam Repository",
          "description": "A centralized archive of past mid and final exam question papers...",
          "url": "https://github.com/oU1TS/uits-exam-repo",
          "relatedCourseId": "cse-213-dsa"
        },
        {
          "resourceId": "cse-notes-drive",
          "title": "CSE Lecture Notes Drive",
          "description": "Curated Google Drive folders containing course slides...",
          "url": "https://drive.google.com/drive/...",
          "relatedLectureId": ["cse-211-oop-l1", "cse-211-oop-l2"]
        }
      ]
    }
  ]
}
```

### Rendering & Interaction Flow
- **Data Load**: Invoked when the hash is `#resources` via `Render.resources(resourcesState)` (fetching `resource.json` first if uncached).
- **Resource Deep Link**: Each resource card is given a copy button with `data-copy-type="resource"` linking to `#resources?resource=RESOURCE_ID` which scrolls to and flashes the card on load.
- **Redirection / Selection Dialogue Popups**:
  - If a resource maps to a **single** related lecture (`relatedLectureId` as string) or course (`relatedCourseId`), it renders a standard redirect anchor to Discussions (`#discussions?lecture=ID`).
  - If a resource maps to **multiple** related lectures (`relatedLectureId` as an array of strings), it renders a select action button `.btn-select-lecture`. Clicking it pops open the `#lecture-select-modal` select overlay.
  - The select modal displays a skeleton loader, fetches `lecture.json` (if uncached), maps the related IDs to their Course Names and Lecture Titles, and renders them as choice cards that close the popup and route the user when clicked.

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
