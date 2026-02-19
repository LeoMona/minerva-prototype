/* ---------- Data (mock) ---------- */
const GRADES = ["K","1","2","3","4","5","6","7","8","9","10","11","12"];

const LESSONS = [
  { id:"l1", title:"Foundations of Climate", subject:"Science", mode:"Self‑paced", grades:[6,7,8,9], band:"6-9" },
  { id:"l2", title:"Metacognition 101", subject:"Life Skills", mode:"Guided", grades:[5,6,7,8,9,10], band:"5-10" },
  { id:"l3", title:"Community Project", subject:"Social Studies", mode:"Collaborative", grades:[7,8,9,10,11,12], band:"7-12" },
  { id:"l4", title:"Fractions with Minecraft", subject:"Math", mode:"Guided", grades:[3,4,5], band:"3-5" },
  { id:"l5", title:"Narrative Writing", subject:"English", mode:"Self‑paced", grades:[6,7], band:"6-7" },
  { id:"l6", title:"Scratch: Arcade Games", subject:"Computer Science", mode:"Self‑paced", grades:[4,5,6], band:"4-6" },
  { id:"l7", title:"Watercolor Basics", subject:"Arts", mode:"Studio", grades:[6,7,8], band:"6-8" },
  { id:"l8", title:"Fitness Circuits", subject:"PE", mode:"Coach‑led", grades:[9,10,11,12], band:"9-12" },
];

const PEERS = [
  { id:"p1", name:"A. Singh", role:"Learner", interests:["Robotics","Climate"], grade:8 },
  { id:"p2", name:"R. Das", role:"Learner", interests:["Art","Debate"], grade:9 },
  { id:"p3", name:"Mentor Dev", role:"Mentor", interests:["Robotics","SDG 13"], grade:null },
  { id:"p4", name:"Ms. Gupta", role:"Teacher", interests:["Debate","Climate"], grade:null },
  { id:"p5", name:"K. Rao", role:"Learner", interests:["Sports","Climate"], grade:6 },
];

/* Diverse, school-realistic projects (not only Climate). */
const PROJECTS = [
  { id:"pr1",  title:"Clean Air Monitor", theme:"SDG 11", band:"6-8", blurb:"Students prototype low‑cost air‑quality sensors and map hotspots around school.", skills:["Design","Data","IoT"] },
  { id:"pr2",  title:"Wellness Ambassadors", theme:"SDG 3", band:"9-12", blurb:"Peer‑led campaign to improve sleep, movement, and nutrition.", skills:["Leadership","Communication"] },
  { id:"pr3",  title:"Learning Toolkit", theme:"SDG 4", band:"K-2", blurb:"Story‑based routines to practice planning and reflection.", skills:["Executive function","Storytelling"] },
  { id:"pr4",  title:"Local History Oral Archive", theme:"Community", band:"6-8", blurb:"Interview elders, digitize stories, and publish a class archive.", skills:["Research","Audio","Curation"] },
  { id:"pr5",  title:"School Garden to Table", theme:"Community", band:"3-5", blurb:"Design a seasonal garden and create a simple recipe e‑book.", skills:["Biology","Writing","Design"] },
  { id:"pr6",  title:"Assistive Tech Hackathon", theme:"STEM", band:"9-12", blurb:"Teams build low‑cost assistive devices with microcontrollers.", skills:["Prototyping","Electronics"] },
  { id:"pr7",  title:"Math Trails @ Campus", theme:"STEM", band:"6-8", blurb:"Create a self‑guided math trail with QR‑coded problems.", skills:["Mathematical modeling","Communication"] },
  { id:"pr8",  title:"Cultural Heritage Zine", theme:"Arts & Culture", band:"3-5", blurb:"Illustrated zines celebrating families’ traditions.", skills:["Illustration","Writing","Publishing"] },
  { id:"pr9",  title:"Eco‑Audit & Action Plan", theme:"SDG 13", band:"9-12", blurb:"Measure energy/waste baselines; propose actionable changes.", skills:["Data","Policy","Advocacy"] },
  { id:"pr10", title:"Community Library App", theme:"STEM", band:"9-12", blurb:"Build a simple web app to catalog and lend class books.", skills:["Web","UX","PM"] },
];

/* ---------- Utility ---------- */
const $  = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];
const toast = (msg) => { const t = $('#toast'); if(!t) return; t.textContent = msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 2200); };

/* Safer localStorage (won’t crash in private modes) */
const save = (k,v)=>{ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} };
const load = (k, d=null)=>{ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : (d!==null?d:null); }catch{ return d!==null?d:null; } };

