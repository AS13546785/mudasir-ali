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
        lerp: 0.08,
        duration: 1.2,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 1.8,
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
          "value": 55,
          "density": {
            "enable": true,
            "value_area": 920
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
          "distance": 160,
          "color": "#60a5fa",
          "opacity": 0.26,
          "width": 1.1
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

// Sticky on scroll
window.addEventListener('scroll', () => {
  if (navbar && window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else if (navbar) {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
}, { passive: true });

// Hamburger toggle
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const shouldOpen = !navLinks.classList.contains('open');
    setMobileMenuOpen(shouldOpen);
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

/* Active nav link on scroll */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + window.innerHeight / 3;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
      navLinkItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
          link.classList.add('active');
        }
      });
    }
  });
}
updateActiveNavLink();

/* Smooth scroll for nav links */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#' || href === '') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    if (locoScroll && typeof locoScroll.scrollTo === 'function') {
      locoScroll.scrollTo(target, { offset: -70, duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ======================== AOS INIT ======================== */
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 80,
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
  let testiStartX = 0;
  let testiDiff = 0;

  const onTestiDragStart = (e) => {
    isTestiDragging = true;
    testiStartX = e.touches ? e.touches[0].clientX : e.clientX;
    testiDiff = 0;
    if (testiTimer) clearInterval(testiTimer);
    testiTrack.classList.add('is-dragging');
    testiTrack.style.transition = 'none';
  };

  const onTestiDragMove = (e) => {
    if (!isTestiDragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    testiDiff = x - testiStartX;
    const slideW = testiSlides[0].offsetWidth + 24;
    const baseOffset = currentTesti * slideW;
    testiTrack.style.transform = `translateX(-${baseOffset - testiDiff}px)`;
  };

  const onTestiDragEnd = () => {
    if (!isTestiDragging) return;
    isTestiDragging = false;
    testiTrack.classList.remove('is-dragging');
    testiTrack.style.transition = 'transform 0.6s cubic-bezier(0.77, 0, 0.18, 1)';
    if (Math.abs(testiDiff) > 50) {
      if (testiDiff < 0) {
        nextTesti();
      } else {
        prevTesti();
      }
    } else {
      goTesti(currentTesti);
    }
    testiDiff = 0;
    startTestiAutoplay();
  };

  if (wrapper) {
    wrapper.addEventListener('mousedown', onTestiDragStart);
    wrapper.addEventListener('touchstart', onTestiDragStart, { passive: true });
    window.addEventListener('mousemove', onTestiDragMove);
    window.addEventListener('touchmove', onTestiDragMove, { passive: true });
    window.addEventListener('mouseup', onTestiDragEnd);
    window.addEventListener('touchend', onTestiDragEnd);
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
carouselEl.addEventListener('mousedown', onDragStart, { passive: true });
carouselEl.addEventListener('touchstart', onDragStart, { passive: true });
window.addEventListener('mousemove', onDragMove, { passive: true });
window.addEventListener('touchmove', onDragMove, { passive: true });
window.addEventListener('mouseup', onDragEnd);
window.addEventListener('touchend', onDragEnd);

function onDragStart(e) {
  isDragging = true;
  dragMoved = false;
  startX = e.touches ? e.touches[0].clientX : e.clientX;
  startY = e.touches ? e.touches[0].clientY : e.clientY;
  dragDiff = 0;
  stopAutoplay();
  track.classList.add('is-dragging');
  track.style.transition = 'none';
}

function onDragMove(e) {
  if (!isDragging) return;
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;
  const diffX = x - startX;
  const diffY = y - startY;

  if (Math.abs(diffX) > 6 || Math.abs(diffY) > 6) {
    dragMoved = true;
  }

  dragDiff = diffX;
  const slideW = slides[0].offsetWidth + 16;
  const baseOffset = currentIndex * slidesPerView * slideW;
  track.style.transform = `translateX(-${baseOffset - dragDiff}px)`;
}

function onDragEnd() {
  if (!isDragging) return;
  isDragging = false;
  track.classList.remove('is-dragging');
  track.style.transition = 'transform 0.6s cubic-bezier(0.77, 0, 0.175, 1)';
  
  const wasDrag = dragMoved || Math.abs(dragDiff) > 8;

  if (Math.abs(dragDiff) > 60) {
    dragDiff < 0 ? next() : prev();
  } else {
    goTo(currentIndex);
  }
  dragDiff = 0;
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
        if (lightboxImg) {
          lightboxImg.style.transformOrigin = 'center center';
          lightboxImg.style.transform = 'scale(1)';
        }
        if (lightboxContent) lightboxContent.classList.remove('is-zoomed');
      });
    }
  });

  const closeLightbox = () => {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
    if (lightboxImg) {
      lightboxImg.style.transformOrigin = 'center center';
      lightboxImg.style.transform = 'scale(1)';
    }
    if (lightboxContent) lightboxContent.classList.remove('is-zoomed');
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-wrapper')) closeLightbox();
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('show')) closeLightbox();
  });

  // Interactive E-commerce Product Image Zoom on Mousemove
  if (lightboxContent && lightboxImg) {
    lightboxContent.addEventListener('mousemove', (e) => {
      const rect = lightboxImg.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));
      
      lightboxImg.style.transformOrigin = `${clampedX}% ${clampedY}%`;
      lightboxImg.style.transform = 'scale(2.2)';
      lightboxContent.classList.add('is-zoomed');
    });

    lightboxContent.addEventListener('mouseleave', () => {
      lightboxImg.style.transformOrigin = 'center center';
      lightboxImg.style.transform = 'scale(1)';
      lightboxContent.classList.remove('is-zoomed');
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

/* ======================== SCROLL PROGRESS BAR ======================== */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  background: linear-gradient(90deg, #0061FF, #00c6ff);
  z-index: 10000;
  transition: width 0.1s linear;
  pointer-events: none;
  box-shadow: 0 0 10px rgba(0, 198, 255, 0.85);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = (scrolled / maxScroll) * 100;
  progressBar.style.width = progress + '%';
}, { passive: true });

/* ======================== SECTION ENTRANCE (handled by AOS) ======================== */

/* ======================== SCROLL TO TOP BUTTON ======================== */
const scrollToTopBtn = document.getElementById('scrollToTop');
if (scrollToTopBtn) {
  const getScrollY = () => {
    let y = 0;
    if (locoScroll) {
      if (typeof locoScroll.lenisInstance?.scroll === 'number') {
        y = Math.max(y, locoScroll.lenisInstance.scroll);
      }
      if (typeof locoScroll.scroll?.y === 'number') {
        y = Math.max(y, locoScroll.scroll.y);
      }
      if (typeof locoScroll.scroll === 'number') {
        y = Math.max(y, locoScroll.scroll);
      }
    }
    const winY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    return Math.max(y, winY);
  };

  const updateScrollBtn = (val) => {
    const y = typeof val === 'number' ? val : getScrollY();
    if (y > 200) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', () => updateScrollBtn(), { passive: true });
  document.addEventListener('scroll', () => updateScrollBtn(), { passive: true });

  if (locoScroll && typeof locoScroll.on === 'function') {
    locoScroll.on('scroll', (args) => {
      const scrollPos = typeof args === 'number' ? args : (typeof args?.scroll === 'number' ? args.scroll : getScrollY());
      updateScrollBtn(scrollPos);
    });
  }

  // Periodic check as a solid fail-safe
  setInterval(() => {
    updateScrollBtn();
  }, 350);

  const doScrollTop = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const homeEl = document.getElementById('home') || document.body;

    // 1. LocomotiveScroll instance smooth scroll
    if (locoScroll && typeof locoScroll.scrollTo === 'function') {
      try {
        locoScroll.scrollTo(homeEl, { offset: 0, duration: 1.2 });
        return;
      } catch (err) {
        try {
          locoScroll.scrollTo(0, { duration: 1.2 });
          return;
        } catch (e2) {}
      }
    }

    // 2. Lenis direct instance
    if (locoScroll && locoScroll.lenisInstance && typeof locoScroll.lenisInstance.scrollTo === 'function') {
      try {
        locoScroll.lenisInstance.scrollTo(0, { duration: 1.2 });
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
