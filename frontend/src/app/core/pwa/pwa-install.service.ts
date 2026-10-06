import { Injectable, signal } from '@angular/core';

export type InstallPlatform = 'ios' | 'android' | 'desktop';

// Evento no estándar de Chromium; no viene tipado en lib.dom
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

@Injectable({
  providedIn: 'root'
})
export class PwaInstallService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  // true cuando el navegador ofrece su diálogo nativo (Chrome/Edge en Android y escritorio)
  canPrompt = signal(false);
  // true si la app ya corre instalada (pantalla de inicio / ventana propia)
  isInstalled = signal(false);
  platform = signal<InstallPlatform>('desktop');
  showInstallSheet = signal(false);

  constructor() {
    if (typeof window === 'undefined') return;

    this.platform.set(this.detectPlatform());
    this.isInstalled.set(
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true
    );

    window.addEventListener('beforeinstallprompt', (event: Event) => {
      // Se guarda el evento para lanzarlo desde nuestro botón en lugar del mini-banner del navegador
      event.preventDefault();
      this.deferredPrompt = event as BeforeInstallPromptEvent;
      this.canPrompt.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.canPrompt.set(false);
      this.isInstalled.set(true);
      this.showInstallSheet.set(false);
    });
  }

  openInstallSheet(): void {
    this.showInstallSheet.set(true);
  }

  closeInstallSheet(): void {
    this.showInstallSheet.set(false);
  }

  async promptInstall(): Promise<void> {
    if (!this.deferredPrompt) return;
    await this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    // El evento solo se puede usar una vez
    this.deferredPrompt = null;
    this.canPrompt.set(false);
    if (outcome === 'accepted') {
      this.showInstallSheet.set(false);
    }
  }

  private detectPlatform(): InstallPlatform {
    const ua = navigator.userAgent;
    // iPadOS se presenta como Mac; se distingue por la pantalla táctil
    const isIpad = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
    if (/iPhone|iPad|iPod/.test(ua) || isIpad) return 'ios';
    if (/Android/.test(ua)) return 'android';
    return 'desktop';
  }
}