/* Routing */
const routes = () => $$("#main [data-route]").map(s=>s.id); // not used; kept for reference
function go(hash){
  const target = (hash||'').replace('#','') || 'join';
  $$("nav a[data-link]").forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+target));
  ["join","login","lessons","peers","projects","dashboard"].forEach(id => {
    const el = $('#'+id);
    if(el) el.classList.toggle('hidden', id!==target);
  });
  if(target==='dashboard') refreshDashboard();
  if(target==='lessons') renderLessons();
  if(target==='peers') renderPeers();
  if(target==='projects') renderProjects();
  const hasUser = !!load('minerva_current_user');
  const logoutBtn = $('#logoutBtn'); if (logoutBtn) logoutBtn.classList.toggle('hidden', !hasUser);
}
window.addEventListener('hashchange', ()=>go(location.hash));

/* Auth helpers */
function currentUser(){ return load('minerva_current_user'); }
function users(){ return load('minerva_users', []); }

/* ---------- Init on DOM ready ---------- */
document.addEventListener('DOMContentLoaded', () => {
  wireAuth();
  initGrades();
  go(location.hash || '#join');
  ensureDialogFallback();
});

/* ---------- Auth ---------- */
function wireAuth(){
  const joinForm = $('#joinForm');
  if(joinForm){
    joinForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const u = {
        id: 'u_'+Date.now(),
        firstName: $('#firstName').value.trim(),
        lastName: $('#lastName').value.trim(),
        role: $('#role').value,
        email: $('#email').value.trim().toLowerCase(),
        pw: $('#pw').value
      };
      const all = users();
      if(all.some(x=>x.email===u.email)) return toast('This email is already registered.');
      all.push(u); save('minerva_users', all); save('minerva_current_user', {id:u.id, name:u.firstName});
      toast('Welcome '+u.firstName+'! Account created.');
      location.hash = '#dashboard';
    });
  }

  const loginForm = $('#loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = $('#loginEmail').value.trim().toLowerCase();
      const pw = $('#loginPw').value;
      const u = users().find(x=>x.email===email && x.pw===pw);
      if(!u) return toast('Invalid credentials');
      save('minerva_current_user', {id:u.id, name:u.firstName});
      toast('Signed in');
      location.hash = '#dashboard';
    });
  }

  const showPw = $('#showPw');
  if(showPw) showPw.addEventListener('change', (e)=>{ $('#loginPw').type = e.target.checked ? 'text':'password'; });

  const forgotBtn = $('#forgotBtn');
  if(forgotBtn) forgotBtn.addEventListener('click', ()=> toast('Password reset is mocked for the prototype.'));

  const logoutBtn = $('#logoutBtn');
  if(logoutBtn) logoutBtn.addEventListener('click', ()=>{
    localStorage.removeItem('minerva_current_user');
    toast('Signed out'); location.hash = '#login';
  });
}

/* ---------- Lessons ---------- */
function initGrades(){
  const sel = $('#gradeSelect'); if(!sel) return;
  sel.innerHTML='';
  GRADES.forEach((g,i)=>{
    const opt = document.createElement('option');
    opt.value = i; opt.textContent = g==='K'? 'K': g; sel.appendChild(opt);
  });
  sel.value = 6; // default Grade 6
  sel.addEventListener('change', renderLessons);
  $$('.subFilter').forEach(cb=>cb.addEventListener('change', renderLessons));
}

function renderLessons(){
  const gradeSel = $('#gradeSelect'); if(!gradeSel) return;
  const gradeIdx = +gradeSel.value; // 0..12
  const selectedSubs = $$('.subFilter').filter(cb=>cb.checked).map(cb=>cb.value);
  const tbody = $('#lessonsBody'); if(!tbody) return;
  tbody.innerHTML='';
  LESSONS.filter(l => l.grades.includes(gradeIdx) && selectedSubs.includes(l.subject))
    .forEach(l => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${l.title}</td><td>${l.subject}</td><td>${l.mode}</td><td>${l.band}</td>
                      <td><button class='btn' data-open='${l.id}'>Open</button></td>`;
      tbody.appendChild(tr);
    });
  tbody.querySelectorAll('button[data-open]').forEach(btn=>btn.addEventListener('click', ()=>openLesson(btn.dataset.open)));
  if(!tbody.children.length){
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="5">No lessons for the selected filters.</td>`;
    tbody.appendChild(tr);
  }
}

