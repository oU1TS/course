> From: https://gemini.google.com/app/31bc7b217940a7b4

# you asked

message time: 2026-07-19 01:09:52

I want to work on another project under oU1TS Community initiative, called "UITS_Course_Mastery".

# idea
The idea is the get the immediate seniors of last semester guide the new juniors of the new semester with the knowledge of their last semester courses. Since seniors are freshly promoted and they just gave their final exams, they would be most knowledgeable of their courses of that semester. With that as the main goal, we also want to "study" exam questions, and plan ahead a study roadmap based on the topics that appear most in those questions. This will help the new semester students get accustomed with the exact problems they will face and also nudge the authorities to put effort in making exam questions and planning the lectures since students will know about it roughly beforehand. This should also allow the students spend less time getting used to the course materials and spend more time on other productive activities: ECA, Skill development and Job preparation.

# plan

I want to make a website with vanilla tech (HTML, CSS, JS) that will act as both the onboarding, repository of previous class recordings, hub for other resources. 

I will be using some old projects as reference and reusable codes for this project:
- render.html, render.js, render.css <-- refer to UITS_Event_Raiders
- facebook group creation and whatsapp joining guide <-- refer to UITS_Event_Raiders
- a single json file to hold much of the contents across the website

# implementation
make a website with a homepage that has a top navigation bar (that becomes a sidebar hamburger menu on mobile display). The website should employ an SPA concept where in a single html page all sections load only after they are called with the navigation buttons.

it will have the following pages:

## homepage

The homepage will contain the motto "let's do the obvious: Asking seniors about their last final exams, Studying the topics that appear in the exams, Spending time on what actually matters. Start this semester with a blast!".

Right below an animation will visually (block) explain our roadmap:
1. Guidance with experience
2. Reverse Engineering Questions
3. Brainstorming & Collaboration
4. Time Management
5. ECA, Skill dev, Job Prep

Clicking on any of the blocks will open a popup window where the blocks will explain their purposes like roadmap.sh does.

## discussions page

in this page section, the previously recorded classes will be listed. Alongside the lecture notes will be attached. The links to videos and lecture notes will be stored in a central json file.

references can be taken from https://ou1ts.github.io/events/#notes

## Resources

in this page, important resources and projects catering to the resources will be organized. 

## About Us

this section will be heavily inspired by https://ou1ts.github.io/events/#learn-more

this page will list the core plans of this project and also links to the parent project https://ou1ts.github.io/ and the groups related to this project across various platforms.

## Join Us

this section will be heavily inspired by https://ou1ts.github.io/events/#join

# Task
- prepare a summary of the idea
- write suggestions and improvements
- write a prompt for agentic AI that I can copy and paste

---

# gemini response

This is a brilliant initiative. The strategy of "reverse engineering" a semester through recent exam questions is incredibly practical—it strips away the academic anxiety for juniors and gives them a highly efficient, targeted roadmap. 

Here is the breakdown of your project concept, some architectural suggestions to keep your vanilla tech stack clean, and a detailed prompt you can hand directly to an AI agent to generate the code.

---

## Concept Summary: UITS Course Mastery

**UITS_Course_Mastery** is an open-source, community-driven Single Page Application (SPA) designed to bridge the knowledge gap between academic semesters. By leveraging the fresh insights of immediate seniors who just completed their final exams, the platform provides incoming juniors with an optimized academic roadmap. 

Instead of traditional, broad tutoring, the project focuses on **reverse-engineering past exam questions** to identify high-yield topics. This targeted approach minimizes the time students spend deciphering course materials, freeing up their schedules for high-impact activities like Extracurricular Activities (ECAs), skill development, and career preparation. The platform acts as a centralized repository for peer-led lecture recordings, study notes, curated resources, and community onboarding guides, all driven by a single, maintainable JSON database.

---

## Technical Suggestions & Improvements

Since you are sticking to vanilla HTML, CSS, and JS while relying heavily on a central JSON file, here are a few design patterns to ensure the code remains scalable and doesn't turn into "spaghetti code":

