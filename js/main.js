/* ============================================================
   MUDASAR ALI PORTFOLIO - MAIN JAVASCRIPT
   Locomotive Scroll + FormSubmit + Carousel + Animations
   ============================================================ */

/* ======================== LOCOMOTIVE SCROLL INITIALIZATION ======================== */
let locoScroll = null;
try {
  if (typeof LocomotiveScroll !== 'undefined') {
    locoScroll = new LocomotiveScroll({
      lenisOptions: {
        wrapper: window,
        content: document.documentElement,
        lerp: 0.12,
        duration: 0.85,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        normalizeWheel: true,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      }
    });
    window.locomotiveScrollInstance = locoScroll;
  }
} catch (err) {
  console.warn('Locomotive Scroll initialization failed, falling back to standard scroll:', err);
}

/* ======================== 3-SECOND MINIMUM LOADER ======================== */
const LOADER_START_TIME = Date.now();
const MIN_LOADER_MS = 3000; // Mandatory 3 seconds minimum display time

function hideLoader() {
  const elapsed = Date.now() - LOADER_START_TIME;
  const remaining = Math.max(0, MIN_LOADER_MS - elapsed);

  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 700);
    }
  }, remaining);
}

window.addEventListener('load', hideLoader);
// Backup fail-safe
setTimeout(hideLoader, 3500);

/* ======================== PARTICLES.JS (SPIDER WEB EFFECT) ======================== */
function initSpiderWebParticles() {
  if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 38,
          "density": {
            "enable": true,
            "value_area": 950
          }
        },
        "color": {
          "value": "#60a5fa"
        },
        "shape": {
          "type": "circle"
        },
        "opacity": {
          "value": 0.32,
          "random": false
        },
        "size": {
          "value": 2.8,
          "random": true
        },
        "line_linked": {
          "enable": true,
          "distance": 140,
          "color": "#60a5fa",
          "opacity": 0.26,
          "width": 1.0
        },
        "move": {
          "enable": true,
          "speed": 1.3,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false
        }
      },
      "interactivity": {
        "detect_on": "window",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "repulse"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "repulse": {
            "distance": 130,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 3
          }
        }
      },
      "retina_detect": true
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSpiderWebParticles);
} else {
  initSpiderWebParticles();
}

