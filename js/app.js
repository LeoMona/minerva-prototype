/* app.js */
'use strict';

// ----- Helpers (your style) -----
const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const toast = (msg) => { const t = $('#toast'); if(!t) return; t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2200); };
const save = (k,v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, d=null) => JSON.parse(localStorage.getItem(k) || (d!==null?JSON.stringify(d):'null'));

// Keys for reset (if you have a Reset button)
const APP_KEYS = [
  'minerva_users','minerva_current_user','minerva_progress','minerva_upcoming',
  'reflections','my_projects','chat_p1','chat_p2','chat_p3','chat_p4','chat_p5',
  // mood
  'mood_history'
];

// ----- Routes -----
let ROUTES = [];
function prettyRoute(r){
  const map = { join:'Join', login:'Login', lessons:'Lessons', peers:'Peers', projects:'Projects', dashboard:'Dashboard' };
  return map[r] || r;
}
function go(hash){
  const target = (hash || location.hash || '#join').replace('#','');
  ROUTES.forEach(id => $('#'+id)?.classList.toggle('hidden', id!==target));
  $$('nav a[data-link]').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+target));
  document.title = `Minerva School — Where curiosity finds its community${target!=='join' ? ' · '+prettyRoute(target) : ''}`;

  if(target==='dashboard') refreshDashboard();
  if(target==='lessons')   renderLessons();
  if(target==='peers')     renderPeers();
  if(target==='projects')  renderProjects();

  $('#logoutBtn')?.classList.toggle('hidden', !load('minerva_current_user'));
}

function currentUser(){ return load('minerva_current_user'); }
function users(){ return load('minerva_users', []); }

// ----- Mood storage (per user) -----
function moodKey(userId){ return 'mood_history'; } // simple single-key store with user entries
function getMoodHistory(){
  return load('mood_history', {}); // { userId: [ {t, mood}, ... ] }
}
function pushMood(userId, mood){
  const all = getMoodHistory();
  all[userId] = all[userId] || [];
  all[userId].unshift({ t: Date.now(), mood: Number(mood) });
  save('mood_history', all);
}

// ----- App init -----
window.addEventListener('DOMContentLoaded', () => {
  // Pre-compute routes
  ROUTES = $$('[data-route]').map(s => s.id);

  // Header actions
  $('#resetBtn')?.addEventListener('click', () => {
    APP_KEYS.forEach(k => localStorage.removeItem(k));
    toast('App data cleared'); setTimeout(() => location.reload(), 300);
  });
  $('#logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('minerva_current_user'); toast('Signed out'); location.hash = '#login';
  });

  // Auth — Join (with mood capture)
  $('#joinForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const moodVal = ($('input[name="mood"]:checked') || {}).value;
    if(!moodVal) { toast('Please select your mood'); return; }

    const u = {
      id: 'u_'+Date.now(),
      firstName: $('#firstName').value.trim(),
      lastName:  $('#lastName').value.trim(),
      role:      $('#role').value,
      email:     $('#email').value.trim().toLowerCase(),
      pw:        $('#pw').value
    };
    const all = users();
    if(all.some(x => x.email===u.email)) return toast('This email is already registered.');
    all.push(u); save('minerva_users', all);
    save('minerva_current_user', {id:u.id, name:u.firstName});
    pushMood(u.id, moodVal);
    toast('Welcome '+u.firstName+'! Account created.');
    location.hash = '#dashboard';
  });

  // Auth — Login
  $('#loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#loginEmail').value.trim().toLowerCase();
    const pw = $('#loginPw').value;
    const u = users().find(x => x.email===email && x.pw===pw);
    if(!u) return toast('Invalid credentials');
    save('minerva_current_user', {id:u.id, name:u.firstName});
    toast('Signed in'); location.hash = '#dashboard';
  });
  $('#showPw')?.addEventListener('change', (e) => { const f = $('#loginPw'); if(f) f.type = e.target.checked? 'text':'password'; });
  $('#forgotBtn')?.addEventListener('click', () => toast('Password reset is mocked for the prototype.'));

  // Lessons
  initGrades();
  initSkills();

  // Chat composer
  const sendBtn = $('#sendMsg');
  const input   = $('#chatInput');
  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
  }

  // Reflections
  $('#addReflection')?.addEventListener('click', () => {
    const text = $('#reflectInput').value.trim(); if(!text) return;
    const arr = load('reflections', []); arr.unshift({t:Date.now(), text}); save('reflections', arr);
    $('#reflectInput').value=''; refreshDashboard(); toast('Reflection added');
  });
  $('#clearReflections')?.addEventListener('click', () => { save('reflections', []); refreshDashboard(); toast('Reflections cleared'); });

  // Mood today button
  $('#moodTodayBtn')?.addEventListener('click', () => {
    const uid = currentUser()?.id; if(!uid){ location.hash='#login'; return;}
    // simple prompt; you can swap for a modal UI later
    const val = prompt('How do you feel today? (1=😞 to 5=😄)', '3');
    if(!val) return;
    const n = Number(val);
    if(n>=1 && n<=5){ pushMood(uid, n); toast('Mood saved'); refreshDashboard(); }
    else toast('Please enter 1..5');
  });

  // Hash routing
  window.addEventListener('hashchange', () => go(location.hash));
  go(location.hash || '#join'); // initial
});

