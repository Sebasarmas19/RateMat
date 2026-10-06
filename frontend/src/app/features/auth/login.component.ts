import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

interface DemoAccount {
  name: string;
  email: string;
  avatarInitial: string;
  avatarBg: string;
  role: 'student' | 'admin';
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isAuthenticating = false;
  authenticatingEmail = '';
  errorMessage: string | null = null;
  returnUrl = '/search';

  // Modo desarrollo / Cuentas de prueba rápidas
  showDevAccounts = false;
  demoAccounts: DemoAccount[] = [
    {
      name: 'Andrés Villalobos',
      email: 'andres.v@est.ucab.edu.ve',
      avatarInitial: 'A',
      avatarBg: 'bg-indigo-600 text-white',
      role: 'admin'
    },
    {
      name: 'Valentina Morales',
      email: 'valentina.m@est.ucab.edu.ve',
      avatarInitial: 'V',
      avatarBg: 'bg-purple-600 text-white',
      role: 'student'
    },
    {
      name: 'Gabriel Pacheco',
      email: 'gabriel.p@est.ucab.edu.ve',
      avatarInitial: 'G',
      avatarBg: 'bg-emerald-600 text-white',
      role: 'student'
    }
  ];

  customEmail = '';
  customName = '';

  constructor() {
    // Si el usuario ya está autenticado, redirigir inmediatamente
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.router.navigateByUrl(this.returnUrl);
      }

      const authErr = this.authService.authError();
      if (authErr) {
        this.errorMessage = authErr;
        this.isAuthenticating = false;
      }
    });
  }

  ngOnInit(): void {
    const qUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (qUrl && qUrl !== '/login') {
      this.returnUrl = qUrl;
    }

    // Verificar si ya hay error previo
    if (this.authService.authError()) {
      this.errorMessage = this.authService.authError();
    }
  }

  async signInWithGoogle(): Promise<void> {
    this.errorMessage = null;
    this.authService.clearAuthError();
    this.isAuthenticating = true;
    this.authenticatingEmail = 'Conectando con Google…';

    try {
      const res = await this.authService.signInWithGoogle();
      if (res.error) {
        this.errorMessage = res.error.message || 'No se pudo iniciar la autenticación con Google.';
        this.isAuthenticating = false;
      }
      // Si todo va bien, Supabase redirige el navegador a Google OAuth
    } catch (err: any) {
      this.errorMessage = err?.message || 'Error de conexión con el proveedor de autenticación.';
      this.isAuthenticating = false;
    }
  }

  selectDemoAccount(acc: DemoAccount): void {
    this.errorMessage = null;
    this.authService.clearAuthError();
    this.isAuthenticating = true;
    this.authenticatingEmail = acc.email;

    setTimeout(() => {
      const res = this.authService.loginWithEmail(acc.email, acc.name);
      this.isAuthenticating = false;
      if (res.success) {
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.errorMessage = res.error || 'Error al autenticar cuenta demo.';
      }
    }, 400);
  }

  submitCustomEmail(): void {
    this.errorMessage = null;
    const email = this.customEmail.trim().toLowerCase();
    if (!email) {
      this.errorMessage = 'Ingresa un correo institucional.';
      return;
    }

    if (!this.authService.isInstitutionalEmail(email)) {
      this.errorMessage = `El correo "${email}" no posee el dominio institucional oficial (@est.ucab.edu.ve o @ucab.edu.ve).`;
      return;
    }

    this.isAuthenticating = true;
    this.authenticatingEmail = email;

    setTimeout(() => {
      const res = this.authService.loginWithEmail(email, this.customName.trim() || undefined);
      this.isAuthenticating = false;
      if (res.success) {
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.errorMessage = res.error || 'Error al autenticar correo institucional.';
      }
    }, 400);
  }

  appendUcabDomain(): void {
    const val = this.customEmail.trim();
    if (!val.includes('@')) {
      this.customEmail = val + '@est.ucab.edu.ve';
    } else {
      this.customEmail = val.split('@')[0] + '@est.ucab.edu.ve';
    }
  }

  clearError(): void {
    this.errorMessage = null;
    this.authService.clearAuthError();
  }
}
