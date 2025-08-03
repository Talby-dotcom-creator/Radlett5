import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug output
console.log("🔍 Checking env vars:", { supabaseUrl, supabaseAnonKey });

// Demo user storage
let currentDemoUser: any = null;
let authStateListeners: Function[] = [];
let isDemoMode = false;

// Notify listeners of auth state change
const notifyAuthStateChange = (event: string, session: any) => {
  authStateListeners.forEach(callback => {
    try {
      callback(event, session);
    } catch (error) {
      console.error('Error in auth state listener:', error);
    }
  });
};

// Demo mode fallback
const createDemoClient = () => {
  console.warn('⚠️ Using demo mode - Supabase not properly configured');
  isDemoMode = true;

  return {
    auth: {
      getSession: async () => ({
        data: {
          session: currentDemoUser
            ? { user: currentDemoUser, access_token: 'demo-token' }
            : null
        },
        error: null
      }),
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        if (email === 'demo@radlettlodge.org' && password === 'demo123456') {
          const mockUser = {
            id: 'demo-user-id',
            email: 'demo@radlettlodge.org',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            aud: 'authenticated',
            role: 'authenticated'
          };
          currentDemoUser = mockUser;
          const session = { user: mockUser, access_token: 'demo-token' };
          setTimeout(() => notifyAuthStateChange('SIGNED_IN', session), 100);
          return { data: { user: mockUser, session }, error: null };
        }
        return { data: { user: null, session: null }, error: { message: 'Invalid login credentials' } };
      },
      signOut: async () => {
        currentDemoUser = null;
        setTimeout(() => notifyAuthStateChange('SIGNED_OUT', null), 100);
        return { error: null };
      },
      getUser: async () => ({ data: { user: currentDemoUser }, error: null }),
      onAuthStateChange: (callback: Function) => {
        authStateListeners.push(callback);
        setTimeout(() => {
          if (currentDemoUser) {
            callback('SIGNED_IN', { user: currentDemoUser, access_token: 'demo-token' });
          } else {
            callback('SIGNED_OUT', null);
          }
        }, 100);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                const index = authStateListeners.indexOf(callback);
                if (index > -1) {
                  authStateListeners.splice(index, 1);
                }
              }
            }
          }
        };
      }
    }
  };
};

// ✅ Only create demo client if env vars are missing
let supabase: any;
if (!supabaseUrl || !supabaseAnonKey) {
  supabase = createDemoClient();
} else {
  console.log("✅ Supabase config found. Connecting...");
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase, isDemoMode };
