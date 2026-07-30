export interface CapabilityItem {
  title: string;
  description: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface SelectedWorkItem {
  url?: string;
  name: string;
  category: string;
  title: string;
  description: string;
  role: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
}

export interface Dictionary {
  navigation: {
    work: string;
    process: string;
    about: string;
    contact: string;
    resumeLabel: string;
    cta: string;
    languageLabel: string;
    menuLabel: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  capabilities: {
    title: string;
    items: CapabilityItem[];
  };
  process: {
    title: string;
    steps: ProcessStep[];
  };
  selectedWork: {
    title: string;
    items: SelectedWorkItem[];
  };
  experienceSummary: {
    title: string;
    text: string;
    resumeLabel: string;
    linkedinLabel: string;
  };
  contact: {
    title: string;
    text: string;
    contactLabel: string;
    linkedinLabel: string;
    emailSubject: string;
  };
  footer: {
    title: string;
    role: string;
    emailLabel: string;
    resumeLabel: string;
    copyright: string;
  };
}
