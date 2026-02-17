// Light theme Minerva prototype — aligned to Canva deck
const app = document.getElementById('app');
const routes = { home, lesson, lesson2, prompt, peers, projects, dashboard, about };

window.addEventListener('hashchange', () => navigate(location.hash.replace('#/','')||'home', true));

document.addEventListener('click', (e)=>{
  const btn = e.target.closest('button.link');
  if(btn && btn.dataset.route){ navigate(btn.dataset.route); }
});

const state = {
  user:{ name:'Aarav', grade:'6' },
  mastery:{ fractions:0.62, geometry:0.48, vocab:0.55, designThinking:0.77 },
  lastCorrect:null,
  usedHint:false,
  teacherOverride:false,
  peers:[{name:'Maya', strengths:['Geometry','Sketching'], overlap:0.82}, {name:'Vihaan', strengths:['Fractions','Python'], overlap:0.74}],
  project:{ title:'Build a City Model', due:'2 weeks', status:'In progress' },
  reflection:[]
};

function navigate(route, fromHash=false){
  (routes[route]||routes.home)();
  if(!fromHash) location.hash = '/'+route;
  app.focus();
}

function card(inner){return `<section class="card">${inner}</section>`}

/* ---------------- VIEWS ---------------- */
function home(){
  app.innerHTML = [
    card(`
      <div class="hero">
        <div style="flex:1">
          <h2 class="section-title">The Minerva School</h2>
          <p class="muted">A decentralized, AI‑guided hybrid model — light, human, community‑first.</p>
          <div class="grid grid-3" style="margin-top:1rem">
            <button class="btn" onclick="navigate('lesson')">Start Lesson</button>
            <button class="btn secondary" onclick="navigate('peers')">Join Peers</button>
            <button class="btn ghost" onclick="navigate('about')">About & Ethics</button>
          </div>
        </div>
      </div>`),
    card(`
      <h3 class="section-title">Aim & Objectives</h3>
      <div class="grid grid-3">
        <div>
          <div class="badge">Personalization</div>
          <ul class="list-check">
            <li>Adaptive learning</li>
            <li>Learner‑centered pathways</li>
          </ul>
        </div>
        <div>
          <div class="badge">Metacognition & Well‑being</div>
          <ul class="list-check">
            <li>Self‑regulation prompts</li>
            <li>Reduce anxiety via pacing</li>
          </ul>
        </div>
        <div>
          <div class="badge">Community Learning</div>
          <ul class="list-check">
            <li>Peer collaboration</li>
            <li>Purpose‑driven projects</li>
          </ul>
        </div>
      </div>`),
    card(`
      <h3 class="section-title">Problem & Opportunity</h3>
      <p class="muted">One‑speed schooling cannot scale personalization or metacognitive support; homeschooling lacks community and oversight. Minerva blends both: adaptive support + human mentorship + peer groups.</p>
    `)
  ].join('');
}

function lesson(){
  state.usedHint=false; state.lastCorrect=null;
  app.innerHTML = card(`
    <h3 class="section-title">Adaptive Lesson — Fractions</h3>
    <p class="muted">Q1 of 2 · 10–12 minutes</p>
    <div class="card">
      <p><strong>Q1:</strong> A recipe uses <em>3/4</em> cup of sugar. You want to make half the recipe. How much sugar do you need?</p>
      <div class="grid grid-3" style="margin:.5rem 0 1rem">
        <button class="btn" onclick="selectAnswer(this,false)">1/4 cup</button>
        <button class="btn" onclick="selectAnswer(this,true)">3/8 cup</button>
        <button class="btn" onclick="selectAnswer(this,false)">1/2 cup</button>
      </div>
      <button class="btn secondary" onclick="showHint()">Show hint</button>
      <div id="hint" class="muted" style="margin-top:.8rem"></div>
    </div>
    <div style="margin-top:.8rem">
      <button class="btn" onclick="lesson2()">Next →</button>
      <button class="btn ghost" onclick="navigate('home')">Back</button>
    </div>
  `);
}

function selectAnswer(btn, isCorrect){
  document.querySelectorAll('.card .btn').forEach(b=>b.style.outline='none');
  btn.style.outline='2px solid var(--brand)';
  state.lastCorrect = !!isCorrect;
}
function showHint(){
  state.usedHint=true; document.getElementById('hint').innerHTML = 'Hint: Half of 3/4 is (3/4) × (1/2) = 3/8. Multiply numerators and denominators.';
}

function lesson2(){
  const struggled = (state.lastCorrect===false) || state.usedHint===true;
  if(struggled){
    app.innerHTML = card(`
      <h3 class="section-title">Adaptive Lesson — Scaffolded Path</h3>
      <p class="muted">We’ll use a number line to visualize halves of fractions.</p>
      <div class="card">
        <p><strong>Q2 (Scaffolded):</strong> Mark <em>1/2 of 2/3</em> on the number line.</p>
        <p class="muted">Why this? You used a hint or missed Q1 → reinforcing the concept visually.</p>
        <button class="btn" onclick="navigate('prompt')">Got it → Reflection</button>
      </div>
    `);
  } else {
    app.innerHTML = card(`
      <h3 class="section-title">Adaptive Lesson — Challenge Path</h3>
      <p class="muted">Great! Let’s step up the challenge.</p>
      <div class="card">
        <p><strong>Q2 (Challenge):</strong> A smoothie uses <em>1 1/2</em> cups of yogurt. For <em>2/3</em> of the recipe, how much yogurt?</p>
        <div class="grid grid-3" style="margin:.5rem 0 1rem">
          <button class="btn">1 cup</button>
          <button class="btn">1 cup + 0.0̅ (Trick!)</button>
          <button class="btn">1 cup</button>
        </div>
        <p class="muted">Why this? Correct on Q1 with no hint → we’re testing mixed numbers scaling.</p>
        <button class="btn" onclick="navigate('prompt')">Next → Reflection</button>
      </div>
    `);
  }
}

