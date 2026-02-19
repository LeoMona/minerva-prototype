// Minerva light climate prototype — interactive front-end only
const app = document.getElementById('app');
const routes = { home, join, login, onboarding, lesson, prompt, peers, projects, dashboard, about };

window.addEventListener('hashchange', () => navigate(location.hash.replace('#/','')||'home', true));

document.addEventListener('click', (e)=>{
  const btn = e.target.closest('button.link');
  if(btn && btn.dataset.route){ navigate(btn.dataset.route); }
});

const state = {
  user:null,
  teacherOverride:false,
  mastery:{ fractions:0.62, geometry:0.48, vocab:0.55, designThinking:0.77 },
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

// HOME
function home(){
  app.innerHTML = [
    card(`
      <div class="hero">
        <div style="flex:1">
          <h2 class="section-title">A school without walls</h2>
          <p class="muted">Personalization + metacognition + community — with transparent human oversight.</p>
          <div class="grid grid-3" style="margin-top:1rem">
            <button class="btn" onclick="navigate('join')">Join now</button>
            <button class="btn secondary" onclick="navigate('login')">Log in</button>
            <button class="btn ghost" onclick="navigate('about')">About & Ethics</button>
          </div>
        </div>
      </div>`),
    card(`
      <h3 class="section-title">How it works</h3>
      <ol>
        <li>Student logs in → <em>AI assesses profile</em></li>
        <li>Personalized learning path created</li>
        <li>Metacognition tracking</li>
        <li>Peer matching</li>
        <li>Project‑based collaboration</li>
        <li>Continuous adaptation</li>
      </ol>
    `)
  ].join('');
}

// AUTH — JOIN
function join(){
  app.innerHTML = card(`
    <h3 class="section-title">Create your account</h3>
    <div class="grid grid-2">
      <div>
        <label class="label">Full name</label>
        <input class="input" id="name" placeholder="e.g., Aarav Sharma"/>
        <label class="label">Email</label>
        <input class="input" id="email" placeholder="name@example.com"/>
        <label class="label">Role</label>
        <select id="role" class="input"><option>Student</option><option>Parent</option><option>Teacher</option></select>
        <div style="margin-top:1rem"><button class="btn" onclick="startOnboarding()">Create account →</button></div>
      </div>
      <div>
        <p class="muted">By continuing you agree to minimal data use: only interaction data (time‑on‑task, hint usage) and brief self‑reports for metacognition. No audio/video/biometrics.</p>
      </div>
    </div>
  `);
}

// AUTH — LOGIN
function login(){
  app.innerHTML = card(`
    <h3 class="section-title">Log in</h3>
    <div class="grid grid-2">
      <div>
        <label class="label">Email</label>
        <input class="input" id="lemail" placeholder="name@example.com"/>
        <label class="label">Password</label>
        <input class="input" id="lpw" type="password"/>
        <div style="margin-top:1rem"><button class="btn" onclick="startOnboarding(true)">Log in →</button></div>
      </div>
      <div>
        <p class="muted">Forgot your password? In this prototype, credentials are not stored. Click Log in to simulate access.</p>
      </div>
    </div>
  `);
}

function startOnboarding(isLogin=false){
  const name = document.getElementById(isLogin? 'lemail':'name')?.value || 'Learner';
  state.user = { name };
  navigate('onboarding');
}

// ONBOARDING — AI assessment → path
function onboarding(){
  app.innerHTML = card(`
    <h3 class="section-title">Setting up your learning space</h3>
    <p class="muted"><span class="spinner"></span> AI is assessing your profile and goals…</p>
    <ul>
      <li>Prior knowledge check (quick interactive)</li>
      <li>Interests & goals (short survey)</li>
      <li>Metacognition baseline (confidence & strategy prompts)</li>
    </ul>
    <div style="margin-top:1rem"><button class="btn" onclick="finishOnboarding()">Continue → Personalized Path</button></div>
  `);
}

function finishOnboarding(){
  app.innerHTML = [
    card(`<h3 class="section-title">Welcome, ${state.user?.name||'Learner'}!</h3><p>Your personalized path is ready.</p>`),
    card(`
      <div class="grid grid-3">
        <div class="badge">Next: Adaptive Lesson</div>
        <div class="badge">Join a Peer Group</div>
        <div class="badge">Pick a Project</div>
      </div>
      <div style="margin-top:1rem"><button class="btn" onclick="navigate('dashboard')">Go to Dashboard →</button></div>
    `)
  ].join('');
}

// LESSON
function lesson(){
  state.lastCorrect=null; state.usedHint=false;
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
function selectAnswer(btn, ok){ document.querySelectorAll('.card .btn').forEach(b=>b.style.outline='none'); btn.style.outline='2px solid var(--brand)'; state.lastCorrect=!!ok; }
function showHint(){ state.usedHint=true; document.getElementById('hint').innerHTML = 'Hint: Half of 3/4 is (3/4) × (1/2) = 3/8.' }

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

// REFLECTION
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

// PEERS
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
      <p class="muted">Educators can override AI suggestions for grouping and pacing at any time.</p>
    `),
    `<div class="grid grid-2">${cards}</div>`,
    `<div style="margin-top:1rem"><button class="btn" onclick="navigate('projects')">Next → Project Hub</button></div>`
  ].join('');
}
function toggleOverride(cb){ state.teacherOverride = cb.checked; peers(); }

// PROJECTS
function projects(){
  app.innerHTML = card(`
    <h3 class="section-title">Project Hub</h3>
    <div class="card">
      <h4>🏗️ ${state.project.title}</h4>
      <p class="muted">Integrates Math (ratios) · Design (scale models) · English (urban‑planning vocabulary).</p>
      <div class="grid grid-3" style="margin:.6rem 0">
        <button class="btn">Start</button>
        <button class="btn secondary">Resources</button>
        <button class="btn ghost">Submit</button>
      </div>
    </div>
    <div style="margin-top:.8rem"><button class="btn" onclick="navigate('dashboard')">Next → Dashboard</button></div>
  `);
}

// DASHBOARD
function dashboard(){
  const m = state.mastery; const userName = state.user?.name || 'Learner';
  app.innerHTML = [
    card(`<h3 class="section-title">Dashboard — Welcome, ${userName}</h3><p class="muted">Your journey at a glance.</p>`),
    card(`
      <h4>Onboarding checklist</h4>
      <ol>
        <li>✔ Log in (done)</li>
        <li>✔ AI profile assessed</li>
        <li>◻ Metacognition baseline set</li>
        <li>◻ Join peer group</li>
        <li>◻ Start project</li>
        <li>◻ Weekly reflection</li>
      </ol>
    `),
    card(`
      <h4>Mastery & momentum</h4>
      <div class="grid grid-3">
        <div class="badge"><strong>Fractions:</strong> ${Math.round(m.fractions*100)}%</div>
        <div class="badge"><strong>Geometry:</strong> ${Math.round(m.geometry*100)}%</div>
        <div class="badge"><strong>Design Thinking:</strong> ${Math.round(m.designThinking*100)}%</div>
      </div>
      <div class="grid grid-2" style="margin-top:.6rem">
        <div>
          <h4>Next Best Actions</h4>
          <ul>
            <li>Visual fractions task (you used diagrams successfully)</li>
            <li>15‑min coach check‑in</li>
            <li>Join City Model planning on Thu</li>
          </ul>
        </div>
        <div>
          <h4>Why these suggestions?</h4>
          <p class="muted">Based on hint use, time‑on‑task, and reflection confidence.</p>
        </div>
      </div>
    `)
  ].join('');
}

// ABOUT — ethics and School of Humanity inspirations
function about(){
  app.innerHTML = card(`
    <h3 class="section-title">About Minerva — Ethics & Model</h3>
    <div class="grid grid-2">
      <div>
        <h4>Data minimization</h4>
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
          <li>“Why this?” panel on Dashboard</li>
        </ul>
      </div>
      <div>
        <h4>Human oversight</h4>
        <ul>
          <li>Teacher override for grouping & pacing</li>
          <li>Parents access weekly summaries</li>
        </ul>
      </div>
      <div>
        <h4>Inspired by mastery & real‑world challenges</h4>
        <ul>
          <li>Challenge‑based learning and portfolios</li>
          <li>Mastery progression (advance on evidence)</li>
        </ul>
      </div>
    </div>
    <p class="muted" style="margin-top:.5rem">This prototype mirrors your presentation and uses a climate‑inspired light palette.</p>
  `);
}

// init
navigate((location.hash.replace('#/',''))||'home', true);
