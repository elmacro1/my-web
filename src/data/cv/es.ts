import { SOCIAL_LINKS } from "../../consts";
import type { CVData } from "./types";

export const cvData: CVData = {
  header: {
    name: "Marco Antonio Galván Fernandez",
    role: "Desarrollador de Software",
    specialty: "Web • Mobile • SaaS • IA",
    location: "Santiago del Estero, Argentina",
    contactLinks: [
      {
        label: "Email",
        href: "mailto:elmacro11@gmail.com",
        text: "elmacro11@gmail.com",
      },
      {
        label: "Sitio web",
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
    skipLink: "Saltar al contenido del CV",
    summary: "Perfil Profesional",
    experience: "Experiencia Profesional",
    projects: "Proyectos Seleccionados",
    skills: "Habilidades Técnicas",
    languages: "Idiomas",
    technologies: "Tecnologías",
  },
  metadata: {
    lang: "es",
    title: "Marco Galván — CV de Desarrollador de Software",
    description:
      "CV en español de Marco Galván, Desarrollador de Software con experiencia construyendo productos web, móviles, SaaS y soluciones con inteligencia artificial.",
    canonical: "https://mgalvan.dev/cv/es",
    alternates: [
      { hreflang: "en", href: "https://mgalvan.dev/cv/en" },
      { hreflang: "es", href: "https://mgalvan.dev/cv/es" },
      { hreflang: "x-default", href: "https://mgalvan.dev/cv/en" },
    ],
  },
  summary: [
    "Desarrollador de Software con casi cinco años de experiencia construyendo productos web, móviles y SaaS para startups, agencias y empresas. Experiencia en ingeniería de producto, arquitectura de software y en todo el ciclo de desarrollo, creando soluciones que resuelven problemas reales de negocio.",
  ],
  experiences: [
    {
      company: "Dam Squad",
      role: "Desarrollador de Software",
      period: "Septiembre de 2025 – Actualidad",
      url: "https://www.damsquad.com",
      bullets: [
        "Desarrollo y entrego soluciones de software a medida para múltiples clientes, trabajando directamente con el CTO.",
        "Lidero el desarrollo y la evolución del ecosistema digital de Amparo Seguros.",
        "Migré a producción la aplicación móvil de venta de seguros desde Expo SDK 52 hasta Expo SDK 55.",
        "Lideré la migración de la plataforma backend desde Payload CMS v2 hacia Payload CMS v3.",
        "Mantengo y evoluciono una aplicación móvil en producción utilizada por asesores de seguros de múltiples sucursales.",
        "Desarrollo y mantengo sitios web, landing pages y soluciones digitales para Red SOS.",
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
      role: "Desarrollador de Software",
      period: "Septiembre de 2025 – Junio de 2026",
      url: "https://www.capsulecodes.com/",
      bullets: [
        "Desarrollé productos web y móviles para clientes internacionales, participando en el desarrollo y la implementación de producto.",
        "Contribuí a UR POV, un producto construido con React Native y Expo para el descubrimiento y las reseñas de negocios en el mercado sudafricano.",
        "Desarrollé productos SaaS para gestión de proyectos, facturación, seguimiento de tiempo y gestión de tickets.",
        "Implementé funcionalidades de producto de punta a punta en frontend, backend y base de datos.",
        "Trabajé en desarrollo frontend, backend y de producto dentro de equipos remotos distribuidos.",
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
      role: "Ingeniero Full Stack",
      period: "Febrero de 2025 – Noviembre de 2025",
      url: "https://helmcode.com/",
      bullets: [
        "Desarrollé Andulia, un asistente de infraestructura cloud con inteligencia artificial que permite gestionar recursos mediante lenguaje natural.",
        "Contribuí al desarrollo de HelmCloud, una plataforma cloud orientada a startups y pequeñas y medianas empresas.",
        "Trabajé en Coderun, una plataforma SaaS para desplegar y gestionar servicios en contenedores.",
        "Construí productos de software, servicios backend y APIs para plataformas orientadas a desarrolladores.",
        "Contribuí a la arquitectura e implementación de productos cloud-native basados en Docker.",
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
      role: "Desarrollador Frontend (Web y Mobile)",
      period: "Septiembre de 2022 – Enero de 2025",
      url: "https://potentialitygroup.com/",
      bullets: [
        "Trabajé como desarrollador bajo modalidad staff augmentation, integrado en los equipos de ingeniería de Iúnigo y San Cristóbal Seguros, contribuyendo a productos digitales de seguros orientados a clientes.",
        "Desarrollé y mantuve productos web y móviles orientados a clientes.",
        "Construí sistemas de cotización de seguros y plataformas de autogestión.",
        "Contribuí a productos críticos para el negocio utilizados en Argentina y Uruguay.",
      ],
      technologies: ["React", "React Native", "Next.js", "TypeScript"],
    },
    {
      company: "Vippin",
      role: "Desarrollador Full Stack",
      period: "Noviembre de 2021 – Septiembre de 2022",
      url: "https://www.vippinn.com/",
      bullets: [
        "Construí el sitio institucional de la Clínica Universitaria Reina Fabiola.",
        "Desarrollé una capa de integración con Salesforce para un proyecto de Telefónica España.",
        "Contribuí a una aplicación móvil de turismo con integración de Google Maps y tecnología Beacon.",
      ],
      technologies: ["React", "React Native", "JavaScript", "Salesforce"],
    },
  ],
  projects: [
    {
      name: "Invoice App",
      url: "https://invoice.mgalvan.dev/en",
      description:
        "Producto liviano de facturación para freelancers que permite generar facturas PDF en múltiples idiomas.",
      technologies: ["Next.js", "TypeScript", "PDF", "i18n"],
    },
    {
      name: "Estudialo AI",
      description:
        "Producto educativo con inteligencia artificial para generar exámenes, resúmenes y materiales de estudio.",
    },
  ],
  skillGroups: [
    {
      category: "Experiencia principal",
      skills: [
        "Arquitectura de Software",
        "Ingeniería de Producto",
        "Desarrollo Full Stack",
        "Desarrollo de SaaS",
        "Integraciones con IA",
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
      category: "Integraciones con IA",
      skills: ["OpenAI", "Google Gemini"],
    },
    {
      category: "Cloud y DevOps",
      skills: ["Docker", "Git", "GitHub", "GitLab"],
    },
  ],
  languages: [
    {
      name: "Español",
      proficiency: "Nativo",
    },
    {
      name: "Inglés",
      proficiency: "Competencia profesional de trabajo",
    },
  ],
};
