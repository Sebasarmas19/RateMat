import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-legal-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './legal-modal.component.html',
  styleUrl: './legal-modal.component.css'
})
export class LegalModalComponent {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  
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

      // Persistir registro digital de aceptación de términos en base de datos (D-010)
      let headers = new HttpHeaders();
      const token = this.authService.session()?.access_token;
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
      const baseApi = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
        ? `${window.location.protocol}//${window.location.hostname}:3001`
        : environment.apiUrl;
      this.http.post(`${baseApi}/api/users/accept-terms`, {}, { headers })
        .pipe(
          catchError(err => {
            console.warn('Registro local completado; sincronización con backend:', err);
            return of(null);
          })
        )
        .subscribe();
    }
  }
}
