// Minimal hash router
const app = document.getElementById('app');
const routes = {
  '/home': renderHome,
  '/join': renderJoin,
  '/login': renderLogin,
  '/lessons': renderLessons,
  '/peers': renderPeers,
  '/projects': renderProjects,
  '/dashboard': renderDashboard,
  '/about': renderAbout
};

function navigate() {
  const hash = location.hash.replace('#', '') || '/home';
  const view = routes[hash] || renderHome;
  app.innerHTML = '';
  app.appendChild(view());
  app.focus(); // accessibility
}

window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', () => {
  // Theme
  const saved = localStorage.getItem('minerva-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? '' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('minerva-theme', next);
  });
  document.getElementById('year').textContent = new Date().getFullYear();
  navigate();
});

// Helpers
function el(tag, attrs = {}, html = '') {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  });
  node.innerHTML = html;
  return node;
}

function card(title, bodyHtml) {
  const c = el('section', { class: 'card feature' });
  c.append(el('h3', {}, title));
  const body = el('div', {});
  body.innerHTML = bodyHtml;
  c.append(body);
  return c;
}

// Views
function renderHome() {
  const container = el('div', { class: 'section' });
  const hero = el('section', { class: 'hero' });
  hero.append(
    el('div', { class: 'panel' }, `
      <span class="badge">Prototype</span>
      <h1 class="headline">Where curiosity finds its community</h1>
      <p class="tagline">A decentralized school model that blends AI tutors, human mentors, and peer communities to deliver personalized, project-based learning.</p>
      <div class="hero-cta">
        <a href="#/join" class="btn btn-primary">Join beta</a>
        <a href="#/about" class="btn btn-secondary">Learn more</a>
      </div>
      <div class="kpis" aria-label="Highlights">
        <div class="kpi"><div class="value">Adaptive</div><div>Personalized pathways</div></div>
        <div class="kpi"><div class="value">Wellbeing</div><div>Metacognition & self-regulation</div></div>
        <div class="kpi"><div class="value">Community</div><div>Peers & mentors</div></div>
      </div>
    `)
  );

  const features = el('section', { class: 'section' });
  features.append(el('h2', { class: 'title' }, 'Core components'));
  const grid = el('div', { class: 'grid cols-3' });
  grid.append(
    card('Decentralized learning', 'Home + community hubs replace the one-size-fits-all classroom.'),
    card('AI tutor', 'Conversational, adaptive guidance that maps talents & interests.'),
    card('Human mentors', 'Design, mentoring, and governance remain central.'),
    card('Peer groups', 'Interest-aligned, evolving cohorts for collaboration.'),
    card('Metacognition tracking', 'Progress journals, reflection prompts, and wellbeing signals.'),
    card('Projects', 'Purpose-driven work tied to local impact & global challenges.')
  );
  features.append(grid);

  const how = el('section', { class: 'section card' });
  how.append(el('h2', { class: 'title' }, 'How it works'));
  const list = el('ol');
  [
    'Student logs in → AI assesses profile',
    'Personalized learning path created',
    'Metacognition & wellbeing tracking',
    'Peer matching (interest-first)',
    'Project-based collaboration',
    'Continuous adaptation with human oversight'
  ].forEach(step => list.append(el('li', {}, step)));
  how.append(list);

  const ethics = el('section', { class: 'section grid cols-2' });
  ethics.append(
    card('Privacy & Safety', '<ul><li>Parental consent & transparency</li><li>Local-first storage where possible</li><li>End-to-end encryption</li><li>Anonymous peer matching</li></ul>'),
    card('Bias & Equity', '<ul><li>Interest-based cohorts</li><li>Regular audits & diverse training data</li><li>Community learning hubs for access</li></ul>')
  );

  const leagues = el('section', { class: 'section card' });
  leagues.append(el('h2', { class: 'title' }, 'Climate Leagues (partners)'));
  leagues.append(el('p', {}, 'We align projects to Oceans · Energy · Water · Land challenges to link learning with climate action.'));
  const chips = el('div', { class: 'chips' });
  ['Oceans', 'Energy', 'Water', 'Land'].forEach(name => chips.append(el('span', { class: 'chip' }, name)));
  leagues.append(chips);

  container.append(hero, features, how, ethics, leagues);
  return container;
}

function renderJoin() {
  const container = el('div', { class: 'section grid cols-2' });
  container.append(
    card('Join Minerva (beta)', `
      <form id="joinForm">
        <label class="label" for="name">Full name</label>
        <input class="input" id="name" name="name" required placeholder="e.g., Asha Kumar"/>
        <label class="label" for="role" style="margin-top:.75rem">Role</label>
        <select class="input" id="role" name="role">
          <option>Learner</option>
          <option>Parent/Guardian</option>
          <option>Mentor</option>
          <option>Teacher</option>
        </select>
        <label class="label" for="email" style="margin-top:.75rem">Email</label>
        <input class="input" id="email" type="email" name="email" placeholder="name@example.com"/>
        <div style="margin-top:1rem; display:flex; gap:.5rem;">
          <button type="submit" class="btn btn-primary">Request invite</button>
          <a href="#/about" class="btn btn-secondary">Learn more</a>
        </div>
      </form>
    `),
    card('Why join?', '<ul><li>Personalized pathways</li><li>Mentor & peer support</li><li>Project-based, purpose-driven learning</li></ul>')
  );
  container.querySelector('#joinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thanks! This is a prototype — your request is recorded locally only.');
  });
  return container;
}

function renderLogin() { return card('Log in', '<p>This is a demo-only prototype. Authentication is not connected.</p>'); }
function renderLessons() {
  const container = el('div', { class: 'section' });
  container.append(el('h2', { class: 'title' }, 'Lessons'));
  const table = el('table', { class: 'table' });
  table.innerHTML = `
    <thead><tr><th>Module</th><th>Focus</th><th>Mode</th><th>Action</th></tr></thead>
    <tbody>
      <tr><td>Foundations of Climate</td><td>Systems thinking</td><td>Self-paced</td><td><button class="btn btn-secondary btn-compact">Open</button></td></tr>
      <tr><td>Metacognition 101</td><td>Learning how to learn</td><td>Guided</td><td><button class="btn btn-secondary btn-compact">Open</button></td></tr>
      <tr><td>Community Project</td><td>Local impact</td><td>Collaborative</td><td><button class="btn btn-secondary btn-compact">Open</button></td></tr>
    </tbody>`;
  container.append(el('div', { class: 'card' }, table.outerHTML));
  return container;
}
function renderPeers() { return card('Peers', '<p>Interest-aligned groups will appear here.</p>'); }
function renderProjects() { return card('Projects', '<p>Showcase of purpose-driven projects. Connect to Oceans, Energy, Water, or Land.</p>'); }
function renderDashboard() { return card('Dashboard', '<p>Progress, reflections, and mentor feedback (mock).</p>'); }
function renderAbout() {
  const wrap = el('div', { class: 'section grid cols-2' });
  wrap.append(
    card('About Minerva School', `
      <p><strong>Vision:</strong> Education should adapt to learners — not the other way around.</p>
      <p>Minerva blends decentralized learning, AI personalization, human mentorship, and peer collaboration. It is anchored in self-determination theory, social constructivism, and metacognition research.</p>
      <p class="muted">Prototype built for design exploration and co-creation.</p>
    `),
    card('Ethics & Governance', '<ul><li>Human-in-the-loop decisions</li><li>Consent & transparency</li><li>Privacy by design</li><li>Independent audits</li></ul>')
  );
  return wrap;
}