/* ======================== NAVBAR ======================== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
const navLinkItems = document.querySelectorAll('.nav-link');
const MOBILE_NAV_BREAKPOINT = 900;

function isMobileViewport() {
  return window.innerWidth <= MOBILE_NAV_BREAKPOINT;
}

function setMobileMenuOpen(isOpen) {
  if (!hamburger || !navLinks) return;
  hamburger.classList.toggle('open', isOpen);
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('nav-open', isOpen);
}

/* ======================== UNIFIED HIGH-PERFORMANCE SCROLL ENGINE ======================== */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  background: linear-gradient(90deg, #0061FF, #00c6ff);
  z-index: 10000;
  pointer-events: none;
  box-shadow: 0 0 10px rgba(0, 198, 255, 0.85);
  will-change: width;
`;
document.body.appendChild(progressBar);

const scrollToTopBtn = document.getElementById('scrollToTop');

let cachedSections = [];
let cachedMaxScroll = 1;

function updateMetricsCache() {
  const sections = document.querySelectorAll('section[id]');
  cachedSections = Array.from(sections).map(section => ({
    id: section.getAttribute('id'),
    top: section.offsetTop,
    height: section.offsetHeight
  }));
  const docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  cachedMaxScroll = Math.max(1, docH - window.innerHeight);
}

window.addEventListener('resize', updateMetricsCache, { passive: true });
window.addEventListener('load', updateMetricsCache, { passive: true });
updateMetricsCache();
setTimeout(updateMetricsCache, 400);

let scrollTicking = false;
function triggerScrollUpdate() {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      runScrollBatch();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}

function runScrollBatch() {
  let scrolled = 0;
  if (locoScroll) {
    if (typeof locoScroll.lenisInstance?.scroll === 'number') {
      scrolled = Math.max(scrolled, locoScroll.lenisInstance.scroll);
    } else if (typeof locoScroll.scroll?.y === 'number') {
      scrolled = Math.max(scrolled, locoScroll.scroll.y);
    } else if (typeof locoScroll.scroll === 'number') {
      scrolled = Math.max(scrolled, locoScroll.scroll);
    }
  }
  const winY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
  scrolled = Math.max(scrolled, winY);

  // 1. Sticky Navbar
  if (navbar) {
    if (scrolled > 20) {
      if (!navbar.classList.contains('scrolled')) navbar.classList.add('scrolled');
    } else {
      if (navbar.classList.contains('scrolled')) navbar.classList.remove('scrolled');
    }
  }

  // 2. Active Nav Link (Zero forced layout reflow - using cached geometry)
  if (cachedSections.length > 0) {
    const scrollPos = scrolled + window.innerHeight / 3;
    for (let i = 0; i < cachedSections.length; i++) {
      const sec = cachedSections[i];
      if (scrollPos >= sec.top && scrollPos < sec.top + sec.height) {
        navLinkItems.forEach(link => {
          if (link.getAttribute('data-section') === sec.id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        break;
      }
    }
  }

  // 3. Scroll progress bar (Zero forced layout reflow)
  if (cachedMaxScroll > 0) {
    const progress = Math.min(100, Math.max(0, (scrolled / cachedMaxScroll) * 100));
    progressBar.style.width = progress + '%';
  }

  // 4. Scroll To Top Button
  if (scrollToTopBtn) {
    if (scrolled > 200) {
      if (!scrollToTopBtn.classList.contains('visible')) scrollToTopBtn.classList.add('visible');
    } else {
      if (scrollToTopBtn.classList.contains('visible')) scrollToTopBtn.classList.remove('visible');
    }
  }
}

window.addEventListener('scroll', triggerScrollUpdate, { passive: true });
if (locoScroll && typeof locoScroll.on === 'function') {
  locoScroll.on('scroll', triggerScrollUpdate);
}
triggerScrollUpdate();

// Hamburger toggle
if (hamburger && navLinks) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const shouldOpen = !navLinks.classList.contains('open');
    setMobileMenuOpen(shouldOpen);
  });
}

// Close mobile menu on overlay click
if (navOverlay) {
  navOverlay.addEventListener('click', () => {
    setMobileMenuOpen(false);
  });
}

// Close mobile menu on link click
navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    setMobileMenuOpen(false);
  });
});

// Close mobile menu when tapping outside nav
document.addEventListener('click', (event) => {
  if (!isMobileViewport() || !navbar || !navLinks || !hamburger) return;
  if (!navLinks.classList.contains('open')) return;
  if (navbar.contains(event.target)) return;
  setMobileMenuOpen(false);
});

// Keep menu state correct across viewport changes
window.addEventListener('resize', () => {
  if (!isMobileViewport()) setMobileMenuOpen(false);
});

// Close menu on Escape
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMobileMenuOpen(false);
});

/* Smooth scroll for nav links */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#' || href === '') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    if (locoScroll && typeof locoScroll.scrollTo === 'function') {
      locoScroll.scrollTo(target, { offset: -70, duration: 0.9 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ======================== AOS INIT ======================== */
AOS.init({
  duration: 650,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
  disableMutationObserver: true,
});

/* ======================== GSAP SCROLL TRIGGERS ======================== */
const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

if (hasGsap) {
  gsap.registerPlugin(ScrollTrigger);
}

function initHeroAnimations() {
  if (!hasGsap) return;
  // Hero content - stagger entrance
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-greeting', { opacity: 0, y: 30, duration: 0.7 })
    .from('.title-line', { opacity: 0, y: 40, stagger: 0.15, duration: 0.7 }, '-=0.3')
    .from('.title-ampersand', { opacity: 0, scale: 0.5, duration: 0.5 }, '-=0.3')
    .from('.hero-description', { opacity: 0, y: 20, duration: 0.6 }, '-=0.2')
    .from('.hero-buttons .btn', { opacity: 0, y: 20, stagger: 0.15, duration: 0.5 }, '-=0.3')
    .from('.hero-social', { opacity: 0, y: 15, duration: 0.5 }, '-=0.2')
    .from('.hero-image-wrapper', { opacity: 0, scale: 0.85, duration: 0.9, ease: 'back.out(1.7)' }, '-=1')
    .from('.hero-badge', { opacity: 0, scale: 0.5, stagger: 0.2, duration: 0.5 }, '-=0.5')
    .from('.hero-scroll-indicator', { opacity: 0, y: 10, duration: 0.5 }, '-=0.2');
}

/* Service cards are handled by AOS */

/* Stats counters */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    const value = Math.round(eased * target);
    el.textContent = formatNumber(value);

    // Continue loop until fully completed
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = formatNumber(target);
    }
  }
  requestAnimationFrame(update);
}

function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 !== 0 ? 1 : 0) + 'K';
  return n.toString();
}

const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => {
  el.textContent = "0"; // ensure 0 initially
  statsObserver.observe(el);
});

/* ======================== TESTIMONIALS CAROUSEL ======================== */
const testiTrack = document.getElementById('testiTrack');
const testiSlides = Array.from(document.querySelectorAll('.testi-card'));
const testiDotsContainer = document.getElementById('testiDots');
const testiPrevBtn = document.getElementById('testiPrev');
const testiNextBtn = document.getElementById('testiNext');

let currentTesti = 0;
let testiTimer = null;

function getTestiPerView() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function getMaxTestiIndex() {
  const perView = getTestiPerView();
  return Math.max(0, testiSlides.length - perView);
}

function buildTestiDots() {
  if (!testiDotsContainer) return;
  testiDotsContainer.innerHTML = '';
  const maxIdx = getMaxTestiIndex();
  const count = maxIdx + 1;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('button');
    dot.classList.add('testi-dot');
    dot.setAttribute('aria-label', `Review Position ${i + 1}`);
    if (i === currentTesti) dot.classList.add('active');
    dot.addEventListener('click', () => goTesti(i));
    testiDotsContainer.appendChild(dot);
  }
}

function updateTestiDots() {
  document.querySelectorAll('.testi-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentTesti);
  });
}

function goTesti(index) {
  const maxIdx = getMaxTestiIndex();
  currentTesti = Math.max(0, Math.min(index, maxIdx));

  if (testiSlides.length > 0 && testiTrack) {
    const slideW = testiSlides[0].offsetWidth + 24; // 24px gap
    const offset = currentTesti * slideW;
    testiTrack.style.transform = `translateX(-${offset}px)`;
  }
  updateTestiDots();
  startTestiAutoplay();
}

function nextTesti() {
  const maxIdx = getMaxTestiIndex();
  if (maxIdx <= 0) return;
  const nextIdx = currentTesti >= maxIdx ? 0 : currentTesti + 1;
  goTesti(nextIdx);
}

function prevTesti() {
  const maxIdx = getMaxTestiIndex();
  if (maxIdx <= 0) return;
  const prevIdx = currentTesti <= 0 ? maxIdx : currentTesti - 1;
  goTesti(prevIdx);
}

function startTestiAutoplay() {
  if (testiTimer) clearInterval(testiTimer);
  testiTimer = setInterval(nextTesti, 4000);
}

if (testiSlides.length > 0) {
  buildTestiDots();
  startTestiAutoplay();

  /* Pause on hover */
  const wrapper = document.querySelector('.testi-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => clearInterval(testiTimer));
    wrapper.addEventListener('mouseleave', startTestiAutoplay);
  }

  if (testiPrevBtn) {
    testiPrevBtn.addEventListener('click', () => {
      prevTesti();
      startTestiAutoplay();
    });
  }

  if (testiNextBtn) {
    testiNextBtn.addEventListener('click', () => {
      nextTesti();
      startTestiAutoplay();
    });
  }

  /* Touch & Pointer Drag Swipe Support for Testimonials */
  let isTestiDragging = false;
  let testiTouchActive = false;
  let testiStartX = 0;
  let testiStartY = 0;
  let testiDiff = 0;
  let testiIsHorizontal = null;

  const onTestiDragStart = (e) => {
    testiTouchActive = true;
    isTestiDragging = false;
    testiIsHorizontal = null;
    testiStartX = e.touches ? e.touches[0].clientX : e.clientX;
    testiStartY = e.touches ? e.touches[0].clientY : e.clientY;
    testiDiff = 0;
    if (testiTimer) clearInterval(testiTimer);
  };

  const onTestiDragMove = (e) => {
    if (!testiTouchActive) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const diffX = x - testiStartX;
    const diffY = y - testiStartY;

    // Direction intent check: dead-zone threshold of 10px
    if (testiIsHorizontal === null) {
      if (Math.abs(diffY) > 8 && Math.abs(diffY) >= Math.abs(diffX)) {
        // Vertical scroll intent: release drag immediately so page scrolls smoothly
        testiIsHorizontal = false;
        testiTouchActive = false;
        return;
      }
      if (Math.abs(diffX) > 10 && Math.abs(diffX) > Math.abs(diffY)) {
        // Confirmed horizontal swipe intent!
        testiIsHorizontal = true;
        isTestiDragging = true;
        testiTrack.classList.add('is-dragging');
        testiTrack.style.transition = 'none';
      }
    }

    if (!isTestiDragging) return;

    if (e.cancelable) e.preventDefault();
    testiDiff = diffX;
    const slideW = testiSlides[0].offsetWidth + 24;
    const baseOffset = currentTesti * slideW;
    testiTrack.style.transform = `translateX(-${baseOffset - testiDiff}px)`;
  };

  const onTestiDragEnd = () => {
    if (!testiTouchActive && !isTestiDragging) return;
    testiTouchActive = false;

    if (isTestiDragging) {
      isTestiDragging = false;
      testiTrack.classList.remove('is-dragging');
      testiTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      if (Math.abs(testiDiff) > 50) {
        if (testiDiff < 0) {
          nextTesti();
        } else {
          prevTesti();
        }
      } else {
        goTesti(currentTesti);
      }
    }
    testiDiff = 0;
    testiIsHorizontal = null;
    startTestiAutoplay();
  };

  if (wrapper) {
    wrapper.addEventListener('mousedown', onTestiDragStart);
    wrapper.addEventListener('touchstart', onTestiDragStart, { passive: true });
    window.addEventListener('mousemove', onTestiDragMove);
    window.addEventListener('touchmove', onTestiDragMove, { passive: false });
    window.addEventListener('mouseup', onTestiDragEnd);
    window.addEventListener('touchend', onTestiDragEnd);
    window.addEventListener('touchcancel', onTestiDragEnd);
  }
}

/* Section reveals are handled by AOS */

/* ======================== PORTFOLIO CAROUSEL ======================== */
const track = document.getElementById('carouselTrack');
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
const dotsContainer = document.getElementById('carouselDots');

let currentIndex = 0;
let autoplayTimer = null;
let slidesPerView = getSlidesPerView();
let totalGroups = Math.ceil(slides.length / slidesPerView);
let isDragging = false;
let startX = 0;
let startY = 0;
let dragDiff = 0;
let dragMoved = false;
const AUTO_DELAY = 4000;

function getSlidesPerView() {
  if (window.innerWidth <= 768) return 1;
  return 2;
}

/* Build dots */
function buildDots() {
  dotsContainer.innerHTML = '';
  totalGroups = Math.ceil(slides.length / slidesPerView);
  for (let i = 0; i < totalGroups; i++) {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    if (i === currentIndex) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

function goTo(index) {
  slidesPerView = getSlidesPerView();
  totalGroups = Math.ceil(slides.length / slidesPerView);
  currentIndex = Math.max(0, Math.min(index, totalGroups - 1));

  if (slides.length > 0) {
    const slideWidth = slides[0].getBoundingClientRect().width + 16; 
    const offset = currentIndex * slidesPerView * slideWidth;
    track.style.transform = `translateX(-${offset}px)`;
  }
  updateDots();
}

function next() {
  slidesPerView = getSlidesPerView();
  totalGroups = Math.ceil(slides.length / slidesPerView);
  goTo(currentIndex >= totalGroups - 1 ? 0 : currentIndex + 1);
}

function prev() {
  slidesPerView = getSlidesPerView();
  totalGroups = Math.ceil(slides.length / slidesPerView);
  goTo(currentIndex <= 0 ? totalGroups - 1 : currentIndex - 1);
}

function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(next, AUTO_DELAY);
}

function stopAutoplay() {
  if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
}

prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
nextBtn.addEventListener('click', () => { next(); startAutoplay(); });

// Touch / drag support
const carouselEl = document.querySelector('.carousel-container');
let touchActive = false;
let isHorizontalDrag = null;

carouselEl.addEventListener('mousedown', onDragStart);
carouselEl.addEventListener('touchstart', onDragStart, { passive: true });
window.addEventListener('mousemove', onDragMove);
window.addEventListener('touchmove', onDragMove, { passive: false });
window.addEventListener('mouseup', onDragEnd);
window.addEventListener('touchend', onDragEnd);
window.addEventListener('touchcancel', onDragEnd);

function onDragStart(e) {
  touchActive = true;
  isDragging = false;
  isHorizontalDrag = null;
  dragMoved = false;
  startX = e.touches ? e.touches[0].clientX : e.clientX;
  startY = e.touches ? e.touches[0].clientY : e.clientY;
  dragDiff = 0;
  stopAutoplay();
}

function onDragMove(e) {
  if (!touchActive) return;
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;
  const diffX = x - startX;
  const diffY = y - startY;

  if (isHorizontalDrag === null) {
    if (Math.abs(diffY) > 8 && Math.abs(diffY) >= Math.abs(diffX)) {
      isHorizontalDrag = false;
      touchActive = false;
      return;
    }
    if (Math.abs(diffX) > 10 && Math.abs(diffX) > Math.abs(diffY)) {
      isHorizontalDrag = true;
      isDragging = true;
      track.classList.add('is-dragging');
      track.style.transition = 'none';
    }
  }

  if (!isDragging) return;

  if (e.cancelable) e.preventDefault();
  dragMoved = true;
  dragDiff = diffX;
  const slideW = slides[0].offsetWidth + 16;
  const baseOffset = currentIndex * slidesPerView * slideW;
  track.style.transform = `translateX(-${baseOffset - dragDiff}px)`;
}

function onDragEnd() {
  if (!touchActive && !isDragging) return;
  touchActive = false;

  if (isDragging) {
    isDragging = false;
    track.classList.remove('is-dragging');
    track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    if (Math.abs(dragDiff) > 60) {
      dragDiff < 0 ? next() : prev();
    } else {
      goTo(currentIndex);
    }
  }

  const wasDrag = dragMoved;
  dragDiff = 0;
  isHorizontalDrag = null;
  startAutoplay();

  if (wasDrag) {
    dragMoved = true;
    setTimeout(() => {
      dragMoved = false;
    }, 200);
  } else {
    dragMoved = false;
  }
}

// Intercept clicks during drag in capture phase so lightbox NEVER opens on drag
track.addEventListener('click', (e) => {
  if (dragMoved) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
}, true);

// Pause autoplay on hover
carouselEl.addEventListener('mouseenter', stopAutoplay);
carouselEl.addEventListener('mouseleave', startAutoplay);

// Init
buildDots();
startAutoplay();

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') { prev(); startAutoplay(); }
  if (e.key === 'ArrowRight') { next(); startAutoplay(); }
});

// Recalculate on resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (testiSlides.length > 0) {
      testiPerView = getTestiPerView();
      testiGroups = Math.ceil(testiSlides.length / testiPerView);
      currentTesti = Math.min(currentTesti, testiGroups - 1);
      buildTestiDots();
      goTesti(currentTesti);
    }

    slidesPerView = getSlidesPerView();
    buildDots();
    // Maintain relative position or reset to 0
    goTo(0);
  }, 200);
});

/* ======================== LIGHTBOX LOGIC & E-COMMERCE ZOOM ======================== */
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent') || document.querySelector('.lightbox-content');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

if (lightbox) {
  const allSlides = Array.from(document.querySelectorAll('.carousel-slide'));
  allSlides.forEach(slide => {
    const img = slide.querySelector('img');
    const title = slide.querySelector('h3')?.textContent || '';
    
    if (img) {
      slide.addEventListener('click', (e) => {
        // If user was dragging or swiping the cards, do NOT open lightbox!
        if (dragMoved) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        lightboxImg.src = img.src;
        lightboxCaption.textContent = title;
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scroll
        
        // Reset zoom state on open
        setLightboxZoom(false);
      });
    }
  });

  const zoomHint = lightboxContent ? lightboxContent.querySelector('.lightbox-zoom-hint') : null;
  let isLightboxZoomed = false;

  const setLightboxZoom = (zoomed, originX = '50%', originY = '50%') => {
    isLightboxZoomed = zoomed;
    if (zoomed && lightboxImg && lightboxContent) {
      lightboxImg.style.transformOrigin = `${originX} ${originY}`;
      lightboxImg.style.transform = 'scale(2.2)';
      lightboxContent.classList.add('is-zoomed');
      if (zoomHint) zoomHint.innerHTML = '<i class="fas fa-search-minus"></i> Tap / Click to Zoom Out';
    } else if (lightboxImg && lightboxContent) {
      lightboxImg.style.transformOrigin = 'center center';
      lightboxImg.style.transform = 'scale(1)';
      lightboxContent.classList.remove('is-zoomed');
      if (zoomHint) zoomHint.innerHTML = '<i class="fas fa-search-plus"></i> Tap / Click to Zoom';
    }
  };

  const closeLightbox = () => {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
    setLightboxZoom(false);
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-wrapper')) closeLightbox();
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('show')) closeLightbox();
  });

  // Tap or Click to toggle Zoom In and Zoom Out
  if (lightboxContent && lightboxImg) {
    lightboxContent.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isLightboxZoomed) {
        setLightboxZoom(false);
      } else {
        const rect = lightboxImg.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
          const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
          setLightboxZoom(true, `${x}%`, `${y}%`);
        } else {
          setLightboxZoom(true);
        }
      }
    });

    // On desktop, mousemove while zoomed allows smooth panning
    const isTouchDevice = () => ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    lightboxContent.addEventListener('mousemove', (e) => {
      if (isTouchDevice()) return;
      if (!isLightboxZoomed) return;
      const rect = lightboxImg.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      lightboxImg.style.transformOrigin = `${x}% ${y}%`;
    });
  }
}

/* ======================== CONTACT FORM (FORMSUBMIT.CO) ======================== */
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnIcon = document.getElementById('btnIcon');
const btnLoader = document.getElementById('btnLoader');

function showToast(type) {
  const toastId = type === 'success' ? 'toastSuccess' : 'toastError';
  const toast = document.getElementById(toastId);
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 6000);
}

function setLoading(loading) {
  if (submitBtn) submitBtn.disabled = loading;
  if (btnText) btnText.textContent = loading ? 'Sending...' : 'Send Message';
  if (btnIcon) btnIcon.style.display = loading ? 'none' : 'inline-block';
  if (btnLoader) btnLoader.style.display = loading ? 'inline-block' : 'none';
}

function validateField(fieldId, errorId, validator) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (!field) return true;
  if (!error) return validator(field.value);
  const isValid = validator(field.value);
  if (!isValid) {
    error.classList.add('visible');
    if (field.parentElement) field.parentElement.style.borderColor = '#f87171';
  } else {
    error.classList.remove('visible');
    if (field.parentElement) field.parentElement.style.borderColor = '';
  }
  return isValid;
}

function validateForm() {
  const nameValid = validateField('name', 'nameError', (v) => {
    const err = document.getElementById('nameError');
    if (!v.trim()) { if (err) err.textContent = 'Name is required.'; return false; }
    if (v.trim().length < 2) { if (err) err.textContent = 'Name must be at least 2 characters.'; return false; }
    return true;
  });

  const emailValid = validateField('email', 'emailError', (v) => {
    const err = document.getElementById('emailError');
    if (!v.trim()) { if (err) err.textContent = 'Email is required.'; return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) { if (err) err.textContent = 'Please enter a valid email.'; return false; }
    return true;
  });

  const messageValid = validateField('message', 'messageError', (v) => {
    const err = document.getElementById('messageError');
    if (!v.trim()) { if (err) err.textContent = 'Message is required.'; return false; }
    if (v.trim().length < 10) { if (err) err.textContent = 'Message must be at least 10 characters.'; return false; }
    return true;
  });

  return nameValid && emailValid && messageValid;
}

// Real-time validation clear on input
['name', 'email', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => {
      const error = document.getElementById(id + 'Error');
      if (error) error.classList.remove('visible');
      if (el.parentElement) el.parentElement.style.borderColor = '';
    });
  }
});

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const formData = new FormData(contactForm);

    try {
      const response = await fetch('https://formsubmit.co/ajax/mudasiralisargani@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data.success === 'true' || data.success === true || !data.error)) {
        setLoading(false);
        contactForm.reset();
        showToast('success');
      } else {
        // Fallback to standard form submit
        contactForm.submit();
      }
    } catch (err) {
      console.warn('AJAX submit encountered an issue, submitting directly:', err);
      contactForm.submit();
    }
  });
}

/* ======================== GSAP — FOOTER REVEAL ======================== */
if (hasGsap) {
  gsap.from('.footer-brand, .footer-links, .footer-services', {
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 85%',
    },
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out',
  });
}

/* ======================== SCROLL TO TOP CLICK HANDLER ======================== */
if (scrollToTopBtn) {
  const doScrollTop = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const homeEl = document.getElementById('home') || document.body;

    // 1. LocomotiveScroll instance smooth scroll
    if (locoScroll && typeof locoScroll.scrollTo === 'function') {
      try {
        locoScroll.scrollTo(homeEl, { offset: 0, duration: 0.9 });
        return;
      } catch (err) {
        try {
          locoScroll.scrollTo(0, { duration: 0.9 });
          return;
        } catch (e2) {}
      }
    }

    // 2. Lenis direct instance
    if (locoScroll && locoScroll.lenisInstance && typeof locoScroll.lenisInstance.scrollTo === 'function') {
      try {
        locoScroll.lenisInstance.scrollTo(0, { duration: 0.9 });
        return;
      } catch (err) {}
    }

    // 3. Fallback smooth scroll
    try {
      homeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  scrollToTopBtn.addEventListener('click', doScrollTop);
  scrollToTopBtn.addEventListener('touchend', doScrollTop);
  scrollToTopBtn.addEventListener('pointerup', doScrollTop);
}
