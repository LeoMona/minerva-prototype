/* data.js */

/* Grades */
const GRADES = ["K","1","2","3","4","5","6","7","8","9","10","11","12"];

/* Lessons: grade-specific, with global skill tags */
const LESSONS = [
  { id:"l1", title:"Foundations of Climate", subject:"Science", mode:"Self‑paced", grades:[6,7,8,9], band:"6-9", skills:["Systems thinking","Data"] },
  { id:"l2", title:"Metacognition 101", subject:"Life Skills", mode:"Guided", grades:[5,6,7,8,9,10], band:"5-10", skills:["Planning","Reflection"] },
  { id:"l3", title:"Community Project", subject:"Social Studies", mode:"Collaborative", grades:[7,8,9,10,11,12], band:"7-12", skills:["Collaboration","Civic"] },
  { id:"l4", title:"Fractions with Minecraft", subject:"Math", mode:"Guided", grades:[3,4,5], band:"3-5", skills:["Problem solving","Representation"] },
  { id:"l5", title:"Narrative Writing", subject:"English", mode:"Self‑paced", grades:[6,7], band:"6-7", skills:["Communication","Creativity"] },
  { id:"l6", title:"Scratch: Arcade Games", subject:"Computer Science", mode:"Self‑paced", grades:[4,5,6], band:"4-6", skills:["Computational thinking","Design"] },
  { id:"l7", title:"Watercolor Basics", subject:"Arts", mode:"Studio", grades:[6,7,8], band:"6-8", skills:["Creativity","Technique"] },
  { id:"l8", title:"Fitness Circuits", subject:"PE", mode:"Coach‑led", grades:[9,10,11,12], band:"9-12", skills:["Wellness","Discipline"] },
];

/* Global peers / mentors / teachers with locations (for map) */
const PEERS = [
  { id:"p1",  name:"A. Kim",         role:"Learner", interests:["Robotics","Math"],        grade:10,  city:"Seoul",        country:"South Korea", lat:37.5665, lng:126.9780 },
  { id:"p2",  name:"L. Oliveira",    role:"Learner", interests:["Art","Media"],            grade:8,   city:"São Paulo",    country:"Brazil",      lat:-23.5505,lng:-46.6333 },
  { id:"p3",  name:"T. Ivanov",      role:"Mentor",  interests:["Civic","Data"],           grade:null,city:"Sofia",        country:"Bulgaria",    lat:42.6977, lng:23.3219 },
  { id:"p4",  name:"M. Okafor",      role:"Teacher", interests:["Biology","Health"],       grade:null,city:"Lagos",        country:"Nigeria",     lat:6.5244,  lng:3.3792 },
  { id:"p5",  name:"S. Banerjee",    role:"Learner", interests:["CS","Entrepreneurship"],  grade:12,  city:"Kolkata",      country:"India",       lat:22.5726, lng:88.3639 },
  { id:"p6",  name:"C. Johnson",     role:"Teacher", interests:["History","Civic"],        grade:null,city:"Chicago",      country:"USA",         lat:41.8781, lng:-87.6298 },
  { id:"p7",  name:"Y. Chen",        role:"Learner", interests:["Math","Physics"],         grade:11,  city:"Taipei",       country:"Taiwan",      lat:25.0330, lng:121.5654 },
  { id:"p8",  name:"R. Haddad",      role:"Mentor",  interests:["Design","Media"],         grade:null,city:"Dubai",        country:"UAE",         lat:25.2048, lng:55.2708 },
  { id:"p9",  name:"E. García",      role:"Learner", interests:["Biology","Environment"],  grade:9,   city:"Barcelona",    country:"Spain",       lat:41.3874, lng:2.1686 },
  { id:"p10", name:"N. Petrovic",    role:"Learner", interests:["PE","Sports"],            grade:7,   city:"Belgrade",     country:"Serbia",      lat:44.7866, lng:20.4489 },
  { id:"p11", name:"K. Williams",    role:"Mentor",  interests:["Finance","Entrepreneurship"],grade:null, city:"London",  country:"UK",          lat:51.5072, lng:-0.1276 },
  { id:"p12", name:"H. Nakamura",    role:"Teacher", interests:["Technology","CS"],        grade:null,city:"Tokyo",        country:"Japan",       lat:35.6762, lng:139.6503 },
];

