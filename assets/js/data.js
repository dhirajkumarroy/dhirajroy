// Projects data (production-ready)

const projectsData = [
  {
    id: 1,
    title: "Production Auth System",
    description:
      "Designed and built a scalable authentication system with Node.js and MongoDB featuring JWT-based access & refresh tokens, role-based access control, secure password hashing, protected APIs, and Swagger documentation for seamless frontend integration.",
    github: "https://github.com/dhirajkumarroy/production-auth-system",
    demo: null,
  },
  {
    id: 2,
    title: "n8n Automation Workflows",
    description:
      "Designed and implemented automation workflows for CRM integration, email campaigns, and third-party API sync using n8n.",
    github: "https://github.com/dhirajkumarroy/n8n-automation",
    demo: null,
  },
  {
    id: 3,
    title: "Microservices Backend System",
    description:
      "Developed a microservices-based architecture with API Gateway, service discovery, and centralized logging for scalability.",
    github: "https://github.com/dhirajkumarroy/microservices-system",
    demo: null,
  },
  {
    id: 4,
    title: "Real-time Analytics Backend",
    description:
      "Implemented real-time data processing using Spring WebFlux and MongoDB aggregation pipelines for analytics dashboards.",
    github: "https://github.com/dhirajkumarroy/realtime-analytics",
    demo: null,
  },
];

/* =========================
   OPTIONAL: Freeze data (prevent mutation)
========================= */
Object.freeze(projectsData);

/* =========================
   EXPORT (Node safe)
========================= */
if (typeof module !== "undefined" && module.exports) {
  module.exports = projectsData;
}
