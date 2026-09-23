import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAdmin = true; // D-011: Admin Role activated for student leaders and mentors

  get currentUser() {
    return this.authService.currentUser();
  }

  get userName(): string {
    const user = this.currentUser;
    return user?.user_metadata?.['full_name'] || user?.email?.split('@')[0] || 'Estudiante UCAB';
  }

  get userEmail(): string {
    return this.currentUser?.email || 'estudiante@est.ucab.edu.ve';
  }

  get userInitial(): string {
    return this.userName.charAt(0).toUpperCase() || 'U';
  }

  logout(): void {
    this.authService.openLogoutModal();
  }
}
