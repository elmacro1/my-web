import { SOCIAL_LINKS } from "../../consts";
import type { CVData } from "./types";

export const cvData: CVData = {
  header: {
    name: "Marco Antonio Galvan Fernandez",
    role: "React Native & Full Stack Developer",
    specialty: "React Native / Expo / Next.js / TypeScript",
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
        href: "https://www.linkedin.com/in/mgalvan26/",
        text: "linkedin.com/in/mgalvan26",
      },
      {
        label: "GitHub",
        href: SOCIAL_LINKS.github,
        text: "github.com/mgalvan-dev",
      },
    ],
  },
  summary: [
    "React Native & Full Stack Developer with 5+ years of experience building scalable web and mobile applications using React, React Native, Expo, Next.js, TypeScript and Node.js. Experienced delivering SaaS products, insurance platforms, AI-powered applications, internal business systems and customer-facing mobile apps, working with startups, agencies and product teams across the full software development lifecycle. Currently focused on React Native, Expo, modern web applications and product development, with hands-on involvement in architecture, implementation, deployment and continuous improvement.",
  ],
  experiences: [
    {
      company: "Dam Squad",
      role: "React Native & Full Stack Developer",
      period: "September 2025 – Present",
      url: "https://www.damsquad.com",
      bullets: [
        "Work directly with the CTO delivering custom software solutions for multiple clients.",
        "Lead development and maintenance of Amparo Seguros' digital ecosystem.",
        "Migrated the insurance-sales mobile application from Expo SDK 52 to Expo SDK 55 in production.",
        "Led the backend platform migration from Payload CMS v2 to Payload CMS v3.",
        "Maintain and evolve a production React Native application used by insurance agents across multiple company branches.",
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
      role: "Full Stack Developer",
      period: "September 2025 – June 2026",
      url: "https://www.capsulecodes.com/",
      bullets: [
        "Develop web and mobile applications for international clients.",
        "Contribute to UR POV, a React Native and Expo platform for business discovery and reviews in the South African market.",
        "Build SaaS solutions for project management, invoicing, time tracking and ticket management.",
        "Develop modern full-stack applications using Next.js, Supabase, PostgreSQL, Drizzle ORM and Zod.",
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
        "Built frontend applications, backend services and APIs for developer-focused products.",
        "Worked with Docker-based environments and modern cloud-native architectures.",
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
      role: "Frontend / Mobile Developer",
      period: "September 2022 – January 2025",
      url: "https://potentialitygroup.com/",
      bullets: [
        "Worked as a staff-augmentation consultant embedded within Iúnigo and San Cristóbal Seguros teams.",
        "Developed and maintained customer-facing mobile and web applications.",
        "Built insurance quoting systems and self-service platforms.",
        "Contributed to high-traffic, business-critical products used across Argentina and Uruguay.",
      ],
      technologies: ["React", "React Native", "Next.js", "TypeScript"],
    },
    {
      company: "Vippin",
      role: "Full Stack Developer",
      period: "November 2021 – September 2022",
      url: "https://www.vippinn.com/",
      bullets: [
        "Developed the corporate website for Clínica Universitaria Reina Fabiola.",
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
        "A lightweight invoice generator for freelancers built with Next.js, TypeScript, PDF generation, and multilingual support.",
      technologies: ["Next.js", "TypeScript", "PDF", "i18n"],
    },
    {
      name: "Estudialo AI",
      description:
        "AI-powered educational platform for generating exams, summaries and learning materials.",
    },
  ],
  skillGroups: [
    {
      category: "Mobile",
      skills: ["React Native", "Expo"],
    },
    {
      category: "Frontend",
      skills: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS"],
    },
    {
      category: "Backend",
      skills: ["Node.js", "Supabase", "PostgreSQL", "Drizzle ORM", "REST APIs"],
    },
    {
      category: "State",
      skills: ["TanStack Query", "Zustand"],
    },
    {
      category: "CMS",
      skills: ["Payload CMS", "Strapi"],
    },
    {
      category: "AI",
      skills: ["OpenAI", "Google Gemini"],
    },
    {
      category: "Tools",
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
      proficiency: "Intermediate (Reading & Writing)",
    },
  ],
};