function openLesson(id){
  const l = LESSONS.find(x=>x.id===id);
  $('#modalTitle').textContent = l.title;
  $('#modalBody').innerHTML = `<p><strong>Subject:</strong> ${l.subject} · <strong>Mode:</strong> ${l.mode} · <strong>Grade band:</strong> ${l.band}</p>
  <ol><li>Warm‑up (5 min)</li><li>Explore: interactive activity</li><li>Reflect &amp; share</li></ol>`;
  const actions = $('#modalActions'); actions.innerHTML = '';
  const start = document.createElement('button'); start.className='btn primary'; start.textContent='Start lesson';
  start.addEventListener('click', ()=>{
    const prog = load('minerva_progress', {});
    prog[id] = Math.min(100, (prog[id]||0) + 20);
    save('minerva_progress', prog);
    toast('Progress saved');
    refreshDashboard();
  });
  const saveToDash = document.createElement('button'); saveToDash.className='btn'; saveToDash.textContent='Pin to dashboard';
  saveToDash.addEventListener('click', ()=>{
    const up = load('minerva_upcoming', []); if(!up.includes(l.title)) up.push(l.title); save('minerva_upcoming', up); refreshDashboard(); toast('Pinned to Upcoming');
  });
  actions.append(saveToDash, start);
  openDialog();
}

/* ---------- Peers ---------- */
let currentPeer = null;
function renderPeers(){
  const list = $('#peerList'); if(!list) return;
  list.innerHTML='';
  const roleSel = $('#roleFilter').value;
  const interests = $$('.interest').filter(i=>i.checked).map(i=>i.value);
  PEERS.filter(p => (roleSel==='All' || p.role===roleSel) && (interests.length===0 || p.interests.some(i=>interests.includes(i))))
       .forEach(p => {
         const card = document.createElement('div'); card.className='card'; card.style.padding='12px';
         card.innerHTML = `<div style='display:flex; justify-content:space-between; align-items:center'>
           <div><strong>${p.name}</strong><div style='color:var(--muted); font-size:13px'>${p.role}${p.grade? ' · G'+p.grade:''}</div></div>
           <button class='btn' data-connect='${p.id}'>Connect</button></div>
           <div style='margin-top:8px; display:flex; gap:6px; flex-wrap:wrap'>${p.interests.map(i=>`<span class='pill'>${i}</span>`).join('')}</div>`;
         list.appendChild(card);
       });
  $('#roleFilter').onchange = renderPeers;
  $$('.interest').forEach(i=>i.onchange = renderPeers);
  list.querySelectorAll('[data-connect]').forEach(btn=>btn.addEventListener('click', ()=>openChat(btn.dataset.connect)));
  if(!currentPeer && PEERS[0]) openChat(PEERS[0].id);
}

function openChat(peerId){
  currentPeer = PEERS.find(p=>p.id===peerId);
  $('#chatMessages').innerHTML = (load('chat_'+peerId, [])).map(m=>`<div class='bubble ${m.me? 'me':''}'>${m.text}</div>`).join('');
  toast('Chatting with '+currentPeer.name);
}
const sendBtn = $('#sendMsg');
if(sendBtn){
  sendBtn.addEventListener('click', ()=>{
    if(!currentPeer) return;
    const input = $('#chatInput'); const text = input.value.trim(); if(!text) return;
    const msgs = load('chat_'+currentPeer.id, []); msgs.push({me:true, text}); save('chat_'+currentPeer.id, msgs);
    $('#chatMessages').insertAdjacentHTML('beforeend', `<div class='bubble me'>${text}</div>`);
    input.value='';
    setTimeout(()=>{
      const reply = {me:false, text:'👍 Let\'s collaborate on it.'};
      const msgs2 = load('chat_'+currentPeer.id, []); msgs2.push(reply); save('chat_'+currentPeer.id, msgs2);
      $('#chatMessages').insertAdjacentHTML('beforeend', `<div class='bubble'>${reply.text}</div>`);
    }, 600);
  });
}

