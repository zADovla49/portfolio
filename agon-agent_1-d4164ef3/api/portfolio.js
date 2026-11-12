import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const [projectsRes, achievementsRes, pillarsRes] = await Promise.all([
        supabase
          .from('portfolio_projects')
          .select('*')
          .order('display_order', { ascending: true }),
        supabase
          .from('portfolio_achievements')
          .select('*')
          .order('id', { ascending: true }),
        supabase
          .from('portfolio_pillars')
          .select('*')
          .order('display_order', { ascending: true }),
      ]);

      if (projectsRes.error) throw projectsRes.error;
      if (achievementsRes.error) throw achievementsRes.error;
      if (pillarsRes.error) throw pillarsRes.error;

      return res.status(200).json({
        projects: projectsRes.data || [],
        achievements: achievementsRes.data || [],
        pillars: pillarsRes.data || [],
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Portfolio API error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
