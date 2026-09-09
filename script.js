const letter = document.getElementById('letter');
const envelope = document.getElementById('envelope');
const openBtn = document.getElementById('openLetter');
const dots = [...document.querySelectorAll('.dot')];
const sections = [...document.querySelectorAll('.slide')];

function goTo(id){
  const el = document.getElementById(id);
  if(!el) return;
  document.body.classList.add('show-slides');
  el.scrollIntoView({behavior:'smooth', block:'start'});
  setActive(id);
}

function setActive(id){
  dots.forEach(d=>d.classList.toggle('active', d.dataset.target===id));
}

openBtn.addEventListener('click', ()=>{
  if(envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  openBtn.disabled = true;
  openBtn.style.opacity = '.6';
  setTimeout(()=>goTo('birthday'), 1250);
});

document.querySelectorAll('.next-btn').forEach(btn=>btn.addEventListener('click',()=>goTo(btn.dataset.target)));
dots.forEach(dot=>dot.addEventListener('click',()=>{
  if(dot.dataset.target==='letter'){
    document.body.classList.remove('show-slides');
    letter.classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
    setActive('letter');
  } else goTo(dot.dataset.target);
}));

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting && entry.target.classList.contains('slide')) setActive(entry.target.id);
  });
},{threshold:.45});
sections.forEach(s=>observer.observe(s));

// Subtle floating hearts on the opening screen.
const heartLayer=document.querySelector('.hearts');
function makeHeart(){
  if(document.body.classList.contains('show-slides')) return;
  const h=document.createElement('span');
  h.className='float-heart';
  h.textContent=['♡','♥','✦'][Math.floor(Math.random()*3)];
  h.style.left=(Math.random()*100)+'%';
  h.style.fontSize=(10+Math.random()*14)+'px';
  h.style.animationDuration=(5+Math.random()*5)+'s';
  heartLayer.appendChild(h);
  setTimeout(()=>h.remove(),10000);
}
setInterval(makeHeart,900);

// Keyboard navigation.
document.addEventListener('keydown',e=>{
  const active=dots.findIndex(d=>d.classList.contains('active'));
  if(e.key==='ArrowDown' || e.key==='ArrowRight'){
    const next=Math.min(active+1,dots.length-1);
    if(dots[next].dataset.target==='letter') return;
    goTo(dots[next].dataset.target);
  }
  if(e.key==='ArrowUp' || e.key==='ArrowLeft'){
    const prev=Math.max(active-1,0);
    if(prev===0){document.body.classList.remove('show-slides');window.scrollTo({top:0,behavior:'smooth'});setActive('letter');}
    else goTo(dots[prev].dataset.target);
  }
});
