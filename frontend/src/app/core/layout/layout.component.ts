import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LegalModalComponent } from '../../shared/components/legal-modal/legal-modal.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LegalModalComponent],
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
            Reseñas anónimas respaldadas por el dominio institucional UCAB.
          </p>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 md:ml-64 min-h-screen pb-24 md:pb-12">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <router-outlet></router-outlet>
        </div>
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
    </div>
  `
})
export class LayoutComponent { }
