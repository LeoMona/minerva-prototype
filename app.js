/* ========= Data (mock) ========= */
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

const PROJECTS = [
  { id:"pr1", title:"Clean Air Monitor", theme:"STEM", band:"6-8", blurb:"Prototype low‑cost air‑quality sensors and map hotspots around school.", skills:["Design","Data","IoT"] },
  { id:"pr2", title:"Wellness Ambassadors", theme:"Wellbeing", band:"9-12", blurb:"Peer‑led campaign to improve sleep, movement, and nutrition.", skills:["Leadership","Communication"] },
  { id:"pr3", title:"Local Heritage Oral History", theme:"Arts & Culture", band:"6-8", blurb:"Interview elders, digitize photographs, and produce a mini‑documentary.", skills:["Research","Media","Curation"] },
  { id:"pr4", title:"Math Trails Around Campus", theme:"STEM", band:"3-5", blurb:"Design outdoor math tasks—area, angles, ratios—then guide younger classes.", skills:["Problem design","Facilitation"] },
  { id:"pr5", title:"Assistive Tech: Switch Interface", theme:"Entrepreneurship", band:"9-12", blurb:"Build a low‑cost switch interface for accessible computer input.", skills:["Electronics","UX","Prototyping"] },
  { id:"pr6", title:"School Garden Hydroponics", theme:"Community & Service", band:"6-8", blurb:"Grow herbs in a small hydroponic rig; run a tasting day for families.", skills:["Biology","Iteration","Data"] },
  { id:"pr7", title:"AI Literacy Buddies", theme:"Media & Communication", band:"9-12", blurb:"Create short explainers and a “do/don’t” AI usage guide for middle school.", skills:["Instructional design","Ethics","Comms"] },
  { id:"pr8", title:"Book‑to‑Film Festival", theme:"Arts & Culture", band:"3-5", blurb:"Adapt chapters into 2‑minute films; storyboards, voice‑over, credits.", skills:["Storytelling","Editing"] }
];

/* ========= Utilities ========= */
const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];
const toast = (msg)=>{ const t = $('#toast'); if(!t) return; t.textContent = msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 2200); };
const save = (k,v)=>localStorage.setItem(k, JSON.stringify(v));
const load = (k, d=null)=>JSON.parse(localStorage.getItem(k) || (d!==null?JSON.stringify(d):'null'));
const todayKey = ()=> new Date().toISOString().slice(0,10); // YYYY-MM-DD

function currentUser(){ return load('minerva_current_user'); }
function users(){ return load('minerva_users', []); }

/* ========= Theme toggle ========= */
document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = $('#themeBtn');
  themeBtn?.addEventListener('click', ()=>{
    const html = document.documentElement;
    html.classList.toggle('force-dark');
    if(html.classList.contains('force-dark')){
      html.style.colorScheme = 'dark';
      html.style.setProperty('--surface', '#0d0b13');
      html.style.setProperty('--card', '#151221DD');
      html.style.setProperty('--ink', '#e5e7eb');
      html.style.setProperty('--muted', '#94a3b8');
      html.style.setProperty('--ring', '#3b2b66');
    }else{
      html.style.colorScheme = 'light';
      html.style.removeProperty('--surface');
      html.style.removeProperty('--card');
      html.style.removeProperty('--ink');
      html.style.removeProperty('--muted');
      html.style.removeProperty('--ring');
    }
  });
});

/* ========= Routing ========= */
const routes = () => $$("[data-route]").map(s=>s.id);

function go(hash){
  const target = (hash || location.hash).replace('#','') || 'join';
  $$("nav a[data-link]").forEach(a=>a.classList.toggle('active', a.getAttribute('href') === '#'+target));
  routes().forEach(id => $('#'+id).classList.toggle('hidden', id!==target));
  if(target==='dashboard') refreshDashboard();
  if(target==='lessons') renderLessons();
  if(target==='peers') renderPeers();
  if(target==='projects') renderProjects();
  $('#logoutBtn')?.classList.toggle('hidden', !currentUser());

  // Prompt Mood Board after successful login (on dashboard)
  if(target==='dashboard') maybeShowMood();
}

window.addEventListener('hashchange', ()=>go(location.hash));

/* ========= Auth ========= */
$('#joinForm')?.addEventListener('submit', (e)=>{
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
  // show mood board after creating account
  save('minerva_last_login', Date.now());
  location.hash = '#dashboard';
});

$('#loginForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = $('#loginEmail').value.trim().toLowerCase();
  const pw = $('#loginPw').value;
  const u = users().find(x=>x.email===email && x.pw===pw);
  if(!u) return toast('Invalid credentials');
  save('minerva_current_user', {id:u.id, name:u.firstName});
  save('minerva_last_login', Date.now());
  toast('Signed in');
  location.hash = '#dashboard';
});

