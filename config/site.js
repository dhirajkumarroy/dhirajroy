// config/site.js
const SITE_CONFIG = {
  // Personal Info
  name: "Dhiraj Roy",
  title: "Backend & AI/ML Engineer | Full Stack Developer",
  email: "dhiraj@dhirajroy.com",
  phone: "+91 9876543210",
  
  // Social Links
  github: "https://github.com/dhirajroy",
  linkedin: "https://linkedin.com/in/dhirajroy",
  twitter: "https://twitter.com/dhirajroy",
  whatsapp: "https://wa.me/919876543210",
  
  // SEO
  domain: "https://dhirajroy.com",
  description: "Dhiraj Roy - Backend Developer specializing in Spring Boot, AI/ML, Android Development, and n8n automation. Building scalable solutions and innovative products.",
  
  // Skills
  skills: {
    backend: ["Java", "Spring Boot", "Python", "Node.js", "REST APIs", "Microservices"],
    ai_ml: ["TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "NLP"],
    android: ["Kotlin", "Java", "Jetpack Compose", "Firebase", "Room DB"],
    automation: ["n8n", "Zapier", "Python Scripting", "Workflow Automation"],
    database: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
    devops: ["Docker", "Kubernetes", "AWS", "CI/CD"]
  },
  
  // Projects
  projects: [
    {
      id: 1,
      title: "AI-Powered Code Review Assistant",
      category: "ai_ml",
      description: "ML model that reviews code for bugs, security vulnerabilities, and suggests improvements using GPT and static analysis.",
      tech: ["Python", "TensorFlow", "FastAPI", "GPT-4"],
      github: "https://github.com/dhirajroy/code-review-ai",
      demo: "https://code-review-ai.demo.com",
      image: "ai-review.jpg"
    },
    {
      id: 2,
      title: "Spring Boot Microservices E-Commerce",
      category: "backend",
      description: "Scalable e-commerce platform with service discovery, API gateway, and distributed tracing.",
      tech: ["Java", "Spring Boot", "Kafka", "Docker", "K8s"],
      github: "https://github.com/dhirajroy/ecommerce-microservices",
      demo: "https://ecommerce.demo.com",
      image: "ecommerce.jpg"
    },
    {
      id: 3,
      title: "n8n Automation Hub",
      category: "automation",
      description: "Workflow automation platform connecting 50+ services with custom nodes and monitoring dashboard.",
      tech: ["n8n", "Node.js", "MongoDB", "Redis", "Webhooks"],
      github: "https://github.com/dhirajroy/n8n-automation-hub",
      demo: "https://automation.demo.com",
      image: "automation.jpg"
    },
    {
      id: 4,
      title: "Android Expense Tracker with ML",
      category: "android",
      description: "Expense tracking app with ML-based categorization and spending predictions.",
      tech: ["Kotlin", "Jetpack Compose", "TensorFlow Lite", "Room"],
      github: "https://github.com/dhirajroy/expense-tracker",
      demo: "https://play.google.com/store/apps/details?id=com.dhiraj.expense",
      image: "expense-tracker.jpg"
    },
    {
      id: 5,
      title: "Real-Time Fraud Detection System",
      category: "ai_ml",
      description: "Machine learning system detecting fraudulent transactions in real-time with 99.2% accuracy.",
      tech: ["Python", "Scikit-learn", "Kafka", "Redis", "FastAPI"],
      github: "https://github.com/dhirajroy/fraud-detection",
      demo: "https://fraud-detection.demo.com",
      image: "fraud-detection.jpg"
    },
    {
      id: 6,
      title: "CI/CD Pipeline Automation Tool",
      category: "automation",
      description: "Tool automating build, test, and deployment workflows across multiple environments.",
      tech: ["Python", "Jenkins", "Docker", "AWS", "Terraform"],
      github: "https://github.com/dhirajroy/ci-cd-automation",
      demo: "https://cicd-automation.demo.com",
      image: "cicd.jpg"
    }
  ],
  
  // Experience
  experience: [
    {
      company: "Tech Solutions Inc.",
      role: "Senior Backend Developer",
      period: "2022 - Present",
      description: "Leading backend development for microservices architecture handling 1M+ requests/day."
    },
    {
      company: "AI Innovations Lab",
      role: "ML Engineer",
      period: "2020 - 2022",
      description: "Developed computer vision models for industrial quality control."
    },
    {
      company: "Mobile Apps Studio",
      role: "Android Developer",
      period: "2018 - 2020",
      description: "Built and published 5+ Android apps with 100K+ total downloads."
    }
  ],
  
  // Blog Info
  blog: {
    title: "Dhiraj's Tech Blog",
    description: "Thoughts on backend development, AI/ML, automation, and software architecture."
  }
};

// Export for use in pages
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}