*   **JSON-Driven SPA Routing:** Instead of hardcoding all your pages inside the HTML file and toggling `display: none`, use your JS `render` system to completely generate the inner HTML of a single `<main>` container based on the active nav selection. This keeps your main `index.html` file tiny and incredibly easy to read.
*   **Centralized Modal Handler:** For the homepage roadmap blocks (the roadmap.sh style popups), don't create 5 separate modal HTML blocks. Write a single, reusable dynamic modal function in your JavaScript that updates its content dynamically based on whichever block the user clicks.
*   **The Single JSON Schema:** Structure your central JSON file cleanly from day one. Group it by features so it is easy to update manually. For example:
    ```json
    {
      "roadmap": { "1": { "title": "...", "description": "..." } },
      "discussions": [ { "semester": "3rd", "course": "CSE-211", "video": "url", "notes": "url" } ],
      "resources": [ { "category": "Math", "title": "...", "link": "..." } ]
    }
    ```
*   **CSS Custom Properties (Variables):** Define consistent brand colors, fonts, and transitions at the top of your CSS file. Since this project is a sister initiative to `UITS_Event_Raiders`, utilizing the exact same CSS variables will give both sites a unified brand identity seamlessly.

---

## Prompt for Agentic AI

*Copy and paste the block below into your AI coding tool to generate the core scaffolding of your project.*

```text
You are an expert frontend developer specialized in clean, lightweight, vanilla web stacks (HTML5, CSS3, modern ES6+ JavaScript). 

I need you to build a Single Page Application (SPA) called "UITS_Course_Mastery", which is a community initiative under the oU1TS banner. The project allows seniors to guide juniors by reverse-engineering past exam papers to optimize study time.

### Architectural Constraints:
- Use pure vanilla HTML, CSS, and JS only. No external frameworks (No React, Vue, Tailwind, etc.).
- Employ an SPA framework-less design: A single `index.html` with a `<main id="content-app">` viewport. The JavaScript file should intercept navigation clicks, clear the container, and render the specific page views dynamically.
- Clean component structure: Separate files for logic (`app.js`), styling (`style.css`), and UI template rendering functions (`render.js`).
- State-driven data: All layout descriptions, video links, notes, roadmap explanations, and community URLs must be read from a single, centralized JavaScript object or JSON structure for effortless updating.
- Fully responsive: Top navigation bar for desktop that gracefully transitions into a functional hamburger sidebar menu on mobile layouts.

### Screen-by-Screen Requirements:

1. HOMEPAGE:
   - Display the motto: "Let's do the obvious: Asking seniors about their last final exams, Studying the topics that appear in the exams, Spending time on what actually matters. Start this semester with a blast!"
   - Implement an interactive visual block diagram outlining these 5 roadmap steps:
     1. Guidance with experience
     2. Reverse Engineering Questions
     3. Brainstorming & Collaboration
     4. Time Management
     5. ECA, Skill dev, Job Prep
   - Clicking any block must open a clean, floating overlay modal window explaining that block's deep purpose (similar to the interactive node behavior on roadmap.sh).

2. DISCUSSIONS PAGE:
   - A grid layout listing recorded peer classes and lectures.
   - Each item must display the course name, semester tag, a functional link button to the video recording, and an attached link button for the respective lecture notes.
   - Model the layout style off the established pattern found at https://ou1ts.github.io/events/#notes.

3. RESOURCES PAGE:
   - A clean, categorized dashboard organizing external links, repositories, and curated project toolkits catering to different academic tracks.

4. ABOUT US PAGE:
   - Deeply inspired by https://ou1ts.github.io/events/#learn-more.
   - Outline the core structural vision of UITS_Course_Mastery and provide clear hyperlinks anchoring back to the parent community portal (https://ou1ts.github.io/).

5. JOIN US PAGE:
   - Heavily inspired by https://ou1ts.github.io/events/#join.
   - A clear onboarding section containing step-by-step instructions for creating official connected Facebook groups and accessing centralized WhatsApp community channels.

Please output the complete, production-ready source code structure: `index.html`, `style.css`, `app.js`, `render.js`, and the configuration `data.json` baseline template. Keep styles clean, modern, accessible, and fast.
```

---

<FollowUp label="Want to flesh out the data schema for the central JSON file right now?" query="Help me design the complete JSON data schema for the UITS_Course_Mastery project so that it supports the homepage roadmap modals, discussions, and links smoothly."/>