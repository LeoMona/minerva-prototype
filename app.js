// Tiny client-side router + demo state (no backend, no persistence)
const app = document.getElementById('app');
const aboutBtn = document.getElementById('aboutBtn');
const aboutPanel = document.getElementById('aboutPanel');
const aboutClose = document.getElementById('aboutClose');

aboutBtn.addEventListener('click',()=>aboutPanel.classList.remove('hidden'));
aboutClose.addEventListener('click',()=>aboutPanel.classList.add('hidden'));
aboutPanel.addEventListener('click', (e)=>{ if(e.target===aboutPanel) aboutPanel.classList.add('hidden'); });

const state = {
  user: { name: 'Aarav', grade: '6' },
  mastery: { fractions: 0.62, geometry: 0.48, vocab: 0.55, designThinking: 0.77 },
  lastCorrect: null, // true/false from last question
  usedHint: false,
  teacherOverride: false, // human-in-the-loop demonstration
  peers: [
    { name: 'Maya', strengths: ['Geometry', 'Sketching'], overlap: 0.82 },
    { name: 'Vihaan', strengths: ['Fractions', 'Python'], overlap: 0.74 }
  ],
  project: { title: 'Build a City Model', due: '2 weeks', status: 'In progress' },
  reflection: []
};

const routes = { home, lesson, lesson2, prompt, peers, projects, dashboard };

document.querySelectorAll('button[data-route]').forEach(btn => {
  btn.addEventListener('click', () => navigate(btn.dataset.route));
});
window.addEventListener('hashchange', () => {
  const r = location.hash.replace('#/', '') || 'home';
  navigate(r, true);
});

function navigate(route, fromHash=false){
  const view = routes[route] || routes.home;
  view();
  if(!fromHash) location.hash = `/${route}`;
  app.focus();
}

function card(inner){ return `<section class="card">${inner}</section>`; }
function kpi(label, value, color){ 
  return `<div class="badge" title="${label}"><strong>${label}:</strong> ${value}</div>`;
}

/* ----------- Views ----------- */
function home(){
  app.innerHTML = [
    card(`
      <h2>Welcome, ${state.user.name}</h2>
      <p class="muted">A school without walls — learning that adapts as you grow.</p>
      <div class="grid grid-3">
        <div class="card">
          <h3>Start Lesson</h3>
          <p class="muted">10–12 min adaptive practice + hinting</p>
          <button class="btn" onclick="navigate('lesson')">Start</button>
        </div>
        <div class="card">
          <h3>Join Peers</h3>
          <p class="muted">Meet 2 peers matched to complement your strengths</p>
          <button class="btn" onclick="navigate('peers')">Find Group</button>
        </div>
        <div class="card">
          <h3>Dashboard</h3>
          <p class="muted">See progress, reflections, and next best action</p>
          <button class="btn" onclick="navigate('dashboard')">Open</button>
        </div>
      </div>
    `),
    card(`
      <h3>Today’s Focus</h3>
      <div class="grid grid-2">
        <div>
          <div class="muted">Fractions Mastery</div>
          <div class="progress" style="margin:.4rem 0 .7rem"><span style="width:${state.mastery.fractions*100}%"></span></div>
          <button class="btn secondary" onclick="navigate('lesson')">Continue fractions →</button>
        </div>
        <div>
          <div class="muted">City Model Project</div>
          <div class="badge">🏗️ ${state.project.title} · ${state.project.status}</div>
          <div style="margin-top:.6rem">
            <button class="btn ghost" onclick="navigate('projects')">Open project hub</button>
          </div>
        </div>
      </div>
    `)
  ].join('');
}

function lesson(){
  state.usedHint = false;
  app.innerHTML = card(`
    <h2>Adaptive Lesson — Fractions</h2>
    <p class="muted">Question 1 of 2</p>
    <div class="card">
      <p><strong>Q1:</strong> A recipe uses <em>3/4</em> cup of sugar. You want to make half the recipe. How much sugar do you need?</p>
      <div class="grid grid-3" style="margin:.5rem 0 1rem">
        <button class="btn secondary" onclick="selectAnswer(this,false)">1/4 cup</button>
        <button class="btn secondary" onclick="selectAnswer(this,true)">3/8 cup</button>
        <button class="btn secondary" onclick="selectAnswer(this,false)">1/2 cup</button>
      </div>
      <button class="btn" onclick="showHint()">Hint</button>
      <div id="hint" style="margin-top:.8rem" class="muted"></div>
    </div>
    <div style="margin-top:.8rem">
      <button class="btn" onclick="navigate('lesson2')">Next →</button>
      <button class="btn ghost" onclick="navigate('home')">Back</button>
    </div>
  `);
}

function selectAnswer(btn, correct){
  document.querySelectorAll('.btn.secondary').forEach(b => b.style.outline='none');
  btn.style.outline = '2px solid var(--brand)';
  state.lastCorrect = !!correct;
}

function showHint(){
  state.usedHint = true;
  const hint = document.getElementById('hint');
  hint.innerHTML = "👉 <em>Hint:</em> Half of 3/4 is (3/4) × (1/2). Multiply numerators and denominators: 3×1 / 4×2 = 3/8.";
}

