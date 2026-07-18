# UITS Course Mastery Portal

A clean, lightweight, vanilla Single-Page Application (SPA) designed to empower the **UITS Course Mastery** student community initiative under the **oU1TS** banner. 

Seniors use this portal to guide juniors by reverse-engineering past exam papers, curating recorded lecture sessions, sharing co-created notes, and hosting resources to maximize study efficiency and focus on career skills.

---

## 🚀 Key Features

- **Hash-Based Router SPA**: Blazing fast client-side page rendering without page reloads using vanilla JS.
- **In-Memory Caching**: Fetches the centralized JSON database once on load and caches it, reducing network requests.
- **Dynamic Themes**: Built-in Dark and Light themes synced with local storage and OS preferences.
- **Modular Component Templates**: Clean segregation between routing controller (`app.js`) and UI template generators (`render.js`).
- **Roadmap Modal Overlay**: Dynamic, keyboard-accessible modal overlays to view deep-dive purpose details of roadmap steps.
- **Fully Responsive**: Mobile-first grid layouts and navigation drawer for tablets and phones.

---

## 📂 Project Architecture

Here is a summary of the main files in this repository:

| File | Description |
| --- | --- |
| **[index.html](index.html)** | App HTML5 shell container, navigation layouts, and modal components. |
| **[style.css](style.css)** | CSS Reset, custom design tokens, dark/light styling configurations. |
| **[app.js](app.js)** | Core router engine, asynchronous fetch controller, and global event listeners. |
| **[render.js](render.js)** | Exposed template compilers (`window.Render`) returning HTML content structures. |
| **[data.json](data.json)** | Central database housing roadmaps, resource links, and discussions metadata. |
| **[documentation.md](documentation.md)** | Technical reference describing routing flow, architecture, and state. |

For a deep dive into data routing, lifecycles, and component state, please refer to the **[Technical Documentation](documentation.md)**.

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
Double-click `index.html` to open the file directly in any modern browser (`file://` protocol). *Note: Fetching `data.json` locally might be blocked by CORS policies in some browser configurations; a local server is recommended.*