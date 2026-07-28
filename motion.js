/* ============================================================
   Nafeesa Khan — Portfolio v2 shared motion system
   Built on GSAP + ScrollTrigger (CDN). Fully guarded behind
   prefers-reduced-motion — reduced-motion users get the final
   resting state instantly, no animation at all.
============================================================ */
(function(){
  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COARSE = window.matchMedia && window.matchMedia('(hover:none), (pointer:coarse)').matches;
  document.documentElement.classList.add(REDUCE ? 'reduce-motion' : 'js-ready');

  // ---------- Reduced-motion / no-GSAP fallback ----------
  if (REDUCE || typeof gsap === 'undefined'){
    document.querySelectorAll('.reveal').forEach(function(el){
      el.style.opacity = 1; el.style.transform = 'none';
    });
    // still wire up the lightweight, non-animated bits
    initHeaderState();
    initScrollProgress(true);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  document.addEventListener('DOMContentLoaded', function(){
    initHeaderState();
    initScrollProgress(false);
    if (!COARSE) initCursor();
    initHeroSplit();
    initReveals();
    initStaggerGroups();
    initMagnetic();
    initParallaxCovers();
    initMarquee();
  });

  // ---------- Header blur state ----------
  function initHeaderState(){
    var header = document.querySelector('header');
    if (!header) return;
    window.addEventListener('scroll', function(){
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    }, { passive:true });
  }

  // ---------- Scroll progress bar ----------
  function initScrollProgress(staticOnly){
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    function update(){
      var h = document.documentElement;
      var pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = (pct || 0) + '%';
    }
    window.addEventListener('scroll', update, { passive:true });
    update();
  }

  // ---------- Custom cursor ----------
  function initCursor(){
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.innerHTML = '<span class="cursor-label"></span>';
    document.body.append(dot, ring);

    var dotX = gsap.quickTo(dot, 'x', { duration:.12, ease:'power3.out' });
    var dotY = gsap.quickTo(dot, 'y', { duration:.12, ease:'power3.out' });
    var ringX = gsap.quickTo(ring, 'x', { duration:.35, ease:'power3.out' });
    var ringY = gsap.quickTo(ring, 'y', { duration:.35, ease:'power3.out' });

    window.addEventListener('mousemove', function(e){
      dotX(e.clientX); dotY(e.clientY);
      ringX(e.clientX); ringY(e.clientY);
    });

    document.querySelectorAll('[data-cursor]').forEach(function(el){
      var label = el.getAttribute('data-cursor');
      el.addEventListener('mouseenter', function(){
        ring.classList.add('is-active');
        ring.querySelector('.cursor-label').textContent = label || '';
      });
      el.addEventListener('mouseleave', function(){
        ring.classList.remove('is-active');
      });
    });
  }

  // ---------- Hero headline split reveal ----------
  function initHeroSplit(){
    document.querySelectorAll('.name, .page-title').forEach(function(el){
      var text = el.textContent.trim();
      var words = text.split(/\s+/);
      el.innerHTML = words.map(function(w){
        return '<span class="word"><span>' + w + '</span></span>';
      }).join(' ');
      gsap.from(el.querySelectorAll('.word > span'), {
        yPercent:110, duration:.9, stagger:.06, ease:'expo.out', delay:.15
      });
    });
  }

  // ---------- Generic scroll reveals ----------
  function initReveals(){
    document.querySelectorAll('.reveal').forEach(function(el){
      gsap.to(el, {
        opacity:1, y:0, duration:.7, ease:'power2.out',
        scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none reverse' }
      });
    });
  }

  // ---------- Stagger groups (grids, lists) ----------
  function initStaggerGroups(){
    document.querySelectorAll('[data-stagger-group]').forEach(function(group){
      var items = group.children;
      gsap.from(items, {
        opacity:0, y:24, scale:.96, duration:.55, ease:'back.out(1.4)',
        stagger:{ each:.09, grid:'auto', from:'start' },
        scrollTrigger:{ trigger:group, start:'top 85%', toggleActions:'play none none reverse' }
      });
    });
  }

  // ---------- Magnetic hover ----------
  function initMagnetic(){
    if (COARSE) return;
    document.querySelectorAll('[data-magnetic]').forEach(function(el){
      var xTo = gsap.quickTo(el, 'x', { duration:.4, ease:'elastic.out(1,0.4)' });
      var yTo = gsap.quickTo(el, 'y', { duration:.4, ease:'elastic.out(1,0.4)' });
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width/2) * .3);
        yTo((e.clientY - r.top - r.height/2) * .3);
      });
      el.addEventListener('mouseleave', function(){ xTo(0); yTo(0); });
    });
  }

  // ---------- Cover media parallax ----------
  function initParallaxCovers(){
    document.querySelectorAll('.case-cover .cover-media').forEach(function(el, i){
      gsap.to(el, {
        yPercent: (i % 2 === 0) ? -8 : 8, ease:'none',
        scrollTrigger:{ trigger: el.closest('.case-card'), scrub:.6 }
      });
    });
  }

  // ---------- Marquee duplication (seamless loop) ----------
  function initMarquee(){
    document.querySelectorAll('.marquee').forEach(function(m){
      m.innerHTML += m.innerHTML;
    });
  }
})();
