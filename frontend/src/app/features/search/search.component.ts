import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  template: `
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h2 class="text-xl font-bold text-gray-900 mb-2">Buscar</h2>
      <p class="text-sm text-gray-500 mb-4">
        Busca materias o profesores.
      </p>
      
      <!-- Styled Search Input -->
      <div class="relative">
        <input 
          type="text" 
          placeholder="Escribe el nombre de un profesor..."
          class="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
        >
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 2.75C6.66751 2.75 2.75 6.66751 2.75 11.5C2.75 16.3325 6.66751 20.25 11.5 20.25C16.3325 20.25 20.25 16.3325 20.25 11.5C20.25 6.66751 16.3325 2.75 11.5 2.75ZM1.25 11.5C1.25 5.83908 5.83908 1.25 11.5 1.25C17.1609 1.25 21.75 5.83908 21.75 11.5C21.75 14.0605 20.8111 16.4017 19.2589 18.1982L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L18.1982 19.2589C16.4017 20.8111 14.0605 21.75 11.5 21.75C5.83908 21.75 1.25 17.1609 1.25 11.5Z" fill="currentColor"/></svg>
        </div>
      </div>
    </div>
  `
})
export class SearchComponent { }
