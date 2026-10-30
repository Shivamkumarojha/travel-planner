import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project'));

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        async getSession() {
          const stored = localStorage.getItem('voyage_demo_user');
          if (stored) {
            try {
              const user = JSON.parse(stored);
              return { data: { session: { user } }, error: null };
            } catch (e) {}
          }
          return { data: { session: null }, error: null };
        },
        async signInWithPassword({ email, password }) {
          const user = { id: 'demo-user-123', email, user_metadata: { full_name: email.split('@')[0] } };
          localStorage.setItem('voyage_demo_user', JSON.stringify(user));
          return { data: { user, session: { user } }, error: null };
        },
        async signUp({ email, password, options }) {
          const user = {
            id: 'demo-user-' + Math.random().toString(36).substring(7),
            email,
            user_metadata: options?.data || { full_name: email.split('@')[0] }
          };
          localStorage.setItem('voyage_demo_user', JSON.stringify(user));
          return { data: { user, session: { user } }, error: null };
        },
        async signOut() {
          localStorage.removeItem('voyage_demo_user');
          return { error: null };
        },
        onAuthStateChange(callback) {
          // Trigger once initially
          const stored = localStorage.getItem('voyage_demo_user');
          const user = stored ? JSON.parse(stored) : null;
          callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user ? { user } : null);
          return {
            data: {
              subscription: {
                unsubscribe: () => {}
              }
            }
          };
        }
      }
    };
