import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';

export interface PendingSuggestion {
  id: string;
  type: 'professor' | 'subject';
  name: string;
  detail: string;
  suggestedBy: string;
  date: string;
}

export interface ReportedItem {
  id: string;
  itemType: 'review' | 'file';
  title: string;
  targetName: string;
  reportsCount: number;
  reason: string;
  contentPreview: string;
  date: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.component.html'
})
export class AdminComponent {
  // Admin Queue Filter
  activeFilter: 'all' | 'suggestions' | 'reports' = 'all';

  // Feedback Toast & Action Animations State
  toastMessage: string | null = null;
  private toastTimer: any = null;
  isResetting = false;

  // 1. Pending Suggestions Queue (D-004 & D-011 Cold Start)
  pendingSuggestions: PendingSuggestion[] = [
    {
      id: 'sug-1',
      type: 'professor',
      name: 'Prof. María Rodríguez',
      detail: 'Cátedra: Física I • Escuela de Ingeniería Industrial',
      suggestedBy: 'estudiante12@est.ucab.edu.ve',
      date: 'Hace 2 horas'
    },
    {
      id: 'sug-2',
      type: 'professor',
      name: 'Prof. Gabriel Blanco',
      detail: 'Cátedra: Sistemas Operativos • Escuela de Informática',
      suggestedBy: 'a.garcia@est.ucab.edu.ve',
      date: 'Hace 5 horas'
    },
    {
      id: 'sug-3',
      type: 'subject',
      name: 'Cátedra: Cálculo III',
      detail: 'Para: Prof. Carlos Hernández • Departamento de Matemáticas',
      suggestedBy: 'm.perez@est.ucab.edu.ve',
      date: 'Ayer'
    }
  ];

  // 2. Reported Content Queue (D-010 & D-011 Panic System)
  pendingReports: ReportedItem[] = [
    {
      id: 'rep-1',
      itemType: 'review',
      title: 'Reseña Difamatoria',
      targetName: 'Prof. Carlos Hernández',
      reportsCount: 3,
      reason: 'Lenguaje soez, difamación personal e insultos reiterados',
      contentPreview: '"Este profesor es un incompetente total y una basura calificando, no debería dar clases a nadie..."',
      date: 'Hace 1 día'
    },
    {
      id: 'rep-2',
      itemType: 'review',
      title: 'Reseña con Acusación No Sustanciada',
      targetName: 'Prof. Ricardo Mendoza',
      reportsCount: 3,
      reason: 'Insinuación de cobros ilegales y descalificación no pedagógica',
      contentPreview: '"Exige comprar su guía fotocopiada en un sitio específico para tener derecho a nota en el parcial..."',
      date: 'Hace 3 días'
    }
  ];

  get totalPendingCount(): number {
    return this.pendingSuggestions.length + this.pendingReports.length;
  }

  setFilter(filter: 'all' | 'suggestions' | 'reports'): void {
    this.activeFilter = filter;
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        gsap.fromTo(
          '.admin-card-item',
          { y: 8, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.22, stagger: 0.03, ease: 'power2.out' }
        );
      }
    }, 20);
  }

  showToast(message: string): void {
    this.toastMessage = message;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastMessage = null;
    }, 3500);
  }

  private dismissCard(elementId: string, onDone: () => void): void {
    if (typeof window !== 'undefined') {
      const el = document.getElementById(elementId);
      if (el) {
        gsap.to(el, {
          x: 24,
          autoAlpha: 0,
          scale: 0.96,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: onDone
        });
        return;
      }
    }
    onDone();
  }

  // --- D-004 Cold Start Moderation Actions ---

  approveSuggestion(item: PendingSuggestion): void {
    this.dismissCard(`suggestion-${item.id}`, () => {
      this.pendingSuggestions = this.pendingSuggestions.filter(s => s.id !== item.id);
      this.showToast(`"${item.name}" ha sido aprobado e incorporado al catálogo docente activo (D-004).`);
    });
  }

  rejectSuggestion(item: PendingSuggestion): void {
    this.dismissCard(`suggestion-${item.id}`, () => {
      this.pendingSuggestions = this.pendingSuggestions.filter(s => s.id !== item.id);
      this.showToast(`Propuesta de "${item.name}" descartada de la cola.`);
    });
  }

  // --- D-010 Content Report Moderation Actions ---

  deleteReportedItem(item: ReportedItem): void {
    this.dismissCard(`report-${item.id}`, () => {
      this.pendingReports = this.pendingReports.filter(r => r.id !== item.id);
      this.showToast(`Contenido eliminado definitivamente por violar las normas comunitarias (D-010).`);
    });
  }

  dismissReports(item: ReportedItem): void {
    this.dismissCard(`report-${item.id}`, () => {
      this.pendingReports = this.pendingReports.filter(r => r.id !== item.id);
      this.showToast(`Denuncias desestimadas. El contenido vuelve a ser visible públicamente.`);
    });
  }

  // Reset sample items for testing
  resetSampleData(): void {
    this.isResetting = true;
    setTimeout(() => { this.isResetting = false; }, 600);

    this.pendingSuggestions = [
      {
        id: 'sug-1',
        type: 'professor',
        name: 'Prof. María Rodríguez',
        detail: 'Cátedra: Física I • Escuela de Ingeniería Industrial',
        suggestedBy: 'estudiante12@est.ucab.edu.ve',
        date: 'Hace 2 horas'
      },
      {
        id: 'sug-2',
        type: 'professor',
        name: 'Prof. Gabriel Blanco',
        detail: 'Cátedra: Sistemas Operativos • Escuela de Informática',
        suggestedBy: 'a.garcia@est.ucab.edu.ve',
        date: 'Hace 5 horas'
      },
      {
        id: 'sug-3',
        type: 'subject',
        name: 'Cátedra: Cálculo III',
        detail: 'Para: Prof. Carlos Hernández • Departamento de Matemáticas',
        suggestedBy: 'm.perez@est.ucab.edu.ve',
        date: 'Ayer'
      }
    ];

    this.pendingReports = [
      {
        id: 'rep-1',
        itemType: 'review',
        title: 'Reseña Difamatoria',
        targetName: 'Prof. Carlos Hernández',
        reportsCount: 3,
        reason: 'Lenguaje soez, difamación personal e insultos reiterados',
        contentPreview: '"Este profesor es un incompetente total y una basura calificando, no debería dar clases a nadie..."',
        date: 'Hace 1 día'
      },
      {
        id: 'rep-2',
        itemType: 'review',
        title: 'Reseña con Acusación No Sustanciada',
        targetName: 'Prof. Ricardo Mendoza',
        reportsCount: 3,
        reason: 'Insinuación de cobros ilegales y descalificación no pedagógica',
        contentPreview: '"Exige comprar su guía fotocopiada en un sitio específico para tener derecho a nota en el parcial..."',
        date: 'Hace 3 días'
      }
    ];

    this.showToast('Datos de muestra del panel de administración restablecidos.');
  }
}
