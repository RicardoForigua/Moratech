// Electric Xtra — Tema mora + toggle Light/Dark + carrusel + UI
(function(){
  const docEl = document.documentElement;

  // Read saved theme or system preference
  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  if(saved){ docEl.setAttribute('data-theme', saved === 'light' ? 'light' : ''); if(saved !== 'light') docEl.removeAttribute('data-theme'); }
  else if(prefersLight){ docEl.setAttribute('data-theme', 'light'); }

  // Theme toggle
  const toggleBtn = document.getElementById('themeToggle');
  if(toggleBtn){
    toggleBtn.addEventListener('click', ()=>{
      const isLight = docEl.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      if(next === 'dark') docEl.removeAttribute('data-theme');
      else docEl.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', next);
    });
  }

  // Mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if(menuToggle && navLinks){
    menuToggle.addEventListener('click', ()=>{
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }


// === Reproducir video al hacer scroll ===


document.addEventListener("DOMContentLoaded", function() {
  const video = document.getElementById("moraVideo");
  const unmuteBtn = document.getElementById("videoUnmute");
  if (!video) return;

  // Si el video ya viene con sonido desactivado, muestra el botón.
  const updateUnmuteBtn = () => {
    if (video.muted) unmuteBtn?.classList.remove('is-hidden');
    else unmuteBtn?.classList.add('is-hidden');
  };
  updateUnmuteBtn();

  // Botón para activar sonido (necesita interacción del usuario)
  unmuteBtn?.addEventListener("click", () => {
    video.muted = false;
    video.volume = 1;
    updateUnmuteBtn();
    // Si estaba pausado, reproduce tras la interacción (permitido por los navegadores)
    if (video.paused) { video.play().catch(()=>{}); }
  });

  // Respetar la intención del usuario
  let userPaused = false;
  video.addEventListener("pause", () => { userPaused = true; });
  video.addEventListener("play",  () => { userPaused = false; });
  video.addEventListener("volumechange", updateUnmuteBtn);

  // Autoplay silencioso al entrar en viewport (y pausar al salir)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Reproduce solo si el usuario NO lo dejó en pausa manual
        if (!userPaused && video.paused) {
          video.play().catch(()=>{}); // Autoplay con muted = OK
        }
      } else {
        if (!video.paused) video.pause();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(video);
});









  // Sticky nav
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 10){ nav.classList.add('scrolled'); }
    else{ nav.classList.remove('scrolled'); }
  });

  // Partículas (mora)
  function createParticles(count=25){
    for(let i=0;i<count;i++){
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random()*100 + 'vw';
      p.style.top = (Math.random()*100) + 'vh';
      document.body.appendChild(p);
    }
  }
  createParticles(25);

  // Tabs
  const tabs = document.querySelectorAll('.tab-item');
  const panels = {
    stock: document.getElementById('panel-stock'),
    garantia: document.getElementById('panel-garantia'),
    compat: document.getElementById('panel-compat'),
    imagen: document.getElementById('panel-imagen'),
    acces: document.getElementById('panel-acces')
  };
  tabs.forEach(t=>t.addEventListener('click', ()=>{
    tabs.forEach(x=>x.classList.remove('active'));
    Object.values(panels).forEach(p=>p.classList.remove('active'));
    t.classList.add('active');
    const key = t.getAttribute('data-tab');
    const panel = panels[key];
    if(panel) panel.classList.add('active');
  }));

  // Rotador Hero
  const sets = Array.from(document.querySelectorAll('#textRotator .text-set'));
  let idx = 0;
  setInterval(()=>{
    if(!sets.length) return;
    sets[idx].classList.remove('active');
    idx = (idx + 1) % sets.length;
    sets[idx].classList.add('active');
  }, 4000);





  // Carrusel auto-scroll
  const track = document.getElementById('carouselTrack');
  if(track){
    let dir = 1;
    setInterval(()=>{
      const max = track.scrollWidth - track.clientWidth;
      if(track.scrollLeft >= max) dir = -1;
      if(track.scrollLeft <= 0) dir = 1;
      track.scrollTo({ left: track.scrollLeft + (20*dir), behavior: 'smooth' });
    }, 2500);
  }
})();




// === Carrusel de logos (auto-rotate) ===
(function(){
  const slides = Array.from(document.querySelectorAll('#logoCarousel .logo-slide'));
  if(!slides.length) return;
  let i = 0;
  setInterval(()=>{
    slides[i].classList.remove('active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('active');
  }, 2500);
})();

// Modal de producto
(function(){
  const modal   = document.getElementById('productModal');
  if(!modal) return;
  const mTitle  = document.getElementById('modalTitle');
  const mImg    = document.getElementById('modalImg');
  const mMeta   = document.getElementById('modalMeta');

  let mDesc = document.getElementById('modalDesc');
  if(!mDesc){

    mDesc = mMeta;
  }

  const closeBtn= document.getElementById('modalClose');

  document.addEventListener('click',(e)=>{
    const btn = e.target.closest('a.btn.ghost[data-details]');
    if(!btn) return;
    const card = btn.closest('.product-card'); if(!card) return;
    e.preventDefault();

    const title = card.querySelector('.product-title')?.textContent?.trim() || 'Detalle del producto';
    const meta  = card.querySelector('.product-meta')?.textContent?.trim()  || '';
    const img   = card.querySelector('.product-media img')?.getAttribute('src') || '';
    const desc  = btn.getAttribute('data-desc') || ''; 

    mTitle.textContent = title;
    mMeta.textContent  = meta;
    mImg.src           = img;
    mDesc.textContent  = desc; 
    modal.classList.add('open'); 
    document.body.style.overflow='hidden';
  });

  const close=()=>{ modal.classList.remove('open'); document.body.style.overflow=''; };
  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click',(e)=>{ if(e.target===modal) close(); });
  document.addEventListener('keydown',(e)=>{ if(e.key==='Escape' && modal.classList.contains('open')) close(); });
})();


// === Carrusel catálogo: flechas para desplazar ===
(function(){
  const track = document.getElementById('catalogoTrack') || document.getElementById('carouselTrack');
  const prev  = document.querySelector('.carousel .prev');
  const next  = document.querySelector('.carousel .next');
  if(!track || !prev || !next) return;

  const step = () => Math.min( (track.clientWidth || 800) * 0.9, 600 ); // tamaño del scroll

  prev.addEventListener('click', ()=> track.scrollBy({left: -step(), behavior: 'smooth'}));
  next.addEventListener('click', ()=> track.scrollBy({left:  step(), behavior: 'smooth'}));
})();


// WhatsApp: abrir/cerrar tarjeta
document.addEventListener('DOMContentLoaded', function(){
  const fab   = document.getElementById('waFab');
  const card  = document.getElementById('waCard');
  const close = document.getElementById('waClose');
  if(!fab || !card) return;

  const toggle = (e)=>{ e?.stopPropagation(); card.classList.toggle('open'); card.setAttribute('aria-hidden', card.classList.contains('open')?'false':'true'); };
  const hide   = (e)=>{ if(card.classList.contains('open')){ card.classList.remove('open'); card.setAttribute('aria-hidden','true'); } };

  fab.addEventListener('click', toggle);
  close?.addEventListener('click', (e)=>{ e.stopPropagation(); hide(); });

  // Cerrar si hacen click fuera
  document.addEventListener('click', (e)=>{
    const w = document.getElementById('waWidget');
    if(!w.contains(e.target)) hide();
  });

  // Evitar que clicks dentro de la tarjeta la cierren por propagación
  card.addEventListener('click', (e)=> e.stopPropagation());
});

