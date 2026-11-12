import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('transmissions')
        .select('id, sender_name, topic, message, client_token, created_at')
        .order('id', { ascending: false })
        .limit(20);
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const { sender_name, topic, message, client_token } = req.body || {};
      if (!sender_name?.trim() || !message?.trim()) {
        return res.status(400).json({ error: 'Name and message are required.' });
      }
      const { data, error } = await supabase
        .from('transmissions')
        .insert({
          sender_name: sender_name.trim().slice(0, 80),
          topic: (topic || 'General Reflection').trim().slice(0, 80),
          message: message.trim().slice(0, 600),
          client_token: (client_token || 'public').slice(0, 64),
          created_at: new Date().toISOString(),
        })
        .select('*')
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, sender_name, topic, message, client_token } = req.body || {};
      if (!id || !client_token) {
        return res.status(400).json({ error: 'Missing message identifier.' });
      }
      if (!sender_name?.trim() || !message?.trim()) {
        return res.status(400).json({ error: 'Name and message are required.' });
      }
      const { data, error } = await supabase
        .from('transmissions')
        .update({
          sender_name: sender_name.trim().slice(0, 80),
          topic: (topic || 'General Reflection').trim().slice(0, 80),
          message: message.trim().slice(0, 600),
        })
        .eq('id', id)
        .eq('client_token', client_token)
        .select('*')
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id, client_token } = req.body || {};
      if (!id || !client_token) {
        return res.status(400).json({ error: 'Missing message identifier.' });
      }
      const { error } = await supabase
        .from('transmissions')
        .delete()
        .eq('id', id)
        .eq('client_token', client_token);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Transmissions API error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
