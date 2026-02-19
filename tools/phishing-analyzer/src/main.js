import './style.css';
import { PhishingAnalyzer } from './analyzer';

// Simple icon fallback - using SVG strings instead of lucide
const icons = {
  shield: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
  search: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>',
  'alert-circle': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>',
  check: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
  copy: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>',
  'rotate-ccw': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 4v6h6M3.51 15a9 9 0 102.13-9.36L1 10"></path></svg>',
  sun: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>',
  moon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>',
  link: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>',
  lock: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>',
  server: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>',
  globe: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>',
  'alert-triangle': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>',
  'git-merge': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>',
  'align-left': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h16"></path></svg>',
  'minimize-2': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>',
  shuffle: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h5v5M4 9l5-5m11 11h-5v5m5-5l-5 5M4 16l5-5m11 5l-5-5"></path></svg>',
  'shield-alert': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>',
  'check-circle': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
  , 'file-text': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 2v6h6"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 13h8M8 17h8"></path></svg>'
  , 'clock': '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l2 2m10-2a10 10 0 11-20 0 10 10 0 0120 0z"></path></svg>'
};

// Function to replace data-lucide attributes with SVG
function replaceLucideIcons() {
  document.querySelectorAll('i[data-lucide]').forEach(element => {
    const iconName = element.getAttribute('data-lucide');
    if (icons[iconName]) {
      const temp = document.createElement('div');
      temp.innerHTML = icons[iconName];
      const svg = temp.firstElementChild;

      if (svg) {
        // Transfer all classes from the placeholder to the SVG
        if (element.className) {
          svg.setAttribute('class', element.className);
        }

        // Transfer ID if present
        if (element.id) {
          svg.setAttribute('id', element.id);
        }

        // Preserve data-lucide attribute for future selections
        svg.setAttribute('data-lucide', iconName);

        // Replace the placeholder with the new SVG
        element.replaceWith(svg);
      }
    }
  });
}

const analyzer = new PhishingAnalyzer();

// Initialize theme on page load
function initializeTheme() {
  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Update icons based on initial theme then replace placeholder icons
  updateThemeIcons();
  replaceLucideIcons();
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  setupModals();
});

// Modal Logic
function setupModals() {
  const modals = ['privacy', 'terms'];

  modals.forEach(id => {
    const modal = document.getElementById(`${id}-modal`);
    const openBtn = document.getElementById(`open-${id}`);

    if (!modal || !openBtn) return;

    const backdrop = modal.querySelector('.modal-backdrop');
    const panel = modal.querySelector('.modal-panel');
    const closeBtns = modal.querySelectorAll('.close-modal');

    // Open
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.remove('hidden');
      // small delay to allow display:block to apply before opacity transition
      setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        backdrop.classList.add('opacity-100');
        panel.classList.remove('opacity-0', 'scale-95');
        panel.classList.add('opacity-100', 'scale-100');
      }, 10);
    });

    // Close function
    const closeModal = () => {
      backdrop.classList.remove('opacity-100');
      backdrop.classList.add('opacity-0');
      panel.classList.remove('opacity-100', 'scale-100');
      panel.classList.add('opacity-0', 'scale-95');

      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300); // match transition duration
    };

    // Close events
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

    // Close on backdrop click (the wrapper div handles the click outside via padding)
    // The backdrop div itself might be behind the panel container in HTML structure z-index stack
    // Simpler check: if click target is the container itself (which has the padding) or the backdrop
    modal.addEventListener('click', (e) => {
      // The modal container (w-screen overflow-y-auto) catches clicks outside the panel
      // We need to check if the click was ON the background wrapper, not inside the panel
      // The panel is inside a child div.

      // Actually, in my HTML structure:
      // modal (fixed inset-0 z-100)
      //   -> backdrop (fixed inset-0)
      //   -> container (fixed inset-0 z-10 w-screen overflow-y-auto)
      //      -> flex wrapper
      //         -> panel

      // Clicks on the 'container' or 'flex wrapper' are "outside".
      // Since the panel stops propagation or we check target...

      // Let's use a simpler approach: check if the click target is NOT inside .modal-panel
      if (!e.target.closest('.modal-panel')) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
  });
}


// DOM Elements
const urlInput = document.getElementById('url-input');
const analyzeBtn = document.getElementById('analyze-btn');
const loadingState = document.getElementById('loading-state');
const resultsDashboard = document.getElementById('results-dashboard');
const errorMsg = document.getElementById('error-msg');
const checksGrid = document.getElementById('checks-grid');

