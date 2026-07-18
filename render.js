/**
 * UITS Course Mastery - UI Template Rendering Functions
 * Author: Antigravity AI & oU1TS Community
 * Language: ES6+ (Vanilla JS)
 */

(function () {
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

  // Render Homepage
  function renderHome(data) {
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
  }

  // Render Discussions Page
  function renderDiscussions(data) {
    const discussions = data.discussions || [];
    let cardsHtml = '';

    if (discussions.length === 0) {
      cardsHtml = '<p class="no-data">No recorded peer classes or lectures available yet.</p>';
    } else {
      discussions.forEach(item => {
        cardsHtml += `
          <div class="discussion-card">
            <div class="card-header">
              <span class="semester-tag">${escapeHTML(item.semester)}</span>
            </div>
            <h3 class="course-name">${escapeHTML(item.course)}</h3>
            <p class="instructor-name">Guided by: <strong>${escapeHTML(item.instructor)}</strong></p>
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

    return `
      <section class="page-section fade-in" id="discussions-view">
        <div class="section-header">
          <span class="section-tag">Peer Learning</span>
          <h2 class="section-title">Recorded Classes & Lectures</h2>
          <p class="section-desc">Access direct study session recordings and co-created lecture notes compiled by seniors.</p>
        </div>
        <div class="discussions-grid">
          ${cardsHtml}
        </div>
      </section>
    `;
  }

  // Render Resources Page
  function renderResources(data) {
    const resources = data.resources || [];
    let categoriesHtml = '';

    if (resources.length === 0) {
      categoriesHtml = '<p class="no-data">No resources curated at this moment.</p>';
    } else {
      resources.forEach(category => {
        let itemsHtml = '';
        category.items.forEach(item => {
          itemsHtml += `
            <div class="resource-card">
              <h4 class="resource-title">${escapeHTML(item.title)}</h4>
              <p class="resource-desc">${escapeHTML(item.description)}</p>
              <a href="${escapeHTML(item.url)}" class="resource-link" target="_blank" rel="noopener noreferrer">
                <span>Access Resource</span>
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
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
  }

  // Render About Us Page
  function renderAbout(data) {
    const about = data.about || {};
    const features = about.features || [];
    let pointsHtml = '';

    features.forEach(feat => {
      pointsHtml += `
        <div class="about-point-card">
          <h4 class="point-title">${escapeHTML(feat.title)}</h4>
          <p class="point-desc">${escapeHTML(feat.description)}</p>
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
  }

  // Render Join Us Page
  function renderJoin(data) {
    const join = data.join || {};
    const instructions = join.instructions || [];
    let instructionsHtml = '';

    instructions.forEach((inst, index) => {
      instructionsHtml += `
        <div class="join-step-card">
          <div class="join-step-number">0${index + 1}</div>
          <div class="join-step-content">
            <h4 class="join-step-title">${escapeHTML(inst.title)}</h4>
            <p class="join-step-desc">${escapeHTML(inst.description)}</p>
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

  // Export globally
  window.Render = {
    home: renderHome,
    discussions: renderDiscussions,
    resources: renderResources,
    about: renderAbout,
    join: renderJoin
  };
})();
