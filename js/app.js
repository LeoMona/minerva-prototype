// Render Peers
function displayPeers() {
  const peerContainer = document.getElementById("peers");
  peerContainer.innerHTML = "";
  peerNames.forEach(name => {
    const div = document.createElement("div");
    div.className = "peer-card";
    div.textContent = name;
    peerContainer.appendChild(div);
  });
}

// Render Lessons
function displayLessons() {
  const lessonsContainer = document.getElementById("lessons");
  lessonsContainer.innerHTML = "";
  lessons.forEach(subject => {
    const div = document.createElement("div");
    div.className = "lesson-card";
    div.textContent = subject;
    lessonsContainer.appendChild(div);
  });
}

// Render Projects
function displayProjects() {
  const projectContainer = document.getElementById("projects");
  projectContainer.innerHTML = "";
  projects.forEach(project => {
    const div = document.createElement("div");
    div.className = "project-card";
    div.textContent = project;
    projectContainer.appendChild(div);
  });
}

// Initialize content
document.addEventListener("DOMContentLoaded", () => {
  displayPeers();
  displayLessons();
  displayProjects();
});
