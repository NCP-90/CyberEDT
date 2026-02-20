// DOM Content Loaded with error handling and performance optimization
document.addEventListener('DOMContentLoaded', function () {
    // Add skip to content functionality
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Mobile Navigation Toggle with error handling
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const logo = document.querySelector('.logo');
    const logoImg = document.querySelector('.logo-img');

    // Performance: Use passive event listeners where possible
    const passiveOptions = { passive: true };

    // Performance: Debounce scroll and resize events
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
    }, passiveOptions);

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); // Toggle scroll lock
    });

    // Logo refresh behavior (works on all pages with the navbar)
    function refreshPage(e) {
        if (e) e.preventDefault();
        // Force reload from server where possible
        window.location.reload(true);
    }
    if (logo) {
        logo.setAttribute('role', 'button');
        logo.setAttribute('tabindex', '0');
        logo.addEventListener('click', refreshPage);
        logo.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') refreshPage(e); });
    }
    if (logoImg) {
        logoImg.addEventListener('click', refreshPage);
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll'); // Remove scroll lock
        });
    });

    // Enhanced smooth scrolling with Intersection Observer for better performance
    function smoothScrollTo(targetId, duration = 800) {
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 70;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // Smooth scrolling for internal navigation links with enhanced accessibility
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // Only intercept in-page anchors
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                smoothScrollTo(targetId);

                // Update URL without page jump
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }

                // Focus the target element for keyboard users
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus({ preventScroll: true });
                }
            }
        });
    });

    // CTA Button smooth scroll
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = document.querySelector('#education');
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });

        // Keep provider links in sync with current form values
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const gmailLink = document.getElementById('gmail-link');
        const outlookLink = document.getElementById('outlook-link');

        function buildMailPieces() {
            const name = sanitizeInput((nameInput?.value || '').trim());
            const email = sanitizeInput((emailInput?.value || '').trim());
            const message = sanitizeInput((messageInput?.value || '').trim());
            const subject = encodeURIComponent(`New Contact from ${name || 'Visitor'}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            return { subject, body };
        }

        function updateProviderLinks() {
            const { subject, body } = buildMailPieces();
            if (gmailLink) {
                gmailLink.href = `https://mail.google.com/mail/?view=cm&fs=1&to=help@cyberedt.com&su=${subject}&body=${body}`;
            }
            if (outlookLink) {
                outlookLink.href = `https://outlook.office.com/mail/deeplink/compose?to=help@cyberedt.com&subject=${subject}&body=${body}`;
            }
        }

        // Initialize and refresh on input
        updateProviderLinks();
        [nameInput, emailInput, messageInput].forEach(el => {
            if (el) el.addEventListener('input', updateProviderLinks);
        });
    }

    // Education Section Tab Functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // ===== ENHANCED SECURITY & MONITORING SYSTEM =====

    // Security Logger Class
    class SecurityLogger {
        static log(event, details = {}) {
            const logEntry = {
                timestamp: new Date().toISOString(),
                event: event,
                userAgent: navigator.userAgent,
                url: window.location.href,
                sessionId: this.getSessionId(),
                details: details,
                userId: this.getUserId()
            };

            this.sendToLoggingService(logEntry);
            this.storeLocally(logEntry);
        }

        static getSessionId() {
            let sessionId = sessionStorage.getItem('sessionId');
            if (!sessionId) {
                sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                sessionStorage.setItem('sessionId', sessionId);
            }
            return sessionId;
        }

        static getUserId() {
            let userId = localStorage.getItem('userId');
            if (!userId) {
                userId = 'user_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('userId', userId);
            }
            return userId;
        }

        static async sendToLoggingService(logEntry) {
            // API endpoint does not exist in static build.
            // Disabling fetch to prevent 404 errors.
            // console.log('Security Log (Local):', logEntry); 
        }

        static storeLocally(logEntry) {
            try {
                const logs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
                logs.push(logEntry);
                if (logs.length > 100) logs.shift();
                localStorage.setItem('securityLogs', JSON.stringify(logs));
            } catch (error) {
                console.warn('Failed to store security log locally:', error);
            }
        }
    }

    // Rate Limiter Class
    class RateLimiter {
        constructor() {
            this.requests = new Map();
            this.limits = {
                form_submission: { count: 3, window: 60000 },
                api_calls: { count: 10, window: 60000 },
                page_loads: { count: 100, window: 60000 }
            };
        }

        canMakeRequest(type) {
            const now = Date.now();
            const limit = this.limits[type];

            if (!this.requests.has(type)) {
                this.requests.set(type, []);
            }

            const requests = this.requests.get(type);
            const validRequests = requests.filter(time => now - time < limit.window);
            this.requests.set(type, validRequests);

            if (validRequests.length >= limit.count) {
                return false;
            }

            validRequests.push(now);
            return true;
        }

        recordRequest(type) {
            if (!this.canMakeRequest(type)) {
                SecurityLogger.log('rate_limit_exceeded', { type });
                throw new Error('Rate limit exceeded. Please slow down.');
            }
        }
    }

    // Enhanced Contact Form with Security
    const rateLimiter = new RateLimiter();
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            try {
                // Rate limiting check
                rateLimiter.recordRequest('form_submission');

                // Clear previous errors (null-safe)
                document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
                const successEl = document.getElementById('success-message');
                if (successEl) successEl.textContent = '';

                // Get and sanitize form data
                const name = sanitizeInput(document.getElementById('name').value.trim());
                const email = sanitizeInput(document.getElementById('email').value.trim());
                const message = sanitizeInput(document.getElementById('message').value.trim());

                // Validate form data
                const errors = validateForm(name, email, message);

                if (Object.keys(errors).length > 0) {
                    displayErrors(errors);
                    return;
                }

                // Submit by opening user's mail client with prefilled content
                await submitSecureForm(name, email, message);
                SecurityLogger.log('form_submission_success');

            } catch (error) {
                SecurityLogger.log('form_submission_error', { error: error.message });
                const nameErr = document.getElementById('name-error');
                if (nameErr) nameErr.textContent = error.message;
            }
        });
    }

    // Enhanced Security Functions
    function sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<[^>]*>/g, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/[<>'"&]/g, (match) => {
                const entityMap = {
                    '<': '<',
                    '>': '>',
                    '"': '"',
                    "'": '&#x27;',
                    '&': '&'
                };
                return entityMap[match];
            })
            .trim()
            .substring(0, 1000);
    }

    function validateForm(name, email, message) {
        const errors = {};

        // Allow common name characters: letters, spaces, dots, hyphens, apostrophes
        if (!name || name.length < 2 || !/^[a-zA-Z\s.'-]+$/.test(name)) {
            errors.name = 'Please enter your name (letters, spaces, . - \')';
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Lowered minimum message length to reduce friction
        if (!message || message.length < 3 || message.length > 500) {
            errors.message = 'Message must be between 3 and 500 characters';
        }

        // Rate limiting check (reduced wait to 10 seconds for usability)
        const lastSubmission = localStorage.getItem('lastFormSubmission');
        const now = Date.now();
        if (lastSubmission && now - lastSubmission < 10000) {
            errors.general = 'Please wait ~10 seconds before trying again';
        }

        return errors;
    }

    async function submitSecureForm(name, email, message) {
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        // Safer loading state without innerHTML
        submitBtn.textContent = ' Sending...';
        const spinner = document.createElement('span');
        spinner.className = 'loading-spinner';
        submitBtn.prepend(spinner);
        submitBtn.disabled = true;

        try {
            // Build a mailto URL to open user's default mail client
            const to = 'help@cyberedt.com';
            const subject = encodeURIComponent(`New Contact from ${name}`);
            const body = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
            );
            const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}`;

            // Try opening the mail client in a robust way
            let opened = false;
            // Method 1: window.open
            const win = window.open(mailtoUrl, '_self');
            if (win !== null) opened = true;
            // Method 2: programmatic anchor click
            if (!opened) {
                const a = document.createElement('a');
                a.href = mailtoUrl;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                opened = true; // best-effort
            }

            // UI feedback and local rate-limit timestamp
            const successEl = document.getElementById('success-message');
            if (successEl) successEl.textContent = 'Opening your email app...';
            contactForm.reset();
            localStorage.setItem('lastFormSubmission', Date.now());
        } catch (error) {
            console.error('Form submission error:', error);
            const generalErr = document.getElementById('general-error');
            if (generalErr) generalErr.textContent = 'Could not open your email app. Please click the link below or email us at help@cyberedt.com';
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // CSRF Protection
    function getCSRFToken() {
        let token = sessionStorage.getItem('csrfToken');
        if (!token) {
            token = generateCSRFToken();
            sessionStorage.setItem('csrfToken', token);
        }
        return token;
    }

    function generateCSRFToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Enhanced Error Display
    function displayErrors(errors) {
        Object.keys(errors).forEach(key => {
            const errorElement = document.getElementById(`${key}-error`);
            if (errorElement) {
                errorElement.textContent = errors[key];
            }
        });
    }

    // Initialize Security Systems
    document.addEventListener('DOMContentLoaded', function () {
        // Log page load
        SecurityLogger.log('page_load');

        // Update security indicator
        updateSecurityIndicator();
    });

    // Security Indicator
    function updateSecurityIndicator() {
        const indicator = document.getElementById('securityIndicator');
        const status = document.getElementById('securityStatus');

        if (window.location.protocol === 'https:') {
            status.textContent = '🔒 HTTPS Secured';
            indicator.className = 'security-badge secure';
        } else {
            status.textContent = '⚠️ Not Secure';
            indicator.className = 'security-badge insecure';
        }
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.edt-card, .feature-card, .education-card, .service-card, .tool-card');
    animateElements.forEach(el => observer.observe(el));

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function () {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Cursor-following glow effect for cyber-grid
    const cyberGrid = document.querySelector('.cyber-grid');
    if (cyberGrid) {
        cyberGrid.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Update CSS custom properties for cursor position
            this.style.setProperty('--mouse-x', x + 'px');
            this.style.setProperty('--mouse-y', y + 'px');
        });

        // Reset glow position when mouse leaves
        cyberGrid.addEventListener('mouseleave', function () {
            this.style.setProperty('--mouse-x', '50%');
            this.style.setProperty('--mouse-y', '50%');
        });
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.cyber-grid');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });

    // Typing effect for hero title (optional enhancement)
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }

        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }

    // Courses page: Back button handler (no inline JS)
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function () {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.close();
            }
        });
    }

    // Courses page: Coming Soon buttons (no inline JS)
    document.querySelectorAll('.course-btn[data-coming-soon="true"]').forEach(btn => {
        btn.addEventListener('click', function () {
            alert('Course coming soon!');
        });
    });

    // Modal wiring for Defense Services popups
    function wireModal(openId, overlayId, closeId) {
        const openBtn = document.getElementById(openId);
        const overlay = document.getElementById(overlayId);
        const closeBtn = document.getElementById(closeId);
        if (!openBtn || !overlay || !closeBtn) return;
        function openModal() {
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
        function closeModal() {
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
        openBtn.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
        document.addEventListener('keydown', function onKey(e) { if (e.key === 'Escape') closeModal(); });
    }
    wireModal('open-csl-modal', 'csl-modal-overlay', 'csl-modal-close');
    wireModal('open-crl-modal', 'crl-modal-overlay', 'crl-modal-close');
    wireModal('open-pha-modal', 'pha-modal-overlay', 'pha-modal-close');
});

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message show`;
    messageDiv.textContent = message;

    // Insert after contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.insertAdjacentElement('afterend', messageDiv);

        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = function (target, duration = 1000) {
        const targetPosition = target.offsetTop - 70;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    };

    // Override smooth scroll for older browsers
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                smoothScrollPolyfill(target);
            }
        });
    });
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function () {
    // Scroll-dependent operations can be added here if needed
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Preload critical images (if any)
function preloadImages() {
    const imageUrls = [
        // Add any critical image URLs here
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Call preload function
preloadImages();

// Function to open courses page in new tab
function openCoursesPage() {
    window.open('courses.html', '_blank');
}

// Add keyboard navigation support
document.addEventListener('keydown', function (e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Add focus management for accessibility
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function trapFocus(element) {
    const focusableContent = element.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}
