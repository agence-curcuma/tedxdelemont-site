/* =========================================================
   TEDxDelémont — interactions
   ---------------------------------------------------------
   ⚙️  BILLETTERIE : un seul endroit à modifier (ci-dessous).
       Quand les places 2027 sont en vente :
         open : true
         url  : "https://…lien-billetterie…"
       Tous les boutons du site s'activent automatiquement.
   ========================================================= */
const TICKETS = {
  open: false,                          // ← passer à true le jour de l'ouverture
  url: "",                              // ← coller le lien de la billetterie
  labelOpen: "Réserver ma place",
  labelSoon: "Billetterie : patience, patience…"
};

function renderTickets(){
  document.querySelectorAll("[data-tickets]").forEach(el=>{
    const label = el.querySelector("span");
    if(TICKETS.open && TICKETS.url){
      el.setAttribute("href", TICKETS.url);
      el.setAttribute("target","_blank");
      el.setAttribute("rel","noopener");
      el.classList.remove("is-soon");
      el.removeAttribute("aria-disabled");
      if(label) label.textContent = el.dataset.tickets === "short" ? "Billetterie" : TICKETS.labelOpen;
    }else{
      el.removeAttribute("href");
      el.classList.add("is-soon");
      el.setAttribute("aria-disabled","true");
      if(label) label.textContent = TICKETS.labelSoon;
    }
  });
}

/* ---------- loader ---------- */
window.addEventListener("load",()=>{
  const l = document.querySelector(".loader");
  if(l) setTimeout(()=>l.classList.add("done"), 500);
});

/* ---------- navigation ---------- */
function initNav(){
  const nav = document.querySelector(".nav");
  const burger = document.querySelector(".burger");
  const bar = document.querySelector(".progress i");
  const setNavH = ()=>{
    if(nav) document.documentElement.style.setProperty("--nav-now", nav.offsetHeight + "px");
  };
  const onScroll = ()=>{
    const y = window.scrollY;
    if(nav) nav.classList.toggle("solid", y > 40);
    setNavH();
    if(bar){
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y/h)*100 : 0) + "%";
    }
  };
  window.addEventListener("scroll", onScroll, {passive:true});
  window.addEventListener("resize", onScroll, {passive:true});
  onScroll();
  setTimeout(setNavH, 400);

  // entrée animée du menu à l'ouverture de la page
  if(nav) setTimeout(()=>nav.classList.add("ready"), 120);

  if(burger){
    burger.addEventListener("click",()=>{
      const open = document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      document.body.style.overflow = open ? "hidden" : "";
      document.querySelectorAll(".drawer nav a").forEach((a,i)=>{
        a.style.transitionDelay = open ? (0.12 + i*0.055)+"s" : "0s";
      });
    });
    const close = document.querySelector(".drawer-close");
    if(close) close.addEventListener("click",()=>burger.click());
    document.querySelectorAll(".drawer a").forEach(a=>a.addEventListener("click",()=>{
      document.body.classList.remove("menu-open");
      document.body.style.overflow = "";
      burger.setAttribute("aria-expanded","false");
    }));
  }
  document.addEventListener("keydown",e=>{
    if(e.key === "Escape" && document.body.classList.contains("menu-open")) burger?.click();
  });
}

