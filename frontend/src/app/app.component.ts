import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { InstallSheetComponent } from './core/pwa/install-sheet.component';
import { PwaInstallService } from './core/pwa/pwa-install.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InstallSheetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'RateMat';
  private router = inject(Router);
  // Se instancia al arrancar para no perder el evento beforeinstallprompt
  private pwaInstall = inject(PwaInstallService);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        const mainEl = document.querySelector('main');
        if (mainEl) {
          mainEl.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
      }
    });
  }
}
