import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LegalModalComponent } from '../../shared/components/legal-modal/legal-modal.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LegalModalComponent],
  template: `
    <!-- Main Shell -->
    <div class="min-h-screen bg-[#f1f4f9] text-slate-900 flex flex-col md:flex-row antialiased">
      
      <!-- Desktop Sidebar (Airbnb/Linear Style) -->
      <aside class="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] fixed inset-y-0 left-0 z-40">
        <!-- Brand Header -->
        <div class="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <a routerLink="/search" class="flex items-center space-x-2.5 group">
            <div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200">
              R
            </div>
            <div>
              <span class="text-lg font-extrabold tracking-tight text-slate-900">RateMat</span>
              <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">UCAB Guayana</span>
            </div>
          </a>
        </div>
        
        <!-- Navigation Links -->
        <nav class="flex-1 px-3.5 py-6 space-y-1.5 overflow-y-auto">
          <div class="px-3 mb-2">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Navegación</span>
          </div>

          <a routerLink="/search" routerLinkActive="bg-indigo-50 text-indigo-700 shadow-sm" [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 active:scale-[0.98] transition-[transform,background-color,color] duration-150 ease-out">
            <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span>Buscador & Carreras</span>
          </a>

          <a routerLink="/home" routerLinkActive="bg-indigo-50 text-indigo-700 shadow-sm" [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 active:scale-[0.98] transition-[transform,background-color,color] duration-150 ease-out">
            <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Feed de Reseñas</span>
          </a>

          <a routerLink="/profile" routerLinkActive="bg-indigo-50 text-indigo-700 shadow-sm" [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 active:scale-[0.98] transition-[transform,background-color,color] duration-150 ease-out">
            <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Mi Reputación</span>
          </a>

          <!-- D-011: Admin Direct Link -->
          <a routerLink="/admin" routerLinkActive="bg-purple-50 text-purple-700 shadow-sm"
             class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 active:scale-[0.98] transition-[transform,background-color,color] duration-150 ease-out">
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 flex-shrink-0 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>Panel Admin</span>
            </div>
            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">D-011</span>
          </a>
        </nav>

        <!-- Sidebar Footer / Community Badge -->
        <div class="p-4 m-3 bg-slate-50 border border-slate-200/70 rounded-2xl">
          <div class="flex items-center space-x-2 text-indigo-600 text-xs font-bold mb-1">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Comunidad Segura</span>
          </div>
          <p class="text-[11px] text-slate-500 leading-tight">
            Reseñas pedagógicas respaldadas por el dominio institucional UCAB.
          </p>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 md:ml-64 min-h-screen pb-24 md:pb-12 flex flex-col justify-between">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 w-full flex-1">
          <router-outlet></router-outlet>
        </div>

        <!-- D-010: Disclaimer de No Afiliación y Footer Legal -->
        <footer class="mt-16 pt-8 pb-12 border-t border-slate-200/80 text-center space-y-2 text-xs text-slate-400 max-w-4xl mx-auto px-4 w-full">
          <p class="font-medium text-slate-500 leading-relaxed">
            RateMat es una iniciativa tecnológica independiente desarrollada por y para estudiantes. No posee vinculación oficial, patrocinio ni aval institucional de la Universidad Católica Andrés Bello (UCAB).
          </p>
          <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] pt-1">
            <button (click)="openTakedownModal()" class="hover:text-indigo-600 hover:underline transition-colors cursor-pointer font-semibold text-slate-500">
              Docentes: Solicitud de Exclusión (Habeas Data)
            </button>
            <span class="text-slate-300">•</span>
            <a routerLink="/admin" class="hover:text-slate-600 hover:underline transition-colors">
              Moderación
            </a>
            <span class="text-slate-300">•</span>
            <span>UCAB Guayana 2026</span>
          </div>
        </footer>
      </main>

      <!-- Mobile Floating Bottom Bar (Blur + Safe Area + Ergonomic Touch Targets + iOS Pill Style) -->
      <nav class="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-safe flex justify-around items-center gap-1">
        
        <a routerLink="/search" 
           routerLinkActive="bg-indigo-50/90 text-indigo-700 font-bold shadow-2xs" 
           [routerLinkActiveOptions]="{exact: true}"
           class="min-h-[50px] py-1 px-2 flex flex-col items-center justify-center flex-1 rounded-2xl text-slate-500 hover:text-slate-900 active:scale-[0.96] transition-[transform,background-color,color] duration-150 ease-out">
          <svg class="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span class="text-[10px] tracking-tight">Explorar</span>
        </a>

        <a routerLink="/home" 
           routerLinkActive="bg-indigo-50/90 text-indigo-700 font-bold shadow-2xs" 
           [routerLinkActiveOptions]="{exact: true}"
           class="min-h-[50px] py-1 px-2 flex flex-col items-center justify-center flex-1 rounded-2xl text-slate-500 hover:text-slate-900 active:scale-[0.96] transition-[transform,background-color,color] duration-150 ease-out">
          <svg class="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span class="text-[10px] tracking-tight">Reseñas</span>
        </a>

        <a routerLink="/profile" 
           routerLinkActive="bg-indigo-50/90 text-indigo-700 font-bold shadow-2xs"
           [routerLinkActiveOptions]="{exact: true}"
           class="min-h-[50px] py-1 px-2 flex flex-col items-center justify-center flex-1 rounded-2xl text-slate-500 hover:text-slate-900 active:scale-[0.96] transition-[transform,background-color,color] duration-150 ease-out">
          <svg class="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span class="text-[10px] tracking-tight">Perfil</span>
        </a>

        <!-- D-011: Admin Mobile Tab -->
        <a routerLink="/admin" 
           routerLinkActive="bg-purple-50/90 text-purple-700 font-bold shadow-2xs"
           class="min-h-[50px] py-1 px-2 flex flex-col items-center justify-center flex-1 rounded-2xl text-slate-500 hover:text-slate-900 active:scale-[0.96] transition-[transform,background-color,color] duration-150 ease-out">
          <svg class="w-5 h-5 mb-0.5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span class="text-[10px] tracking-tight text-purple-700 font-medium">Admin</span>
        </a>

      </nav>
      
      <!-- Legal Onboarding Modal -->
      <app-legal-modal></app-legal-modal>

      <!-- D-010: Modal Ligero de Takedown / Habeas Data Docente -->
      <div *ngIf="showTakedownModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4 animate-scale-up">
          <div class="flex items-start justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 border border-indigo-100">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-base font-extrabold text-slate-900">Canal de Atención Docente y Privacidad</h3>
                <p class="text-xs text-slate-400">Garantía de Habeas Data (Art. 28 CRBV)</p>
              </div>
            </div>
            <button (click)="closeTakedownModal()" class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="space-y-3 text-xs text-slate-600 leading-relaxed">
            <p>
              Respetamos el derecho de autodeterminación informativa y protección del honor (Art. 28 y 60 de la Constitución de la República Bolivariana de Venezuela).
            </p>
            <p>
              Si eres docente titular o contratado de la UCAB y deseas actualizar tus cátedras o solicitar la exclusión formal de tu perfil en nuestra plataforma estudiantil, escríbenos a <a href="mailto:legal@ratemat.app" class="font-bold text-indigo-600 hover:underline">legal&#64;ratemat.app</a> o completa este formulario. Atendemos todas las solicitudes en un plazo máximo de 48 horas.
            </p>
            <div class="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-[11px] text-slate-500 flex items-start gap-2.5">
              <svg class="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <div>
                <strong class="text-slate-700">Compromiso de Respuesta:</strong> Atendemos todas las solicitudes de docentes en un plazo máximo de <strong>48 horas</strong>, procediendo a la desactivación inmediata del perfil si es solicitado.
              </div>
            </div>
          </div>
          <div class="pt-2 flex justify-end">
            <button (click)="closeTakedownModal()" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer">
              Entendido
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class LayoutComponent {
  showTakedownModal = false;

  openTakedownModal(): void {
    this.showTakedownModal = true;
  }

  closeTakedownModal(): void {
    this.showTakedownModal = false;
  }
}
