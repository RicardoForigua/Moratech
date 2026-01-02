// UI helpers for MoraTech landing
(function(){
  const body = document.body;

  // Mobile menu
  const navLinks = document.getElementById('navLinks');
  const menuToggle = document.getElementById('menuToggle');
  if(menuToggle && navLinks){
    menuToggle.addEventListener('click', ()=>{
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link=>{
      link.addEventListener('click', ()=>{
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Hero slider
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dotsContainer = document.getElementById('heroDots');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  let current = 0;
  let timer;

  function renderDots(){
    if(!dotsContainer || !slides.length) return;
    dotsContainer.innerHTML = '';
    slides.forEach((_,i)=>{
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = i===0 ? 'active' : '';
      btn.addEventListener('click', ()=>goTo(i, true));
      dotsContainer.appendChild(btn);
    });
  }

  function setActive(index){
    slides.forEach((slide,i)=>{
      slide.classList.toggle('active', i===index);
    });
    if(dotsContainer){
      [...dotsContainer.children].forEach((dot,i)=>{
        dot.classList.toggle('active', i===index);
      });
    }
    current = index;
  }

  function goTo(index, userTriggered=false){
    if(!slides.length) return;
    const next = (index + slides.length) % slides.length;
    setActive(next);
    if(userTriggered) restartTimer();
  }

  function restartTimer(){
    if(timer) clearInterval(timer);
    timer = setInterval(()=>goTo(current+1), 10000);
  }

  if(slides.length){
    renderDots();
    setActive(0);
    restartTimer();
    // ensure nav buttons clickable above slides
    prevBtn?.setAttribute('aria-hidden','false');
    nextBtn?.setAttribute('aria-hidden','false');
  }
  prevBtn?.addEventListener('click', ()=>goTo(current-1, true));
  nextBtn?.addEventListener('click', ()=>goTo(current+1, true));

  // Video unmute helper
  document.addEventListener('DOMContentLoaded', ()=>{
    const video = document.getElementById('moraVideo');
    const unmuteBtn = document.getElementById('videoUnmute');
    if(!video || !unmuteBtn) return;

    const update = ()=>{ unmuteBtn.classList.toggle('is-hidden', !video.muted); };
    update();

    unmuteBtn.addEventListener('click', ()=>{
      video.muted = false;
      video.volume = 1;
      video.play().catch(()=>{});
      update();
    });
    video.addEventListener('volumechange', update);
  });

  // Reveal products on scroll (toggle show when in viewport)
  (function(){
    const cards = document.querySelectorAll('.catalog-grid .product-card');
    if(!cards.length) return;
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      });
    },{threshold:0.2, rootMargin:'0px 0px -5% 0px'});
    cards.forEach(c=>obs.observe(c));
  })();

  // Tabs
  (function(){
    const tabs = document.querySelectorAll('.tab-item');
    const panels = {
      stock: document.getElementById('panel-stock'),
      garantia: document.getElementById('panel-garantia'),
      compat: document.getElementById('panel-compat'),
      imagen: document.getElementById('panel-imagen'),
      acces: document.getElementById('panel-acces')
    };
    tabs.forEach(tab=>{
      tab.addEventListener('click', ()=>{
        tabs.forEach(t=>t.classList.remove('active'));
        tab.classList.add('active');
        Object.values(panels).forEach(p=>p?.classList.remove('active'));
        const key = tab.getAttribute('data-tab');
        panels[key]?.classList.add('active');
      });
    });
  })();


  // Product modal
  (function(){
    const modal = document.getElementById('productModal');
    if(!modal) return;
    const mTitle = document.getElementById('modalTitle');
    const mImg = document.getElementById('modalImg');
    const mMeta = document.getElementById('modalMeta');
    const mDesc = document.getElementById('modalDesc');
    const closeBtn = document.getElementById('modalClose');

    const close = ()=>{ modal.classList.remove('open'); body.style.overflow=''; };
    document.addEventListener('click', e=>{
      const btn = e.target.closest('a.btn.ghost[data-details]');
      if(!btn) return;
      e.preventDefault();
      const card = btn.closest('.product-card');
      const title = card?.querySelector('.product-title')?.textContent?.trim() || 'Detalle del producto';
      const meta = card?.querySelector('.product-meta')?.textContent?.trim() || '';
      const img = card?.querySelector('.product-media img')?.src || '';
      const desc = btn.getAttribute('data-desc') || '';
      mTitle.textContent = title;
      mMeta.textContent = meta;
      mImg.src = img;
      mDesc.textContent = desc;
      modal.classList.add('open');
      body.style.overflow='hidden';
    });
    modal.addEventListener('click', e=>{ if(e.target === modal) close(); });
    closeBtn?.addEventListener('click', close);
    document.addEventListener('keydown', e=>{ if(e.key === 'Escape') close(); });
  })();

  // Contact form feedback modal
  (function(){
    const form = document.querySelector('.contact-form');
    const modal = document.getElementById('feedbackModal');
    if(!form || !modal) return;

    const title = modal.querySelector('[data-feedback-title]');
    const text = modal.querySelector('[data-feedback-text]');
    const closeBtn = modal.querySelector('[data-feedback-close]');
    const submitBtn = form.querySelector('.submit-btn');
    const defaultBtnLabel = submitBtn ? submitBtn.textContent : '';
    let busy = false;

    const open = (isError, message)=>{
      modal.classList.toggle('is-error', isError);
      if(title){
        title.textContent = isError ? 'No se pudo enviar' : 'Solicitud recibida';
      }
      if(text){
        text.textContent = message || (isError
          ? 'No se pudo enviar el mensaje. Intenta de nuevo mas tarde.'
          : 'Gracias, recibimos tu solicitud. Te contactaremos pronto.');
      }
      modal.classList.add('open');
      modal.setAttribute('aria-hidden','false');
      body.style.overflow = 'hidden';
    };

    const close = ()=>{
      modal.classList.remove('open');
      modal.classList.remove('is-error');
      modal.setAttribute('aria-hidden','true');
      body.style.overflow = '';
    };

    closeBtn?.addEventListener('click', close);
    modal.addEventListener('click', e=>{ if(e.target === modal) close(); });
    document.addEventListener('keydown', e=>{
      if(e.key === 'Escape' && modal.classList.contains('open')) close();
    });

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      if(busy) return;
      busy = true;
      if(submitBtn){
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      try{
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        const contentType = response.headers.get('content-type') || '';
        let message = '';
        if(contentType.includes('application/json')){
          const data = await response.json().catch(()=>null);
          message = data?.message || '';
        } else {
          message = await response.text();
        }

        if(response.ok){
          form.reset();
          open(false, message);
        } else {
          open(true, message);
        }
      } catch (err){
        open(true, 'No se pudo enviar el mensaje. Intenta de nuevo mas tarde.');
      } finally {
        busy = false;
        if(submitBtn){
          submitBtn.disabled = false;
          submitBtn.textContent = defaultBtnLabel;
        }
      }
    });
  })();

  // Counters for metrics
  (function(){
    const counters = document.querySelectorAll('[data-counter]');
    if(!counters.length) return;

    const animate = (el)=>{
      const target = parseInt(el.getAttribute('data-target'),10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1600;
      const start = performance.now();

      const step = (now)=>{
        const progress = Math.min((now - start)/duration,1);
        const value = Math.floor(progress * target);
        el.textContent = `${value}${suffix}`;
        if(progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const obs = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          animate(entry.target);
        }
      });
    },{threshold:0.4});

    counters.forEach(c=>obs.observe(c));
  })();

  // WhatsApp widget
  (function(){
    const fab = document.getElementById('waFab');
    const card = document.getElementById('waCard');
    const close = document.getElementById('waClose');
    const widget = document.getElementById('waWidget');
    if(!fab || !card || !widget) return;

    const hide = ()=>{ card.classList.remove('open'); card.setAttribute('aria-hidden','true'); };
    const toggle = e=>{
      e?.stopPropagation();
      card.classList.toggle('open');
      card.setAttribute('aria-hidden', card.classList.contains('open') ? 'false' : 'true');
    };
    fab.addEventListener('click', toggle);
    close?.addEventListener('click', e=>{ e.stopPropagation(); hide(); });
    document.addEventListener('click', e=>{ if(!widget.contains(e.target)) hide(); });
    card.addEventListener('click', e=>e.stopPropagation());
  })();

  // Scroll spy
  (function(){
    const items = document.querySelectorAll('.nav-item');
    const map = {};
    items.forEach(link=>{
      const id = link.getAttribute('href');
      if(id && id.startsWith('#')) map[id.slice(1)] = link;
    });
    const observer = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const link = map[entry.target.id];
          if(!link) return;
          items.forEach(i=>i.classList.remove('active'));
          link.classList.add('active');
        }
      });
    },{threshold:0.45});
    document.querySelectorAll('section,header').forEach(sec=>observer.observe(sec));
  })();
})();
