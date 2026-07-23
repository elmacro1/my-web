export interface CVContactLink {
  label: string;
  href: string;
  text: string;
}

export interface CVHeaderData {
  name: string;
  role: string;
  specialty: string;
  location: string;
  contactLinks: CVContactLink[];
}

export interface CVExperience {
  company: string;
  role: string;
  period: string;
  url?: string;
  bullets: string[];
  technologies?: string[];
}

export interface CVProject {
  name: string;
  url?: string;
  description: string;
  highlights?: string[];
  technologies?: string[];
}

export interface CVSkillGroup {
  category: string;
  skills: string[];
}

export interface CVLanguage {
  name: string;
  proficiency: string;
}

export interface CVLabels {
  skipLink: string;
  summary: string;
  experience: string;
  projects: string;
  skills: string;
  languages: string;
  technologies: string;
}

export interface CVAlternate {
  hreflang: "en" | "es" | "x-default";
  href: string;
}

export interface CVPageMetadata {
  lang: "en" | "es";
  title: string;
  description: string;
  canonical: string;
  alternates: CVAlternate[];
}

export interface CVData {
  header: CVHeaderData;
  labels: CVLabels;
  metadata: CVPageMetadata;
  summary: string[];
  experiences: CVExperience[];
  projects: CVProject[];
  skillGroups: CVSkillGroup[];
  languages: CVLanguage[];
}