function lesson2(){
  // Branching: success → challenge up; struggle → scaffolded path
  const struggled = (state.lastCorrect === false) || state.usedHint === true;
  if(struggled){
    app.innerHTML = card(`
      <h2>Adaptive Lesson — Scaffolded Path</h2>
      <p class="muted">We’ll use a number line to visualize halves of fractions.</p>
      <div class="card">
        <p><strong>Q2 (Scaffolded):</strong> Mark <em>1/2 of 2/3</em> on the number line.</p>
        <p class="muted">Why this? You asked for a hint or selected a wrong answer, so we’re reinforcing the concept visually.</p>
        <button class="btn" onclick="navigate('prompt')">Got it → Reflection</button>
      </div>
    `);
  } else {
    app.innerHTML = card(`
      <h2>Adaptive Lesson — Challenge Path</h2>
      <p class="muted">Great! Let’s step up the challenge.</p>
      <div class="card">
        <p><strong>Q2 (Challenge):</strong> A smoothie uses <em>1 1/2</em> cups of yogurt. For <em>2/3</em> of the recipe, how much yogurt?</p>
        <div class="grid grid-3" style="margin:.5rem 0 1rem">
          <button class="btn secondary">1 cup</button>
          <button class="btn secondary">1 cup + 0.0̅ (Trick!)</button>
          <button class="btn secondary">1 cup</button>
        </div>
        <p class="muted">Why this? Correct on Q1 with no hint → we’re testing mixed numbers scaling.</p>
        <button class="btn" onclick="navigate('prompt')">Next → Reflection</button>
      </div>
    `);
  }
}

function prompt(){
  app.innerHTML = card(`
    <h2>Quick Reflection</h2>
    <p class="muted">How confident do you feel about solving similar problems?</p>
    <div class="grid grid-3" style="margin:.5rem 0 1rem">
      <button class="btn" onclick="saveReflection('low')">😟 Low</button>
      <button class="btn" onclick="saveReflection('medium')">😐 Medium</button>
      <button class="btn" onclick="saveReflection('high')">😄 High</button>
    </div>
    <p class="muted">Your response personalizes the next hint or challenge.</p>
    <div style="margin-top:.8rem">
      <button class="btn" onclick="navigate('peers')">Next → Join Peers</button>
    </div>
  `);
}

function saveReflection(level){
  state.reflection.push({ ts: Date.now(), level });
  alert(`Saved: ${level} confidence`);
}

function peers(){
  const peers = state.peers.map(p => `
    <div class="card">
      <h3>${p.name}</h3>
      <p class="muted">Strengths: ${p.strengths.join(', ')}</p>
      <div class="badge">Match: ${(p.overlap*100).toFixed(0)}%</div>
      <div style="margin-top:.6rem">${state.teacherOverride
        ? `<button class=\"btn\" onclick=\"alert('Assigned by teacher override')\">Assign Directly</button>`
        : `<button class=\"btn\">Request to Join</button>`}
      </div>
      <p class="muted" style="margin-top:.5rem">Why this match? Complementary skills + schedule fit.</p>
    </div>`).join('');

  app.innerHTML = [
    card(`
      <h2>Peer Matching</h2>
      <div class="badge">Teacher Override: 
        <label class="switch" style="vertical-align:middle; margin-left:.5rem">
          <input type="checkbox" ${state.teacherOverride? 'checked':''} onchange="toggleOverride(this)">
          <span class="slider" aria-hidden="true"></span>
          <span class="sr-only">Toggle teacher override</span>
        </label>
      </div>
      <p class="muted">Teachers/parents can override AI suggestions for grouping and pacing at any time.</p>
    `),
    `<div class="grid grid-2">${peers}</div>`,
    `<div style="margin-top:1rem"><button class="btn" onclick="navigate('projects')">Next → Project Hub</button></div>`
  ].join('');
}

function toggleOverride(cb){
  state.teacherOverride = cb.checked;
  peers();
}

function projects(){
  app.innerHTML = card(`
    <h2>Project Hub</h2>
    <div class="card">
      <h3>🏗️ ${state.project.title}</h3>
      <p class="muted">Connect Math (ratios) + Design (scale models) + English (Vocabulary: urban planning).</p>
      <div class="grid grid-3" style="margin:.6rem 0">
        <button class="btn secondary">Start</button>
        <button class="btn secondary">Resources</button>
        <button class="btn secondary">Submit</button>
      </div>
    </div>
    <div style="margin-top:.8rem">
      <button class="btn" onclick="navigate('dashboard')">Next → Dashboard</button>
    </div>
  `);
}

function dashboard(){
  const m = state.mastery;
  app.innerHTML = [
    card(`<h2>Dashboard</h2><p class="muted">Transparent progress and next steps. Teachers and parents can review and adjust.</p>`),
    card(`
      <div class="grid grid-3">
        ${kpi('Fractions Mastery', Math.round(m.fractions*100)+'%', 'var(--brand)')}
        ${kpi('Geometry Mastery', Math.round(m.geometry*100)+'%', 'var(--accent)')}
        ${kpi('Design Thinking', Math.round(m.designThinking*100)+'%', 'var(--good)')}
      </div>
      <div class="grid grid-2" style="margin-top:.6rem">
        <div>
          <h3>Next Best Actions</h3>
          <ul>
            <li>Try a visual fractions task with number lines <em>(you succeeded using diagrams)</em></li>
            <li>Schedule a 15‑min check‑in with your coach</li>
            <li>Join peers for City Model planning on Thursday</li>
          </ul>
        </div>
        <div>
          <h3>Vocabulary Boost (English)</h3>
          <p class="muted">Urban planning words: <em>zoning, transit, density, sustainable</em></p>
          <button class="btn secondary">Start 3‑minute review</button>
        </div>
      </div>
      <p class="muted">Why these suggestions? Based on your recent hint use, time‑on‑task, and reflection confidence.</p>
      <div style="margin-top:.6rem">
        <button class="btn ghost" onclick="navigate('home')">Back to Home</button>
      </div>
    `)
  ].join('');
}

// Init
navigate((location.hash.replace('#/','')) || 'home', true);
