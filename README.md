# Minerva — Concept Prototype (GitHub‑ready)

A lightweight, client‑side prototype you can host on **GitHub Pages** to pitch Minerva to decision‑makers.
It demonstrates the core learner flow and the ethics guardrails (data minimization, explainability, human‑in‑the‑loop).

## 💡 What’s inside
- Home → Lesson → Reflection → Peer Matching → Project Hub → Dashboard
- **Branching lesson**: success → challenge up; struggle → scaffolded hint
- **Teacher override** toggle for grouping (human oversight)
- **About / Ethics** panel
- No backend, no persistence, **no personal data**

## 🚀 1‑minute deploy (GitHub Pages)
1. Create a new repo named `minerva-prototype` on your GitHub account.
2. Upload these files (drag‑and‑drop the contents of this folder).
3. Go to **Settings → Pages → Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main** and **/ (root)**
   - Save and wait ~1–2 minutes.
4. Your live URL: `https://<your-username>.github.io/minerva-prototype/`

## 🖥️ Run locally
- Just open `index.html` in your browser, or
- Use a local server: `python -m http.server 5173` → open http://localhost:5173

## 🎯 Pitch mode (60‑second flow)
- Start on **Home**: “A school without walls — learning that adapts as you grow.”
- Click **Start Lesson** → answer Q1; show **Hint** once to demo scaffold.
- Click **Next**: see **Challenge path** if correct/no hint, or **Scaffolded path** if wrong/hint.
- Click **Next → Reflection**: choose a confidence level.
- Go to **Join Peers**: toggle **Teacher Override** → show “Assign Directly.”
- Open **Project Hub**: show integrated Math + Design + English vocabulary.
- End on **Dashboard**: show **Next Best Actions** + explain “Why these suggestions.”

## 🔒 Ethics & Safety (v1 prototype)
- Data minimization: no audio/video/biometrics; interaction data stays in the browser.
- Explainability: “Why this?” messages indicate the simple rule powering a suggestion.
- Human oversight: teacher override switch; manual controls are always available.
- Equity: low‑bandwidth UI; offline‑first roadmap for v2; printable kits in v2.

## 🛠️ Customize
- Edit brand text in `index.html` (header) and the gradient in `styles.css`.
- Adjust lesson items and branching in `app.js` (functions `lesson` and `lesson2`).
- Replace `assets/logo.svg` with your own logo.

## 📄 License
This concept prototype is for demonstration and coursework purposes.