/* Global Subjects & Projects (no SDG) */
const PROJECTS = [
  // STEM
  { id:"pr1",  subject:"STEM", title:"Low‑Cost Air Sensor", band:"6-8",
    blurb:"Assemble a PM2.5 sensor, calibrate, and compare readings around campus.",
    skills:["Electronics","Data","Calibration"] },
  { id:"pr2",  subject:"STEM", title:"Math Modeling Challenge", band:"9-12",
    blurb:"Use functions to model real‑world growth/decay; present assumptions & limitations.",
    skills:["Modeling","Reasoning","Communication"] },

  // Arts & Design
  { id:"pr3",  subject:"Arts & Design", title:"Community Mural", band:"6-8",
    blurb:"Co‑design a mural celebrating local stories; create stencils & color plan.",
    skills:["Design","Collaboration","Technique"] },

  // Civic & Service
  { id:"pr4",  subject:"Civic & Service", title:"Open Data Story", band:"9-12",
    blurb:"Use open civic data to tell a story about transport, parks, or safety.",
    skills:["Research","Data viz","Storytelling"] },

  // Entrepreneurship
  { id:"pr5",  subject:"Entrepreneurship", title:"Campus Startup Sprint", band:"9-12",
    blurb:"Validate a problem, prototype, and run a mini‑pilot with real users.",
    skills:["Customer discovery","Prototyping","Pitching"] },

  // Health & Wellness
  { id:"pr6",  subject:"Health & Wellness", title:"Mindful Mornings Program", band:"3-5",
    blurb:"Design 5‑minute routines (breathing, journaling, gratitude) before class.",
    skills:["Habits","Facilitation","Wellbeing"] },

  // Environment
  { id:"pr7",  subject:"Environment", title:"Zero‑Waste Cafeteria", band:"6-8",
    blurb:"Audit waste, design signage and compost workflow; track change.",
    skills:["Measurement","Behavior design","Data"] },

  // Media & Communication
  { id:"pr8",  subject:"Media & Communication", title:"Podcast: Voices of Our City", band:"9-12",
    blurb:"Research, script, interview, and publish a 10‑minute episode.",
    skills:["Interviewing","Editing","Distribution"] },

  // Technology & Computing
  { id:"pr9",  subject:"Technology & Computing", title:"Scratch Arcade Showcase", band:"4-6",
    blurb:"Build and showcase a playable arcade with at least 3 mechanics.",
    skills:["Computational thinking","Game design"] },
  { id:"pr10", subject:"Technology & Computing", title:"Web for Good", band:"9-12",
    blurb:"Design an accessible website for a local cause; measure usability.",
    skills:["Accessibility","Frontend","UX"] },
];

/* Suggestions: competitions & internships (static demo) */
const SUGGESTIONS = [
  { id:"s1",  type:"Competition", title:"Math Modeling Mini‑Challenge", subject:"STEM", bands:["9-12"], link:"https://example.org/math-modeling" },
  { id:"s2",  type:"Competition", title:"Youth Podcast Awards", subject:"Media & Communication", bands:["9-12"], link:"https://example.org/podcast-awards" },
  { id:"s3",  type:"Competition", title:"Scratch Game Jam", subject:"Technology & Computing", bands:["4-6","6-8"], link:"https://example.org/scratch-jam" },
  { id:"s4",  type:"Internship",  title:"Local Museum Jr. Docent", subject:"Arts & Design", bands:["9-12"], link:"https://example.org/museum-docent" },
  { id:"s5",  type:"Internship",  title:"Civic Data Fellowship (virtual)", subject:"Civic & Service", bands:["9-12"], link:"https://example.org/civic-data" },
  { id:"s6",  type:"Competition", title:"Green Campus Innovators", subject:"Environment", bands:["6-8","9-12"], link:"https://example.org/green-campus" },
  { id:"s7",  type:"Internship",  title:"Startup Shadow Week", subject:"Entrepreneurship", bands:["9-12"], link:"https://example.org/startup-shadow" },
  { id:"s8",  type:"Competition", title:"Wellness Poster Design", subject:"Health & Wellness", bands:["3-5","6-8"], link:"https://example.org/wellness-poster" },
];
