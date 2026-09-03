import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-legal-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './legal-modal.component.html',
  styleUrl: './legal-modal.component.css'
})
export class LegalModalComponent {
  private authService = inject(AuthService);
  
  isVisible = signal<boolean>(false);
  
  check1 = false;
  check2 = false;
  check3 = false;

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        const storageKey = `rateMat_termsAccepted_${user.id}`;
        const hasAccepted = localStorage.getItem(storageKey);
        
        if (!hasAccepted) {
          this.isVisible.set(true);
        } else {
          this.isVisible.set(false);
        }
      } else {
        this.isVisible.set(false);
      }
    }, { allowSignalWrites: true });
  }

  get canAccept(): boolean {
    return this.check1 && this.check2 && this.check3;
  }

  acceptTerms() {
    if (!this.canAccept) return;
    
    const user = this.authService.currentUser();
    if (user) {
      const storageKey = `rateMat_termsAccepted_${user.id}`;
      localStorage.setItem(storageKey, 'true');
      this.isVisible.set(false);
    }
  }
}