// ---- Lessons (skills) ----
function allSkills(){
  const set = new Set();
  LESSONS.forEach(l => (l.skills||[]).forEach(s => set.add(s)));
  return [...set].sort();
}
function initSkills(){
  const host = $('#skillFilters'); if(!host) return;
  host.innerHTML = '';
  allSkills().forEach(skill => {
    const lbl = document.createElement('label');
    lbl.className = 'pill';
    lbl.innerHTML = `<input type="checkbox" class="skillFilter" value="${skill}"> ${skill}`;
    host.appendChild(lbl);
  });
  host.querySelectorAll('.skillFilter').forEach(cb => cb.addEventListener('change', renderLessons));
}
function initGrades(){
  const sel = $('#gradeSelect'); if(!sel) return;
  sel.innerHTML='';
  GRADES.forEach((g,i) => {
    const opt = document.createElement('option');
    opt.value = i; opt.textContent = g==='K'? 'K' : g; sel.appendChild(opt);
  });
  sel.value = 6; // default Grade 6
  sel.addEventListener('change', renderLessons);
  $$('.subFilter').forEach(cb => cb.addEventListener('change', renderLessons));
}
function renderLessons(){
  const sel = $('#gradeSelect'); if(!sel) return;
  const gradeIdx = +sel.value; // 0..12
  const selectedSubs  = $$('.subFilter').filter(cb => cb.checked).map(cb => cb.value);
  const selectedSkill = $$('.skillFilter').filter(cb => cb.checked).map(cb => cb.value);
  const tbody = $('#lessonsBody'); if(!tbody) return; tbody.innerHTML='';
  LESSONS.filter(l =>
    l.grades.includes(gradeIdx) &&
    selectedSubs.includes(l.subject) &&
    (selectedSkill.length===0 || l.skills?.some(s => selectedSkill.includes(s)))
  ).forEach(l => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${l.title}</td><td>${l.subject}</td><td>${l.mode}</td><td>${l.band}</td>
                    <td><button class='btn' data-open='${l.id}'>Open</button></td>`;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('button[data-open]').forEach(btn => btn.addEventListener('click', () => openLesson(btn.dataset.open)));
  if(!tbody.children.length){
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="5">No lessons for the selected filters.</td>`;
    tbody.appendChild(tr);
  }
}
function openLesson(id){
  const l = LESSONS.find(x => x.id===id);
  if(!l) return;
  $('#modalTitle').textContent = l.title;
  $('#modalBody').innerHTML = `<p><strong>Subject:</strong> ${l.subject} · <strong>Mode:</strong> ${l.mode} · <strong>Grade band:</strong> ${l.band}</p>
    <p><strong>Skills:</strong> ${(l.skills||[]).join(', ') || '—'}</p>
    <ol>
      <li>Warm‑up (5 min)</li>
      <li>Explore: interactive activity</li>
      <li>Reflect &amp; share</li>
    </ol>`;
  const actions = $('#modalActions');
  actions.innerHTML = '';
  const start = document.createElement('button'); start.className='btn primary'; start.textContent='Start lesson';
  start.addEventListener('click', () => {
    const prog = load('minerva_progress', {});
    prog[id] = Math.min(100, (prog[id]||0) + 20);
    save('minerva_progress', prog);
    toast('Progress saved'); refreshDashboard();
  });
  const saveToDash = document.createElement('button'); saveToDash.className='btn'; saveToDash.textContent='Pin to dashboard';
  saveToDash.addEventListener('click', () => {
    const up = load('minerva_upcoming', []); if(!up.includes(l.title)) up.push(l.title); save('minerva_upcoming', up); refreshDashboard(); toast('Pinned to Upcoming');
  });
  actions.append(saveToDash, start);
  const dlg = $('#modal');
  if (dlg?.showModal) dlg.showModal(); else dlg?.setAttribute('open','');
}

// ---- Peers + Map (Leaflet) ----
let currentPeer = null;
let map, markersLayer;

