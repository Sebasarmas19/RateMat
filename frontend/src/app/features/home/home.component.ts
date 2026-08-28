import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Inicio</h2>
      <p class="text-sm text-gray-500">
        Bienvenido a RateMat. Aquí verás las últimas reseñas de profesores.
      </p>
      
      <!-- Skeleton loader example (impeccable) -->
      <div class="mt-6 space-y-4">
        <div class="animate-pulse bg-gray-200 h-24 w-full rounded-xl"></div>
        <div class="animate-pulse bg-gray-200 h-24 w-full rounded-xl"></div>
      </div>
    </div>
  `
})
export class HomeComponent { }
