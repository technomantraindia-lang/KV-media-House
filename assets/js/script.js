/* KV Media House - shared site behaviour and premium motion */
(function(){
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const isDesktopFine = window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)').matches;

  if(hasGSAP) gsap.registerPlugin(ScrollTrigger);

  function initPreloader(){
    const scriptSrc = document.currentScript ? document.currentScript.getAttribute('src') || '' : '';
    const assetBase = scriptSrc.replace(/assets\/js\/script\.js.*$/i, 'assets/');
    const loader = document.createElement('div');
    loader.className = 'kv-preloader';
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-label', 'Loading KV Media House');
    loader.innerHTML = `
      <div class="kv-preloader-bg" aria-hidden="true"></div>
      <div class="kv-preloader-stage">
        <span class="kv-preloader-orbit" aria-hidden="true"></span>
        <span class="kv-preloader-spark spark-one" aria-hidden="true"></span>
        <span class="kv-preloader-spark spark-two" aria-hidden="true"></span>
        <span class="kv-preloader-spark spark-three" aria-hidden="true"></span>
        <div class="kv-preloader-logo-shell">
          <img src="${assetBase}images/logo-final-header.png" alt="KV Media House logo" class="kv-preloader-logo">
          <span class="kv-preloader-shine" aria-hidden="true"></span>
        </div>
        <div class="kv-preloader-wordmark" aria-hidden="true">
          <span>KV</span>
          <small>MEDIA HOUSE</small>
        </div>
        <span class="kv-preloader-line" aria-hidden="true"><i></i></span>
      </div>
    `;
    document.body.prepend(loader);
    document.body.classList.add('kv-preloader-lock');

    const finish = () => {
      if(loader.dataset.done === 'true') return;
      loader.dataset.done = 'true';
      const release = () => {
        document.body.classList.remove('kv-preloader-lock');
        loader.remove();
        if(window.ScrollTrigger) ScrollTrigger.refresh(true);
      };
      if(hasGSAP && !prefersReduced){
        gsap.timeline({onComplete:release})
          .to('.kv-preloader-line i', {scaleX:1, duration:.32, ease:'power2.inOut'})
          .to(loader, {autoAlpha:0, duration:.72, ease:'power3.inOut'}, '+=.12')
          .to('.page-fade', {autoAlpha:1, y:0, duration:.01}, '<');
      } else {
        loader.classList.add('is-hidden');
        window.setTimeout(release, prefersReduced ? 80 : 520);
      }
    };

    if(hasGSAP && !prefersReduced){
      const logo = loader.querySelector('.kv-preloader-logo');
      const tl = gsap.timeline({defaults:{ease:'power3.out'}});
      tl.set('.page-fade', {autoAlpha:0, y:14})
        .fromTo(loader, {autoAlpha:0}, {autoAlpha:1, duration:.18})
        .fromTo('.kv-preloader-logo-shell', {scale:.78, rotation:-4, autoAlpha:0}, {scale:1, rotation:0, autoAlpha:1, duration:.95, ease:'expo.out'}, '-=.02')
        .fromTo('.kv-preloader-orbit', {scale:.72, rotation:-36, autoAlpha:0}, {scale:1, rotation:0, autoAlpha:1, duration:1.1, ease:'expo.out'}, '-=.74')
        .fromTo('.kv-preloader-wordmark span, .kv-preloader-wordmark small', {y:16, autoAlpha:0}, {y:0, autoAlpha:1, duration:.62, stagger:.08}, '-=.48')
        .fromTo('.kv-preloader-line i', {scaleX:0}, {scaleX:.72, duration:1.05, ease:'power2.inOut'}, '-=.62')
        .fromTo('.kv-preloader-spark', {scale:0, autoAlpha:0}, {scale:1, autoAlpha:1, duration:.5, stagger:.08, ease:'back.out(2)'}, '-=.8');
      gsap.to(logo, {filter:'drop-shadow(0 0 24px rgba(195,167,125,.6)) drop-shadow(0 20px 48px rgba(0,0,0,.75))', duration:1.1, yoyo:true, repeat:-1, ease:'sine.inOut'});
      gsap.to('.kv-preloader-orbit', {rotation:360, duration:4.8, repeat:-1, ease:'none'});
      gsap.to('.kv-preloader-shine', {xPercent:240, duration:1.55, repeat:-1, repeatDelay:.4, ease:'power2.inOut'});
    }

    const loaded = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise(resolve => window.addEventListener('load', resolve, {once:true}));
    const minimum = new Promise(resolve => window.setTimeout(resolve, prefersReduced ? 250 : 1650));
    const maximum = window.setTimeout(finish, prefersReduced ? 1200 : 3600);
    Promise.all([loaded, minimum]).then(() => {
      window.clearTimeout(maximum);
      finish();
    });
  }

  function initHeader(){
    const header = document.getElementById('siteHeader');
    if(header){
      const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 100);
      onScroll();
      window.addEventListener('scroll', onScroll, {passive:true});
      if(hasGSAP && !prefersReduced){
        gsap.fromTo(header, {autoAlpha:0}, {autoAlpha:1, duration:.6, ease:'power3.out', delay:.08});
      }
      const path = window.location.pathname.replace(/\/$/, '/index.html');
      const activeKey = path.includes('/services/') || path.endsWith('/services.html')
        ? 'services.html'
        : path.split('/').pop();
      qsa('.desktop-nav .nav-link', header).forEach(link => {
        const href = link.getAttribute('href') || '';
        link.classList.toggle('active', !!activeKey && href.endsWith(activeKey));
      });
      const mobileMenu = document.getElementById('mobileMenu');
      if(mobileMenu){
        qsa('nav a', mobileMenu).forEach(link => {
          const href = link.getAttribute('href') || '';
          link.classList.toggle('active', !!activeKey && href.endsWith(activeKey));
        });
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
    if(!window.matchMedia('(min-width: 1025px) and (hover: hover) and (pointer: fine)').matches) return;
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
      if(el.classList.contains('service-panel')) return;
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

    if(window.matchMedia('(min-width: 769px) and (hover: hover)').matches){
      gsap.to(bg, {yPercent:8, ease:'none', scrollTrigger:{trigger:hero, start:'top top', end:'bottom top', scrub:1}});
    }

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
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    qsa('.about-service-collage img, .founder-media .media-frame, .service-panel .sp-media, .mason-item, .insta-item .media-frame').forEach((el, index) => {
      if(isMobile && el.closest('.service-panel')) {
        gsap.set(el, {clipPath:'inset(0% 0 0 0)', autoAlpha:1});
        return;
      }
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

    panels.forEach(panel => {
      panel.classList.add('in');
      panel.dataset.gsapReveal = 'done';
      if(hasGSAP) gsap.set(panel, {autoAlpha:1, x:0, y:0, clearProps:'transform'});
    });
    if(hasGSAP) gsap.set(track, {x:0, clearProps:'transform'});
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
    /* Use responsive CSS grid — avoids Swiper DOM glitches on resize */
  }

  function initInstagramCarousel(){
    /* Use responsive CSS grid — avoids Swiper DOM glitches on resize */
  }

  function initResponsiveHelpers(){
    const mobileMenu = document.getElementById('mobileMenu');
    const burgerBtn = document.getElementById('burgerBtn');
    const desktopNav = window.matchMedia('(min-width: 981px)');

    const closeMenuIfDesktop = () => {
      if(desktopNav.matches && mobileMenu && mobileMenu.classList.contains('open')){
        mobileMenu.classList.remove('open');
        if(burgerBtn) burgerBtn.setAttribute('aria-expanded','false');
        document.body.style.overflow = '';
      }
    };
    desktopNav.addEventListener('change', closeMenuIfDesktop);

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        closeMenuIfDesktop();
        if(window.ScrollTrigger) ScrollTrigger.refresh(true);
      }, 180);
    };
    window.addEventListener('resize', onResize, {passive:true});
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        closeMenuIfDesktop();
        if(window.ScrollTrigger) ScrollTrigger.refresh(true);
      }, 320);
    }, {passive:true});

    setTimeout(() => {
      qsa('.reveal, .reveal-stagger').forEach(el => {
        const style = getComputedStyle(el);
        const opacity = parseFloat(style.opacity);
        if(opacity < 0.1 || style.visibility === 'hidden'){
          el.classList.add('in');
          if(window.gsap) gsap.set(el, {autoAlpha:1, x:0, y:0, clearProps:'transform'});
        }
      });
    }, 2200);
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
    if(img && window.matchMedia('(min-width: 769px) and (hover: hover)').matches){
      gsap.to(img, {yPercent:4, ease:'none', scrollTrigger:{trigger:section, start:'top bottom', end:'bottom top', scrub:1}});
    }
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
    if(emphasis) gsap.fromTo(emphasis, {color:'#F3EFE7'}, {color:'#C3A77D', ease:'none', scrollTrigger:{trigger:section, start:'top 70%', end:'center center', scrub:1}});
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
        if(window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)').matches){
          gsap.to(bg, {scale:1.06, yPercent:5, ease:'none', scrollTrigger:{trigger:hero, start:'top top', end:'bottom top', scrub:1}});
        }
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

    const form = document.getElementById('inquiryForm');
    if(form){
      const status = document.getElementById('formStatus');
      const submitBtn = form.querySelector('button[type="submit"]');

      form.addEventListener('submit', async event => {
        event.preventDefault();
        let valid = true;
        const setErr = (field, msg) => {
          if(!field) return;
          const wrap = field.closest('.field');
          wrap.classList.toggle('invalid', !!msg);
          wrap.querySelector('.err-msg').textContent = msg || '';
          if(msg) valid = false;
        };
        const name = form.fullName;
        const email = form.email;
        const service = form.service;
        const msg = form.message;
        setErr(name, name.value.trim() ? '' : 'Please enter your name.');
        setErr(email, email.value.trim() ? (validateEmail(email.value.trim()) ? '' : 'Enter a valid email address.') : 'Email is required.');
        setErr(service, service.value ? '' : 'Please select a service.');
        setErr(msg, msg.value.trim() ? '' : 'Tell us about your project.');
        if(!valid){
          status.textContent = 'Please fix the highlighted fields.';
          return;
        }

        status.textContent = 'Sending your inquiry…';
        if(submitBtn) submitBtn.disabled = true;

        try {
          const payload = {
            name: name.value.trim(),
            email: email.value.trim(),
            company: form.brand ? form.brand.value.trim() : '',
            service: service.value,
            budget: form.budget ? form.budget.value.trim() : '',
            startDate: form.startDate ? form.startDate.value : '',
            message: msg.value.trim(),
            _subject: 'New Project Inquiry — KV Media House Website',
            _template: 'table',
            _captcha: 'false',
            _replyto: email.value.trim(),
            _autoresponse: `Hi ${name.value.trim()}, thank you for contacting KV Media House. We have received your inquiry and our team will review your project details soon. You can also reach us directly at info@kvmediahouse.com.`
          };
          const response = await fetch('https://formsubmit.co/ajax/info@kvmediahouse.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await response.json().catch(() => ({}));
          if(response.ok && (data.success === 'true' || data.success === true)){
            status.textContent = 'Thank you — your inquiry has been sent. Our team will contact you soon.';
            form.reset();
          } else {
            throw new Error('submit_failed');
          }
        } catch (err) {
          status.textContent = 'Unable to send right now. Please email info@kvmediahouse.com directly.';
        } finally {
          if(submitBtn) submitBtn.disabled = false;
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

  initPreloader();
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
  initResponsiveHelpers();
  refreshAfterAssets();
})();
