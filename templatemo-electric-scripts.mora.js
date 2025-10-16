
(function(){
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if(menuToggle && navLinks){
    menuToggle.addEventListener('click', ()=>{
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // Nav on scroll
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 10){ nav.classList.add('scrolled'); }
    else{ nav.classList.remove('scrolled'); }
  });

  // Partículas moradas
  function createParticles(count=20){
    for(let i=0;i<count;i++){
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random()*100 + 'vw';
      p.style.top = (Math.random()*100) + 'vh';
      document.body.appendChild(p);
    }
  }
  createParticles(25);

  // Tabs Core Features
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

  // Rotador simple (Hero)
  const sets = Array.from(document.querySelectorAll('#textRotator .text-set'));
  let idx = 0;
  setInterval(()=>{
    sets[idx].classList.remove('active');
    idx = (idx + 1) % sets.length;
    sets[idx].classList.add('active');
  }, 4000);

  // Auto-scroll del carrusel
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