/* ---------- reveal on scroll ---------- */
function initReveal(){
  const els = document.querySelectorAll("[data-rv],[data-rv-img],.stack,.giant,.giant2");
  if(!("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("in")); return; }

  // certains blocs ne doivent apparaître qu'une fois le scroll enclenché
  let scrolled = window.scrollY > 4;
  const waiting = [];
  const onFirstScroll = ()=>{
    if(scrolled) return;
    scrolled = true;
    waiting.forEach(e=>io.observe(e));
    waiting.length = 0;
  };
  ["scroll","wheel","touchmove","keydown"].forEach(ev=>
    window.addEventListener(ev,onFirstScroll,{passive:true,once:true}));

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(!en.isIntersecting) return;
      const el = en.target;
      const d = parseFloat(el.dataset.rvDelay || 0);
      if(d) el.style.transitionDelay = d+"s";
      if(el.classList.contains("stack")){
        el.querySelectorAll(".ln>span").forEach((s,i)=>{ s.style.transitionDelay = (i*0.08)+"s"; });
      }
      el.classList.add("in");
      io.unobserve(el);
    });
  },{rootMargin:"0px 0px -10% 0px", threshold:.1});

  const vh = window.innerHeight || document.documentElement.clientHeight;
  els.forEach(e=>{
    if(!scrolled && e.closest("[data-rv-onscroll]")){ waiting.push(e); return; }

    // Tout ce qui est déjà dans le premier écran est révélé immédiatement.
    // L'observateur ignore les 10 % inférieurs du viewport : sans ce
    // court-circuit, un élément calé tout en bas du hero (le thème et le mot
    // géant sur mobile) n'était jamais révélé tant qu'on ne défilait pas.
    const r = e.getBoundingClientRect();
    if(r.top < vh && r.bottom > 0){
      if(e.classList.contains("stack")){
        e.querySelectorAll(".ln>span").forEach((s,i)=>{ s.style.transitionDelay = (i*0.08)+"s"; });
      }
      e.classList.add("in");
      return;
    }
    io.observe(e);
  });
}

/* ---------- fond hero : champ de points rouges réactif à la souris ---------- */
function initDots(){
  const cv = document.querySelector(".hero-dots");
  if(!cv) return;
  const ctx = cv.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  let W=0, H=0, dpr=1, pts=[], mx=-9999, my=-9999, tmx=-9999, tmy=-9999;

  function build(){
    dpr = Math.min(window.devicePixelRatio||1, 2);
    const r = cv.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = W*dpr; cv.height = H*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);

    const step = Math.max(46, Math.min(78, Math.round(Math.sqrt(W*H)/16)));
    pts = [];
    for(let y=step*0.5; y<H+step; y+=step){
      for(let x=step*0.5; x<W+step; x+=step){
        const jx = (Math.random()-.5)*step*.55;
        const jy = (Math.random()-.5)*step*.55;
        pts.push({
          bx:x+jx, by:y+jy, x:x+jx, y:y+jy, vx:0, vy:0,
          r: Math.random()<.09 ? 2.6 : (Math.random()<.4 ? 1.7 : 1.15),
          a: .18 + Math.random()*.45,
          ph: Math.random()*Math.PI*2,
          sp: .25 + Math.random()*.5
        });
      }
    }
  }

  window.addEventListener("mousemove", e=>{
    const r = cv.getBoundingClientRect();
    tmx = e.clientX - r.left; tmy = e.clientY - r.top;
  }, {passive:true});
  window.addEventListener("touchmove", e=>{
    const t = e.touches[0]; if(!t) return;
    const r = cv.getBoundingClientRect();
    tmx = t.clientX - r.left; tmy = t.clientY - r.top;
  }, {passive:true});
  document.addEventListener("mouseleave", ()=>{ tmx=-9999; tmy=-9999; });

  let t0 = performance.now();
  function frame(now){
    const dt = Math.min(40, now - t0); t0 = now;
    const time = now/1000;
    mx += (tmx-mx)*.12; my += (tmy-my)*.12;

    ctx.clearRect(0,0,W,H);

    // halo rouge qui suit la souris
    if(mx > -1000 && !reduce){
      const g = ctx.createRadialGradient(mx,my,0,mx,my,260);
      g.addColorStop(0,"rgba(235,0,40,.16)");
      g.addColorStop(1,"rgba(235,0,40,0)");
      ctx.fillStyle = g;
      ctx.fillRect(mx-260,my-260,520,520);
    }

    const R = 190, R2 = R*R;
    for(let i=0;i<pts.length;i++){
      const p = pts[i];
      let tx = p.bx, ty = p.by;

      if(!reduce){
        // dérive lente
        tx += Math.sin(time*p.sp + p.ph)*7;
        ty += Math.cos(time*p.sp*0.8 + p.ph)*7;
      }

      // répulsion souple autour du curseur
      const dx = p.x-mx, dy = p.y-my, d2 = dx*dx+dy*dy;
      let boost = 0;
      if(d2 < R2){
        const d = Math.sqrt(d2)||1;
        const f = (1 - d/R);
        boost = f;
        tx += (dx/d) * f*f * 62;
        ty += (dy/d) * f*f * 62;
      }

      p.vx += (tx-p.x)*0.06; p.vy += (ty-p.y)*0.06;
      p.vx *= 0.82; p.vy *= 0.82;
      p.x += p.vx*(dt/16.7); p.y += p.vy*(dt/16.7);

      const alpha = Math.min(1, p.a + boost*0.75);
      const rad = p.r * (1 + boost*0.9);
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad, 0, 6.2832);
      ctx.fillStyle = boost > .05
        ? `rgba(255,${Math.round(40 - boost*20)},${Math.round(70 - boost*20)},${alpha})`
        : `rgba(235,0,40,${alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  build();
  let rt; window.addEventListener("resize",()=>{clearTimeout(rt); rt=setTimeout(build,180)});
  requestAnimationFrame(frame);
}

/* ---------- curseur : X rouge (le x de TEDx) ---------- */
function initCursor(){
  if(window.matchMedia("(pointer:coarse)").matches) return;
  document.documentElement.classList.add("cursor-x");  // masque le curseur système
  const c = document.createElement("div");
  c.className = "cursor";
  c.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true">
      <circle class="ring" cx="50" cy="50" r="44"/>
      <line class="xline" x1="26" y1="26" x2="74" y2="74"/>
      <line class="xline" x1="74" y1="26" x2="26" y2="74"/>
    </svg>`;
  document.body.appendChild(c);
  const svg = c.querySelector("svg");
  let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y,rot=0,tRot=0,lastX=x;
  window.addEventListener("mousemove",e=>{
    x=e.clientX; y=e.clientY; c.classList.add("on");
    tRot += (x-lastX)*0.55;      // le X tourne selon le mouvement
    lastX = x;
  });
  document.addEventListener("mouseleave",()=>c.classList.remove("on"));
  (function loop(){
    cx += (x-cx)*.2; cy += (y-cy)*.2;
    rot += (tRot-rot)*.08;
    c.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    svg.style.transform = `rotate(${rot}deg)`;
    requestAnimationFrame(loop);
  })();
  const hot = "a,button,.reel-play,.hscroll,input,label,.chip";
  document.querySelectorAll(hot).forEach(el=>{
    el.addEventListener("mouseenter",()=>c.classList.add("hot"));
    el.addEventListener("mouseleave",()=>c.classList.remove("hot"));
  });
}

