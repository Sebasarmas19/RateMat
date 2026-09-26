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
  showLogoutModal = signal<boolean>(false);

  openLogoutModal(): void {
    this.showLogoutModal.set(true);
  }

  closeLogoutModal(): void {
    this.showLogoutModal.set(false);
  }

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
      if (typeof window !== 'undefined' && localStorage.getItem('ratemat_demo_auth') === 'true') {
        const storedUser = localStorage.getItem('rateMat_demoUser');
        let parsed: any = null;
        try {
          parsed = storedUser ? JSON.parse(storedUser) : null;
        } catch {
          parsed = null;
        }

        const mockUser: any = {
          id: parsed?.id || '11111111-0000-4000-8000-000000000001',
          email: parsed?.email || 'andres.v@est.ucab.edu.ve',
          user_metadata: { full_name: parsed?.name || 'Andrés Villalobos' }
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

  hasActiveSession(): boolean {
    if (this.currentUser()) return true;
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('ratemat_demo_auth') === 'true') return true;
      if (localStorage.getItem('ratemat_has_session') === 'true') return true;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') && key.endsWith('-auth-token'))) {
          return true;
        }
      }
    }
    return false;
  }

  private async initSession() {
    if (!this.supabase) return;
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      this.session.set(session);
      this.currentUser.set(session?.user ?? null);
      if (typeof window !== 'undefined') {
        if (session) {
          localStorage.setItem('ratemat_has_session', 'true');
        } else {
          localStorage.removeItem('ratemat_has_session');
        }
      }

      this.supabase.auth.onAuthStateChange((_event, session) => {
        this.session.set(session);
        this.currentUser.set(session?.user ?? null);
        if (typeof window !== 'undefined') {
          if (session) {
            localStorage.setItem('ratemat_has_session', 'true');
          } else {
            localStorage.removeItem('ratemat_has_session');
          }
        }
      });
    } catch (err) {
      console.error('Error al obtener sesión de Supabase:', err);
    }
  }

  isInstitutionalEmail(email: string): boolean {
    if (!email) return false;
    const lower = email.trim().toLowerCase();
    return lower.endsWith('@est.ucab.edu.ve') || lower.endsWith('@ucab.edu.ve');
  }

  loginWithEmail(email: string, fullName?: string): { success: boolean; error?: string } {
    const trimmed = email.trim().toLowerCase();
    if (!this.isInstitutionalEmail(trimmed)) {
      return {
        success: false,
        error: 'El correo ingresado no pertenece al dominio oficial @est.ucab.edu.ve o @ucab.edu.ve. RateMat requiere validación institucional para garantizar la veracidad de la comunidad.'
      };
    }

    const defaultName = trimmed.split('@')[0]
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    const name = fullName || defaultName || 'Estudiante UCAB';

    const mockUser: any = {
      id: '11111111-0000-4000-8000-' + Math.floor(100000000000 + Math.random() * 900000000000).toString(16).substring(0, 12),
      email: trimmed,
      user_metadata: { full_name: name }
    };

    const mockSession: any = {
      access_token: 'mock-jwt-token-for-dev',
      user: mockUser
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('ratemat_demo_auth', 'true');
      localStorage.setItem('ratemat_has_session', 'true');
      localStorage.setItem('rateMat_demoUser', JSON.stringify({
        id: mockUser.id,
        email: mockUser.email,
        name: name,
        role: trimmed.includes('admin') ? 'admin' : 'student'
      }));
      localStorage.setItem('rateMat_termsAccepted_mock', 'true');
    }

    this.session.set(mockSession);
    this.currentUser.set(mockUser);

    return { success: true };
  }

  async signInWithGoogle() {
    if (!this.supabase) {
      return this.loginWithEmail('andres.v@est.ucab.edu.ve', 'Andrés Villalobos');
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
      try {
        await this.supabase.auth.signOut();
      } catch (err) {
        console.warn('Error signing out of Supabase:', err);
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ratemat_demo_auth');
      localStorage.removeItem('ratemat_has_session');
      localStorage.removeItem('rateMat_demoUser');
      localStorage.removeItem('rateMat_termsAccepted_mock');
    }
    this.session.set(null);
    this.currentUser.set(null);
  }

  get token(): string | undefined {
    return this.session()?.access_token;
  }
}
