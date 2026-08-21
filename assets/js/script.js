/* KV Media House — shared site behaviour (header, mobile menu, reveals, filters, form) */
(function(){
  const header = document.getElementById('siteHeader');
  if(header){
    const onScroll = ()=> header.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
  }

  const burgerBtn = document.getElementById('burgerBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if(burgerBtn && mobileMenu){
    const openMenu = ()=>{ mobileMenu.classList.add('open'); burgerBtn.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; };
    const closeMenu = ()=>{ mobileMenu.classList.remove('open'); burgerBtn.setAttribute('aria-expanded','false'); document.body.style.overflow=''; };
    burgerBtn.addEventListener('click', openMenu);
    if(closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeMenu));
  }

  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if(revealEls.length && 'IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:.14});
    revealEls.forEach(el=>io.observe(el));
  } else {
    revealEls.forEach(el=>el.classList.add('in'));
  }

  const filterWrap = document.getElementById('pfFilters');
  if(filterWrap){
    filterWrap.addEventListener('click', (e)=>{
      const btn = e.target.closest('.pf-btn');
      if(!btn) return;
      filterWrap.querySelectorAll('.pf-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('#pfGrid .mason-item').forEach(item=>{
        const show = cat==='All' || item.dataset.cat===cat;
        item.style.display = show ? '' : 'none';
      });
    });
  }

  function validateEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function validatePhone(v){ return /^[\d\s\-\+\(\)]{7,20}$/.test(v); }

  const form = document.getElementById('inquiryForm');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      let valid = true;
      const setErr = (field, msg)=>{
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
        status.textContent = 'Thank you — your inquiry has been noted. We will be in touch soon.';
        form.reset();
      } else {
        status.textContent = 'Please fix the highlighted fields.';
      }
    });
  }

  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
})();
