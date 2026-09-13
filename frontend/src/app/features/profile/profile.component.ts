import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto space-y-6">
      
      <!-- User Profile Header Card -->
      <div class="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)] relative overflow-hidden">
        <div class="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
          
          <!-- Avatar -->
          <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-extrabold text-2xl shadow-md shadow-indigo-600/20 border-2 border-white flex-shrink-0">
            {{ userInitial }}
          </div>

          <!-- User Info -->
          <div class="flex-1 min-w-0 space-y-1.5">
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
                {{ userName }}
              </h1>
              <span class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <span>Estudiante Verificado</span>
              </span>
            </div>
            
            <p class="text-xs text-slate-500 font-medium">{{ userEmail }}</p>
            <p class="text-[11px] uppercase tracking-wider text-slate-400 font-semibold pt-1">
              Universidad Católica Andrés Bello
            </p>
          </div>

          <!-- Sign Out Action -->
          <button (click)="logout()" 
                  class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200/80 rounded-xl transition-all duration-200 active:scale-95 flex-shrink-0">
            Cerrar Sesión
          </button>
        </div>
      </div>

      <!-- Gamification & Reputation Tier (D-002) -->
      <div class="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 sm:p-7 rounded-2xl shadow-lg shadow-indigo-900/10 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider text-indigo-300">Gamificación Académica</span>
            <h2 class="text-xl font-black mt-0.5 tracking-tight">Nivel 2: Colaborador Destacado</h2>
          </div>
          <div class="flex items-center space-x-2 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-xs">
            <span class="text-amber-400 font-bold text-sm">★</span>
            <span class="font-extrabold text-sm text-white">140 Puntos</span>
          </div>
        </div>

        <p class="text-xs text-slate-300 max-w-xl leading-relaxed">
          Ganas reputación cuando aportas reseñas públicas verificadas y cuando tus compañeros votan que tu comentario les resultó útil.
        </p>

        <!-- Progress to next level -->
        <div class="space-y-1.5 pt-1">
          <div class="flex justify-between text-[11px] font-bold text-slate-400">
            <span>Progreso a Nivel 3 (Mentor UCAB)</span>
            <span>140 / 200 pts</span>
          </div>
          <div class="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-amber-400 to-indigo-400 rounded-full" style="width: 70%"></div>
          </div>
        </div>
      </div>

      <!-- Gamification Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        
        <div class="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 space-y-1 text-center sm:text-left">
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Reseñas Aportadas</span>
          <div class="text-2xl font-black text-slate-900">4</div>
          <p class="text-[11px] text-slate-500">2 públicas • 2 anónimas</p>
        </div>

        <div class="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 space-y-1 text-center sm:text-left">
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Votos "Útil" Recibidos</span>
          <div class="text-2xl font-black text-emerald-600">+28</div>
          <p class="text-[11px] text-slate-500">Aportan a tu reputación</p>
        </div>

        <div class="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 space-y-1 text-center sm:text-left">
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Archivos en el Hub</span>
          <div class="text-2xl font-black text-indigo-600">3</div>
          <p class="text-[11px] text-slate-500">PDFs verificados por pares</p>
        </div>

      </div>

      <!-- Privacy & Anonymous Guarantee Notice (D-002) -->
      <div class="p-4 sm:p-5 bg-slate-50/80 border border-slate-200/90 rounded-2xl flex items-start space-x-3.5">
        <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div class="space-y-1 text-xs">
          <h3 class="font-bold text-slate-900">Garantía de Privacidad Híbrida (D-002)</h3>
          <p class="text-slate-500 leading-relaxed">
            Cuando publicas una reseña como anónima, nunca mostramos tu identidad en el muro público ni en la API pública. Tu libertad de opinión está blindada ante cualquier autoridad académica.
          </p>
        </div>
      </div>

    </div>
  `
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

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

  async logout() {
    if (window.confirm('¿Seguro que deseas cerrar sesión?')) {
      await this.authService.signOut();
      this.router.navigate(['/']);
    }
  }
}
