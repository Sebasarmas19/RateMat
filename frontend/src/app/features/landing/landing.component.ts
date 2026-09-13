import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.currentUser()) {
        this.router.navigate(['/search']);
      }
    });
  }

  async login() {
    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }
}