/* ---------- Projects ---------- */
function renderProjects(){
  const grid = $('#projectGrid'); if(!grid) return;
  grid.innerHTML='';
  const theme = $('#projTheme').value; const band = $('#projGrade').value;
  PROJECTS.filter(p => (theme==='All'||p.theme===theme) && (band==='All'||p.band===band))
    .forEach(p =>{
      const card = document.createElement('div'); card.className='card';
      card.innerHTML = `<h3>${p.title}</h3>
        <div style='color:var(--muted); font-size:14px; margin-top:-6px'>${p.theme} · ${p.band}</div>
        <p>${p.blurb}</p>
        <div style='display:flex; gap:6px; flex-wrap:wrap; margin-top:6px'>${p.skills.map(s=>`<span class='pill'>${s}</span>`).join('')}</div>
        <div style='display:flex; gap:8px; justify-content:flex-end; margin-top:10px'>
          <button class='btn' data-preview='${p.id}'>Preview</button>
          <button class='btn primary' data-join='${p.id}'>Join project</button>
        </div>`;
      grid.appendChild(card);
    });
  $('#projTheme').onchange = renderProjects; $('#projGrade').onchange = renderProjects;
  grid.querySelectorAll('[data-preview]').forEach(btn=>btn.addEventListener('click', ()=>openProject(btn.dataset.preview)));
  grid.querySelectorAll('[data-join]').forEach(btn=>btn.addEventListener('click', ()=>joinProject(btn.dataset.join)));
}

function openProject(id){
  const p = PROJECTS.find(x=>x.id===id);
  $('#modalTitle').textContent = p.title;
  $('#modalBody').innerHTML = `<p>${p.blurb}</p><ul><li>Artifacts: proposal → prototype → showcase</li><li>Team size: 3–5</li><li>Duration: 4 weeks</li></ul>`;
  $('#modalActions').innerHTML = `<button class='btn primary' data-join='${p.id}'>Join project</button>`;
  openDialog();
  $('#modalActions [data-join]').addEventListener('click', ()=>joinProject(p.id));
}

function joinProject(id){
  const my = load('my_projects', []); const p = PROJECTS.find(x=>x.id===id);
  if(!my.some(x=>x.id===id)) my.push(p); save('my_projects', my);
  const up = load('minerva_upcoming', []); if(!up.includes(p.title)) {up.push(p.title); save('minerva_upcoming', up);}
  toast('Added to your dashboard'); refreshDashboard();
}

/* ---------- Dashboard ---------- */
function refreshDashboard(){
  const prog = load('minerva_progress', {});
  const subjects = {};
  LESSONS.forEach(l=>{ subjects[l.subject] = Math.max(subjects[l.subject]||0, prog[l.id]||0); });
  const list = $('#progressList'); if(!list) return; list.innerHTML='';
  Object.entries(subjects).forEach(([sub, pct])=>{
    const row = document.createElement('div');
    row.innerHTML = `<div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:6px'><strong>${sub}</strong><span>${pct||0}%</span></div><div class='progress'><span style='width:${pct||0}%'></span></div>`;
    list.appendChild(row);
  });
  if(!Object.keys(subjects).length){ list.innerHTML = '<div class="pill">No progress yet — start a lesson to see updates.</div>'; }

  const upcoming = load('minerva_upcoming', []);
  const ul = $('#upcomingList'); ul.innerHTML='';
  upcoming.forEach(u=>{ const li=document.createElement('li'); li.textContent = u; ul.appendChild(li); });
  if(!upcoming.length){ ul.innerHTML = '<li>Add a lesson or join a project to populate Upcoming.</li>'; }

  const refl = load('reflections', []);
  const wrap = $('#reflections'); wrap.innerHTML = refl.map(r=>`<div class='card' style='padding:10px; margin:8px 0'><div style='font-size:13px; color:var(--muted)'>${new Date(r.t).toLocaleString()}</div>${r.text}</div>`).join('') || '<div class="pill">No reflections yet.</div>';

  const fb = [
    {from:'Mentor Dev', text:'Great systems mapping in your climate module. Next time, push for clearer measurements.'},
    {from:'Ms. Gupta', text:'Loved your reflection depth. Try a "plan‑do‑review" next week.'}
  ];
  $('#feedback').innerHTML = fb.map(f=>`<div class='card' style='padding:10px; margin:8px 0'><strong>${f.from}</strong><div>${f.text}</div></div>`).join('');
}

/* ---------- Dialog fallback (mobile-safe) ---------- */
function ensureDialogFallback(){
  const dlg = document.getElementById('modal');
  if(!dlg) return;
  if(typeof dlg.showModal !== 'function'){
    // basic fallback for older browsers
    dlg.showModal = function(){ dlg.setAttribute('open',''); };
    dlg.close = function(){ dlg.removeAttribute('open'); };
  }
}
function openDialog(){ const dlg = document.getElementById('modal'); if(!dlg) return; dlg.showModal(); }
