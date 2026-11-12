import type {
  PortfolioBundle,
  PortfolioProject,
  PortfolioAchievement,
  PortfolioPillar,
  TransmissionItem,
} from '../types/portfolio';

const CLIENT_TOKEN_KEY = 'abdulloh_visitor_token_v1';
const NOTES_KEY = 'abdulloh_portfolio_notes_v1';

// GitHub Pages is a static host: API routes are not executed there.
// Keep the portfolio content in the frontend so every section works without a server.
const portfolioData: PortfolioBundle = {
  projects: [
    {
      id: 1,
      project_number: '01',
      slug: 'northwest-coast',
      title: 'Northwest Coast — Made by Abdulloh',
      category: 'EDUCATIONAL WEBSITE',
      description: 'An interactive educational exhibit about Northwest Coast Indigenous peoples and their environment.',
      extended_note: 'A digital museum-style experience exploring the art, culture, and environment of the Northwest Coast.',
      website_url: 'https://zadovla49.github.io/Northwest-coast-made-by-Abdulloh/',
      preview_image: '/portfolio/images/project-northwest-coast.png',
      display_order: 1,
    },
    {
      id: 2,
      project_number: '02',
      slug: 'central-valley',
      title: 'Central Valley',
      category: 'EDUCATIONAL WEBSITE',
      description: "An educational experience exploring California's geography, agriculture, water, communities, and history.",
      extended_note: 'An interactive tour website highlighting the people, places, and important features of California’s Central Valley.',
      website_url: 'https://zadovla49.github.io/central-valley-tour-website-made-by-Abdulloh/',
      preview_image: '/portfolio/images/project-central-valley.png',
      display_order: 2,
    },
  ],
  achievements: [
    {
      id: 1,
      event_title: 'LIBERTY BELL JUDO CLASSIC',
      honor: '2ND PLACE — SILVER MEDAL',
      year: 2026,
      location_context: 'UNITED STATES · 2026',
      summary: 'Earned a second-place finish and silver medal at the Liberty Bell Judo Classic.',
      training_status: 'Continuing to develop judo fundamentals, technique, and discipline through regular practice.',
    },
  ],
  pillars: [
    { id: 1, section: 'interest', code: '01', title: 'JUDO', subtitle: 'DISCIPLINE', description: 'Building focus, patience, and confidence through training and competition.', display_order: 1 },
    { id: 2, section: 'interest', code: '02', title: 'PROGRAMMING', subtitle: 'CREATION', description: 'Learning programming step by step and exploring how digital experiences are built.', display_order: 2 },
    { id: 3, section: 'interest', code: '03', title: 'CYBERSECURITY', subtitle: 'FUTURE GOAL', description: 'Exploring technology and working toward a future in cybersecurity.', display_order: 3 },
    { id: 4, section: 'interest', code: '04', title: 'DESIGN', subtitle: 'CREATIVITY', description: 'Experimenting with visual ideas, interactive layouts, and digital presentation.', display_order: 4 },
    { id: 5, section: 'interest', code: '05', title: 'LEARNING', subtitle: 'CURIOSITY', description: 'Developing new skills through study, practice, and personal projects.', display_order: 5 },
    { id: 6, section: 'interest', code: '06', title: 'SELF-IMPROVEMENT', subtitle: 'CONSISTENCY', description: 'Making steady progress and focusing on becoming better over time.', display_order: 6 },
    { id: 7, section: 'journey', code: '01', title: 'FOUNDATIONS', subtitle: 'START WITH THE BASICS', description: 'Learning how computers, the web, and programming work, one step at a time.', display_order: 7 },
    { id: 8, section: 'journey', code: '02', title: 'BUILD & EXPLORE', subtitle: 'TURN IDEAS INTO PROJECTS', description: 'Creating interactive projects while strengthening technical and problem-solving skills.', display_order: 8 },
    { id: 9, section: 'journey', code: '03', title: 'CYBERSECURITY', subtitle: 'THE LONG-TERM DIRECTION', description: 'Continuing to learn about digital safety and working toward a future in cybersecurity.', display_order: 9 },
  ],
};

function readNotes(): TransmissionItem[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? (JSON.parse(raw) as TransmissionItem[]) : [];
  } catch {
    return [];
  }
}

function writeNotes(notes: TransmissionItem[]): void {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function getVisitorToken(): string {
  try {
    let token = localStorage.getItem(CLIENT_TOKEN_KEY);
    if (!token) {
      token = 'ad_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(CLIENT_TOKEN_KEY, token);
    }
    return token;
  } catch {
    return 'ad_session_guest';
  }
}

export async function fetchPortfolioBundle(): Promise<PortfolioBundle> {
  return portfolioData;
}

export async function fetchTransmissions(): Promise<TransmissionItem[]> {
  return readNotes().sort((a, b) => b.id - a.id).slice(0, 20);
}

export async function createTransmission(payload: {
  sender_name: string;
  topic: string;
  message: string;
  client_token: string;
}): Promise<TransmissionItem> {
  const notes = readNotes();
  const item: TransmissionItem = {
    ...payload,
    id: Date.now(),
    created_at: new Date().toISOString(),
  };
  writeNotes([item, ...notes]);
  return item;
}

export async function updateTransmission(payload: {
  id: number;
  sender_name: string;
  topic: string;
  message: string;
  client_token: string;
}): Promise<TransmissionItem> {
  const notes = readNotes();
  const index = notes.findIndex(
    (item) => item.id === payload.id && item.client_token === payload.client_token
  );
  if (index < 0) throw new Error('This note could not be found on this device.');
  const updated = { ...notes[index], ...payload };
  notes[index] = updated;
  writeNotes(notes);
  return updated;
}

export async function deleteTransmission(payload: {
  id: number;
  client_token: string;
}): Promise<void> {
  writeNotes(
    readNotes().filter(
      (item) => !(item.id === payload.id && item.client_token === payload.client_token)
    )
  );
}
