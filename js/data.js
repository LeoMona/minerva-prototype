// Grades
const GRADES = ["K","1","2","3","4","5","6","7","8","9","10","11","12"];

// Lessons (sample)
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

// Peers (mock)
const PEERS = [
  { id:"p1", name:"A. Singh", role:"Learner", interests:["Robotics","Climate"], grade:8 },
  { id:"p2", name:"R. Das", role:"Learner", interests:["Art","Debate"], grade:9 },
  { id:"p3", name:"Mentor Dev", role:"Mentor", interests:["Robotics","Civic"], grade:null },
  { id:"p4", name:"Ms. Gupta", role:"Teacher", interests:["Debate","Education"], grade:null },
  { id:"p5", name:"K. Rao", role:"Learner", interests:["Sports","Sustainability"], grade:6 },
];

// Diverse projects (not only climate)
const PROJECTS = [
  { id:"pr1", title:"Community Health Map", theme:"Health", band:"9-12",
    blurb:"Students collect anonymous survey data on sleep, movement, and stress; visualize patterns; share tips.",
    skills:["Data literacy","Ethics","Visualization"] },
  { id:"pr2", title:"Reading Buddies", theme:"Education", band:"3-5",
    blurb:"Older students design read‑aloud sessions and phonics games for early readers.",
    skills:["Literacy","Mentoring","Planning"] },
  { id:"pr3", title:"Zero‑Waste Lunch", theme:"Sustainability", band:"6-8",
    blurb:"Audit cafeteria waste, prototype reusable/compostable choices, run a campaign.",
    skills:["Systems thinking","Design","Communication"] },
  { id:"pr4", title:"Civic Data Stories", theme:"Civic", band:"9-12",
    blurb:"Use open municipal data to tell a story about transport, parks, or safety.",
    skills:["Research","Data","Storytelling"] },
  { id:"pr5", title:"Assistive Tech Hack", theme:"Technology", band:"6-8",
    blurb:"Build low‑cost assistive prototypes (switches, grips) with microcontrollers or cardboard.",
    skills:["Prototyping","Empathy","Electronics"] },
  { id:"pr6", title:"School Heritage Walk", theme:"Arts", band:"K-2",
    blurb:"Create a photo‑and‑sound map of significant places and stories near your school.",
    skills:["Creativity","Curation","Collaboration"] },
  { id:"pr7", title:"Local Biodiversity Index", theme:"Sustainability", band:"3-5",
    blurb:"Document schoolyard species; propose habitat boosters (planters, pollinator paths).",
    skills:["Observation","Classification","Science"] },
  { id:"pr8", title:"Financial Fitness Club", theme:"Education", band:"9-12",
    blurb:"Peer‑taught modules on budgeting, savings, and mindful spending using simulations.",
    skills:["Quantitative reasoning","Leadership"] },
];
