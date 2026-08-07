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

## 💬 3. Discussions View (Root Drop-down Menus & Collapsible Accordions)

### Data Schema
```json
// technical.json (Root -> Topics -> Discussion Item Accordions)
{
  "topics": [
    {
      "topicId": "tech-disc-1",
      "topicName": "Technical Discussion #1",
      "discussions": [
        {
          "discussionId": "tech-disc-1.1",
          "title": "Technical Discussion #1.1 | CSE-55 UITS",
          "semester": "Autumn 2026",
          "instructor": "OmniPotato23",
          "description": "This video covers topics ranging from hosting portfolio websites...",
          "videoUrl": "https://youtu.be/icGNcUG_fKI",
          "notesUrl": [
            "render.html?file=note/technical/tech-1.1.md",
            "https://github.com/user-attachments/files/30622748/Linux.VM.Installation.Guide.pdf"
          ]
        }
      ]
    }
  ]
}

// course.json / lecture.json (Root -> Courses -> Lecture Item Accordions)
{
  "courses": [
    {
      "courseId": "cse-0611327-cgm",
      "courseName": "CSE0611327: Computer Graphics & Multimedia",
      "lectures": [
        {
          "lectureId": "cse-0611327-cgm-l2",
          "title": "MM Memory Data Banks",
          "semester": "Autumn 2026",
          "instructor": "b1tranger",
          "description": "",
          "videoUrl": "https://youtu.be/sbMpP3OyGGQ",
          "notesUrl": "https://github.com/..."
        }
      ]
    }
  ]
}
```

### Rendering & Interaction Flow
- **Data Load**: Invoked when the hash is `#discussions` via `Render.discussions({ courseData, techData })` (fetching `course.json` and `technical.json` first if uncached).
- **Multi-Tier Accordion Hierarchy**:
  1. **Root Section Accordions**: Top-level dropdown containers for **Course Discussions** (`#root-section-course`) and **Technical Discussions** (`#root-section-technical`).
  2. **Course Accordions**: Inner course panel dropdowns grouped by `courseId` inside Course Discussions.
  3. **Item Parent Dropdowns (`.discussion-accordion-item`)**: Each individual lecture or technical discussion item is rendered as an expandable parent dropdown card.
- **Item Collapsed vs Expanded View**:
  - **Collapsed View (Before Expanding)**: Each item's header (`.discussion-accordion-header`) displays `"lectureId"` / `"discussionId"` tag, `"title"`, `"semester"` tag, and `"instructor"`, along with the copy link button and dropdown arrow. It hides `"description"`, `"videoUrl"`, and `"notesUrl"`.
  - **Expanded View (On Header Click)**: Expands `.discussion-card-body` to reveal the **Video Recording** button, **Lecture Notes** button (or multiple notes selector button), and a **Session Description** dropdown toggle button (`.card-desc-toggle`) if description text is present.
- **Nested Session Description Dropdown**: Clicking the "Session Description" toggle button inside the expanded item body expands/collapses the `"description"` text container (`.card-desc-content`).
- **Copiable Deep Links**:
  - **Copy Root Dropdown Link**: A `.btn-copy-id` (with `data-copy-type="section"`) copies `#discussions?section=technical` or `#discussions?section=course`.
  - **Copy Discussion Link**: Each technical discussion item has a `.btn-copy-id` (with `data-copy-type="discussion"`) copying `#discussions?discussion=DISCUSSION_ID`.
  - **Copy Course Link**: A `.btn-copy-id` (with `data-copy-type="course"`) copies `#discussions?course=COURSE_ID`.
  - **Copy Lecture Link**: Each lecture item has a `.btn-copy-id` (with `data-copy-type="lecture"`) copying `#discussions?lecture=LECTURE_ID`.
