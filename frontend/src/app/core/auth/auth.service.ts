import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient | null = null;
  
  // Usamos Signals (Angular 16+) para reactividad premium
  currentUser = signal<User | null>(null);
  session = signal<Session | null>(null);

  constructor() {
    const isConfigured = environment.supabaseUrl && 
      environment.supabaseUrl.startsWith('http') && 
      !environment.supabaseUrl.includes('YOUR_SUPABASE');

    if (isConfigured) {
      try {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
        this.initSession();
      } catch (e) {
        console.warn('No se pudo inicializar Supabase:', e);
      }
    } else {
      console.warn('⚠️ Supabase no está configurado aún en environment.ts. Modo demo activo para previsualización.');
      if (typeof window !== 'undefined' && localStorage.getItem('ratemat_demo_auth') === 'true') {
        const mockUser: any = {
          id: 'd3b07384-d113-4f4c-9f0e-36798547372a',
          email: 'estudiante.demo@est.ucab.edu.ve',
          user_metadata: { full_name: 'Estudiante Demo' }
        };
        const mockSession: any = {
          access_token: 'mock-jwt-token-for-dev',
          user: mockUser
        };
        this.session.set(mockSession);
        this.currentUser.set(mockUser);
      }
    }
  }

  private async initSession() {
    if (!this.supabase) return;
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      this.session.set(session);
      this.currentUser.set(session?.user ?? null);

      this.supabase.auth.onAuthStateChange((_event, session) => {
        this.session.set(session);
        this.currentUser.set(session?.user ?? null);
      });
    } catch (err) {
      console.error('Error al obtener sesión de Supabase:', err);
    }
  }

  async signInWithGoogle() {
    if (!this.supabase) {
      // Modo demo sin credenciales de Supabase para probar la app en desarrollo
      const mockUser: any = {
        id: 'd3b07384-d113-4f4c-9f0e-36798547372a',
        email: 'estudiante.demo@est.ucab.edu.ve',
        user_metadata: { full_name: 'Estudiante Demo' }
      };
      const mockSession: any = {
        access_token: 'mock-jwt-token-for-dev',
        user: mockUser
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('ratemat_demo_auth', 'true');
      }
      this.session.set(mockSession);
      this.currentUser.set(mockUser);
      return { data: { user: mockUser, session: mockSession }, error: null };
    }

    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    if (this.supabase) {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ratemat_demo_auth');
    }
    this.session.set(null);
    this.currentUser.set(null);
  }

  get token(): string | undefined {
    return this.session()?.access_token;
  }
}
