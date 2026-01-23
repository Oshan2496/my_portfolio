// ===================================
// MAIN JAVASCRIPT FILE
// ===================================

import { initTypewriter } from "./components/typewriter.js";

document.addEventListener("DOMContentLoaded", function () {

  // ===================================
  initTypewriter("#typewriter");

  // ===================================
  // MOBILE NAVIGATION TOGGLE
  // ===================================
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const nav = document.querySelector(".nav");

  if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener("click", function () {
      nav.classList.toggle("active");

      // Change icon
      mobileMenuToggle.textContent = nav.classList.contains("active") ? "✕" : "☰";
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        nav.classList.remove("active");
        mobileMenuToggle.textContent = "☰";
      });
    });
  }

  // ===================================
  // STICKY HEADER ON SCROLL
  // ===================================
  const header = document.querySelector(".header");

  if (header) {
    window.addEventListener("scroll", function () {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // ===================================
  // PROJECT FILTER FUNCTIONALITY
  // ===================================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");

        const filterValue = this.getAttribute("data-filter");

        projectCards.forEach((card) => {
          const category = card.getAttribute("data-category");

          if (filterValue === "all" || category === filterValue) {
            card.style.display = "block";
            card.style.animation = "fadeIn 0.5s ease-in-out";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // ===================================
  // CONTACT FORM SUBMISSION
  // ===================================
  const contactForm = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");

  if (contactForm && successMessage) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = {
        name: document.getElementById("name")?.value || "",
        email: document.getElementById("email")?.value || "",
        subject: document.getElementById("subject")?.value || "",
        message: document.getElementById("message")?.value || "",
      };

      console.log("Form submitted:", formData);

      successMessage.classList.add("show");
      contactForm.reset();

      setTimeout(() => {
        successMessage.classList.remove("show");
      }, 5000);
    });
  }

  // ===================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ===================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href && href !== "#") {
        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  // ===================================
  // SKILL BARS ANIMATION ON SCROLL
  // ===================================
  const skillBars = document.querySelectorAll(".skill-progress");

  if (skillBars.length > 0) {
    const animateSkillBars = () => {
      skillBars.forEach((bar) => {
        const barTop = bar.getBoundingClientRect().top;
        const barBottom = bar.getBoundingClientRect().bottom;

        if (barTop < window.innerHeight && barBottom >= 0) {
          if (!bar.classList.contains("animated")) {
            const originalWidth = bar.style.width || "0%";
            bar.style.width = "0";

            setTimeout(() => {
              bar.style.transition = "width 1.5s ease-in-out";
              bar.style.width = originalWidth;
            }, 100);

            bar.classList.add("animated");
          }
        }
      });
    };

    window.addEventListener("scroll", animateSkillBars);
    animateSkillBars();
  }

  // ===================================
  // FADE IN ANIMATION ON SCROLL
  // ===================================
  const fadeElements = document.querySelectorAll(".card, .feature-card, .timeline-item");

  if ("IntersectionObserver" in window && fadeElements.length > 0) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target); 
        }
      });
    }, observerOptions);

    fadeElements.forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
      observer.observe(element);
    });
  }

  // ===================================
  // MODAL FUNCTIONALITY (if needed)
  // ===================================
  const modalOverlays = document.querySelectorAll(".modal-overlay");

  if (modalOverlays.length > 0) {
    modalOverlays.forEach((overlay) => {
      const closeBtn = overlay.querySelector(".modal-close");

      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          overlay.classList.remove("active");
        });
      }

      overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
          overlay.classList.remove("active");
        }
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        modalOverlays.forEach((overlay) => overlay.classList.remove("active"));
      }
    });
  }

});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Add fadeIn animation to CSS dynamically
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