- **Auto-expansion & Deep Link Redirection**: Visiting query parameter URLs (`?section=...`, `?discussion=...`, `?course=...`, `?lecture=...`) automatically expands parent root sections, course accordions, and the target item's parent dropdown, scrolls to the element, and triggers a `.highlight-flash` pulse animation.

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

---

## 🎯 7. OBE Cracked View (Outcome-Based Education Bridge)

### Data Schema (`obe_data.json`)
```json
{
  "narrative_comparisons": [
    {
      "id": 1,
      "course_context": "Data Structures & Algorithms (POa / K3, K4)",
      "academic_text": "\"Analyze basic linear and non-linear data structures for computational efficiency (CO1 / POa - Bloom: Analyze/C4).\"",
      "engineering_text": "Selecting the optimal data structure (HashMaps vs. Arrays) so backend memory usage stays low and lookup speed executes in O(1) time."
    }
  ],
  "courses": [
    {
      "course_code": "CSE0613321",
      "course_name": "Compiler",
      "outcomes": [
        {
          "id": "cmp-co1",
          "co": "CO1",
          "po": "POa",
          "category": "PO1",
          "bloom_level": "Understand (C2)",
          "knowledge_profile": "K2, K3",
          "formal_desc": "Explain the phases of a compiler...",
          "practical_translation": "Understanding how raw source code text moves from lexical analysis...",
          "applied_task": "Tracing source code compilation steps...",
          "resume_impact": "Understood low-level program compilation lifecycles..."
        }
      ]
    }
  ],
  "sandbox_tasks": [
    {
      "id": "sb-task-1",
      "title": "Created a GitHub Pull Request",
      "desc": "Submitted code via feature branch, requested peer code review...",
      "satisfied_pos": ["POe", "POi", "POj"],
      "po_breakdown": {
        "POe": "Modern Tool Usage (PO5): Managed distributed Git version control workflows.",
        "POi": "Teamwork (PO9): Coordinated with teammates during PR iterations.",
        "POj": "Communication (PO10): Authored clear PR descriptions and code review comments."
      }
    }
  ]
}
```

### Rendering & Interaction Flow
- **Data Load**: Invoked on `obe_cracked.html` load via `initOBECracked()` in [app.js](app.js), fetching `obe_data.json`.
- **Interactive Hero Narrative Carousel**:
  - `initNarrativeCarousel()` loops over `obe_data.json`'s `narrative_comparisons` array.
  - Automatically cycles comparisons every 7 seconds (`setInterval`).
  - Triggers a smooth 180ms CSS fade-slide transition (`.cycling`) during content updates.
  - Pauses timer on `mouseenter`, `focusin`, and `touchstart` (`pauseCycle()`), dynamically updating `#obe-cycle-hint` text to `"Paused | Click/Tap to cycle"`.
  - Resumes timer on `mouseleave`, `focusout`, and `touchend` (`resumeCycle()`), updating status text to `"Auto 7s | Click/Tap to cycle"`.
  - Clicking/tapping advances immediately to the next comparison card (`handleUserClick()`).
- **Dynamic Course & Category Filters**:
  - `initOBECracked()` populates `#obe-course-select` with available Computer Science course outlines.
  - `renderOBECards()` filters outcome cards dynamically by selected course and active category tab (`All Outcomes`, `PO1`, `PO3`, `PO5`, `PO9/PO10`).
- **Interactive Outcome Cards**:
  - Renders Academic Outcome Badges (`CO` / `PO`), Bloom Taxonomy Levels, Knowledge Profiles (`K-Profile`), Formal Syllabus Descriptions, Plain-English Practical Translations, Applied Evidence/Lab Tasks, and Resume Bullet Point Suggestions.
- **Action-to-Outcome Interactive Sandbox**:
  - `initOBESandbox()` renders practical developer action checkboxes from `obe_data.json`.
  - `updateOBESandbox()` calculates checked task satisfied POs, activates status cards (`.obe-po-status-card.active`), and renders live outcome proof log entries.
