/* chatbot.js — Wellness check panel that saves mood + optional note.
   - Uses #modal if present; falls back to prompt if not.
   - Persists to localStorage: mood_history = { [userId]: [{t, mood, note?}, ...] }
   - Works with your existing toast() and refreshDashboard() if available.
*/
(() => {
  'use strict';

  // Utilities (safe fallbacks)
  const $  = (sel, root=document) => root.querySelector(sel);
  const load = (k, d=null) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; }
  };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const toast = (msg) => {
    if (typeof window.toast === 'function') { window.toast(msg); }
    else { console.log('[toast]', msg); }
  };

  const MOOD_KEY = 'mood_history';

  function currentUser() {
    return load('minerva_current_user');
  }
  function pushMood(userId, mood, note='') {
    const all = load(MOOD_KEY, {});
    all[userId] = all[userId] || [];
    all[userId].unshift({ t: Date.now(), mood: Number(mood), note: (note||'').slice(0, 280) });
    save(MOOD_KEY, all);
  }

  function openWellnessModal() {
    const user = currentUser();
    if (!user) {
      toast('Please sign in to log your mood');
      location.hash = '#login';
      return;
    }

    const dlg = $('#modal');
    const title = $('#modalTitle');
    const body = $('#modalBody');
    const actions = $('#modalActions');

    if (!dlg || !title || !body || !actions || typeof dlg.showModal !== 'function') {
      const mood = prompt('How are you feeling? (1=😞 to 5=😄)', '3');
      if (!mood) return;
      const n = Number(mood);
      if (n >= 1 && n <= 5) {
        pushMood(user.id, n, '');
        toast('Mood saved');
        if (typeof window.refreshDashboard === 'function') window.refreshDashboard();
      } else {
        toast('Please enter a number between 1 and 5');
      }
      return;
    }

    title.textContent = 'Wellness check';
    body.innerHTML = `
      <p style="margin:6px 0">How are you feeling right now?</p>
      <div id="moodRow" style="display:flex; gap:8px; flex-wrap:wrap">
        <button type="button" class="btn" data-mood="1" title="😞">😞</button>
        <button type="button" class="btn" data-mood="2" title="🙁">🙁</button>
        <button type="button" class="btn" data-mood="3" title="😐">😐</button>
        <button type="button" class="btn" data-mood="4" title="🙂">🙂</button>
        <button type="button" class="btn" data-mood="5" title="😄">😄</button>
      </div>
      <div style="margin-top:10px">
        <label for="moodNote" style="display:block; font-size:14px; color:var(--muted); margin-bottom:6px">Want to add a short note?</label>
        <textarea id="moodNote" rows="3" placeholder="e.g., Feeling tired after practice, will take a walk and sleep early."></textarea>
      </div>
      <div class="card" style="padding:10px; margin-top:10px">
        <strong>Quick self‑care ideas</strong>
        <ul style="margin:6px 0 0 18px">
          <li>60‑second stretch or 10 deep breaths</li>
          <li>2‑minute water break</li>
          <li>Make a tiny plan: one task you’ll do next</li>
        </ul>
      </div>
    `;
    actions.innerHTML = `
      <form method="dialog"><button class="btn">Close</button></form>
      <button class="btn primary" id="saveMoodBtn" disabled>Save</button>
    `;

    let selectedMood = null;
    const row = $('#moodRow');
    const saveBtn = $('#saveMoodBtn');
    const noteEl = $('#moodNote');

    row.querySelectorAll('button[data-mood]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedMood = Number(btn.dataset.mood);
        row.querySelectorAll('button').forEach(b => b.classList.remove('primary'));
        btn.classList.add('primary');
        saveBtn.disabled = false;
      });
    });

    saveBtn.addEventListener('click', () => {
      if (!selectedMood) return;
      pushMood(user.id, selectedMood, noteEl.value.trim());
      toast('Mood saved');
      if (typeof window.refreshDashboard === 'function') window.refreshDashboard();
      dlg.close();
    });

    dlg.showModal();
  }

  function init() {
    const btn = document.getElementById('chatbotBtn');
    if (btn) btn.addEventListener('click', openWellnessModal);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
