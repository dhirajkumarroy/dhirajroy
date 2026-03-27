// Projects data for dynamic rendering
const projectsData = [
    {
        id: 1,
        title: "E-Commerce API Platform",
        description: "Scalable REST API with Spring Boot, JWT authentication, and Redis caching. Handles 10K+ concurrent users.",
        image: "assets/images/project-api.svg",
        github: "https://github.com/backenddevpro/ecommerce-api",
        demo: "https://api-demo.backenddevpro.com"
    },
    {
        id: 2,
        title: "n8n Automation Suite",
        description: "Custom workflow automation for CRM integration, email marketing, and data synchronization across 5+ platforms.",
        image: "assets/images/project-automation.svg",
        github: "https://github.com/backenddevpro/n8n-workflows",
        demo: "https://automation-demo.backenddevpro.com"
    },
    {
        id: 3,
        title: "Microservices Architecture",
        description: "Complete system design with service discovery, API gateway, and distributed tracing for enterprise clients.",
        image: "assets/images/project-system.svg",
        github: "https://github.com/backenddevpro/microservices-demo",
        demo: "https://system-demo.backenddevpro.com"
    },
    {
        id: 4,
        title: "Real-time Analytics Dashboard",
        description: "WebSocket-based real-time data streaming with WebFlux and MongoDB aggregation pipelines.",
        image: "assets/images/project-analytics.svg",
        github: "https://github.com/backenddevpro/analytics-dashboard",
        demo: "https://analytics-demo.backenddevpro.com"
    }
];

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = projectsData;
}