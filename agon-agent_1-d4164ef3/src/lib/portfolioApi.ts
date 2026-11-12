import { createClient } from '@supabase/supabase-js';
import type { PortfolioBundle, TransmissionItem } from '../types/portfolio';

const CLIENT_TOKEN_KEY = 'abdulloh_visitor_token_v1';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const staticSupabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

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
  try {
    const res = await fetch('/api/portfolio');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
  } catch {
    // Fall through to direct Supabase query when hosted on static GitHub Pages
  }

  if (staticSupabase) {
    const [projectsRes, achievementsRes, pillarsRes] = await Promise.all([
      staticSupabase.from('portfolio_projects').select('*').order('display_order', { ascending: true }),
      staticSupabase.from('portfolio_achievements').select('*').order('id', { ascending: true }),
      staticSupabase.from('portfolio_pillars').select('*').order('display_order', { ascending: true }),
    ]);
    if (projectsRes.error) throw projectsRes.error;
    if (achievementsRes.error) throw achievementsRes.error;
    if (pillarsRes.error) throw pillarsRes.error;
    return {
      projects: projectsRes.data || [],
      achievements: achievementsRes.data || [],
      pillars: pillarsRes.data || [],
    };
  }

  throw new Error('Unable to load portfolio records.');
}

export async function fetchTransmissions(): Promise<TransmissionItem[]> {
  try {
    const res = await fetch('/api/transmissions');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
  } catch {
    // Fall through to direct Supabase query on static hosts
  }

  if (staticSupabase) {
    const { data, error } = await staticSupabase
      .from('transmissions')
      .select('id, sender_name, topic, message, client_token, created_at')
      .order('id', { ascending: false })
      .limit(20);
    if (error) throw error;
    return data || [];
  }

  throw new Error('Unable to load visitor notes.');
}

export async function createTransmission(payload: {
  sender_name: string;
  topic: string;
  message: string;
  client_token: string;
}): Promise<TransmissionItem> {
  try {
    const res = await fetch('/api/transmissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      return data;
    }
  } catch (err) {
    if (!staticSupabase) throw err;
  }

  if (staticSupabase) {
    const { data, error } = await staticSupabase
      .from('transmissions')
      .insert({
        ...payload,
        created_at: new Date().toISOString(),
      })
      .select('*')
      .single();
    if (error) throw error;
    return data;
  }

  throw new Error('Failed to send message');
}

export async function updateTransmission(payload: {
  id: number;
  sender_name: string;
  topic: string;
  message: string;
  client_token: string;
}): Promise<TransmissionItem> {
  try {
    const res = await fetch('/api/transmissions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update message');
      return data;
    }
  } catch (err) {
    if (!staticSupabase) throw err;
  }

  if (staticSupabase) {
    const { data, error } = await staticSupabase
      .from('transmissions')
      .update({
        sender_name: payload.sender_name,
        topic: payload.topic,
        message: payload.message,
      })
      .eq('id', payload.id)
      .eq('client_token', payload.client_token)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  }

  throw new Error('Failed to update message');
}

export async function deleteTransmission(payload: {
  id: number;
  client_token: string;
}): Promise<void> {
  try {
    const res = await fetch('/api/transmissions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete message');
      return;
    }
  } catch (err) {
    if (!staticSupabase) throw err;
  }

  if (staticSupabase) {
    const { error } = await staticSupabase
      .from('transmissions')
      .delete()
      .eq('id', payload.id)
      .eq('client_token', payload.client_token);
    if (error) throw error;
    return;
  }

  throw new Error('Failed to delete message');
}
