export interface PortfolioProject {
  id: number;
  project_number: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  extended_note: string;
  website_url: string;
  preview_image: string;
  display_order: number;
}

export interface PortfolioAchievement {
  id: number;
  event_title: string;
  honor: string;
  year: number;
  location_context: string;
  summary: string;
  training_status: string;
}

export interface PortfolioPillar {
  id: number;
  section: 'interest' | 'journey' | 'origin';
  code: string;
  title: string;
  subtitle: string;
  description: string;
  display_order: number;
}

export interface PortfolioBundle {
  projects: PortfolioProject[];
  achievements: PortfolioAchievement[];
  pillars: PortfolioPillar[];
}

export interface TransmissionItem {
  id: number;
  sender_name: string;
  topic: string;
  message: string;
  client_token: string;
  created_at: string;
}
