import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

interface GoogleAccountOption {
  name: string;
  email: string;
  avatarInitial: string;
  avatarBg: string;
  isInstitutional: boolean;
  statusBadge: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Available sample Google accounts detected in the environment
  accounts: GoogleAccountOption[] = [
    {
      name: 'Andrés Villalobos',
      email: 'andres.v@est.ucab.edu.ve',
      avatarInitial: 'A',
      avatarBg: 'bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white',
      isInstitutional: true,
      statusBadge: 'Estudiante UCAB • Autorizado'
    },
    {
      name: 'Valentina Morales',
      email: 'valentina.m@est.ucab.edu.ve',
      avatarInitial: 'V',
      avatarBg: 'bg-gradient-to-tr from-purple-600 to-violet-700 text-white',
      isInstitutional: true,
      statusBadge: 'Estudiante UCAB • Autorizado'
    },
    {
      name: 'Sebastián Personal',
      email: 'sebastian.personal@gmail.com',
      avatarInitial: 'S',
      avatarBg: 'bg-slate-200 text-slate-700 border border-slate-300',
      isInstitutional: false,
      statusBadge: 'Personal • No institucional'
    }
  ];

  // Custom Account Form State
  showCustomInput = false;
  customEmail = '';
  customName = '';

  // Processing & Error State
  isAuthenticating = false;
  authenticatingEmail = '';
  errorMessage: string | null = null;
  errorEmail: string | null = null;

  selectAccount(acc: GoogleAccountOption): void {
    this.errorMessage = null;
    this.errorEmail = null;

    if (!acc.isInstitutional) {
      this.errorEmail = acc.email;
      this.errorMessage = `El correo ${acc.email} no pertenece al dominio oficial de la Universidad Católica Andrés Bello (@est.ucab.edu.ve). Para preservar la veracidad comunitaria y prevenir abusos, solo los estudiantes activos de la UCAB pueden ingresar a RateMat.`;
      return;
    }

    this.processLogin(acc.email, acc.name);
  }

  toggleCustomInput(): void {
    this.showCustomInput = !this.showCustomInput;
    this.errorMessage = null;
    this.errorEmail = null;
    if (this.showCustomInput) {
      this.customEmail = '';
      this.customName = '';
    }
  }

  appendUcabDomain(): void {
    if (!this.customEmail.includes('@')) {
      this.customEmail = this.customEmail.trim() + '@est.ucab.edu.ve';
    } else {
      const username = this.customEmail.split('@')[0];
      this.customEmail = username + '@est.ucab.edu.ve';
    }
  }

  submitCustomEmail(): void {
    this.errorMessage = null;
    this.errorEmail = null;

    const email = this.customEmail.trim();
    if (!email) {
      this.errorMessage = 'Por favor ingresa un correo electrónico.';
      return;
    }

    if (!this.authService.isInstitutionalEmail(email)) {
      this.errorEmail = email;
      this.errorMessage = `El correo "${email}" no posee la extensión institucional autorizada (@est.ucab.edu.ve o @ucab.edu.ve). Ingresa tu cuenta universitaria para continuar.`;
      return;
    }

    this.processLogin(email, this.customName.trim() || undefined);
  }

  private processLogin(email: string, name?: string): void {
    this.isAuthenticating = true;
    this.authenticatingEmail = email;

    // Simulate realistic Google OAuth verification latency
    setTimeout(() => {
      const res = this.authService.loginWithEmail(email, name);
      this.isAuthenticating = false;

      if (res.success) {
        this.router.navigate(['/search']);
      } else {
        this.errorMessage = res.error || 'Ocurrió un error inesperado al autenticar.';
      }
    }, 850);
  }

  clearError(): void {
    this.errorMessage = null;
    this.errorEmail = null;
  }
}
