// ===================================
// MAIN JAVASCRIPT - ENHANCED
// Professional portfolio interactions
// ===================================

import { Typewriter } from "./components/typewriter.js";

/**
 * EmailJS Configuration
 * Send email through contact form
 */
function sendMail(e) {
  e.preventDefault(); // Prevent form from submitting normally
  
  const submitBtn = document.querySelector('#contactForm button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Disable button and show loading
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  submitBtn.classList.add('loading');

  // Get form values
  let params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  // Send email using EmailJS
  emailjs.send("service_e1fi8wq", "template_ihkralo", params)
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
      
      // Show success message
      showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
      
      // Reset form
      document.getElementById("contactForm").reset();
      
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.classList.remove('loading');
    })
    .catch(function(error) {
      console.log('FAILED...', error);
      
      // Show error message
      showNotification('Failed to send message. Please try again or email me directly.', 'error');
      
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.classList.remove('loading');
    });
}

/**
 * Show notification message
 */
function showNotification(message, type) {
  // Remove existing notifications
  const existing = document.querySelector('.notification-message');
  if (existing) existing.remove();

  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification-message ${type}`;
  notification.textContent = message;
  
  // Insert at top of form
  const form = document.getElementById('contactForm');
  form.insertBefore(notification, form.firstChild);
  
  // Show with animation
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

/**
 * Main App Class
 * Centralized control for all portfolio features
 */
class PortfolioApp {
  constructor() {
    this.state = {
      isScrolling: false,
      scrollTimeout: null,
      headerVisible: true,
      lastScrollPosition: 0,
      activeFilter: 'all',
      isDarkMode: false,
      typewriterInstance: null
    };

    this.config = {
      scrollThreshold: 100,
      scrollDebounce: 150,
      animationDelay: 100,
      skillBarDelay: 1500
    };

    this.init();
  }

  /**
   * Initialize all features
   */
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  /**
   * Setup all features
   */
  setup() {
    this.initTypewriter();
    this.initNavigation();
    this.initHeader();
    this.initProjectFilters();
    this.initContactForm();
    this.initSmoothScroll();
    this.initSkillBars();
    this.initScrollAnimations();
    this.initBackToTop();
    this.initThemeToggle();
    this.initLazyLoading();
    this.initModals();
    this.initParallax();
    this.initTooltips();
    this.addKeyboardNavigation();
    this.addPerformanceMonitoring();
    
    console.log('✓ Portfolio initialized successfully');
  }

  // ===================================
  // TYPEWRITER EFFECT
  // ===================================
  initTypewriter() {
    const typewriterEl = document.querySelector('#typewriter');
    if (!typewriterEl) return;

    try {
      this.state.typewriterInstance = new Typewriter('#typewriter', {
        words: typewriterEl.getAttribute('data-words') 
          ? JSON.parse(typewriterEl.getAttribute('data-words'))
          : ['Web Developer', 'Designer', 'Creator'],
        typeSpeed: 100,
        deleteSpeed: 60,
        delayBetweenWords: 1500,
        loop: true,
        cursor: true
      });
    } catch (error) {
      console.warn('Typewriter initialization failed:', error);
    }
  }

  // ===================================
  // NAVIGATION
  // ===================================
  initNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const navOverlay = document.querySelector('.nav-overlay') || this.createNavOverlay();

    if (!mobileMenuToggle || !nav) return;

    // Toggle menu
    mobileMenuToggle.addEventListener('click', () => {
      const isActive = nav.classList.toggle('active');
      navOverlay.classList.toggle('active', isActive);
      mobileMenuToggle.classList.toggle('active', isActive);
      
      // Update icon
      const icon = mobileMenuToggle.querySelector('span');
      if (icon) {
        icon.textContent = isActive ? '✕' : '☰';
      }
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? 'hidden' : '';
      
      // Announce to screen readers
      mobileMenuToggle.setAttribute('aria-expanded', isActive);
    });

    // Close menu on link click
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu(nav, navOverlay, mobileMenuToggle);
      });
    });

    // Close menu on overlay click
    navOverlay.addEventListener('click', () => {
      this.closeMenu(nav, navOverlay, mobileMenuToggle);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        this.closeMenu(nav, navOverlay, mobileMenuToggle);
      }
    });

    // Highlight active page
    this.highlightActivePage();
  }

  createNavOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    return overlay;
  }

  closeMenu(nav, overlay, toggle) {
    nav.classList.remove('active');
    overlay.classList.remove('active');
    toggle.classList.remove('active');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
    
    const icon = toggle.querySelector('span');
    if (icon) icon.textContent = '☰';
  }

  highlightActivePage() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath) {
        link.classList.add('active');
      }
    });
  }

  // ===================================
  // HEADER EFFECTS
  // ===================================
  initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    let ticking = false;

    const updateHeader = () => {
      const currentScroll = window.pageYOffset;

      // Add/remove scrolled class
      if (currentScroll > this.config.scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide/show on scroll direction
      if (currentScroll > lastScroll && currentScroll > 200) {
        // Scrolling down
        header.classList.add('hide');
        header.classList.remove('show');
      } else {
        // Scrolling up
        header.classList.remove('hide');
        header.classList.add('show');
      }

      lastScroll = currentScroll;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    // Initialize progress bar
    this.initHeaderProgress();
  }

  initHeaderProgress() {
    const progressBar = document.querySelector('.header-progress');
    if (!progressBar) return;

    let ticking = false;

    const updateProgress = () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.pageYOffset / windowHeight) * 100;
      progressBar.style.width = `${scrolled}%`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
  }

  // ===================================
  // PROJECT FILTERS
  // ===================================
  initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length === 0 || projectCards.length === 0) return;

    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        this.state.activeFilter = filterValue;
        
        // Filter projects with staggered animation
        this.filterProjects(filterValue, projectCards);
        
        // Add ripple effect
        this.createRipple(e, button);
      });
    });

    // Keyboard navigation for filters
    this.addFilterKeyboardNav(filterButtons);
  }

  filterProjects(filter, cards) {
    let delay = 0;

    cards.forEach((card, index) => {
      const category = card.getAttribute('data-category');
      const shouldShow = filter === 'all' || category === filter;

      if (shouldShow) {
        setTimeout(() => {
          card.style.display = 'block';
          card.style.animation = 'fadeInUp 0.5s ease both';
        }, delay);
        delay += this.config.animationDelay;
      } else {
        card.style.animation = 'fadeOut 0.3s ease both';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });

    // Update count
    this.updateProjectCount(filter, cards);
  }

  updateProjectCount(filter, cards) {
    const countElement = document.querySelector('.projects-count');
    if (!countElement) return;

    const visibleCount = Array.from(cards).filter(card => {
      const category = card.getAttribute('data-category');
      return filter === 'all' || category === filter;
    }).length;

    countElement.textContent = `Showing ${visibleCount} project${visibleCount !== 1 ? 's' : ''}`;
  }

  addFilterKeyboardNav(buttons) {
    buttons.forEach((button, index) => {
      button.addEventListener('keydown', (e) => {
        let targetIndex = index;

        if (e.key === 'ArrowRight') {
          targetIndex = (index + 1) % buttons.length;
        } else if (e.key === 'ArrowLeft') {
          targetIndex = (index - 1 + buttons.length) % buttons.length;
        } else {
          return;
        }

        e.preventDefault();
        buttons[targetIndex].focus();
        buttons[targetIndex].click();
      });
    });
  }

  createRipple(event, button) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }

  // ===================================
  // CONTACT FORM - UPDATED WITH EMAILJS
  // ===================================
  initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Attach sendMail function to form submit
    form.addEventListener('submit', sendMail);

    // Real-time validation
    this.addFormValidation(form);
  }

  addFormValidation(form) {
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          this.validateField(input);
        }
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    } else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email';
      }
    }

    if (isValid) {
      field.classList.remove('invalid');
      field.classList.add('valid');
      this.removeErrorMessage(field);
    } else {
      field.classList.add('invalid');
      field.classList.remove('valid');
      this.showFieldError(field, errorMessage);
    }
  }

  showFieldError(field, message) {
    this.removeErrorMessage(field);
    
    const error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    field.parentNode.appendChild(error);
  }

  removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  }

  // ===================================
  // SMOOTH SCROLL
  // ===================================
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        
        if (!href || href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          history.pushState(null, null, href);
        }
      });
    });
  }

  // ===================================
  // SKILL BARS ANIMATION
  // ===================================
  initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length === 0) return;

    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          this.animateSkillBar(entry.target);
          entry.target.classList.add('animated');
        }
      });
    }, observerOptions);

    skillBars.forEach(bar => observer.observe(bar));
  }

  animateSkillBar(bar) {
    const targetWidth = bar.style.width || bar.getAttribute('data-width') || '0%';
    bar.style.width = '0';
    
    setTimeout(() => {
      bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
      bar.style.width = targetWidth;
    }, 100);
  }

  // ===================================
  // SCROLL ANIMATIONS
  // ===================================
  initScrollAnimations() {
    const elements = document.querySelectorAll(
      '.card, .feature-card, .timeline-item, .project-card, .footer-section'
    );

    if (!('IntersectionObserver' in window) || elements.length === 0) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    elements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(element);
    });
  }

  // ===================================
  // BACK TO TOP BUTTON
  // ===================================
  initBackToTop() {
    let backToTop = document.querySelector('.back-to-top');
    
    if (!backToTop) {
      backToTop = this.createBackToTopButton();
    }

    let ticking = false;

    const updateButton = () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateButton);
        ticking = true;
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  createBackToTopButton() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    button.innerHTML = '↑';
    document.body.appendChild(button);
    return button;
  }

  // ===================================
  // THEME TOGGLE
  // ===================================
  initThemeToggle() {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      toggle.textContent = '🌙';
    }

    toggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      
      toggle.textContent = isLight ? '🌙' : '☀️';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      
      // Announce to screen readers
      toggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    });
  }

  // ===================================
  // LAZY LOADING
  // ===================================
  initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (!('IntersectionObserver' in window) || images.length === 0) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // ===================================
  // MODALS
  // ===================================
  initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal-overlay');

    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
          this.openModal(modal);
        }
      });
    });

    modals.forEach(modal => {
      const closeBtn = modal.querySelector('.modal-close');
      
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal(modal));
      }

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal);
        }
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modals.forEach(modal => this.closeModal(modal));
      }
    });
  }

  openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus first focusable element
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  }

  closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ===================================
  // PARALLAX EFFECT
  // ===================================
  initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length === 0) return;

    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-parallax') || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ===================================
  // TOOLTIPS
  // ===================================
  initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        this.showTooltip(e.target);
      });
      
      element.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  }

  showTooltip(element) {
    const text = element.getAttribute('data-tooltip');
    if (!text) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;

    setTimeout(() => tooltip.classList.add('show'), 10);
  }

  hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) tooltip.remove();
  }

  // ===================================
  // KEYBOARD NAVIGATION
  // ===================================
  addKeyboardNavigation() {
    // Skip to main content link
    const skipLink = document.querySelector('.skip-to-main');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const main = document.querySelector('main');
        if (main) {
          main.setAttribute('tabindex', '-1');
          main.focus();
        }
      });
    }

    // Escape key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close any open menus, modals, etc.
        this.closeAllOverlays();
      }
    });
  }

  closeAllOverlays() {
    // Close mobile menu
    const nav = document.querySelector('.nav');
    const overlay = document.querySelector('.nav-overlay');
    const toggle = document.querySelector('.mobile-menu-toggle');
    if (nav && nav.classList.contains('active')) {
      this.closeMenu(nav, overlay, toggle);
    }

    // Close modals
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      this.closeModal(modal);
    });
  }

  // ===================================
  // PERFORMANCE MONITORING
  // ===================================
  addPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              console.warn('Slow operation detected:', entry.name, entry.duration);
            }
          });
        });
        
        observer.observe({ entryTypes: ['measure'] });
      } catch (e) {
        // Performance Observer not supported
      }
    }
  }

  // ===================================
  // UTILITY METHODS
  // ===================================
  debounce(func, wait) {
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

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// ===================================
// INITIALIZE APP
// ===================================
const app = new PortfolioApp();

// Export for external use
export default app;