$('#showPw')?.addEventListener('change', (e)=>{ $('#loginPw').type = e.target.checked? 'text':'password'; });
$('#forgotBtn')?.addEventListener('click', () => toast('Password reset is mocked for the prototype.'));
$('#logoutBtn')?.addEventListener('click', ()=>{
  localStorage.removeItem('minerva_current_user');
  toast('Signed out');
  location.hash = '#login';
});

/* ========= Lessons ========= */
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
  const sel = $('#gradeSelect'); if(!sel) return;
  const gradeIdx = +sel.value;
  const selectedSubs = $$('.subFilter').filter(cb=>cb.checked).map(cb=>cb.value);
  const tbody = $('#lessonsBody'); tbody.innerHTML='';
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
    <ol>
      <li>Warm‑up (5 min)</li>
      <li>Explore: interactive activity</li>
      <li>Reflect &amp; share</li>
    </ol>`;
  const actions = $('#modalActions');
  actions.innerHTML = '';
  const start = document.createElement('button'); start.className='btn primary'; start.textContent='Start lesson';
  start.addEventListener('click', ()=>{
    const prog = load('minerva_progress', {});
    prog[id] = Math.min(100, (prog[id]||0) + 20);
    save('minerva_progress', prog);
    toast('Progress saved');
    refreshDashboard();
  });
  const pin = document.createElement('button'); pin.className='btn'; pin.textContent='Pin to dashboard';
  pin.addEventListener('click', ()=>{
    const up = load('minerva_upcoming', []); if(!up.includes(l.title)) up.push(l.title); save('minerva_upcoming', up); refreshDashboard(); toast('Pinned to Upcoming');
  });
  actions.append(pin, start);
  $('#modal').showModal();
}

/* ========= Peers ========= */
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
$('#sendMsg')?.addEventListener('click', ()=>{
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

/* ========= Projects ========= */
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
  $('#modal').showModal();
  $('#modalActions [data-join]').addEventListener('click', ()=>joinProject(p.id));
}

function joinProject(id){
  const my = load('my_projects', []); const p = PROJECTS.find(x=>x.id===id);
  if(!my.some(x=>x.id===id)) my.push(p); save('my_projects', my);
  const up = load('minerva_upcoming', []); if(!up.includes(p.title)) {up.push(p.title); save('minerva_upcoming', up);}
  toast('Added to your dashboard'); refreshDashboard();
}

/* ========= Dashboard ========= */
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
  const wrap = $('#reflections');
  wrap.innerHTML = refl.map(r=>`<div class='card' style='padding:10px; margin:8px 0'><div style='font-size:13px; color:var(--muted)'>${new Date(r.t).toLocaleString()}</div>${r.text}</div>`).join('') || '<div class="pill">No reflections yet.</div>';

  const fb = [
    {from:'Mentor Dev', text:'Great systems mapping in your climate module. Next time, push for clearer measurements.'},
    {from:'Ms. Gupta', text:'Loved your reflection depth. Try a "plan‑do‑review" next week.'}
  ];
  $('#feedback').innerHTML = fb.map(f=>`<div class='card' style='padding:10px; margin:8px 0'><strong>${f.from}</strong><div>${f.text}</div></div>`).join('');
}

$('#addReflection')?.addEventListener('click', ()=>{
  const text = $('#reflectInput').value.trim(); if(!text) return;
  const arr = load('reflections', []); arr.unshift({t:Date.now(), text}); save('reflections', arr);
  $('#reflectInput').value=''; refreshDashboard(); toast('Reflection added');
});
$('#clearReflections')?.addEventListener('click', ()=>{ save('reflections', []); refreshDashboard(); toast('Reflections cleared'); });

/* ========= Mood Board ========= */
const MOODS = [
  {id:'happy', label:'Happy', emoji:'😄'},
  {id:'curious', label:'Curious', emoji:'🤔'},
  {id:'stressed', label:'Stressed', emoji:'😵‍💫'},
  {id:'tired', label:'Tired', emoji:'🥱'},
  {id:'excited', label:'Excited', emoji:'🤩'},
];

const MODES = [
  {id:'quick', label:'Quick practice'},
  {id:'deep', label:'Deep dive'},
  {id:'collab', label:'Collaborative'},
  {id:'create', label:'Create a project'},
];

let selectedMood = null;
let selectedMode = null;

function buildMoodBoard(){
  const moodWrap = $('#moodChoices');
  const modeWrap = $('#modeChoices');
  if(!moodWrap || !modeWrap) return;

  moodWrap.innerHTML = MOODS.map(m=>`<button type="button" class="mood-card" data-mood="${m.id}"><div class="emoji">${m.emoji}</div><div>${m.label}</div></button>`).join('');
  modeWrap.innerHTML = MODES.map(m=>`<label class="pill"><input type="radio" name="learnMode" value="${m.id}"> ${m.label}</label>`).join('');

  moodWrap.querySelectorAll('.mood-card').forEach(b=>{
    b.addEventListener('click', ()=>{
      moodWrap.querySelectorAll('.mood-card').forEach(x=>x.classList.remove('selected'));
      b.classList.add('selected');
      selectedMood = b.dataset.mood;
    });
  });
  modeWrap.querySelectorAll('input[name="learnMode"]').forEach(r=>{
    r.addEventListener('change', ()=> selectedMode = r.value);
  });

  $('#skipMood')?.addEventListener('click', ()=> $('#moodModal').close());
  $('#saveMood')?.addEventListener('click', ()=>{
    const u = currentUser(); if(!u){ $('#moodModal').close(); return; }
    const k = `mood_${u.id}`;
    const existing = load(k, {});
    existing[todayKey()] = { mood:selectedMood||'unspecified', mode:selectedMode||'unspecified', t:Date.now() };
    save(k, existing);
    toast('Saved. Tailoring suggestions…');
    // simple nudge based on mode
    if(selectedMode==='quick') nudgeUpcoming('Quick practice: Narrative Writing');
    if(selectedMode==='deep') nudgeUpcoming('Deep dive: Metacognition 101');
    if(selectedMode==='collab') nudgeUpcoming('Collaborative: Community Project');
    if(selectedMode==='create') nudgeUpcoming('Start: Book‑to‑Film Festival');
    refreshDashboard();
    $('#moodModal').close();
  });
}

function nudgeUpcoming(title){
  const up = load('minerva_upcoming', []); if(!up.includes(title)) up.push(title); save('minerva_upcoming', up);
}

function maybeShowMood(){
  const u = currentUser(); if(!u) return;
  const k = `mood_${u.id}`;
  const moods = load(k, {});
  if(!moods[todayKey()]){
    buildMoodBoard();
    $('#moodModal').showModal();
  }
}

/* ========= Assistant (floating chatbot) ========= */
const assistant = {
  open(){
    $('#assistant').classList.remove('hidden');
    this.push('assistant', 'Hi! I can help you start a lesson, pin a project, or open pages. Try “open projects” or “start a math lesson”.');
  },
  close(){ $('#assistant').classList.add('hidden'); },
  push(who, text){
    const m = document.createElement('div');
    m.className = 'assistant-bubble' + (who==='me' ? ' me':'');
    m.textContent = text;
    $('#assistantMessages').appendChild(m);
    $('#assistantMessages').scrollTop = $('#assistantMessages').scrollHeight;
  },
  handle(input){
    const t = input.trim(); if(!t) return;
    this.push('me', t);

    // very simple intent routing
    const tt = t.toLowerCase();

    if(tt.includes('open') && tt.includes('project')){ location.hash = '#projects'; this.push('assistant','Opening Projects. Filter by theme or grade.'); return; }
    if(tt.includes('open') && tt.includes('lesson')){ location.hash = '#lessons'; this.push('assistant','Opening Lessons. Try Grade 6 to start.'); return; }
    if(tt.includes('dashboard')){ location.hash = '#dashboard'; this.push('assistant','Jumping to Dashboard.'); return; }
    if(tt.includes('mood')){ maybeShowMood(); this.push('assistant','Here is the mood board. Save your mood and learning style to personalize suggestions.'); return; }
    if(tt.includes('start') && tt.includes('math')){ openLesson('l4'); this.push('assistant','Launching “Fractions with Minecraft”.'); return; }
    if(tt.includes('help')){ this.push('assistant','You can say: “open projects”, “open lessons”, “show mood”, “dashboard”, or “start math”.'); return; }

    this.push('assistant',"Got it. I can navigate (projects/lessons/dashboard), show the mood board, or start a suggested lesson. Try: “open projects”.");
  }
};

document.addEventListener('DOMContentLoaded', ()=>{
  // Router init
  initGrades();
  go(location.hash || '#join');

  // Mobile menu behavior
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('#navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('show');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close on link click
    navMenu.querySelectorAll('a[data-link]').forEach(a =>
      a.addEventListener('click', () => {
        navMenu.classList.remove('show');
        navToggle.setAttribute('aria-expanded','false');
      })
    );
  }

  // Sticky header shadow
  const hdr = document.querySelector('header');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        hdr.classList.toggle('scrolled', window.scrollY > 4);
        ticking = false;
      });
      ticking = true;
    }
  });

  // iOS zoom fix
  document.querySelectorAll('input, select, textarea').forEach(el => el.style.fontSize = '16px');

  // Assistant hookups
  $('#helpFab')?.addEventListener('click', ()=>assistant.open());
  $('#assistantClose')?.addEventListener('click', ()=>assistant.close());
  $('#assistantSend')?.addEventListener('click', ()=>{
    const inp = $('#assistantInput');
    const val = inp.value;
    inp.value = '';
    assistant.handle(val);
  });
  $('#assistantInput')?.addEventListener('keydown', (e)=>{
    if(e.key==='Enter'){ e.preventDefault(); $('#assistantSend').click(); }
  });
});