/* ---------- aftermovie en lecture auto, son coupé ---------- */
function initMovie(){
  document.querySelectorAll(".movie").forEach(box=>{
    const v = box.querySelector("video");
    const b = box.querySelector(".snd");
    if(!v) return;
    v.muted = true;                     // requis pour l'autoplay
    const p = v.play();
    if(p && p.catch) p.catch(()=>{ v.setAttribute("controls",""); });
    if(!b) return;
    b.addEventListener("click",()=>{
      v.muted = !v.muted;
      if(!v.muted) v.play();
      b.querySelector("span").textContent = v.muted ? "Activer le son" : "Couper le son";
      b.setAttribute("aria-pressed", v.muted ? "false" : "true");
    });
  });
}

/* ---------- ajuste un mot à la largeur exacte de son conteneur ----------
   Le mot est en inline-block : sa largeur mesurée est donc bien celle du
   texte, pas celle du bloc parent. On mesure à une taille de référence,
   on applique la règle de trois, puis on affine en deux passes pour
   absorber l'arrondi et le crénage. Résultat exact à toute largeur. */
function initFit(){
  const els = Array.from(document.querySelectorAll("[data-fit]"));
  if(!els.length) return;

  const fitOne = el=>{
    const p = el.parentElement;
    if(!p) return;
    const cs = getComputedStyle(p);
    const avail = p.clientWidth - parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0);
    if(avail <= 0) return;

    let size = 200;                       // taille de référence
    el.style.fontSize = size + "px";
    for(let i = 0; i < 3; i++){
      const w = el.getBoundingClientRect().width;
      if(!w) return;
      size = size * (avail / w);
      el.style.fontSize = size + "px";
    }
    el.style.fontSize = (size * 0.998).toFixed(3) + "px";   // marge d'un cheveu
  };
  const fitAll = ()=>els.forEach(fitOne);

  fitAll();
  requestAnimationFrame(fitAll);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
  window.addEventListener("load", fitAll);
  window.addEventListener("orientationchange", ()=>setTimeout(fitAll, 200));
  let t; window.addEventListener("resize", ()=>{ clearTimeout(t); t = setTimeout(fitAll, 100); });
  if("ResizeObserver" in window){
    const ro = new ResizeObserver(()=>fitAll());
    els.forEach(el=>el.parentElement && ro.observe(el.parentElement));
  }
}

