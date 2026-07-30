import { SOCIAL_LINKS } from "../../consts";
import type { CVData } from "./types";

export const cvData: CVData = {
  header: {
    name: "Marco Antonio Galván Fernandez",
    role: "Software Developer",
    specialty: "Web • Mobile • SaaS • AI",
    location: "Santiago del Estero, Argentina",
    contactLinks: [
      {
        label: "Email",
        href: "mailto:elmacro11@gmail.com",
        text: "elmacro11@gmail.com",
      },
      {
        label: "Website",
        href: "https://mgalvan.dev",
        text: "mgalvan.dev",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/mgalvan26",
        text: "linkedin.com/in/mgalvan26",
      },
      {
        label: "GitHub",
        href: SOCIAL_LINKS.github,
        text: "github.com/mgalvan-dev",
      },
    ],
  },
  labels: {
    skipLink: "Skip to CV content",
    summary: "Professional Summary",
    experience: "Professional Experience",
    projects: "Featured Projects",
    skills: "Core Technologies",
    languages: "Languages",
    technologies: "Technologies",
  },
  metadata: {
    lang: "en",
    title: "Marco Antonio Galván Fernandez — Software Developer",
    description:
      "Software Developer with nearly five years of experience building web, mobile and SaaS products for startups, agencies and businesses. Experienced across product engineering, software architecture and the full development lifecycle, delivering software that solves real business problems.",
    canonical: "https://mgalvan.dev/cv/en/",
    alternates: [
      { hreflang: "en", href: "https://mgalvan.dev/cv/en/" },
      { hreflang: "es", href: "https://mgalvan.dev/cv/es/" },
      { hreflang: "x-default", href: "https://mgalvan.dev/cv/en/" },
    ],
  },
  summary: [
    "Software Developer with nearly five years of experience building web, mobile and SaaS products for startups, agencies and businesses. Experienced across product engineering, software architecture and the full development lifecycle, delivering software that solves real business problems.",
  ],
  experiences: [
    {
      company: "Dam Squad",
      role: "Software Developer",
      period: "September 2025 – Present",
      url: "https://www.damsquad.com",
      bullets: [
        "Build and deliver custom software solutions for multiple clients in direct collaboration with the CTO.",
        "Lead the development and evolution of Amparo Seguros' digital insurance ecosystem.",
        "Migrated the insurance-sales mobile application from Expo SDK 52 to Expo SDK 55 in production.",
        "Led the backend platform migration from Payload CMS v2 to Payload CMS v3.",
        "Maintain and evolve a production mobile application used by insurance agents across multiple company branches.",
        "Develop and maintain websites, landing pages and digital solutions for Red SOS.",
      ],
      technologies: [
        "React Native",
        "Expo",
        "Next.js",
        "Payload CMS",
        "TypeScript",
        "PostgreSQL",
        "Docker",
      ],
    },
    {
      company: "Capsule Codes",
      role: "Software Developer",
      period: "September 2025 – June 2026",
      url: "https://www.capsulecodes.com/",
      bullets: [
        "Build web and mobile products for international clients, working across product development and implementation.",
        "Contribute to UR POV, a React Native and Expo product for business discovery and reviews in the South African market.",
        "Build SaaS products for project management, invoicing, time tracking and ticket management.",
        "Deliver end-to-end product features across frontend, backend and database layers.",
        "Work across frontend, backend and product development in distributed remote teams.",
      ],
      technologies: [
        "React Native",
        "Expo",
        "Next.js",
        "Supabase",
        "PostgreSQL",
        "Drizzle ORM",
        "Zod",
        "Docker",
      ],
    },
    {
      company: "Helmcode",
      role: "Full Stack Engineer",
      period: "February 2025 – November 2025",
      url: "https://helmcode.com/",
      bullets: [
        "Developed Andulia, an AI-powered cloud assistant enabling infrastructure management through natural-language interactions.",
        "Contributed to HelmCloud, a cloud platform designed for startups and SMBs.",
        "Worked on Coderun, a SaaS platform for deploying and managing containerized services.",
        "Built software products, backend services and APIs for developer-focused platforms.",
        "Contributed to the architecture and implementation of Docker-based, cloud-native products.",
      ],
      technologies: [
        "React",
        "Next.js",
        "FastAPI",
        "Node.js",
        "PostgreSQL",
        "Redis",
        "Docker",
      ],
    },
    {
      company: "Potentiality Group",
      role: "Frontend Developer (Web & Mobile)",
      period: "September 2022 – January 2025",
      url: "https://potentialitygroup.com/",
      bullets: [
        "Worked as a staff-augmentation developer embedded in the engineering teams of Iúnigo and San Cristóbal Seguros, contributing to customer-facing insurance products.",
        "Developed and maintained customer-facing mobile and web products.",
        "Built insurance quoting systems and self-service platforms.",
        "Contributed to business-critical products used across Argentina and Uruguay.",
      ],
      technologies: ["React", "React Native", "Next.js", "TypeScript"],
    },
    {
      company: "Vippin",
      role: "Full Stack Developer",
      period: "November 2021 – September 2022",
      url: "https://www.vippinn.com/",
      bullets: [
        "Built the corporate website for Clínica Universitaria Reina Fabiola.",
        "Built a Salesforce integration layer for a Telefónica España project.",
        "Contributed to a tourism mobile application featuring Google Maps and Beacon technology.",
      ],
      technologies: ["React", "React Native", "JavaScript", "Salesforce"],
    },
  ],
  projects: [
    {
      name: "Invoice App",
      url: "https://invoice.mgalvan.dev/en",
      description:
        "A lightweight invoicing product for freelancers that generates multilingual PDF invoices.",
      technologies: ["Next.js", "TypeScript", "PDF", "i18n"],
    },
    {
      name: "Estudialo AI",
      description:
        "An AI-powered educational product for generating exams, summaries and learning materials.",
    },
  ],
  skillGroups: [
    {
      category: "Core Expertise",
      skills: [
        "Software Architecture",
        "Product Engineering",
        "Full-Stack Development",
        "SaaS Development",
        "AI Integrations",
      ],
    },
    {
      category: "Frontend",
      skills: [
        "React",
        "Next.js",
        "React Native",
        "Expo",
        "Tailwind CSS",
        "TanStack Query",
        "Zustand",
        "TypeScript",
        "JavaScript",
      ],
    },
    {
      category: "Backend",
      skills: ["Node.js", "REST APIs", "PostgreSQL", "Supabase", "Drizzle ORM"],
    },
    {
      category: "CMS",
      skills: ["Payload CMS", "Strapi"],
    },
    {
      category: "AI Integrations",
      skills: ["OpenAI", "Google Gemini"],
    },
    {
      category: "Cloud & DevOps",
      skills: ["Docker", "Git", "GitHub", "GitLab"],
    },
  ],
  languages: [
    {
      name: "Spanish",
      proficiency: "Native",
    },
    {
      name: "English",
      proficiency: "Professional Working Proficiency",
    },
  ],
};