function ensureMap(){
  if(map) return;
  const el = $('#peerMap'); if(!el) return;
  map = L.map(el).setView([20, 10], 2); // world view
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '&copy; OpenStreetMap'
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
}

function renderPeers(){
  ensureMap();
  const list = $('#peerList'); if(!list) return; list.innerHTML='';
  const roleSel = $('#roleFilter').value;
  const interests = $$('.interest').filter(i => i.checked).map(i => i.value);

  const filtered = PEERS.filter(p =>
    (roleSel==='All' || p.role===roleSel) &&
    (interests.length===0 || p.interests.some(i => interests.includes(i)))
  );

  // List
  filtered.forEach(p => {
    const card = document.createElement('div'); card.className='card'; card.style.padding='12px';
    card.innerHTML = `<div style='display:flex; justify-content:space-between; align-items:center'>
      <div><strong>${p.name}</strong>
        <div style='color:var(--muted); font-size:13px'>${p.role}${p.grade? ' · G'+p.grade:''} · ${p.city}, ${p.country}</div>
      </div>
      <button class='btn' data-connect='${p.id}'>Connect</button></div>
      <div style='margin-top:8px; display:flex; gap:6px; flex-wrap:wrap'>${p.interests.map(i=>`<span class='pill'>${i}</span>`).join('')}</div>`;
    list.appendChild(card);
  });

  // Filters (rebind once)
  $('#roleFilter').onchange = renderPeers;
  $$('.interest').forEach(i => i.onchange = renderPeers);
  list.querySelectorAll('[data-connect]').forEach(btn => btn.addEventListener('click', () => openChat(btn.dataset.connect)));

  if(!currentPeer && filtered[0]) openChat(filtered[0].id);

  // Map markers
  if(markersLayer){
    markersLayer.clearLayers();
    filtered.forEach(p => {
      if(typeof p.lat === 'number' && typeof p.lng === 'number'){
        const m = L.marker([p.lat, p.lng]).bindPopup(`<strong>${p.name}</strong><br>${p.role}${p.grade? ' · G'+p.grade:''}<br>${p.city}, ${p.country}`);
        markersLayer.addLayer(m);
      }
    });
    if(filtered.length){
      const group = L.featureGroup(filtered.filter(p => p.lat && p.lng).map(p => L.marker([p.lat,p.lng])));
      try { map.fitBounds(group.getBounds().pad(0.25)); } catch {}
    }
  }
}

function openChat(peerId){
  currentPeer = PEERS.find(p => p.id===peerId);
  const msgsWrap = $('#chatMessages'); if(!msgsWrap) return;
  msgsWrap.innerHTML = (load('chat_'+peerId, [])).map(m => `<div class='bubble ${m.me? 'me':''}'>${m.text}</div>`).join('');
  toast('Chatting with '+(currentPeer?.name || 'peer'));
}

function sendMessage(){
  if(!currentPeer) return;
  const input = $('#chatInput'); const text = input.value.trim(); if(!text) return;
  const key = 'chat_'+currentPeer.id;
  const msgs = load(key, []); msgs.push({me:true, text}); save(key, msgs);
  $('#chatMessages').insertAdjacentHTML('beforeend', `<div class='bubble me'>${text}</div>`);
  input.value='';
  setTimeout(() => {
    const reply = {me:false, text:'👍 Let\'s collaborate on it.'};
    const msgs2 = load(key, []); msgs2.push(reply); save(key, msgs2);
    $('#chatMessages').insertAdjacentHTML('beforeend', `<div class='bubble'>${reply.text}</div>`);
  }, 600);
}

// ---- Projects (global subjects) + Suggestions ----
function renderProjects(){
  const grid = $('#projectGrid'); if(!grid) return; grid.innerHTML='';
  const subject = $('#projSubject')?.value || 'All';
  const band    = $('#projGrade')?.value || 'All';

  PROJECTS.filter(p => (subject==='All'||p.subject===subject) && (band==='All'||p.band===band))
    .forEach(p =>{
      const card = document.createElement('div'); card.className='card';
      card.innerHTML = `<h3>${p.title}</h3>
        <div style='color:var(--muted); font-size:14px; margin-top:-6px'>${p.subject} · ${p.band}</div>
        <p>${p.blurb}</p>
        <div style='display:flex; gap:6px; flex-wrap:wrap; margin-top:6px'>${p.skills.map(s=>`<span class='pill'>${s}</span>`).join('')}</div>
        <div class='right' style='margin-top:10px'>
          <button class='btn' data-preview='${p.id}'>Preview</button>
          <button class='btn primary' data-join='${p.id}'>Join project</button>
        </div>`;
      grid.appendChild(card);
    });

  $('#projSubject')?.addEventListener('change', renderProjects);
  $('#projGrade')?.addEventListener('change', renderProjects);
  grid.querySelectorAll('[data-preview]').forEach(btn => btn.addEventListener('click', () => openProject(btn.dataset.preview)));
  grid.querySelectorAll('[data-join]').forEach(btn => btn.addEventListener('click', () => joinProject(btn.dataset.join)));

  renderSuggestions(subject, band);
}

