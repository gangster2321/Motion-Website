/* ==========================================================================
   Main JavaScript
   - Theme toggle (dark / light)
   - UpSunday-style cursor: dot + trailing ring
   - Magnetic button effect
   - Video player toggle with page wipe
   - Scroll reveal (IntersectionObserver)
   ========================================================================== */

(function () {
  'use strict';

  /* Always start a fresh page view at the top instead of restoring the last
     scroll position after refresh/navigation. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  window.addEventListener('load', function () { window.scrollTo(0, 0); }, { once: true });
  window.addEventListener('pageshow', function () { window.scrollTo(0, 0); });

  /* -------- Theme Toggle (dark → light) -------- */
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  const themes = ['dark', 'light'];
  const storedTheme = localStorage.getItem('theme');
  const savedTheme = themes.includes(storedTheme) ? storedTheme : 'dark';
  html.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const currentIndex = themes.indexOf(current);
      const next = themes[(currentIndex + 1) % themes.length];
      themeToggle.setAttribute('aria-label', 'Switch to ' + themes[(themes.indexOf(next) + 1) % themes.length] + ' theme');
      const applyTheme = () => {
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      };

      // Use a circular View Transition when supported, expanding from the toggle.
      if (typeof document.startViewTransition === 'function') {
        const rect = themeToggle.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
        const transition = document.startViewTransition(applyTheme);
        transition.ready.then(() => {
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 500, easing: 'cubic-bezier(.16, 1, .3, 1)', pseudoElement: '::view-transition-new(root)' }
          );
        }).catch(() => {});
      } else {
        applyTheme();
      }

      themeToggle.classList.add('is-switching');
      window.setTimeout(() => themeToggle.classList.remove('is-switching'), 500);
    });
  }

  /* -------- Page Wipe Transition -------- */
  const pageWipe = document.getElementById('pageWipe');

  function triggerWipe(onComplete) {
    if (!pageWipe) return;
    pageWipe.classList.add('active');
    setTimeout(() => {
      if (onComplete) onComplete();
      setTimeout(() => {
        pageWipe.classList.remove('active');
        pageWipe.classList.add('reverse');
        setTimeout(() => {
          pageWipe.classList.remove('reverse');
        }, 700);
      }, 100);
    }, 450);
  }

  /* -------- Smooth Cursor: physics-like trailing frame -------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouchDevice && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let previousRingX = 0, previousRingY = 0;
    let isActive = false;
    let rafId = null;

    // Dot follows instantly
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

      if (!isActive) {
        isActive = true;
        animateRing();
      }
    }, { passive: true });

    // Ring follows with smooth lag and rotates with movement direction.
    function animateRing() {
      if (!isActive) return;
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      const velocityX = ringX - previousRingX;
      const velocityY = ringY - previousRingY;
      const velocity = Math.hypot(velocityX, velocityY);
      if (velocity > 0.05) {
        const angle = Math.atan2(velocityY, velocityX) * 180 / Math.PI;
        cursorRing.style.setProperty('--cursor-angle', `${angle}deg`);
        // The supplied pointer SVG points up-left by default; offset it so
        // the arrow follows the direction of travel like a directional cursor.
      }
      previousRingX = ringX;
      previousRingY = ringY;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animateRing);
    }

    // Click effect
    document.addEventListener('mousedown', () => {
      cursorDot.classList.add('click');
    });
    document.addEventListener('mouseup', () => {
      cursorDot.classList.remove('click');
    });

    // Hover effect on interactive elements
    document.querySelectorAll('a, button, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isActive = false;
        if (rafId) cancelAnimationFrame(rafId);
      }
    });
  }

  /* -------- Magnetic Button -------- */
  const magnets = document.querySelectorAll('[data-magnetic]');
  if (magnets.length && !isTouchDevice) {
    const strength = 0.18;
    magnets.forEach((magnet) => {
      magnet.addEventListener('mousemove', (e) => {
        const rect = magnet.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        magnet.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      magnet.addEventListener('mouseleave', () => {
        magnet.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* -------- Video Player Toggle (no wipe) -------- */
  document.querySelectorAll('.video-frame').forEach(frame => {
    const videoUrl = frame.dataset.video;
    if (!videoUrl) return;

    frame.addEventListener('click', () => {
      if (frame.classList.contains('playing')) return;
      const iframe = document.createElement('iframe');
      iframe.src = videoUrl + '?autoplay=1&rel=0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      frame.appendChild(iframe);
      frame.classList.add('playing');
    });
  });

  /* -------- Scroll Reveal (IntersectionObserver) -------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  /* -------- Statement --------
     Deliberately NOT rebuilt in JS. The previous version read .textContent
     (which silently stripped the <span class="hl"> italics) and re-emitted the
     copy as fixed 6-word blocks, so the paragraph stacked into seven short
     lines instead of wrapping naturally into three. The scroll-in is handled
     by the shared `.reveal` observer above, and the wrap is left to CSS. */
  (function () {
    const statement = document.getElementById('statementText');
    if (!statement) return;
    const walker = document.createTreeWalker(statement, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    let wordIndex = 0;
    textNodes.forEach(function (node) {
      const parts = node.nodeValue.split(/(\s+)/);
      if (parts.length < 2) return;
      const fragment = document.createDocumentFragment();
      parts.forEach(function (part) {
        if (/^\s+$/.test(part) || !part) fragment.appendChild(document.createTextNode(part));
        else {
          const word = document.createElement('span');
          word.className = 'mask-word';
          word.style.setProperty('--word-index', wordIndex++);
          word.textContent = part;
          fragment.appendChild(word);
        }
      });
      node.parentNode.replaceChild(fragment, node);
    });
    /* Measure the natural wrapping and assign one shared delay per line. */
    requestAnimationFrame(function () {
      const lineMap = new Map();
      let lineIndex = 0;
      statement.querySelectorAll('.mask-word').forEach(function (word) {
        const top = word.offsetTop;
        if (!lineMap.has(top)) lineMap.set(top, lineIndex++);
        word.style.setProperty('--line-index', lineMap.get(top));
      });
    });
  })();

  /* -------- Scroll Progress Bar + Traveling Dot -------- */
  const progressFill = document.getElementById('progressFill');
  const travelingLine = document.getElementById('travelingLine');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressFill) {
      progressFill.style.height = scrollPercent + '%';
    }

    if (travelingLine) {
      travelingLine.style.setProperty('--scroll-percent', scrollPercent + '%');
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();


  /* -------- Loading Screen -------- */
  (function() {
    const loader = document.getElementById('loader');
    const loaderMorph = document.getElementById('loaderMorph');
    const loaderProgress = document.getElementById('loaderProgress');
    const loaderPercent = document.getElementById('loaderPercent');
    const loaderNoteText = document.getElementById('loaderNoteText');
    const loaderAudioGate = document.getElementById('loaderAudioGate');

    if (!loader || !loaderMorph) return;
    document.body.classList.add('is-loading');

    const words = loaderMorph.querySelectorAll('.morph-word');
    let progress = 0;
    let morphIndex = 0;
    let hasFinished = false;
    let hasEntered = false;
    const statusMessages = [
      '// Initializing motion system...',
      '// Loading project frames...',
      '// Syncing the project archive...',
      '// Tuning the final cut...',
      '// Entering Chandra Prakash portfolio...'
    ];
    let statusIndex = 0;
    const statusInterval = setInterval(() => {
      statusIndex = (statusIndex + 1) % statusMessages.length;
      if (loaderNoteText) {
        loaderNoteText.classList.add('is-changing');
        setTimeout(() => {
          loaderNoteText.textContent = statusMessages[statusIndex];
          loaderNoteText.classList.remove('is-changing');
        }, 140);
      }
    }, 720);

    // Simulate loading progress: 0% -> 100%
    const progressInterval = setInterval(() => {
      if (progress < 30) {
        progress += Math.random() * 8 + 3;
      } else if (progress < 60) {
        progress += Math.random() * 5 + 2;
      } else if (progress < 85) {
        progress += Math.random() * 3 + 1;
      } else if (progress < 100) {
        progress += Math.random() * 2 + 0.5;
      }

      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
      }

      const pct = Math.floor(progress);
      if (loaderProgress) loaderProgress.style.width = pct + '%';
      if (loaderPercent) loaderPercent.textContent = pct + '%';

      // Morph words at ~45%
      if (pct >= 45 && morphIndex === 0) {
        words[0].classList.remove('active');
        words[1].classList.add('active');
        morphIndex = 1;
      }
    }, 60);

    // Exit loader
    function finishLoader(force) {
      if (hasFinished) return;
      if (!force && !hasEntered) return;
      hasFinished = true;
      clearInterval(progressInterval);
      clearInterval(statusInterval);

      if (loaderProgress) loaderProgress.style.width = '100%';
      if (loaderPercent) loaderPercent.textContent = '100%';

      setTimeout(() => {
        loader.classList.add('done');
        setTimeout(() => { loader.style.display = 'none'; document.body.classList.remove('is-loading'); }, 1000);
      }, 600);
    }

    if (loaderAudioGate) {
      loaderAudioGate.querySelectorAll('[data-enter]').forEach(function (button) {
        button.addEventListener('click', function () {
          hasEntered = true;
          finishLoader(false);
        });
      });
    }

    // Always run for minimum time, then exit
    const minLoadTime = 2100;
    setTimeout(function () {
      if (hasEntered) finishLoader(false);
    }, minLoadTime);

    // Hard fallback: 5s
    setTimeout(() => {
      if (!loader.classList.contains('done')) finishLoader(true);
    }, 4200);
  })();



  /* ===== HERO FLOATING IMAGES INTERACTION ===== */
  (function () {
    const hero = document.getElementById('hero');
    const images = document.querySelectorAll('.floating-img');
    if (!hero || !images.length) return;

    const imgData = [];
    images.forEach((img, i) => {
      const rect = img.getBoundingClientRect();
      imgData.push({
        el: img,
        baseX: rect.left + rect.width / 2,
        baseY: rect.top + rect.height / 2,
        rotate: parseFloat(img.dataset.rotate) || 0,
        speed: parseFloat(img.dataset.speed) || 0.03,
        floatSpeed: parseFloat(img.dataset.floatSpeed) || 2.5,
        floatAmp: parseFloat(img.dataset.floatAmp) || 10,
        phase: Math.random() * Math.PI * 2,
      });
    });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    let time = 0;
    function animate() {
      // Slightly slower drift for a calmer, more deliberate hero motion.
      time += isTouchDevice ? 0.006 : 0.011;
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      imgData.forEach((data, i) => {
        const rect = data.el.getBoundingClientRect();
        const imgCenterX = rect.left + rect.width / 2;
        const imgCenterY = rect.top + rect.height / 2;

        // Parallax
        const parallaxX = (currentX - centerX) * data.speed;
        const parallaxY = (currentY - centerY) * data.speed;

        // Floating animation
        const floatX = Math.sin(time * data.floatSpeed + data.phase) * data.floatAmp * 0.3;
        const floatY = Math.cos(time * data.floatSpeed * 0.7 + data.phase) * data.floatAmp;

        // Proximity push
        const dx = mouseX - imgCenterX;
        const dy = mouseY - imgCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
         const proximityThreshold = 180;

        let pushX = 0, pushY = 0, scale = 1;

        if (distance < proximityThreshold && distance > 0) {
          const force = (proximityThreshold - distance) / proximityThreshold;
           pushX = -(dx / distance) * force * 12;
           pushY = -(dy / distance) * force * 12;
           scale = 1 + force * 0.05;
          data.el.classList.add('proximity-active');
        } else {
          data.el.classList.remove('proximity-active');
        }

        const finalX = parallaxX + floatX + pushX;
        const finalY = parallaxY + floatY + pushY;

        data.el.style.transform = `translate(${finalX}px, ${finalY}px) rotate(${data.rotate}deg) scale(${scale})`;
      });

      requestAnimationFrame(animate);
    }

    animate();

    // Entrance animation
    images.forEach((img, i) => {
      img.style.opacity = '0';
      img.style.transform = `translateY(50px) rotate(${imgData[i].rotate}deg)`;

      setTimeout(() => {
        img.style.transition = 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        img.style.opacity = img.classList.contains('depth-far') ? '0.6' :
                           img.classList.contains('depth-mid') ? '0.8' : '1';
        img.style.transform = `rotate(${imgData[i].rotate}deg)`;

        setTimeout(() => {
          img.style.transition = 'box-shadow 0.4s ease, filter 0.4s ease';
        }, 1000);
      }, 300 + i * 200);
    });
  })();


  /* -------- Archive (Video + Image Sections) --------
     Cards are generated from js/projects-data.js. To change the archive,
     edit that file — not this one. */
  (function () {
    const videoGrid = document.getElementById('videoGrid');
    const imageGrid = document.getElementById('imageGrid');
    const reelGrid = document.getElementById('reelGrid');
    const projects = window.PORTFOLIO_PROJECTS;
    if (!videoGrid || !imageGrid || !Array.isArray(projects) || !projects.length) return;

    const YT_URL = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([\w-]{11})/;
    const YT_BARE = /^[\w-]{11}$/;

    function resolve(raw) {
      if (!raw || typeof raw !== 'string') return null;
      const value = raw.trim();

      if (value.toLowerCase().startsWith('drive:')) {
        const id = value.slice(6).trim();
        return {
          kind: 'drive',
          id: id,
          embed: 'https://drive.google.com/file/d/' + id + '/preview',
          image: 'https://drive.google.com/thumbnail?id=' + id + '&sz=w1600'
        };
      }

      const ytMatch = value.match(YT_URL);
      const id = ytMatch ? ytMatch[1] : (YT_BARE.test(value) && !value.includes('.') ? value : null);
      if (id) {
        return {
          kind: 'youtube',
          id: id,
          embed: 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0',
          image: 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg'
        };
      }

      return { kind: 'file', id: null, embed: value, image: value };
    }

    /* Normalize projects */
    const items = projects.map(function (p, i) {
      const video = resolve(p.video);
      const reel = resolve(p.reel);
      const image = resolve(p.image);
      const gallery = Array.isArray(p.gallery) ? p.gallery.filter(Boolean) : [];
      const thumb = resolve(p.thumb);
      const type = reel ? 'reel' : (video ? 'video' : 'image');
      const media = reel || video || image || (gallery.length ? { kind: 'gallery', image: gallery[0] } : null);

      let poster = null;
      if (thumb) poster = thumb.image;
      else if (type === 'image' && image) poster = image.image;
      else if (type === 'image' && gallery.length) poster = gallery[0];
      else if (media && media.kind !== 'file') poster = media.image;

      return {
        index: i,
        title: p.title || 'Untitled',
        desc: p.desc || '',
        tags: Array.isArray(p.tags) ? p.tags : [],
        featured: !!p.featured,
        type: type,
        media: media,
        poster: poster,
        gallery: gallery
      };
    }).filter(function (p) { return p.media; });

    /* Separate into video and image arrays */
    const videoItems = items.filter(function (p) { return p.type === 'video'; });
    const imageItems = items.filter(function (p) { return p.type === 'image'; });
    const reelItems = items.filter(function (p) { return p.type === 'reel'; });
    const byIndex = {};
    items.forEach(function (p) { byIndex[p.index] = p; });

    function esc(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    const PLAY_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

    /* Build card HTML */
    function buildCard(p) {
      const isVideo = p.type === 'video';
      const isReel = p.type === 'reel';
      const label = (isVideo || isReel ? 'Play ' : 'View ') + p.title;

      let visual;
      if (p.poster) {
        const galleryAttr = p.gallery && p.gallery.length ? ' data-gallery="' + esc(JSON.stringify(p.gallery)) + '"' : '';
        visual = '<img class="' + (p.gallery && p.gallery.length ? 'gallery-image' : '') + '" src="' + esc(p.poster) + '" alt="' + esc(p.title) + '" loading="lazy"' + galleryAttr + '>';
      } else if ((isVideo || isReel) && p.media.kind === 'file') {
        visual = '<video src="' + esc(p.media.embed) + '" preload="metadata" muted playsinline></video>';
      } else {
        visual = '<span class="project-thumb-fallback">' + esc(p.title.charAt(0)) + '</span>';
      }

      return '' +
        '<article class="project-card' + (isReel ? ' reel-card' : '') + '" style="--card-index:' + p.index + '">' +
          '<button type="button" class="project-thumb' + ((isVideo || isReel) ? ' video-thumb' : '') + '"' +
                  ' data-item="' + p.index + '" aria-label="' + esc(label) + '">' +
            visual +
            ((isVideo || isReel) ? '<span class="play-overlay">' + PLAY_SVG + '</span>' : '') +
          '</button>' +
        '</article>';
    }

    /* Render video section */
    if (videoItems.length) {
      videoGrid.innerHTML = videoItems.map(buildCard).join('');
    } else {
      videoGrid.style.display = 'none';
    }

    /* Render image section */
    if (imageItems.length) {
      imageGrid.innerHTML = imageItems.map(buildCard).join('');
    } else {
      imageGrid.style.display = 'none';
      const imageCarousel = imageGrid.closest('.image-carousel');
      if (imageCarousel) imageCarousel.style.display = 'none';
      const imageHeading = document.querySelector('.image-section-heading');
      if (imageHeading) imageHeading.style.display = 'none';
    }

    /* Render portrait 9:16 reel section when reel entries are provided. */
    if (reelGrid && reelItems.length) {
      reelGrid.innerHTML = reelItems.map(buildCard).join('');
    } else if (reelGrid) {
      reelGrid.innerHTML = '<p class="reel-empty">Your vertical reels will appear here.</p>';
    }

    [videoGrid, imageGrid].forEach(function (grid) {
      grid.querySelectorAll('.project-card').forEach(function (card, i) {
        card.style.setProperty('--card-index', i);
      });
    });

    /* Auto-rotate grouped gallery images inside a single placeholder. */
    imageGrid.querySelectorAll('img[data-gallery]').forEach(function (img) {
      let sources;
      try { sources = JSON.parse(img.getAttribute('data-gallery')); } catch (e) { sources = []; }
      if (!sources || sources.length < 2) return;
      let current = 0;
      const project = byIndex[parseInt(img.closest('.project-thumb').dataset.item, 10)];
      window.setInterval(function () {
        img.classList.add('is-swapping');
        window.setTimeout(function () {
          current = (current + 1) % sources.length;
          img.src = sources[current];
          if (project && project.media) project.media.image = sources[current];
          img.classList.remove('is-swapping');
        }, 260);
      }, 4200);
    });

    /* -------- "View More" reveal --------
       Each grid shows its first INITIAL cards; the rest get a
       .hidden-card class (see css/components/work.css) until the button
       is clicked. */
    const INITIAL = window.PORTFOLIO_INITIAL_VISIBLE || 6;
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    let expanded = false;
    if (viewMoreBtn && window.PORTFOLIO_ARCHIVE_URL) viewMoreBtn.href = window.PORTFOLIO_ARCHIVE_URL;

    function applyLimit() {
      let extraCount = 0;
      [videoGrid, imageGrid, reelGrid].forEach(function (grid) {
        if (!grid) return;
        const cards = grid.querySelectorAll('.project-card');
        cards.forEach(function (card, i) {
          card.classList.toggle('hidden-card', !expanded && i >= INITIAL);
          if (i >= INITIAL) extraCount++;
        });
      });
      if (viewMoreBtn) {
        viewMoreBtn.style.display = 'inline-flex';
        viewMoreBtn.innerHTML = 'View More <span aria-hidden="true">→</span>';
      }
    }

    applyLimit();

    /* Horizontal image archive carousel controls. */
    const imageCarousel = document.getElementById('imageGrid');
    const imagePrev = document.getElementById('imageCarouselPrev');
    const imageNext = document.getElementById('imageCarouselNext');
    if (imageCarousel && imagePrev && imageNext) {
      /* Keep the archive moving even when the first three cards fit exactly
         in the viewport by appending a lightweight copy of the first card. */
      const originalImageCards = Array.from(imageCarousel.querySelectorAll('.project-card'));
      if (originalImageCards.length > 1 && imageCarousel.scrollWidth <= imageCarousel.clientWidth + 2) {
        originalImageCards.forEach(function (card) {
          const clone = card.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          imageCarousel.appendChild(clone);
        });
      }
      const slideImages = (direction) => imageCarousel.scrollBy({ left: direction * imageCarousel.clientWidth * 0.82, behavior: 'smooth' });
      imagePrev.addEventListener('click', () => slideImages(-1));
      imageNext.addEventListener('click', () => slideImages(1));

      let carouselPaused = false;
      const moveCarousel = () => {
        if (carouselPaused || imageCarousel.scrollWidth <= imageCarousel.clientWidth) return;
        const atEnd = imageCarousel.scrollLeft + imageCarousel.clientWidth >= imageCarousel.scrollWidth - 8;
        if (atEnd) imageCarousel.scrollTo({ left: 0, behavior: 'smooth' });
        else slideImages(1);
      };
      const carouselTimer = window.setInterval(moveCarousel, 4200);
      imageCarousel.addEventListener('mouseenter', () => { carouselPaused = true; });
      imageCarousel.addEventListener('mouseleave', () => { carouselPaused = false; });
      imageCarousel.addEventListener('focusin', () => { carouselPaused = true; });
      imageCarousel.addEventListener('focusout', () => { carouselPaused = false; });
      window.addEventListener('beforeunload', () => window.clearInterval(carouselTimer), { once: true });
    }

    /* Interactive card tilt: movement follows the pointer, while the grid
       itself remains stationary for predictable vertical page scrolling. */
    if (window.matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll('.project-card').forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          card.style.setProperty('--tilt-x', (-y * 5).toFixed(2) + 'deg');
          card.style.setProperty('--tilt-y', (x * 5).toFixed(2) + 'deg');
          card.style.setProperty('--spot-x', ((x + 0.5) * 100).toFixed(1) + '%');
          card.style.setProperty('--spot-y', ((y + 0.5) * 100).toFixed(1) + '%');
          card.style.setProperty('--image-x', (x * -10).toFixed(2) + 'px');
          card.style.setProperty('--image-y', (y * -10).toFixed(2) + 'px');
        });
        card.addEventListener('pointerleave', function () {
          card.style.setProperty('--tilt-x', '0deg');
          card.style.setProperty('--tilt-y', '0deg');
          card.style.setProperty('--image-x', '0px');
          card.style.setProperty('--image-y', '0px');
        });
      });
    }

    if (viewMoreBtn) {
      viewMoreBtn.addEventListener('click', function () {
        expanded = !expanded;
        applyLimit();
      });
    }

    /* -------- lightbox --------
       Uses the fixed #lightbox / #lightboxFrame / #lightboxImg markup in
       index.html. Handles YouTube, Google Drive, local video files and
       images. */
    const lightbox = document.getElementById('lightbox');
    const lightboxFrame = document.getElementById('lightboxFrame');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    function closeLightbox() {
      if (!lightbox || lightbox.hidden) return;
      lightbox.hidden = true;
      lightbox.classList.remove('is-image');
      if (lightboxFrame) lightboxFrame.src = '';
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    }

    function onKey(e) {
      if (e.key === 'Escape') closeLightbox();
    }

    document.querySelectorAll('.project-thumb').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = parseInt(this.dataset.item, 10);
        const p = byIndex[idx];
        if (!p || !lightbox) return;

        if ((p.type === 'video' || p.type === 'reel') && lightboxFrame) {
          lightbox.classList.remove('is-image');
          lightboxFrame.src = p.media.embed;
        } else if (p.type === 'image' && lightboxImg) {
          lightbox.classList.add('is-image');
          lightboxImg.src = p.media.image;
          lightboxImg.alt = p.title;
        } else {
          return;
        }

        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKey);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });
    }
  })();
})();
