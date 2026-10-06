import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

// Cuentas demo con rol admin (modo sin Supabase), para mostrar el módulo de moderación
const DEMO_ADMIN_EMAILS = ['andres.v@est.ucab.edu.ve'];

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient | null = null;
  
  // Usamos Signals (Angular 16+) para reactividad premium
  currentUser = signal<User | null>(null);
  currentUserRole = signal<'admin' | 'student'>('student');
  session = signal<Session | null>(null);
  showLogoutModal = signal<boolean>(false);
  isInitializing = signal<boolean>(true);
  authError = signal<string | null>(null);

  isAdmin(): boolean {
    return this.currentUserRole() === 'admin';
  }

  openLogoutModal(): void {
    this.showLogoutModal.set(true);
  }

  closeLogoutModal(): void {
    this.showLogoutModal.set(false);
  }

  clearAuthError(): void {
    this.authError.set(null);
  }

  constructor() {
    const isConfigured = environment.supabaseUrl && 
      environment.supabaseUrl.startsWith('http') && 
      !environment.supabaseUrl.includes('YOUR_SUPABASE');

    if (isConfigured) {
      try {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
        this.initSession();
      } catch (e) {
        console.warn('No se pudo inicializar Supabase:', e);
        this.restoreDemoSessionIfAny();
        this.isInitializing.set(false);
      }
    } else {
      this.restoreDemoSessionIfAny();
      this.isInitializing.set(false);
    }
  }

  private restoreDemoSessionIfAny() {
    if (typeof window !== 'undefined' && localStorage.getItem('ratemat_demo_auth') === 'true') {
      const storedUser = localStorage.getItem('rateMat_demoUser');
      let parsed: any = null;
      try {
        parsed = storedUser ? JSON.parse(storedUser) : null;
      } catch {
        parsed = null;
      }

      if (parsed) {
        const email = parsed.email || 'andres.v@est.ucab.edu.ve';
        const role = parsed.role === 'admin' || this.resolveDemoRole(email) === 'admin' ? 'admin' : 'student';
        this.currentUserRole.set(role);

        const mockUser: any = {
          id: parsed.id || '11111111-0000-4000-8000-000000000001',
          email,
          user_metadata: { full_name: parsed.name || 'Andrés Villalobos' }
        };
        const mockSession: any = {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTExMTExMS0wMDAwLTQwMDAtODAwMC0wMDAwMDAwMDAwMDEiLCJlbWFpbCI6ImFuZHJlcy52QGVzdC51Y2FiLmVkdS52ZSIsImlhdCI6MTc5MDUzMDg3OX0.bN3PzOwOyTQJsO6fC5OnuDbkow-VnVW2ZhSXEEl8Ssc',
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
      if (localStorage.getItem('ratemat_demo_auth') === 'true') {
        return !!localStorage.getItem('rateMat_demoUser');
      }
    }
    return false;
  }

  private async handleAuthSession(session: Session | null): Promise<boolean> {
    if (!session || !session.user) {
      this.session.set(null);
      this.currentUser.set(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ratemat_has_session');
      }
      return false;
    }

    const email = (session.user.email || '').toLowerCase().trim();

    // Verificación de blindaje de dominios institucionales autorizados (D-007 y D-009)
    if (!this.isInstitutionalEmail(email)) {
      console.warn(`[RateMat Security] Rechazado inicio de sesión de dominio no UCAB: ${email}`);
      if (this.supabase) {
        await this.supabase.auth.signOut();
      }
      this.session.set(null);
      this.currentUser.set(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ratemat_has_session');
        localStorage.removeItem('ratemat_demo_auth');
      }
      this.authError.set(
        `Esa cuenta (${email}) no es de la UCAB. Entra con tu correo @est.ucab.edu.ve.`
      );
      return false;
    }

    // Aprobado institucionalmente
    this.authError.set(null);
    this.session.set(session);
    this.currentUser.set(session.user);
    const role = this.resolveDemoRole(email);
    this.currentUserRole.set(role);

    if (typeof window !== 'undefined') {
      localStorage.setItem('ratemat_has_session', 'true');
      localStorage.removeItem('ratemat_demo_auth');
    }
    return true;
  }

  private async initSession() {
    if (!this.supabase) {
      this.isInitializing.set(false);
      return;
    }

    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (error) {
        console.warn('Error al verificar sesión en Supabase:', error);
      }

      if (session) {
        await this.handleAuthSession(session);
      } else {
        this.restoreDemoSessionIfAny();
      }

      this.supabase.auth.onAuthStateChange(async (_event, newSession) => {
        await this.handleAuthSession(newSession);
      });
    } catch (err) {
      console.error('Error al inicializar sesión de Supabase:', err);
      this.restoreDemoSessionIfAny();
    } finally {
      this.isInitializing.set(false);
    }
  }

  private resolveDemoRole(email: string): 'admin' | 'student' {
    const lower = email.trim().toLowerCase();
    const isAdmin = DEMO_ADMIN_EMAILS.includes(lower) || lower.startsWith('admin.') || lower.includes('admin@');
    return isAdmin ? 'admin' : 'student';
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
        error: `Esa cuenta (${trimmed}) no es de la UCAB. Entra con tu correo @est.ucab.edu.ve.`
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
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTExMTExMS0wMDAwLTQwMDAtODAwMC0wMDAwMDAwMDAwMDEiLCJlbWFpbCI6ImFuZHJlcy52QGVzdC51Y2FiLmVkdS52ZSIsImlhdCI6MTc5MDUzMDg3OX0.bN3PzOwOyTQJsO6fC5OnuDbkow-VnVW2ZhSXEEl8Ssc',
      user: mockUser
    };

    const assignedRole = this.resolveDemoRole(trimmed);

    if (typeof window !== 'undefined') {
      localStorage.setItem('ratemat_demo_auth', 'true');
      localStorage.setItem('ratemat_has_session', 'true');
      localStorage.setItem('rateMat_demoUser', JSON.stringify({
        id: mockUser.id,
        email: mockUser.email,
        name: name,
        role: assignedRole
      }));
      localStorage.setItem('rateMat_termsAccepted_mock', 'true');
    }

    this.currentUserRole.set(assignedRole);
    this.session.set(mockSession);
    this.currentUser.set(mockUser);
    this.authError.set(null);

    return { success: true };
  }

  async signInWithGoogle(): Promise<{ error?: any; url?: string }> {
    if (!this.supabase) {
      return this.loginWithEmail('andres.v@est.ucab.edu.ve', 'Andrés Villalobos');
    }

    this.authError.set(null);

    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/login`
      : 'http://localhost:4200/login';

    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          prompt: 'select_account'
        }
      }
    });

    if (error) {
      this.authError.set(error.message);
      return { error };
    }

    return { url: data.url };
  }

  async signOut() {
    if (this.supabase) {
      try {
        await this.supabase.auth.signOut();
      } catch (err) {
        console.warn('Error al cerrar sesión de Supabase:', err);
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ratemat_demo_auth');
      localStorage.removeItem('ratemat_has_session');
      localStorage.removeItem('rateMat_demoUser');
      localStorage.removeItem('rateMat_termsAccepted_mock');
    }
    this.currentUserRole.set('student');
    this.session.set(null);
    this.currentUser.set(null);
    this.authError.set(null);
    this.closeLogoutModal();
  }

  get token(): string | undefined {
    return this.session()?.access_token;
  }
}
