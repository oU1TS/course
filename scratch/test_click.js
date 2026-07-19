const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../data.json');
const appJsPath = path.resolve(__dirname, '../app.js');

console.log('Loading files...');
console.log('data.json path:', dataPath);
console.log('app.js path:', appJsPath);

const dataJsonContent = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Mock Click Listeners Map
const clickListeners = {};
const keydownListeners = {};

// Mock Roadmap Blocks
const roadmapBlocks = dataJsonContent.roadmap.map((step, index) => {
  return {
    getAttribute: (attr) => {
      if (attr === 'data-step-index') return String(index);
      return null;
    },
    addEventListener: (event, cb) => {
      if (event === 'click') clickListeners[index] = cb;
      if (event === 'keydown') keydownListeners[index] = cb;
    }
  };
});

// Setup DOM mock
global.document = {
  body: {
    classList: {
      add: (cls) => console.log(`[DOM] body.classList.add: ${cls}`),
      remove: (cls) => console.log(`[DOM] body.classList.remove: ${cls}`),
      toggle: (cls) => console.log(`[DOM] body.classList.toggle: ${cls}`)
    },
    style: {}
  },
  addEventListener: (event, cb) => {
    if (event === 'DOMContentLoaded') {
      global.domContentLoadedCallback = cb;
    }
  },
  getElementById: (id) => {
    return {
      id: id,
      classList: {
        add: (cls) => console.log(`[DOM] classList.add called on #${id} with: ${cls}`),
        remove: (cls) => console.log(`[DOM] classList.remove called on #${id} with: ${cls}`),
        toggle: (cls) => console.log(`[DOM] classList.toggle called on #${id} with: ${cls}`)
      },
      setAttribute: (name, val) => console.log(`[DOM] setAttribute called on #${id}: ${name}="${val}"`),
      removeAttribute: (name) => console.log(`[DOM] removeAttribute called on #${id}: ${name}`),
      focus: () => console.log(`[DOM] focus called on #${id}`),
      appendChild: (el) => console.log(`[DOM] appendChild called on #${id} (el ID: ${el.id || el.tagName})`),
      style: {},
      addEventListener: () => {},
      set textContent(val) {
        console.log(`[DOM] textContent set on #${id}: "${val.substring(0, 50)}..."`);
      }
    };
  },
  querySelectorAll: (selector) => {
    if (selector === '#main-nav .nav-link') {
      return [
        { getAttribute: () => '#home', classList: { add: () => {}, remove: () => {} }, setAttribute: () => {}, removeAttribute: () => {} }
      ];
    }
    if (selector === '.roadmap-block') {
      return roadmapBlocks;
    }
    return [];
  },
  querySelector: (selector) => {
    return {
      contains: () => false
    };
  },
  createElement: (tagName) => {
    return {
      tagName: tagName,
      style: {},
      classList: {
        add: () => {}
      },
      addEventListener: () => {}
    };
  }
};

global.window = {
  location: {
    hash: '#home'
  },
  scrollTo: () => {},
  matchMedia: () => ({ matches: false }),
  addEventListener: () => {}
};

global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};

global.history = {
  replaceState: () => {}
};

global.fetch = async (url) => {
  return {
    ok: true,
    json: async () => dataJsonContent
  };
};

// Load app.js code and execute it
const appJsCode = fs.readFileSync(appJsPath, 'utf8');
try {
  eval(appJsCode);
  console.log('Loaded and evaluated app.js successfully.');
} catch (err) {
  console.error('Error evaluating app.js:', err);
  process.exit(1);
}

// Trigger DOMContentLoaded
if (global.domContentLoadedCallback) {
  console.log('Triggering DOMContentLoaded...');
  global.domContentLoadedCallback();
} else {
  console.error('DOMContentLoaded callback not registered!');
  process.exit(1);
}

// Wait for async fetch to finish and bind listeners
setTimeout(() => {
  // Test Step 3 Click (index 2)
  console.log('\n--- Testing Step 3 Click ---');
  if (clickListeners[2]) {
    try {
      clickListeners[2]();
      console.log('Step 3 click handler executed successfully.');
    } catch (err) {
      console.error('Error during Step 3 click handler:', err);
    }
  } else {
    console.error('Step 3 click listener not registered!');
  }

  // Test Step 4 Click (index 3)
  console.log('\n--- Testing Step 4 Click ---');
  if (clickListeners[3]) {
    try {
      clickListeners[3]();
      console.log('Step 4 click handler executed successfully.');
    } catch (err) {
      console.error('Error during Step 4 click handler:', err);
    }
  } else {
    console.error('Step 4 click listener not registered!');
  }
}, 100);
