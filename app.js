/**
 * UITS Course Mastery - SPA Client Application Controller & Template Renderers
 * Author: Antigravity AI & oU1TS Community
 * Language: ES6+ (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Cache UI elements
  const contentApp = document.getElementById('content-app');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const mainNav = document.getElementById('main-nav');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.querySelectorAll('#main-nav .nav-link');
  
  // Modal UI Elements
  const modalOverlay = document.getElementById('roadmap-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalTag = document.getElementById('modal-tag');
  const modalDescription = document.getElementById('modal-description');

  // SPA Configuration
  const validRoutes = {
    '#home': 'home',
    '#discussions': 'discussions',
    '#resources': 'resources',
    '#about': 'about',
    '#join': 'join'
  };

  // State Variables
  let appState = null;       // Holds data.json content
  let lecturesState = null;   // Holds lecture.json content
  let resourcesState = null;  // Holds resource.json content
  let isDataLoading = false;

  /* ==========================================================================
     1. UI Template Rendering Functions (SPA Views)
     ========================================================================== */
  // Helper: Basic HTML escaping to prevent XSS injection
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const Render = {
    // Render Homepage
    home(data) {
      const motto = data.motto || '';
      const roadmap = data.roadmap || [];

      let roadmapHtml = '';
      roadmap.forEach((step, index) => {
        roadmapHtml += `
          <div class="roadmap-block" data-step-index="${index}" role="button" tabindex="0" aria-label="Roadmap Step ${step.step}: ${escapeHTML(step.title)}. Click to view details.">
            <div class="roadmap-step-num">0${step.step}</div>
            <div class="roadmap-step-body">
              <span class="roadmap-step-subtitle">${escapeHTML(step.subtitle)}</span>
              <h3 class="roadmap-step-title">${escapeHTML(step.title)}</h3>
              <p class="roadmap-step-summary">${escapeHTML(step.summary)}</p>
            </div>
            <div class="roadmap-step-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        `;
      });

      return `
        <section class="page-section fade-in" id="home-view">
          <div class="hero-wrapper">
            <h1 class="hero-title">UITS <br><span class="accent-text">Course Mastery</span></h1>
            <p class="hero-motto">${escapeHTML(motto)}</p>
            <div class="hero-ctas">
              <a href="#discussions" class="btn btn-primary">
                <span>Explore Discussions</span>
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <a href="#join" class="btn btn-secondary">
                <span>Join Community</span>
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></svg>
              </a>
            </div>
          </div>

          <div class="section-divider"></div>

          <div class="roadmap-container">
            <div class="section-header">
              <span class="section-tag">Methodology</span>
              <h2 class="section-title">Our Study Roadmap</h2>
              <p class="section-desc">Click any block to learn how we systematically optimize our semester prep time.</p>
            </div>
            <div class="roadmap-grid">
              ${roadmapHtml}
            </div>
          </div>
        </section>
      `;
    },

    // Render Discussions Page
    discussions(data) {
      const courses = data.courses || [];
      let accordionHtml = '';

      if (courses.length === 0) {
        accordionHtml = '<p class="no-data">No recorded peer classes or lectures available yet.</p>';
      } else {
        courses.forEach(course => {
          let lecturesHtml = '';
          const lectures = course.lectures || [];

          if (lectures.length === 0) {
            lecturesHtml = '<p class="no-data">No lectures available for this course.</p>';
          } else {
            lectures.forEach(item => {
              lecturesHtml += `
                <div class="discussion-card" id="lecture-${escapeHTML(item.lectureId)}">
                  <div class="card-header">
                    <span class="semester-tag">${escapeHTML(item.semester)}</span>
                  </div>
                  <h4 class="lecture-title">${escapeHTML(item.title)}</h4>
                  <p class="lecture-instructor">Guided by: <strong>${escapeHTML(item.instructor)}</strong></p>
                  <div class="card-actions">
                    <a href="${escapeHTML(item.videoUrl)}" class="card-btn btn-video" target="_blank" rel="noopener noreferrer">
                      <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                      </svg>
                      <span>Video Recording</span>
                    </a>
                    <a href="${escapeHTML(item.notesUrl)}" class="card-btn btn-notes" target="_blank" rel="noopener noreferrer">
                      <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      <span>Lecture Notes</span>
                    </a>
                  </div>
                </div>
              `;
            });
          }

          accordionHtml += `
            <div class="course-accordion-item" id="course-${escapeHTML(course.courseId)}">
              <button class="course-accordion-header" aria-expanded="false" aria-controls="lectures-${escapeHTML(course.courseId)}">
                <span class="course-title-text">${escapeHTML(course.courseName)}</span>
                <span class="lectures-count">${lectures.length} ${lectures.length === 1 ? 'Lecture' : 'Lectures'}</span>
                <svg class="accordion-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div class="course-accordion-content" id="lectures-${escapeHTML(course.courseId)}">
                <div class="lectures-grid">
                  ${lecturesHtml}
                </div>
              </div>
            </div>
          `;
        });
      }

      return `
        <section class="page-section fade-in" id="discussions-view">
          <div class="section-header">
            <span class="section-tag">Peer Learning</span>
            <h2 class="section-title">Recorded Classes & Lectures</h2>
            <p class="section-desc">Access direct study session recordings and co-created lecture notes compiled by seniors.</p>
          </div>
          <div class="courses-accordion">
            ${accordionHtml}
          </div>
        </section>
      `;
    },

    // Render Resources Page
    resources(data) {
      const resources = data.resources || [];
      let categoriesHtml = '';

      if (resources.length === 0) {
        categoriesHtml = '<p class="no-data">No resources curated at this moment.</p>';
      } else {
        resources.forEach(category => {
          let itemsHtml = '';
          category.items.forEach(item => {
            let redirectionLinkHtml = '';
            if (item.relatedLectureId) {
              redirectionLinkHtml = `
                <a href="#discussions?lecture=${escapeHTML(item.relatedLectureId)}" class="resource-link related-link">
                  <span>View Related Lecture</span>
                  <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </a>
              `;
            } else if (item.relatedCourseId) {
              redirectionLinkHtml = `
                <a href="#discussions?course=${escapeHTML(item.relatedCourseId)}" class="resource-link related-link">
                  <span>View Course Lectures</span>
                  <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </a>
              `;
            }

            itemsHtml += `
              <div class="resource-card">
                <h4 class="resource-title">${escapeHTML(item.title)}</h4>
                <p class="resource-desc">${escapeHTML(item.description)}</p>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: auto;">
                  <a href="${escapeHTML(item.url)}" class="resource-link" target="_blank" rel="noopener noreferrer">
                    <span>Access Resource</span>
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </a>
                  ${redirectionLinkHtml}
                </div>
              </div>
            `;
          });

          categoriesHtml += `
            <div class="resource-category-section">
              <h3 class="category-heading">${escapeHTML(category.category)}</h3>
              <p class="category-desc">${escapeHTML(category.description)}</p>
              <div class="resources-grid">
                ${itemsHtml}
              </div>
            </div>
          `;
        });
      }

      return `
        <section class="page-section fade-in" id="resources-view">
          <div class="section-header">
            <span class="section-tag">Academic Assets</span>
            <h2 class="section-title">Curated Study Resources</h2>
            <p class="section-desc">Hand-picked repositories, toolkits, and academic guides collected for different UITS courses.</p>
          </div>
          <div class="resources-container">
            ${categoriesHtml}
          </div>
        </section>
      `;
    },

    // Render About Us Page
    about(data) {
      const about = data.about || {};
      const features = about.features || [];
      let pointsHtml = '';

      features.forEach(feat => {
        let linksHtml = '';
        if (feat.links && feat.links.length > 0) {
          feat.links.forEach(link => {
            linksHtml += `
              <a href="${escapeHTML(link.url)}" class="card-link" ${link.url.startsWith('#') ? '' : 'target="_blank" rel="noopener noreferrer"'}>
                <span>${escapeHTML(link.text)}</span>
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 10px; height: 10px; margin-left: 2px;">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
            `;
          });
        }

        pointsHtml += `
          <div class="about-point-card">
            <h4 class="point-title">${escapeHTML(feat.title)}</h4>
            <p class="point-desc">${escapeHTML(feat.description)}</p>
            ${linksHtml ? `<div class="card-links">${linksHtml}</div>` : ''}
          </div>
        `;
      });

      return `
        <section class="page-section fade-in" id="about-view">
          <div class="section-header">
            <span class="section-tag">Overview</span>
            <h2 class="section-title">${escapeHTML(about.title || 'About UITS Course Mastery')}</h2>
            <p class="section-desc">Understand the academic optimization vision driven by oU1TS.</p>
          </div>
          <div class="about-content">
            <div class="about-vision-block">
              <p class="about-main-desc">${escapeHTML(about.description || '')}</p>
              <a href="${escapeHTML(about.parentPortal)}" class="btn btn-secondary community-link" target="_blank" rel="noopener noreferrer">
                <span>Visit parent community portal (oU1TS)</span>
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
            </div>
            
            <div class="about-points-grid">
              ${pointsHtml}
            </div>
          </div>
        </section>
      `;
    },

    // Render Join Us Page
    join(data) {
      const join = data.join || {};
      const instructions = join.instructions || [];
      let instructionsHtml = '';

      instructions.forEach((inst, index) => {
        let linksHtml = '';
        if (inst.links && inst.links.length > 0) {
          inst.links.forEach(link => {
            linksHtml += `
              <a href="${escapeHTML(link.url)}" class="card-link" ${link.url.startsWith('#') ? '' : 'target="_blank" rel="noopener noreferrer"'}>
                <span>${escapeHTML(link.text)}</span>
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 10px; height: 10px; margin-left: 2px;">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
            `;
          });
        }

        instructionsHtml += `
          <div class="join-step-card">
            <div class="join-step-number">0${index + 1}</div>
            <div class="join-step-content">
              <h4 class="join-step-title">${escapeHTML(inst.title)}</h4>
              <p class="join-step-desc">${escapeHTML(inst.description)}</p>
              ${linksHtml ? `<div class="card-links">${linksHtml}</div>` : ''}
            </div>
          </div>
        `;
      });

      return `
        <section class="page-section fade-in" id="join-view">
          <div class="section-header">
            <span class="section-tag">Onboarding</span>
            <h2 class="section-title">Join the Collective</h2>
            <p class="section-desc">Follow these clear instructions to connect with peer channels and study groups.</p>
          </div>
          
          <div class="join-container">
            <div class="join-steps-timeline">
              ${instructionsHtml}
              
              <!-- Privacy Policy Box -->
              <div class="privacy-disclaimer">
                <svg class="privacy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <div class="privacy-text">
                  <strong>Student Data Protection Note:</strong> The copy of your Student ID card is used exclusively for one-time verification. It is stored securely and permanently deleted from all chats and devices immediately post-verification. We respect your privacy. For further queries, reach out via the <a href="${escapeHTML(join.facebook ? join.facebook.url : '')}" target="_blank" rel="noopener noreferrer">Facebook Group</a>.
                </div>
              </div>
            </div>
            
            <div class="join-channels-panel">
              <div class="channel-card fb-channel">
                <h3>Community Facebook Group</h3>
                <p>Post queries, request resources, and coordinate with peer maintainers.</p>
                <a href="${escapeHTML(join.facebook ? join.facebook.url : '')}" class="channel-link btn-fb" target="_blank" rel="noopener noreferrer">
                  <span>Join FB Group</span>
                  <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>

              <div class="channel-card wa-channel">
                <h3>WhatsApp Community Hub</h3>
                <p>Get real-time updates and join specific active course group channels.</p>
                <a href="${escapeHTML(join.whatsapp ? join.whatsapp.url : '')}" class="channel-link btn-wa" target="_blank" rel="noopener noreferrer">
                  <span>Join Whatsapp Channel</span>
                  <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      `;
    }
  };

  /* ==========================================================================
     2. Theme Engine (Light / Dark Mode, Default: Dark)
     ========================================================================== */
  function initializeTheme() {
    const storedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

    if (storedTheme === 'light' || (!storedTheme && prefersLight)) {
      document.body.classList.add('light-theme');
      updateThemeToggleAccessibility(true);
    } else {
      document.body.classList.remove('light-theme');
      updateThemeToggleAccessibility(false);
    }
  }

  function toggleTheme() {
    const isLightThemeActive = document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', isLightThemeActive ? 'light' : 'dark');
    updateThemeToggleAccessibility(isLightThemeActive);
  }

  function updateThemeToggleAccessibility(isLight) {
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  /* ==========================================================================
     3. Asynchronous Data Fetching & Routing
     ========================================================================== */
  async function fetchAppData(fileName) {
    if (fileName === 'data.json' && appState) return appState;
    if (fileName === 'lecture.json' && lecturesState) return lecturesState;
    if (fileName === 'resource.json' && resourcesState) return resourcesState;
    if (isDataLoading) return null;

    isDataLoading = true;
    renderSkeletons();

    try {
      const response = await fetch(fileName);
      if (!response.ok) {
        throw new Error(`Failed to load ${fileName} (HTTP ${response.status})`);
      }
      const data = await response.json();
      if (fileName === 'data.json') appState = data;
      else if (fileName === 'lecture.json') lecturesState = data;
      else if (fileName === 'resource.json') resourcesState = data;
      return data;
    } catch (err) {
      console.error(`Error fetching ${fileName}:`, err);
      renderError(err.message);
      return null;
    } finally {
      isDataLoading = false;
    }
  }

  function renderSkeletons() {
    if (!contentApp) return;
    contentApp.innerHTML = `
      <section class="page-section fade-in">
        <div class="section-header">
          <span class="section-tag">Syncing</span>
          <h2 class="section-title">Loading Application Data</h2>
          <p class="section-desc">Retrieving state variables from central template database...</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; max-width: 1100px; margin: 0 auto;">
          <div class="skeleton-card"></div>
          <div class="skeleton-card"></div>
          <div class="skeleton-card"></div>
        </div>
      </section>
    `;
  }

  function renderError(msg) {
    if (!contentApp) return;
    contentApp.innerHTML = `
      <section class="page-section fade-in" style="text-align: center; padding: 4rem 1.5rem;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px; margin: 0 auto 1.5rem auto;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2 class="section-title">Failed to Load Content</h2>
        <p class="section-desc" style="margin-bottom: 2rem;">An error occurred while loading the application: ${msg}</p>
        <button class="btn btn-primary" onclick="window.location.reload()">Retry Connection</button>
      </section>
    `;
  }

  async function routePage() {
    let rawHash = window.location.hash || '#home';
    let currentHash = rawHash;
    let queryParams = {};

    // Support query parameters in hash, e.g. #discussions?course=cse-213-dsa
    if (rawHash.includes('?')) {
      const parts = rawHash.split('?');
      currentHash = parts[0];
      const queryStr = parts[1];
      queryStr.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key) {
          queryParams[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
      });
    }

    // Default fallback
    if (!currentHash || !validRoutes[currentHash]) {
      currentHash = '#home';
      history.replaceState(null, null, currentHash);
    }

    // 1. Sync Active Navbar Link
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentHash) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    // 2. Fetch data (depending on page/route)
    let data = null;
    const renderKey = validRoutes[currentHash];
    if (renderKey === 'home' || renderKey === 'about' || renderKey === 'join') {
      data = await fetchAppData('data.json');
    } else if (renderKey === 'discussions') {
      data = await fetchAppData('lecture.json');
    } else if (renderKey === 'resources') {
      data = await fetchAppData('resource.json');
    }
    if (!data) return; // Error or loading rendered inside fetchAppData

    // 3. Clear container & Dynamic Render
    if (contentApp) {
      contentApp.innerHTML = '';
      if (Render[renderKey]) {
        contentApp.innerHTML = Render[renderKey](data);
        setupViewInteractions(renderKey, queryParams);
      } else {
        renderError(`Renderer for "${renderKey}" is not defined.`);
      }
    }

    // 4. Scroll page to top (if no specific anchor redirection is happening)
    if (!queryParams.course && !queryParams.lecture) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // 5. Close Mobile Sidebar Menu
    closeMobileMenu();
  }

  // Intercept hash change
  window.addEventListener('hashchange', routePage);

  /* ==========================================================================
     4. Setup View Interactions (Modal bindings, CTA intercepts)
     ========================================================================== */
  function setupViewInteractions(viewKey, queryParams) {
    if (viewKey === 'home') {
      // Bind Roadmap Block Click Event Listeners
      const roadmapBlocks = document.querySelectorAll('.roadmap-block');
      roadmapBlocks.forEach(block => {
        block.addEventListener('click', () => {
          const stepIndex = parseInt(block.getAttribute('data-step-index'), 10);
          showRoadmapModal(stepIndex);
        });

        // Accessibility: Keyboard Enter
        block.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const stepIndex = parseInt(block.getAttribute('data-step-index'), 10);
            showRoadmapModal(stepIndex);
          }
        });
      });
    } else if (viewKey === 'discussions') {
      // Bind Accordion Toggle Click Handlers
      const headers = document.querySelectorAll('.course-accordion-header');
      headers.forEach(header => {
        header.addEventListener('click', () => {
          const item = header.closest('.course-accordion-item');
          const isExpanded = header.getAttribute('aria-expanded') === 'true';
          
          // Toggle this accordion item
          header.setAttribute('aria-expanded', !isExpanded);
          const content = item.querySelector('.course-accordion-content');
          if (content) {
            content.style.maxHeight = !isExpanded ? `${content.scrollHeight}px` : '0';
          }
        });
      });

      // Handle redirect query parameters (auto-expand and scroll)
      if (queryParams) {
        if (queryParams.lecture) {
          const lectureCard = document.getElementById(`lecture-${queryParams.lecture}`);
          if (lectureCard) {
            const accordionItem = lectureCard.closest('.course-accordion-item');
            if (accordionItem) {
              const header = accordionItem.querySelector('.course-accordion-header');
              const content = accordionItem.querySelector('.course-accordion-content');
              if (header && content) {
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = `${content.scrollHeight}px`;
              }
            }
            // Smooth scroll to target lecture card
            setTimeout(() => {
              lectureCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
              lectureCard.classList.add('highlight-flash');
              setTimeout(() => lectureCard.classList.remove('highlight-flash'), 2000);
            }, 150);
          }
        } else if (queryParams.course) {
          const accordionItem = document.getElementById(`course-${queryParams.course}`);
          if (accordionItem) {
            const header = accordionItem.querySelector('.course-accordion-header');
            const content = accordionItem.querySelector('.course-accordion-content');
            if (header && content) {
              header.setAttribute('aria-expanded', 'true');
              content.style.maxHeight = `${content.scrollHeight}px`;
            }
            // Smooth scroll to target course
            setTimeout(() => {
              accordionItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
          }
        }
      }
    }
  }

  /* ==========================================================================
     5. Roadmap Modal Controllers
     ========================================================================== */
  function showRoadmapModal(stepIndex) {
    if (!appState || !appState.roadmap || !appState.roadmap[stepIndex]) return;
    const stepData = appState.roadmap[stepIndex];

    if (modalTitle && modalTag && modalDescription && modalOverlay) {
      modalTag.textContent = `Step 0${stepData.step}`;
      modalTitle.textContent = stepData.title;
      modalDescription.textContent = stepData.description;

      // Handle rendering of dynamic step links
      const modalLinksContainer = document.getElementById('modal-links');
      if (modalLinksContainer) {
        modalLinksContainer.innerHTML = '';
        if (stepData.links && stepData.links.length > 0) {
          stepData.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.className = 'btn btn-primary modal-link';
            if (link.url.startsWith('#')) {
              // SPA link, close modal on navigate
              a.addEventListener('click', () => {
                closeRoadmapModal();
              });
            } else {
              a.target = '_blank';
              a.rel = 'noopener noreferrer';
            }
            a.textContent = link.text;
            modalLinksContainer.appendChild(a);
          });
          modalLinksContainer.style.display = 'flex';
        } else {
          modalLinksContainer.style.display = 'none';
        }
      }

      modalOverlay.classList.add('open');
      modalOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      
      // Accessibility focus on close button
      if (modalCloseBtn) modalCloseBtn.focus();
    }
  }

  function closeRoadmapModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Restore scroll
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeRoadmapModal);
  }

  if (modalOverlay) {
    // Backdrop click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeRoadmapModal();
      }
    });
  }

  // Keyboard Escape listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeRoadmapModal();
    }
  });

  /* ==========================================================================
     6. Mobile Navigation Sidebar
     ========================================================================== */
  function toggleMobileMenu() {
    const isOpen = mainNav.classList.toggle('open');
    mobileToggle.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', isOpen);
  }

  function closeMobileMenu() {
    if (mainNav && mobileToggle) {
      mainNav.classList.remove('open');
      mobileToggle.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  // Close when clicking outside header area
  document.addEventListener('click', (e) => {
    const header = document.querySelector('.header');
    if (header && !header.contains(e.target)) {
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     7. Run Application
     ========================================================================== */
  initializeTheme();
  routePage();
});