const scoreCircle = document.getElementById('score-circle');
const riskScoreDisplay = document.getElementById('risk-score');
const riskLevelDisplay = document.getElementById('risk-level');
const resultUrlDisplay = document.getElementById('result-url');
const themeToggle = document.getElementById('theme-toggle');

// Theme Toggle
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  // Save theme preference
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  // Update icons immediately after theme change
  updateThemeIcons();
  replaceLucideIcons();
});

// Function to update theme icons
// Function to update theme icons
function updateThemeIcons() {
  // logic handled by tailwind classes (dark:hidden, dark:block)
}

// Analyze Button Click
analyzeBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();

  // Basic validation check
  if (!url || !url.includes('.')) {
    showError("Please enter a valid URL (e.g., example.com)");
    return;
  }

  hideError();
  startLoading();

  try {
    const results = await analyzer.analyze(url);
    stopLoading();
    displayResults(results);
  } catch (error) {
    stopLoading();
    showError("Analysis failed. Please try again.");
  }
});

// Enter key support
urlInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const url = urlInput.value.trim();

    // Basic validation check
    if (!url || !url.includes('.')) {
      showError("Please enter a valid URL (e.g., example.com)");
      return;
    }

    hideError();
    startLoading();

    try {
      const results = await analyzer.analyze(url);
      stopLoading();
      displayResults(results);
    } catch (error) {
      stopLoading();
      showError("Analysis failed. Please try again.");
    }
  }
});

// Copy Report Button
const copyReportBtn = document.getElementById('copy-report-btn');
if (copyReportBtn) {
  copyReportBtn.addEventListener('click', () => {
    const risk = riskLevelDisplay.textContent;
    const score = riskScoreDisplay.textContent;
    const url = resultUrlDisplay.innerText;

    const text = `Phishing Analysis Report\nURL: ${url}\nRisk Level: ${risk}\nScore: ${score}/100\n\nGenerated by CyberEDT Phishing Analyzer`;

    navigator.clipboard.writeText(text).then(() => {
      const originalText = copyReportBtn.innerHTML;
      copyReportBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Copied!';
      setTimeout(() => {
        copyReportBtn.innerHTML = originalText;
        replaceLucideIcons();
      }, 2000);
    });
  });
}


// Helper Functions

function showError(msg) {
  errorMsg.classList.remove('hidden');
  errorMsg.querySelector('span').textContent = msg;
  urlInput.classList.add('border-cyber-red');
}

function hideError() {
  errorMsg.classList.add('hidden');
  urlInput.classList.remove('border-cyber-red');
}

function startLoading() {
  loadingState.classList.remove('hidden');
  resultsDashboard.classList.add('hidden');
  analyzeBtn.disabled = true;
  analyzeBtn.innerHTML = '<div class="loader w-4 h-4 border-2"></div> Analysing...';
}

function stopLoading() {
  loadingState.classList.add('hidden');
  analyzeBtn.disabled = false;
  analyzeBtn.innerHTML = '<i data-lucide="search" class="w-5 h-5"></i> <span>Analyze URL</span>';
  replaceLucideIcons(); // Re-init icons for the button
}

function displayResults(result) {
  resultsDashboard.classList.remove('hidden');

  // URL Display
  resultUrlDisplay.textContent = result.url;
  resultUrlDisplay.href = result.url.startsWith('http') ? result.url : `http://${result.url}`;

  // Score Animation
  let score = result.riskScore;
  let level = result.riskLevel;

  animateScore(score);

  // Risk Level Text
  riskLevelDisplay.textContent = level;
  riskLevelDisplay.className = `text-2xl font-bold ${getRiskColorClass(level)}`;
  riskScoreDisplay.textContent = score;

  // Display Domain Details
  if (result.domainInfo) {
    displayDomainDetails(result.domainInfo);
  }

  // Render Checks Grid
  checksGrid.innerHTML = '';

  result.checks.forEach(check => {
    const card = document.createElement('div');
    card.className = `glass p-6 border-t-4 ${getStatusBorder(check.status)} hover:translate-y-[-5px] transition-transform duration-300`;

    const iconName = getIconForCheck(check.id);

    card.innerHTML = `
        <div class="flex items-start justify-between mb-4">
           <div class="p-3 rounded-lg ${getStatusBg(check.status)}">
             <i data-lucide="${iconName}" class="${getStatusColor(check.status)} w-6 h-6"></i>
           </div>
           <span class="text-xs font-bold uppercase ${getStatusColor(check.status)} border border-current px-2 py-1 rounded">${check.status === 'safe' ? 'PASSED' : 'RISK'}</span>
        </div>
        <h3 class="font-bold text-lg mb-2 text-text-primary">${check.name}</h3>
        <p class="text-sm text-text-secondary leading-relaxed">${check.message}</p>
      `;
    checksGrid.appendChild(card);
  });

  replaceLucideIcons();

  // Scroll to results
  resultsDashboard.scrollIntoView({ behavior: 'smooth' });
}

