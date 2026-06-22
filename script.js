/* ============================================
   SRUJANA REDDI — Portfolio JavaScript
   Terminal Loading · Navbar · Counters · Reveal
   ============================================ */

(function () {
  'use strict';

  // ──────────────────────────────────────────
  // 1. TERMINAL LOADING ANIMATION
  // ──────────────────────────────────────────
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent   = document.getElementById('main-content');
  const progressFill  = document.getElementById('progress-fill');
  const progressBar   = document.getElementById('terminal-progress');
  const lines         = document.querySelectorAll('.terminal-line');

  function typeText(element, text, speed) {
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        element.textContent = text.slice(0, i + 1);
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
  }

  async function runTerminalSequence() {
    const delays   = [0, 600, 1200, 1800, 2600];
    const typeSpeed = 30;

    // Show progress bar immediately
    progressBar.classList.add('visible');

    for (let idx = 0; idx < lines.length; idx++) {
      await new Promise((r) => setTimeout(r, idx === 0 ? 300 : delays[idx] - delays[idx - 1]));

      const line    = lines[idx];
      const textEl  = line.querySelector('.text');
      const fullText = textEl.getAttribute('data-text');

      line.classList.add('visible');

      // Remove cursor from previous line
      if (idx > 0) {
        const prevCursor = lines[idx - 1].querySelector('.cursor-blink');
        if (prevCursor) prevCursor.remove();
      }

      await typeText(textEl, fullText, typeSpeed);

      // Update progress
      const pct = Math.min(((idx + 1) / lines.length) * 100, 100);
      progressFill.style.width = pct + '%';
    }

    // Small pause after last line
    await new Promise((r) => setTimeout(r, 500));

    // Remove last cursor
    const lastCursor = lines[lines.length - 1].querySelector('.cursor-blink');
    if (lastCursor) lastCursor.remove();

    // Transition out
    loadingScreen.classList.add('fade-out');
    mainContent.classList.add('visible');

    // Clean up loading screen after transition
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 900);
  }

  // Start loading animation
  runTerminalSequence();

  // ──────────────────────────────────────────
  // 2. NAVBAR
  // ──────────────────────────────────────────
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('nav-hamburger');
  const mobileMenu  = document.getElementById('nav-mobile');
  const navLinksAll  = document.querySelectorAll('.nav-link');
  const sections    = document.querySelectorAll('section[id]');

  // Scroll → add background
  function handleNavScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', !isOpen);
    if (isOpen) {
      mobileMenu.classList.remove('open');
    } else {
      mobileMenu.classList.add('open');
    }
  });

  // Close mobile menu on link click
  navLinksAll.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Active section highlighting via IntersectionObserver
  const observerNavOptions = {
    root: null,
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0,
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinksAll.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('data-section') === id);
        });
      }
    });
  }, observerNavOptions);

  sections.forEach((section) => navObserver.observe(section));

  // ──────────────────────────────────────────
  // 3. ANIMATED COUNTERS
  // ──────────────────────────────────────────
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let countersRan = false;

  function animateCounters() {
    if (countersRan) return;
    countersRan = true;

    statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1800;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }

  // Trigger counters when stats section becomes visible
  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    counterObserver.observe(statsSection);
  }

  // ──────────────────────────────────────────
  // 4. SCROLL-REVEAL ANIMATIONS
  // ──────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ──────────────────────────────────────────
  // 5. SMOOTH SCROLL for anchor links
  // ──────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ──────────────────────────────────────────
  // 6. INTERACTIVE HOVER CARD TILT (subtle)
  // ──────────────────────────────────────────
  const tiltCards = document.querySelectorAll('.project-card, .skill-category');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ──────────────────────────────────────────
  // 7. CURSOR GLOW EFFECT ON GLASSMORPHISM CARDS
  // ──────────────────────────────────────────
  const glassCards = document.querySelectorAll(
    '.stat-card, .project-card, .cert-card, .skill-category, .achievement-card, .timeline-card'
  );

  glassCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
      card.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(157,78,221,0.06), transparent 60%), var(--bg-glass)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  // ──────────────────────────────────────────
  // 8. KEYBOARD ACCESSIBILITY
  // ──────────────────────────────────────────
  // Ensure nav links are focusable and trigger click on Enter
  navLinksAll.forEach((link) => {
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        link.click();
      }
    });
  });

})();
