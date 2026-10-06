import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstallPlatform, PwaInstallService } from './pwa-install.service';

type StepIcon = 'share' | 'add-square' | 'more' | 'download' | 'monitor-down' | 'check';

interface InstallStep {
  icon: StepIcon;
  text: string;
  label?: string;
}

@Component({
  selector: 'app-install-sheet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './install-sheet.component.html'
})
export class InstallSheetComponent {
  pwa = inject(PwaInstallService);

  selectedPlatform = signal<InstallPlatform>('desktop');

  readonly tabs: { id: InstallPlatform; label: string }[] = [
    { id: 'ios', label: 'iPhone' },
    { id: 'android', label: 'Android' },
    { id: 'desktop', label: 'Computadora' }
  ];

  readonly steps: Record<InstallPlatform, InstallStep[]> = {
    ios: [
      { icon: 'share', text: 'Toca Compartir en la barra de Safari.' },
      { icon: 'add-square', text: 'Desliza hacia abajo y elige', label: 'Agregar a inicio' },
      { icon: 'check', text: 'Confirma con', label: 'Agregar' }
    ],
    android: [
      { icon: 'more', text: 'Toca el menú de Chrome, arriba a la derecha.' },
      { icon: 'download', text: 'Elige', label: 'Instalar app' },
      { icon: 'check', text: 'Confirma con', label: 'Instalar' }
    ],
    desktop: [
      { icon: 'monitor-down', text: 'Haz clic en el ícono de instalar, al final de la barra de direcciones (Chrome o Edge).' },
      { icon: 'check', text: 'Confirma con', label: 'Instalar' }
    ]
  };

  readonly notes: Record<InstallPlatform, string> = {
    ios: 'En Chrome para iPhone, Compartir está junto a la barra de direcciones.',
    android: 'Si no ves "Instalar app", busca "Agregar a la pantalla principal".',
    desktop: 'En Safari para Mac: Archivo → Agregar al Dock.'
  };

  constructor() {
    // Cada vez que se abre, muestra los pasos del dispositivo actual
    effect(() => {
      if (this.pwa.showInstallSheet()) {
        this.selectedPlatform.set(this.pwa.platform());
      }
    }, { allowSignalWrites: true });
  }

  // El diálogo nativo solo sirve en la plataforma donde se está navegando
  canPromptHere(): boolean {
    return this.pwa.canPrompt() && this.selectedPlatform() === this.pwa.platform();
  }

  close(): void {
    this.pwa.closeInstallSheet();
  }

  install(): void {
    this.pwa.promptInstall();
  }
}
