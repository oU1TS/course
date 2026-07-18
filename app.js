/**
 * UITS Course Mastery - SPA Client Application Controller
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
  let appState = null;
  let isDataLoading = false;

  /* ==========================================================================
     1. Theme Engine (Light / Dark Mode, Default: Dark)
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
     2. Asynchronous Data Fetching & Routing
     ========================================================================== */
  async function fetchAppData() {
    if (appState) return appState;
    if (isDataLoading) return null;

    isDataLoading = true;
    renderSkeletons();

    try {
      const response = await fetch('data.json');
      if (!response.ok) {
        throw new Error(`Failed to load data.json (HTTP ${response.status})`);
      }
      appState = await response.json();
      return appState;
    } catch (err) {
      console.error('Error fetching application state:', err);
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
    let currentHash = window.location.hash;
    
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

    // 2. Fetch data (if not cached)
    const data = await fetchAppData();
    if (!data) return; // Error or loading rendered inside fetchAppData

    // 3. Clear container & Dynamic Render
    if (contentApp) {
      contentApp.innerHTML = '';
      const renderKey = validRoutes[currentHash];
      
      if (window.Render && window.Render[renderKey]) {
        contentApp.innerHTML = window.Render[renderKey](data);
        setupViewInteractions(renderKey);
      } else {
        renderError(`Renderer for "${renderKey}" is not defined.`);
      }
    }

    // 4. Scroll page to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // 5. Close Mobile Sidebar Menu
    closeMobileMenu();
  }

  // Intercept hash change
  window.addEventListener('hashchange', routePage);

  /* ==========================================================================
     3. Setup View Interactions (Modal bindings, CTA intercepts)
     ========================================================================== */
  function setupViewInteractions(viewKey) {
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
    }
  }

  /* ==========================================================================
     4. Roadmap Modal Controllers
     ========================================================================== */
  function showRoadmapModal(stepIndex) {
    if (!appState || !appState.roadmap || !appState.roadmap[stepIndex]) return;
    const stepData = appState.roadmap[stepIndex];

    if (modalTitle && modalTag && modalDescription && modalOverlay) {
      modalTag.textContent = `Step 0${stepData.step}`;
      modalTitle.textContent = stepData.title;
      modalDescription.textContent = stepData.description;

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
     5. Mobile Navigation Sidebar
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
     6. Run Application
     ========================================================================== */
  initializeTheme();
  routePage();
});