/* ---------- galeries draggables ---------- */
function initDrag(){
  document.querySelectorAll(".hscroll").forEach(el=>{
    let down=false,sx=0,sl=0;
    el.addEventListener("pointerdown",e=>{down=true;sx=e.clientX;sl=el.scrollLeft;el.classList.add("drag")});
    el.addEventListener("pointermove",e=>{ if(!down) return; el.scrollLeft = sl-(e.clientX-sx); });
    ["pointerup","pointerleave","pointercancel"].forEach(ev=>el.addEventListener(ev,()=>{down=false;el.classList.remove("drag")}));
  });
}

/* ---------- aftermovie ---------- */
function initReel(){
  document.querySelectorAll(".reel-player").forEach(p=>{
    const v = p.querySelector("video");
    const b = p.querySelector(".reel-play");
    if(!v||!b) return;
    b.addEventListener("click",()=>{ v.play(); v.setAttribute("controls",""); p.classList.add("playing"); });
    v.addEventListener("pause",()=>{ if(v.currentTime===0) p.classList.remove("playing"); });
  });
}

/* ---------- sous-nav active ---------- */
function initSubnav(){
  const links = document.querySelectorAll(".subnav a[href^='#']");
  if(!links.length) return;
  const map = new Map();
  links.forEach(a=>{ const t = document.querySelector(a.getAttribute("href")); if(t) map.set(t,a); });
  const io = new IntersectionObserver(es=>{
    es.forEach(en=>{
      const a = map.get(en.target);
      if(a && en.isIntersecting){ links.forEach(l=>l.classList.remove("on")); a.classList.add("on"); }
    });
  },{rootMargin:"-25% 0px -65% 0px"});
  map.forEach((a,t)=>io.observe(t));
}

/* ---------- newsletter (à connecter) ---------- */
function initNewsletter(){
  document.querySelectorAll("form[data-newsletter]").forEach(f=>{
    f.addEventListener("submit",e=>{
      if(f.getAttribute("action")) return;
      e.preventDefault();
      const msg = f.parentElement.querySelector("[data-msg]");
      if(msg) msg.textContent = "Merci ! L'inscription sera active dès la connexion du service d'emailing.";
    });
  });
}

/* ---------- compte à rebours vers le 23 avril 2027 ---------- */
/* Recalculé à chaque chargement de page puis toutes les minutes :
   la valeur affichée est donc toujours à jour, sans intervention. */
function initClock(){
  const els = document.querySelectorAll("[data-countdown]");
  if(!els.length) return;
  const target = new Date("2027-04-23T17:00:00+02:00");
  const tick = ()=>{
    const days = Math.max(0, Math.ceil((target - new Date())/86400000));
    els.forEach(el=>{
      el.textContent = days > 0 ? "J−" + days : "C'est aujourd'hui";
      el.setAttribute("datetime","2027-04-23");
      el.setAttribute("title", days + " jours avant le TEDxDelémont 2027");
    });
  };
  tick(); setInterval(tick, 60000);
  // remise à jour quand on revient sur l'onglet
  document.addEventListener("visibilitychange",()=>{ if(!document.hidden) tick(); });
}

/* ---------- galerie photo : défilement continu ---------- */
function initPhotoMarquee(){
  document.querySelectorAll(".photomq-track").forEach(track=>{
    if(track.dataset.cloned) return;
    track.innerHTML += track.innerHTML;   // duplique pour une boucle sans couture
    track.dataset.cloned = "1";
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  renderTickets(); initNav(); initReveal(); initDots();
  initCursor(); initDrag(); initReel(); initSubnav();
  initNewsletter(); initClock(); initPhotoMarquee(); initMovie(); initFit();
  window.__tedxReady = true;   // témoin pour le filet de sécurité des pages
});