// Display domain details
function displayDomainDetails(domainInfo) {
  // Create domain details section if it doesn't exist
  let domainDetailsSection = document.getElementById('domain-details');
  if (!domainDetailsSection) {
    domainDetailsSection = document.createElement('div');
    domainDetailsSection.id = 'domain-details';
    domainDetailsSection.className = 'glass p-6 mb-8 border-t-4 border-blue-500';

    domainDetailsSection.innerHTML = `
      <h3 class="text-xl font-bold mb-4 text-text-primary flex items-center gap-2">
        <i data-lucide="globe" class="w-5 h-5"></i>
        Domain Information
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-surface p-4 rounded-lg">
          <h4 class="font-semibold text-text-primary mb-2">Domain Details</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-text-secondary">Domain:</span>
              <span class="text-text-primary font-mono">${domainInfo.domain}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Main Domain:</span>
              <span class="text-text-primary font-mono">${domainInfo.mainDomain}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">TLD:</span>
              <span class="text-text-primary font-mono">${domainInfo.tld}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Subdomains:</span>
              <span class="text-text-primary font-mono">${domainInfo.subdomains.length > 0 ? domainInfo.subdomains.join('.') : 'None'}</span>
            </div>
          </div>
        </div>
        <div class="bg-surface p-4 rounded-lg">
          <h4 class="font-semibold text-text-primary mb-2">Registration Info</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-text-secondary">Registered:</span>
              <span class="text-text-primary font-mono">${domainInfo.registrationDate}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Age:</span>
              <span class="text-text-primary font-mono">${domainInfo.age}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Registrar:</span>
              <span class="text-text-primary font-mono">${domainInfo.registrar}</span>
            </div>
          </div>
        </div>
        <div class="bg-surface p-4 rounded-lg">
          <h4 class="font-semibold text-text-primary mb-2">Hosting & Location</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-text-secondary">Hosting:</span>
              <span class="text-text-primary font-mono">${domainInfo.hosting}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Country:</span>
              <span class="text-text-primary font-mono">${domainInfo.country}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-text-secondary">Security Level:</span>
              <span class="text-text-primary font-mono">${domainInfo.securityLevel}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert domain details after the score card
    const scoreCard = document.querySelector('.glass.p-8');
    if (scoreCard && scoreCard.parentNode) {
      scoreCard.parentNode.insertBefore(domainDetailsSection, scoreCard.nextSibling);
    }
  }
}

function animateScore(targetScore) {
  // reset
  scoreCircle.style.strokeDashoffset = 351.86;

  // calculate offset
  const circumference = 351.86;
  const offset = circumference - (targetScore / 100) * circumference;

  // Set color based on score
  if (targetScore >= 70) {
    scoreCircle.classList.remove('text-success', 'text-warning');
    scoreCircle.classList.add('text-danger');
  } else if (targetScore >= 30) {
    scoreCircle.classList.remove('text-success', 'text-danger');
    scoreCircle.classList.add('text-warning');
  } else {
    scoreCircle.classList.remove('text-danger', 'text-warning');
    scoreCircle.classList.add('text-success');
  }

  // Slight delay to allow transition
  setTimeout(() => {
    scoreCircle.style.strokeDashoffset = offset;
  }, 100);
}

function getRiskColorClass(level) {
  if (level === 'High Risk') return 'text-danger';
  if (level === 'Suspicious') return 'text-warning';
  return 'text-success';
}

function getStatusBorder(status) {
  if (status === 'danger') return 'border-danger';
  if (status === 'warning') return 'border-warning';
  return 'border-success';
}

function getStatusBg(status) {
  if (status === 'danger') return 'bg-danger/10';
  if (status === 'warning') return 'bg-warning/10';
  return 'bg-success/10';
}

function getStatusColor(status) {
  if (status === 'danger') return 'text-danger';
  if (status === 'warning') return 'text-warning';
  return 'text-success';
}

function getIconForCheck(id) {
  const map = {
    'ssl': 'lock',
    'ip': 'globe',
    'tld': 'server',
    'subdomain': 'git-merge',
    'brand': 'alert-triangle',
    'keywords': 'search',
    'length': 'align-left',
    'shortener': 'minimize-2',
    'redirect': 'shuffle',
    'homograph': 'shield-alert',
    'known-phishing': 'alert-triangle',
    'port': 'server',
    'extension': 'file-text',
    'reputation': 'clock'
  };
  return map[id] || 'check-circle';
}
