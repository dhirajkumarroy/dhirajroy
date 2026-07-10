// Featured production projects data
const projectsData = [
  {
    id: 1,
    title: "AUConnect",
    description: "A smart shopping list application built with Flutter that simplifies grocery planning, categorizes items automatically, and supports shared sync lists for collaborative family shopping.",
    status: "Live",
    techBadges: ["Flutter", "Dart", "SQLite", "Firebase"],
    features: [
      "Offline-first item storage with local SQLite database synchronization",
      "Dynamic automatic categorization and price calculation algorithms",
      "Real-time list sharing and collaborative syncing via Firebase integrations",
      "Intuitive dashboard optimized for single-handed mobile navigation layout"
    ],
    architecture: "Clean architecture using Flutter BLoC state management, repository design patterns, and real-time database sync layers.",
    github: "https://github.com/dhirajkumarroy/auconnect",
    demo: "https://auconnect.dhirajroy.com",
    caseStudy: "/projects.html#auconnect",
    category: "mobile"
  },
  {
    id: 2,
    title: "AUNext",
    description: "A library and coaching management system built with Laravel and React, automating student schedules, book borrowing systems, fee invoice tracking, and academic performance tracking.",
    status: "Live",
    techBadges: ["React", "Laravel", "PHP", "MySQL"],
    features: [
      "Automated library checkouts and deadline alerts notification systems",
      "Dynamic schedule conflict prevention for coaching class timetables",
      "Integrated payment reporting and digital fee invoice generation logs",
      "Interactive student progress charts and monthly test reporting boards"
    ],
    architecture: "Model-View-Controller backend utilizing Laravel Eloquent ORM, combined with a dynamic React front-end powered by CSS variables.",
    github: "https://github.com/dhirajkumarroy/aunext",
    demo: "https://aunext.dhirajroy.com",
    caseStudy: "/projects.html#aunext",
    category: "fullstack"
  },
  {
    id: 3,
    title: "AUCart",
    description: "A campus e-commerce marketplace built using Node.js, Express, React, and MongoDB, supporting multi-seller setups, transaction dashboards, and payout schedules.",
    status: "Coming Soon",
    techBadges: ["React", "Node.js", "Express", "MongoDB", "Razorpay"],
    features: [
      "Multi-vendor product management portals with individual stock logging",
      "Razorpay checkout integrations and automated payment verification hooks",
      "Centralized administrative console for seller verification checks",
      "Real-time chat modules connecting buyers and sellers directly"
    ],
    architecture: "Decoupled MERN stack architecture leveraging JWT token validation, mongoose models, and RESTful service orchestration.",
    github: "https://github.com/dhirajkumarroy/au-kart",
    demo: null,
    caseStudy: "/projects.html#aucart",
    category: "fullstack"
  }
];

/* Freeze data to prevent mutation */
Object.freeze(projectsData);

/* Export for node environment if applicable */
if (typeof module !== "undefined" && module.exports) {
  module.exports = projectsData;
}
