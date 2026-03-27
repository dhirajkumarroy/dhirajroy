// Projects data for dynamic rendering (clean version - no images)
const projectsData = [
    {
        id: 1,
        title: "E-Commerce API Platform",
        description: "Scalable REST API with Spring Boot, JWT authentication, and Redis caching. Handles 10K+ concurrent users.",
        github: "https://github.com/backenddevpro/ecommerce-api",
        demo: "https://api-demo.backenddevpro.com"
    },
    {
        id: 2,
        title: "n8n Automation Suite",
        description: "Custom workflow automation for CRM integration, email marketing, and data synchronization across 5+ platforms.",
        github: "https://github.com/backenddevpro/n8n-workflows",
        demo: "https://automation-demo.backenddevpro.com"
    },
    {
        id: 3,
        title: "Microservices Architecture",
        description: "Complete system design with service discovery, API gateway, and distributed tracing for enterprise clients.",
        github: "https://github.com/backenddevpro/microservices-demo",
        demo: "https://system-demo.backenddevpro.com"
    },
    {
        id: 4,
        title: "Real-time Analytics Dashboard",
        description: "WebSocket-based real-time data streaming with WebFlux and MongoDB aggregation pipelines.",
        github: "https://github.com/backenddevpro/analytics-dashboard",
        demo: "https://analytics-demo.backenddevpro.com"
    }
];

// Export for Node (optional, safe to keep)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = projectsData;
}