function openProject(id){
  const p = PROJECTS.find(x => x.id===id); if(!p) return;
  $('#modalTitle').textContent = p.title;
  $('#modalBody').innerHTML = `<p>${p.blurb}</p>
    <ul><li>Artifacts: proposal → prototype → showcase</li><li>Team size: 3–5</li><li>Duration: 4 weeks</li></ul>`;
  $('#modalActions').innerHTML = `<button class='btn primary' data-join='${p.id}'>Join project</button>`;
  const dlg = $('#modal');
  if (dlg?.showModal) dlg.showModal(); else dlg?.setAttribute('open','');
  $('#modalActions [data-join]').addEventListener('click', () => joinProject(p.id));
}

function joinProject(id){
  const my = load('my_projects', []); const p = PROJECTS.find(x=>x.id===id);
  if(!p) return;
  if(!my.some(x=>x.id===id)) my.push(p); save('my_projects', my);
  const up = load('minerva_upcoming', []); if(!up.includes(p.title)) {up.push(p.title); save('minerva_upcoming', up);} 
  toast('Added to your dashboard'); refreshDashboard();
}

/* Suggestions */
function renderSuggestions(subject, band){
  const ul = $('#suggestionsList'); if(!ul) return; ul.innerHTML = '';
  const selected = SUGGESTIONS.filter(s =>
    (subject==='All' || s.subject===subject) &&
    (band==='All' || s.bands.includes(band))
  );
  if(!selected.length){
    ul.innerHTML = `<li>No suggestions yet for this subject/grade — try a different filter.</li>`;
    return;
  }
  selected.forEach(s => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="pill">${s.type}</span> <strong>${s.title}</strong> · <span style="color:var(--muted)">${s.subject} · ${s.bands.join(',')}</span> · <a href="${s.link}" target="_blank" rel="noopener">Learn more</a>`;
    ul.appendChild(li);
  });
}

// ---- Dashboard ----
function refreshDashboard(){
  const prog = load('minerva_progress', {});
  const subjects = {};
  LESSONS.forEach(l => { subjects[l.subject] = Math.max(subjects[l.subject]||0, prog[l.id]||0); });
  const list = $('#progressList'); if(list){ list.innerHTML='';
    Object.entries(subjects).forEach(([sub, pct]) => {
      const row = document.createElement('div');
      row.innerHTML = `<div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:6px'><strong>${sub}</strong><span>${pct||0}%</span></div><div class='progress'><span style='width:${pct||0}%'></span></div>`;
      list.appendChild(row);
    });
    if(!Object.keys(subjects).length){ list.innerHTML = '<div class="pill">No progress yet — start a lesson to see updates.</div>'; }
  }

  const upcoming = load('minerva_upcoming', []);
  const ul = $('#upcomingList'); if(ul){ ul.innerHTML=''; upcoming.forEach(u => { const li=document.createElement('li'); li.textContent = u; ul.appendChild(li); });
    if(!upcoming.length){ ul.innerHTML = '<li>Add a lesson or join a project to populate Upcoming.</li>'; }
  }

  const refl = load('reflections', []);
  const wrap = $('#reflections'); if(wrap){
    wrap.innerHTML = refl.map(r => `<div class='card' style='padding:10px; margin:8px 0'><div style='font-size:13px; color:var(--muted)'>${new Date(r.t).toLocaleString()}</div>${r.text}</div>`).join('') || '<div class="pill">No reflections yet.</div>';
  }

  // Mood snippet
  const uid = currentUser()?.id;
  const mh = getMoodHistory()[uid] || [];
  const latest = mh[0];
  const fbWrap = $('#feedback');
  if(fbWrap){
    const base = [
      {from:'Mentor Dev', text:'Great systems mapping in your climate module. Next time, push for clearer measurements.'},
      {from:'Ms. Gupta',  text:'Loved your reflection depth. Try a "plan‑do‑review" next week.'}
    ];
    const moodLine = latest ? [{from:'Wellbeing Bot', text:`Latest mood logged: ${'😞🙁😐🙂😄'[latest.mood-1]} (${latest.mood}/5)`}] : [];
    fbWrap.innerHTML = [...moodLine, ...base].map(f => `<div class='card' style='padding:10px; margin:8px 0'><strong>${f.from}</strong><div>${f.text}</div></div>`).join('');
  }
}
