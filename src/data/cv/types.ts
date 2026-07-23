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

export interface CVData {
  header: CVHeaderData;
  summary: string[];
  experiences: CVExperience[];
  projects: CVProject[];
  skillGroups: CVSkillGroup[];
  languages: CVLanguage[];
}
