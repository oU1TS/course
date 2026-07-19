# UITS Course Mastery Portal

A clean, lightweight, vanilla Single-Page Application (SPA) designed to empower the **UITS Course Mastery** student community initiative under the **oU1TS** banner. 

Seniors use this portal to guide juniors by reverse-engineering past exam papers, curating recorded lecture sessions, sharing co-created notes, and hosting resources to maximize study efficiency and focus on career skills.

---

## 🚀 Key Features

- **Hash-Based Router SPA**: Blazing fast client-side page rendering without page reloads using vanilla JS.
- **Lazy Fetch & State Caching**: Dynamic page routing loads data databases (`data.json`, `lecture.json`, and `resource.json`) lazily depending on user navigation and caches them in memory.
- **Deep Linking & Sharing**: Sharing buttons next to courses, lectures, and resources that copy direct URLs (e.g. `#discussions?lecture=ID` or `#resources?resource=ID`) to your clipboard. Navigating to these URLs automatically auto-expands accordions, scrolls to the card, and flashes it.
- **Selection Dialog Modals**: Open custom, accessible select modals (`#lecture-select-modal`) when selecting a resource that matches multiple lecture sessions.
- **Dynamic Themes**: Built-in Dark (default pure black `#000000`) and Light (default pure white `#ffffff`) themes synced with local storage and OS preferences.
- **Roadmap Modal Overlay**: Dynamic, keyboard-accessible modal overlays to view deep-dive purpose details of roadmap steps.
- **Fully Responsive**: Mobile-first grid layouts and navigation drawer for tablets and phones.

---

## 📂 Project Architecture

Here is a summary of the main files in this repository:

| File | Description |
| --- | --- |
| **[index.html](index.html)** | App HTML5 shell container, navigation layouts, and modal overlay components. |
| **[style.css](style.css)** | Custom design tokens, dark/light theme configurations, layout grids, accordion and button animations. |
| **[app.js](app.js)** | SPA router, state manager, template view compilers, modal controllers, and clipboard copy engines. |
| **[data.json](data.json)** | Content database housing the motto, roadmap timeline steps, about sections, and join channels. |
| **[lecture.json](lecture.json)** | Recorded classes and peer lectures grouped by course with semesters and notes. |
| **[resource.json](resource.json)** | Curated academic resources, toolkits, drive links, and course/lecture mappings. |
| **[documentation.md](documentation.md)** | Technical reference describing routing flow, lifecycle architecture, and state. |
| **[explain.md](explain.md)** | Mapping guidelines explaining JSON schemas and corresponding view renderers. |

For a deep dive into data routing, lifecycles, and component state, please refer to the **[Technical Documentation](documentation.md)** and the **[Data Mapping Guide](explain.md)**.

---

## 🛠️ Run Locally

Since this is a fully client-side application, you can run it locally without a complex build setup.

### Option 1: Live Server (Recommended)
Use an extension like VS Code's **Live Server** or run a simple local web server:
```bash
# Using Node.js (npx)
npx serve .

# Using Python
python -m http.server 8000
```
Then visit `http://localhost:3000` (or `http://localhost:8000`) in your browser.

### Option 2: Open File Directly
Double-click `index.html` to open the file directly in any modern browser (`file://` protocol). *Note: Fetching database JSON files locally might be blocked by CORS policies in some browser configurations; a local server is recommended.*