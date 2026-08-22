/* KV Media House - shared site behaviour and premium motion */
(function(){
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const isDesktopFine = window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)').matches;

  if(hasGSAP) gsap.registerPlugin(ScrollTrigger);

  function initHeader(){
    const header = document.getElementById('siteHeader');
    if(header){
      const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
      onScroll();
      window.addEventListener('scroll', onScroll, {passive:true});
      if(hasGSAP && !prefersReduced){
        gsap.fromTo(header, {autoAlpha:0, y:-25}, {autoAlpha:1, y:0, duration:.85, ease:'power3.out', delay:.08});
      }
    }

    const burgerBtn = document.getElementById('burgerBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if(burgerBtn && mobileMenu){
      const openMenu = () => {
        mobileMenu.classList.add('open');
        burgerBtn.setAttribute('aria-expanded','true');
        document.body.style.overflow = 'hidden';
      };
      const closeMenu = () => {
        mobileMenu.classList.remove('open');
        burgerBtn.setAttribute('aria-expanded','false');
        document.body.style.overflow = '';
      };
      burgerBtn.addEventListener('click', openMenu);
      if(closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
      qsa('a', mobileMenu).forEach(a => a.addEventListener('click', closeMenu));
    }
  }

  function initSmoothScroll(){
    if(prefersReduced || !window.Lenis || !hasGSAP) return;
    const lenis = new Lenis({
      duration: 1.05,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.15
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    qsa('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', event => {
        const target = anchor.getAttribute('href');
        if(!target || target === '#') return;
        const el = qs(target);
        if(!el) return;
        event.preventDefault();
        lenis.scrollTo(el, {offset:-90});
      });
    });
  }

  function fallbackReveals(){
    const revealEls = qsa('.reveal, .reveal-stagger');
    if(!revealEls.length) return;
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, {threshold:.14});
      revealEls.forEach(el => io.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('in'));
    }
  }

  function initScrollProgress(){
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);
    if(hasGSAP && !prefersReduced){
      gsap.to(progress, {scaleX:1, ease:'none', scrollTrigger:{start:0, end:'max', scrub:.25}});
    } else {
      const update = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      };
      update();
      window.addEventListener('scroll', update, {passive:true});
    }
  }

  function wrapHeadingLines(el){
    if(!el || el.dataset.motionText === 'true') return qsa('.motion-line-inner', el);
    const groups = [[]];
    Array.from(el.childNodes).forEach(node => {
      if(node.nodeName === 'BR') groups.push([]);
      else groups[groups.length - 1].push(node);
    });
    el.textContent = '';
    groups.forEach((nodes, index) => {
      const mask = document.createElement('span');
      const inner = document.createElement('span');
      mask.className = 'motion-line';
      inner.className = 'motion-line-inner';
      nodes.forEach(node => inner.appendChild(node));
      mask.appendChild(inner);
      el.appendChild(mask);
      if(index < groups.length - 1) el.appendChild(document.createElement('br'));
    });
    el.dataset.motionText = 'true';
    return qsa('.motion-line-inner', el);
  }

  function initTextReveals(){
    const headings = qsa('.hero h1, .statement h2, .about-grid h2, section .wrap > .reveal h2, .founder-grid h2, .why-premium h2, .philosophy h2, .final-cta h2, .inner-hero h1');
    headings.forEach(heading => {
      const lines = wrapHeadingLines(heading);
      if(heading.closest('.hero')) return;
      if(!hasGSAP || prefersReduced) return;
      gsap.fromTo(lines, {yPercent:110, autoAlpha:0}, {
        yPercent:0,
        autoAlpha:1,
        duration:1.08,
        ease:'power4.out',
        stagger:.1,
        scrollTrigger:{trigger:heading, start:'top 82%', once:true}
      });
    });
  }

  function initGlobalReveals(){
    if(!hasGSAP || prefersReduced){
      fallbackReveals();
      return;
    }
    qsa('.reveal, .reveal-stagger').forEach(el => el.classList.add('in'));
    qsa('.reveal, .reveal-stagger, [data-reveal]').forEach(el => {
      if(el.closest('.hero') || el.dataset.gsapReveal === 'done') return;
      el.dataset.gsapReveal = 'done';
      const mode = el.dataset.reveal || 'up';
      const fromVars = mode === 'left' ? {x:-60, y:0, scale:1} : mode === 'right' ? {x:60, y:0, scale:1} : mode === 'scale' ? {x:0, y:0, scale:.94} : {x:0, y:50, scale:1};
      gsap.fromTo(el, {autoAlpha:0, ...fromVars}, {
        autoAlpha:1,
        x:0,
        y:0,
        scale:1,
        duration:1,
        ease:'power3.out',
        scrollTrigger:{trigger:el, start:'top 84%', once:true}
      });
    });
  }

  function initHeroAnimations(){
    const hero = qs('.hero');
    if(!hero || !hasGSAP || prefersReduced) return;
    const bg = qs('.hero-bg', hero);
    const label = qs('.eyebrow', hero);
    const heading = qs('h1', hero);
    const lines = wrapHeadingLines(heading);
    const desc = qs('.desc', hero);
    const buttons = qsa('.hero-buttons .btn', hero);
    const indicators = qsa('.hero-indicators span', hero);

    gsap.timeline({defaults:{ease:'power3.out'}})
      .fromTo(bg, {scale:1.06, autoAlpha:.82}, {scale:1, autoAlpha:1, duration:1.45, ease:'expo.out'})
      .fromTo(label, {autoAlpha:0, y:18}, {autoAlpha:1, y:0, duration:.72}, '-=1.1')
      .fromTo(lines, {yPercent:110, autoAlpha:0}, {yPercent:0, autoAlpha:1, duration:1.12, stagger:.11, ease:'power4.out'}, '-=.62')
      .fromTo(desc, {autoAlpha:0, y:24}, {autoAlpha:1, y:0, duration:.8}, '-=.42')
      .fromTo(buttons, {autoAlpha:0, y:26}, {autoAlpha:1, y:0, duration:.75, stagger:.08}, '-=.45')
      .fromTo(indicators, {autoAlpha:0, y:18}, {autoAlpha:1, y:0, duration:.72, stagger:.07}, '-=.3');

    gsap.to(bg, {yPercent:8, ease:'none', scrollTrigger:{trigger:hero, start:'top top', end:'bottom top', scrub:1}});

    if(isDesktopFine){
      hero.addEventListener('mousemove', event => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        gsap.to(bg, {x:x * 12, y:y * 8, duration:1.2, ease:'power3.out'});
      });
      hero.addEventListener('mouseleave', () => gsap.to(bg, {x:0, y:0, duration:1.1, ease:'power3.out'}));
    }
  }

  function initHeroIndicators(){
    if(!isDesktopFine || !hasGSAP) return;
    qsa('.hero-indicators span').forEach(item => {
      item.addEventListener('mouseenter', () => gsap.to(item, {x:8, duration:.35, ease:'power2.out'}));
      item.addEventListener('mouseleave', () => gsap.to(item, {x:0, duration:.35, ease:'power2.out'}));
    });
  }

  function initMarquee(){
    const track = qs('.marquee-track');
    if(!track) return;
    track.style.animation = 'none';
    if(!hasGSAP || prefersReduced) return;
    const tween = gsap.to(track, {xPercent:-50, duration:34, repeat:-1, ease:'none'});
    track.addEventListener('mouseenter', () => tween.timeScale(.28));
    track.addEventListener('mouseleave', () => tween.timeScale(1));
  }

  function initImageReveals(){
    if(!hasGSAP || prefersReduced) return;
    qsa('.about-service-collage img, .founder-media .media-frame, .service-panel .sp-media, .mason-item, .insta-item .media-frame').forEach((el, index) => {
      gsap.fromTo(el, {clipPath:'inset(100% 0 0 0)', autoAlpha:0}, {
        clipPath:'inset(0% 0 0 0)',
        autoAlpha:1,
        duration:1.1,
        ease:'power4.out',
        delay:(index % 4) * .06,
        scrollTrigger:{trigger:el, start:'top 86%', once:true}
      });
    });
  }

  function initServiceMotion(){
    const panels = qsa('.service-panel');
    if(!panels.length) return;
    const track = panels[0].parentElement;
    const section = track.closest('section');
    if(!track || !section) return;
    section.classList.add('services-motion-section');
    track.classList.add('services-motion-track');
    if(!hasGSAP || prefersReduced) return;

    gsap.matchMedia().add('(min-width: 901px)', () => {
      const totalMove = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
      const tween = gsap.to(track, {
        x:() => -totalMove(),
        ease:'none',
        scrollTrigger:{
          trigger:section,
          pin:true,
          scrub:1,
          start:'top top',
          end:() => `+=${totalMove() + window.innerHeight * .7}`,
          invalidateOnRefresh:true
        }
      });
      panels.forEach(panel => {
        gsap.fromTo(panel, {autoAlpha:.55, y:50}, {
          autoAlpha:1,
          y:0,
          duration:.9,
          ease:'power3.out',
          scrollTrigger:{trigger:panel, containerAnimation:tween, start:'left 82%', once:true}
        });
      });
    });
  }

  function buildSwiper(container, options, modifierClass){
    if(!container || !window.Swiper || container.dataset.swiperBuilt === 'true') return null;
    container.dataset.swiperBuilt = 'true';
    container.classList.add('swiper', modifierClass);
    const wrapper = document.createElement('div');
    wrapper.className = 'swiper-wrapper';
    Array.from(container.children).forEach(child => {
      child.classList.add('swiper-slide');
      wrapper.appendChild(child);
    });
    container.appendChild(wrapper);
    const controls = document.createElement('div');
    controls.className = 'motion-swiper-controls';
    controls.innerHTML = '<button class="motion-prev" type="button" aria-label="Previous slide">&larr;</button><span class="motion-progress"></span><button class="motion-next" type="button" aria-label="Next slide">&rarr;</button>';
    container.after(controls);
    return new Swiper(container, {
      speed:820,
      grabCursor:true,
      watchSlidesProgress:true,
      navigation:{prevEl:controls.querySelector('.motion-prev'), nextEl:controls.querySelector('.motion-next')},
      scrollbar:{el:controls.querySelector('.motion-progress'), draggable:true},
      ...options
    });
  }

  function initPortfolioCarousel(){
    qsa('.masonry').forEach(grid => {
      if(grid.id === 'pfGrid') return;
      buildSwiper(grid, {
        slidesPerView:1.1,
        spaceBetween:18,
        centeredSlides:true,
        breakpoints:{768:{slidesPerView:2.15, spaceBetween:22}, 1200:{slidesPerView:2.65, spaceBetween:26}}
      }, 'portfolio-swiper');
    });
  }

  function initInstagramCarousel(){
    buildSwiper(qs('.insta-grid'), {
      slidesPerView:'auto',
      spaceBetween:18,
      freeMode:{enabled:true, momentum:true},
      centeredSlides:false
    }, 'instagram-swiper');
  }

  function initFounderAnimations(){
    const section = qs('.founder-spotlight');
    if(!section || !hasGSAP || prefersReduced) return;
    const media = qs('.founder-media .media-frame', section);
    const textItems = qsa('.eyebrow, h2, .role, p, .btn', section);
    gsap.fromTo(media, {clipPath:'inset(100% 0 0 0)'}, {
      clipPath:'inset(0% 0 0 0)',
      duration:1.2,
      ease:'power4.out',
      scrollTrigger:{trigger:section, start:'top 72%', once:true}
    });
    gsap.fromTo(textItems, {autoAlpha:0, y:24}, {
      autoAlpha:1,
      y:0,
      duration:.85,
      stagger:.09,
      ease:'power3.out',
      scrollTrigger:{trigger:section, start:'top 70%', once:true}
    });
    const img = media ? qs('img', media) : null;
    if(img) gsap.to(img, {yPercent:4, ease:'none', scrollTrigger:{trigger:section, start:'top bottom', end:'bottom top', scrub:1}});
  }

  function initReasonAnimations(){
    const rows = qsa('.why-premium .why-item');
    if(!rows.length || !hasGSAP || prefersReduced) return;
    gsap.fromTo(rows, {autoAlpha:0, y:38}, {
      autoAlpha:1,
      y:0,
      duration:.9,
      stagger:.12,
      ease:'power3.out',
      scrollTrigger:{trigger:'.why-premium', start:'top 72%', once:true}
    });
    rows.forEach(row => {
      row.addEventListener('mouseenter', () => gsap.to(row, {x:8, duration:.38, ease:'power2.out'}));
      row.addEventListener('mouseleave', () => gsap.to(row, {x:0, duration:.38, ease:'power2.out'}));
    });
  }

  function initPhilosophyMotion(){
    const section = qs('.philosophy');
    if(!section || !hasGSAP || prefersReduced) return;
    const image = qs('.media-frame img', section);
    const emphasis = qs('h2 em', section);
    if(image) gsap.fromTo(image, {scale:1.08}, {scale:1, ease:'none', scrollTrigger:{trigger:section, start:'top bottom', end:'bottom top', scrub:1}});
    if(emphasis) gsap.fromTo(emphasis, {color:'#F6F4EE'}, {color:'#D4B982', ease:'none', scrollTrigger:{trigger:section, start:'top 70%', end:'center center', scrub:1}});
  }

  function initFinalCTA(){
    const section = qs('.final-cta');
    if(!section || !hasGSAP || prefersReduced) return;
    const items = qsa('.eyebrow, h2 .motion-line-inner, p, .btn', section);
    gsap.fromTo(items, {autoAlpha:0, y:28}, {
      autoAlpha:1,
      y:0,
      duration:.92,
      stagger:.08,
      ease:'power3.out',
      scrollTrigger:{trigger:section, start:'top 74%', once:true}
    });
  }

  function initServiceDetailPremium(){
    const page = qs('.service-detail-page');
    if(!page || !hasGSAP || prefersReduced) return;

    const hero = qs('.sd-hero', page);
    if(hero){
      const bg = qs('.sd-hero-bg img', hero);
      const heroItems = qsa('.sd-breadcrumb, .sd-hero h1, .sd-title-rule, .sd-hero-copy p, .sd-hero-actions, .sd-hero-ticks, .sd-hero-card', hero);
      if(bg){
        gsap.fromTo(bg, {scale:1.08, autoAlpha:.76}, {scale:1, autoAlpha:1, duration:1.5, ease:'expo.out'});
        gsap.to(bg, {scale:1.06, yPercent:5, ease:'none', scrollTrigger:{trigger:hero, start:'top top', end:'bottom top', scrub:1}});
      }
      gsap.fromTo(heroItems, {autoAlpha:0, y:34}, {autoAlpha:1, y:0, duration:.95, ease:'power3.out', stagger:.08, delay:.18});
    }

    qsa('.sd-feature-grid article, .sd-work-card, .sd-tool-row span').forEach((el, index) => {
      gsap.fromTo(el, {autoAlpha:0, y:34}, {
        autoAlpha:1,
        y:0,
        duration:.82,
        ease:'power3.out',
        delay:(index % 6) * .035,
        scrollTrigger:{trigger:el, start:'top 88%', once:true}
      });
    });

    qsa('.sd-process-line').forEach(line => {
      line.style.setProperty('--line-scale', '0');
      gsap.to(line, {
        '--line-scale': 1,
        duration:1.2,
        ease:'power3.out',
        scrollTrigger:{trigger:line, start:'top 82%', once:true}
      });
      gsap.fromTo(qsa('article', line), {autoAlpha:0, y:28}, {
        autoAlpha:1,
        y:0,
        duration:.86,
        stagger:.12,
        ease:'power3.out',
        scrollTrigger:{trigger:line, start:'top 80%', once:true}
      });
    });
  }

  function initMagneticButtons(){
    if(!isDesktopFine || !hasGSAP || prefersReduced) return;
    qsa('.btn').forEach(btn => {
      btn.addEventListener('mousemove', event => {
        const rect = btn.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
        gsap.to(btn, {x:x * 8, y:y * 6, duration:.35, ease:'power2.out'});
      });
      btn.addEventListener('mouseleave', () => gsap.to(btn, {x:0, y:0, duration:.45, ease:'power3.out'}));
    });
  }

  function initFormsAndFilters(){
    const filterWrap = document.getElementById('pfFilters');
    if(filterWrap){
      filterWrap.addEventListener('click', event => {
        const btn = event.target.closest('.pf-btn');
        if(!btn) return;
        qsa('.pf-btn', filterWrap).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        qsa('#pfGrid .mason-item').forEach(item => {
          const show = cat === 'All' || item.dataset.cat === cat;
          item.style.display = show ? '' : 'none';
        });
        if(window.ScrollTrigger) ScrollTrigger.refresh();
      });
    }

    qsa('.sd-filter-row').forEach(row => {
      row.addEventListener('click', event => {
        const btn = event.target.closest('.sd-filter-btn');
        if(!btn) return;
        const section = row.closest('.sd-work');
        const filter = btn.dataset.filter;
        qsa('.sd-filter-btn', row).forEach(item => item.classList.remove('active'));
        btn.classList.add('active');
        qsa('.sd-work-card', section || document).forEach(card => {
          const show = filter === 'All' || card.dataset.cat === filter;
          card.style.display = show ? '' : 'none';
        });
        if(window.ScrollTrigger) ScrollTrigger.refresh();
      });
    });

    function validateEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
    function validatePhone(v){ return /^[\d\s\-\+\(\)]{7,20}$/.test(v); }

    const form = document.getElementById('inquiryForm');
    if(form){
      form.addEventListener('submit', event => {
        event.preventDefault();
        let valid = true;
        const setErr = (field, msg) => {
          const wrap = field.closest('.field');
          wrap.classList.toggle('invalid', !!msg);
          wrap.querySelector('.err-msg').textContent = msg || '';
          if(msg) valid = false;
        };
        const name = form.fullName, email = form.email, phone = form.phone, service = form.service, msg = form.message;
        setErr(name, name.value.trim() ? '' : 'Please enter your name.');
        setErr(email, email.value.trim() ? (validateEmail(email.value.trim()) ? '' : 'Enter a valid email address.') : 'Email is required.');
        setErr(phone, phone.value.trim() ? (validatePhone(phone.value.trim()) ? '' : 'Enter a valid phone number.') : 'Phone number is required.');
        setErr(service, service.value ? '' : 'Please select a service.');
        setErr(msg, msg.value.trim() ? '' : 'Tell us a little about your project.');
        const status = document.getElementById('formStatus');
        if(valid){
          status.textContent = 'Thank you - your inquiry has been noted. We will be in touch soon.';
          form.reset();
        } else {
          status.textContent = 'Please fix the highlighted fields.';
        }
      });
    }

    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function refreshAfterAssets(){
    if(!window.ScrollTrigger) return;
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  initHeader();
  initSmoothScroll();
  initScrollProgress();
  initTextReveals();
  initHeroAnimations();
  initGlobalReveals();
  initHeroIndicators();
  initMarquee();
  initImageReveals();
  initServiceMotion();
  initPortfolioCarousel();
  initInstagramCarousel();
  initFounderAnimations();
  initReasonAnimations();
  initPhilosophyMotion();
  initFinalCTA();
  initServiceDetailPremium();
  initMagneticButtons();
  initFormsAndFilters();
  refreshAfterAssets();
})();