function prompt(){
  app.innerHTML = card(`
    <h3 class="section-title">Quick Reflection</h3>
    <p class="muted">How confident do you feel about similar problems?</p>
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
function saveReflection(level){ state.reflection.push({ts:Date.now(), level}); alert('Saved: '+level+' confidence'); }

function peers(){
  const cards = state.peers.map(p=>`
    <div class="card">
      <h4>${p.name}</h4>
      <p class="muted">Strengths: ${p.strengths.join(', ')}</p>
      <div class="badge">Match: ${(p.overlap*100).toFixed(0)}%</div>
      <div style="margin-top:.6rem">${state.teacherOverride
        ? '<button class="btn" onclick="alert('Assigned by teacher override')">Assign directly</button>'
        : '<button class="btn">Request to join</button>'}
      </div>
      <p class="muted" style="margin-top:.5rem">Why this match? Complementary skills + schedule fit.</p>
    </div>`).join('');

  app.innerHTML = [
    card(`
      <h3 class="section-title">Peer Matching</h3>
      <div class="badge">Teacher Override:
        <label class="switch" style="vertical-align:middle; margin-left:.5rem">
          <input type="checkbox" ${state.teacherOverride?'checked':''} onchange="toggleOverride(this)">
          <span class="slider" aria-hidden="true"></span>
          <span class="sr-only">Toggle teacher override</span>
        </label>
      </div>
      <p class="muted">Teachers/parents can override AI suggestions for grouping and pacing at any time.</p>
    `),
    `<div class="grid grid-2">${cards}</div>`,
    `<div style="margin-top:1rem"><button class="btn" onclick="navigate('projects')">Next → Project Hub</button></div>`
  ].join('');
}
function toggleOverride(cb){ state.teacherOverride = cb.checked; peers(); }

function projects(){
  app.innerHTML = card(`
    <h3 class="section-title">Project Hub</h3>
    <div class="card">
      <h4>🏗️ ${state.project.title}</h4>
      <p class="muted">Connect Math (ratios) · Design (scale models) · English (Urban‑planning vocabulary).</p>
      <div class="grid grid-3" style="margin:.6rem 0">
        <button class="btn">Start</button>
        <button class="btn secondary">Resources</button>
        <button class="btn ghost">Submit</button>
      </div>
    </div>
    <div class="card">
      <h4>Vocabulary Boost</h4>
      <p class="muted">Words: zoning, transit, density, sustainable</p>
      <button class="btn secondary">Start 3‑minute review</button>
    </div>
    <div style="margin-top:.8rem"><button class="btn" onclick="navigate('dashboard')">Next → Dashboard</button></div>
  `);
}

function dashboard(){
  const m = state.mastery;
  app.innerHTML = [
    card(`<h3 class="section-title">Dashboard</h3><p class="muted">Transparent progress and next steps. Teachers and parents can review and adjust.</p>`),
    card(`
      <div class="grid grid-3">
        <div class="badge"><strong>Fractions:</strong> ${Math.round(m.fractions*100)}%</div>
        <div class="badge"><strong>Geometry:</strong> ${Math.round(m.geometry*100)}%</div>
        <div class="badge"><strong>Design Thinking:</strong> ${Math.round(m.designThinking*100)}%</div>
      </div>
      <div class="grid grid-2" style="margin-top:.6rem">
        <div>
          <h4>Next Best Actions</h4>
          <ul>
            <li>Try a visual fractions task (you used diagrams successfully)</li>
            <li>Schedule a 15‑minute check‑in with your coach</li>
            <li>Join peers for City Model planning on Thursday</li>
          </ul>
        </div>
        <div>
          <h4>Why these suggestions?</h4>
          <p class="muted">Based on hint use, time‑on‑task, and reflection confidence.</p>
        </div>
      </div>
      <div style="margin-top:.6rem"><button class="btn ghost" onclick="navigate('home')">Back to Home</button></div>
    `)
  ].join('');
}

function about(){
  app.innerHTML = [
    card(`
      <h3 class="section-title">About Minerva — Ethics & Human Oversight</h3>
      <div class="grid grid-2">
        <div>
          <h4>Data Minimization</h4>
          <ul>
            <li>No audio/video/biometrics in v1</li>
            <li>Demo runs entirely in your browser</li>
            <li>Interaction data is ephemeral</li>
          </ul>
        </div>
        <div>
          <h4>Explainability</h4>
          <ul>
            <li>Recommendations show simple rules</li>
            <li>“Why this?” panel in Dashboard</li>
          </ul>
        </div>
        <div>
          <h4>Human Oversight</h4>
          <ul>
            <li>Teacher override for grouping & pacing</li>
            <li>Parents access weekly summaries</li>
          </ul>
        </div>
        <div>
          <h4>Equity & Access</h4>
          <ul>
            <li>Low‑bandwidth UI</li>
            <li>Offline‑first roadmap; printable kits (v2)</li>
          </ul>
        </div>
      </div>
      <p class="muted" style="margin-top:.5rem">This prototype mirrors the presentation’s light aesthetic and section flow (Aim & Objectives → Problem & Opportunity → Solution → How it works → Features → Ethics → Demo).</p>
    `)
  ].join('');
}

// init
navigate((location.hash.replace('#/',''))||'home', true);
