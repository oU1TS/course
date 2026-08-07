# UITS Course Mastery Portal

A clean, lightweight, vanilla Single-Page Application (SPA) designed to empower the **UITS Course Mastery** student community initiative under the **oU1TS** banner. 

Seniors use this portal to guide juniors by reverse-engineering past exam papers, curating recorded lecture sessions, sharing co-created notes, and hosting resources to maximize study efficiency and focus on career skills.

---

## 🚀 Key Features

- **OBE Cracked Component**: Standalone single-page web component (`obe_cracked.html`) translating Outcome-Based Education (CO/PO) course outlines into concrete software development practices, Bloom taxonomy levels, Knowledge Profiles (K-Profile), resume bullet points, interactive narrative comparison carousel, and developer action-to-outcome sandbox checklist widget.
- **Hash-Based Router SPA**: Blazing fast client-side page rendering without page reloads using vanilla JS.
- **Lazy Fetch & State Caching**: Dynamic page routing loads data databases (`data.json`, `course.json`, `technical.json`, `resource.json`, and `obe_data.json`) lazily depending on user navigation and caches them in memory.
- **Multi-Tier Accordions**: Expandable root sections, course accordions, item-level parent dropdowns (hiding video/notes/description until expanded), and nested session description toggle dropdowns.
- **Deep Linking & Sharing**: Sharing buttons next to courses, lectures, and resources that copy direct URLs (e.g. `#discussions?lecture=ID` or `#resources?resource=ID`) to your clipboard. Navigating to these URLs automatically auto-expands accordions (including item dropdowns), scrolls to the card, and flashes it.
- **Selection Dialog Modals**: Open custom, accessible select modals (`#notes-select-modal` and `#lecture-select-modal`) when selecting resources or notes with multiple attachments.
- **Dynamic Themes**: Built-in Dark (default pure black `#000000`) and Light (default pure white `#ffffff`) themes synced with local storage and OS preferences.
- **Roadmap Modal Overlay**: Dynamic, keyboard-accessible modal overlays to view deep-dive purpose details of roadmap steps.
- **Fully Responsive**: Mobile-first layout containers and navigation drawer for tablets and phones.

---

## 📂 Project Architecture

Here is a summary of the main files in this repository:

| File | Description |
| --- | --- |
| **[index.html](index.html)** | App HTML5 shell container, navigation layouts, and modal overlay components. |
| **[obe_cracked.html](obe_cracked.html)** | Standalone component layout for OBE Cracked, hero narrative carousel, and outcome sandbox. |
| **[style.css](style.css)** | Custom design tokens, dark/light theme configurations, layout grids, accordion and button animations. |
| **[app.js](app.js)** | SPA router, state manager, template view compilers, modal controllers, and OBE Cracked controller. |
| **[data.json](data.json)** | Content database housing the motto, roadmap timeline steps, about sections, and join channels. |
| **[course.json](course.json)** | Content database for recorded peer classes and course lectures indexed by `courseId`. |
| **[technical.json](technical.json)** | Content database for technical workshops and discussions grouped by sequence/topic (`topicId`). |
| **[resource.json](resource.json)** | Curated academic resources, toolkits, drive links, and course/lecture mappings. |
| **[obe_data.json](obe_data.json)** | Content database for CO/PO outcome mappings, Knowledge Profiles (K-Profile), and sandbox tasks. |
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