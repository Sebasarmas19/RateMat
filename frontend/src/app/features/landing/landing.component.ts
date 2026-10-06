import { Component, AfterViewInit, OnDestroy, ElementRef, QueryList, ViewChildren, inject, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);

  @ViewChildren('demoVideo') private demoVideos!: QueryList<ElementRef<HTMLVideoElement>>;
  private videoObserver?: IntersectionObserver;

  constructor() {
    effect(() => {
      if (this.authService.currentUser()) {
        this.router.navigate(['/search']);
      }
    });
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.setupDemoVideos();

    // =======================================================================
    // 1. HERO ENTRANCE CON EFECTO "BLUR-UP" (Como en video original 00:00 - 00:02)
    // =======================================================================
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.hero-pill',
        { y: 15, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.5, delay: 0.05, clearProps: 'transform,opacity,filter' }
      )
      .fromTo('.hero-headline',
        { y: 30, opacity: 0, filter: 'blur(14px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.75, clearProps: 'transform,opacity,filter' },
        '-=0.3'
      )
      .fromTo('.hero-subheadline',
        { y: 20, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, clearProps: 'transform,opacity,filter' },
        '-=0.45'
      )
      .fromTo('.hero-actions',
        { y: 18, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.55, clearProps: 'transform,opacity,filter' },
        '-=0.4'
      )
      .fromTo('.hero-rating-pill',
        { y: 14, opacity: 0, filter: 'blur(6px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.5, clearProps: 'transform,opacity,filter' },
        '-=0.35'
      )
      .fromTo('.hero-mockup-wrapper',
        { y: 30, scale: 0.96, opacity: 0, filter: 'blur(6px)' },
        { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.75, ease: 'power4.out', clearProps: 'transform,opacity,filter' },
        '-=0.4'
      );

      // =======================================================================
      // 2. TRES CARACTERÍSTICAS (00:03 DEL VIDEO)
      // =======================================================================
      gsap.fromTo('.feature-card',
        { y: 40, opacity: 0, filter: 'blur(10px)' },
        {
          scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 82%',
            toggleActions: 'play none none none'
          },
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.65,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'transform,opacity,filter'
        }
      );

      // =======================================================================
      // 2B. MODERACIÓN Y TRANSPARENCIA
      // =======================================================================
      gsap.fromTo('.moderation-card',
        { y: 40, opacity: 0, filter: 'blur(10px)' },
        {
          scrollTrigger: {
            trigger: '.moderation-grid',
            start: 'top 82%',
            toggleActions: 'play none none none'
          },
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.65,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'transform,opacity,filter'
        }
      );

      // =======================================================================
      // 3. SECCIÓN DE ALTO CONTRASTE OSCURO (00:04 - 00:06 DEL VIDEO)
      // =======================================================================
      gsap.fromTo('.dark-hub-text',
        { x: -30, opacity: 0, filter: 'blur(10px)' },
        {
          scrollTrigger: {
            trigger: '.dark-hub-section',
            start: 'top 78%',
            toggleActions: 'play none none none'
          },
          x: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'transform,opacity,filter'
        }
      );

      gsap.fromTo('.dark-hub-preview > div',
        { x: 30, opacity: 0, filter: 'blur(8px)' },
        {
          scrollTrigger: {
            trigger: '.dark-hub-section',
            start: 'top 78%',
            toggleActions: 'play none none none'
          },
          x: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'transform,opacity,filter'
        }
      );

      gsap.fromTo('.dark-metrics-preview',
        { y: 35, opacity: 0, filter: 'blur(8px)' },
        {
          scrollTrigger: {
            trigger: '.dark-metrics-preview',
            start: 'top 82%',
            toggleActions: 'play none none none'
          },
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.65,
          ease: 'power3.out',
          clearProps: 'transform,opacity,filter'
        }
      );

      gsap.fromTo('.dark-metrics-text',
        { y: 35, opacity: 0, filter: 'blur(8px)' },
        {
          scrollTrigger: {
            trigger: '.dark-metrics-text',
            start: 'top 82%',
            toggleActions: 'play none none none'
          },
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.65,
          ease: 'power3.out',
          clearProps: 'transform,opacity,filter'
        }
      );

      // =======================================================================
      // 4. FAQ EN GRID 2X2 (00:07 - 00:08 DEL VIDEO)
      // =======================================================================
      gsap.fromTo('.faq-card',
        { y: 35, opacity: 0, filter: 'blur(8px)' },
        {
          scrollTrigger: {
            trigger: '.faq-grid',
            start: 'top 82%',
            toggleActions: 'play none none none'
          },
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'transform,opacity,filter'
        }
      );

      // =======================================================================
      // 5. TESTIMONIOS ESTUDIANTILES EN 3 COLUMNAS (00:10 - 00:11 DEL VIDEO)
      // =======================================================================
      gsap.fromTo('.testimonial-card',
        { y: 35, opacity: 0, filter: 'blur(8px)' },
        {
          scrollTrigger: {
            trigger: '.testimonials-grid',
            start: 'top 82%',
            toggleActions: 'play none none none'
          },
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'transform,opacity,filter'
        }
      );

      // =======================================================================
      // 6. CTA FINAL OSCURO CON GLOW (00:12 DEL VIDEO)
      // =======================================================================
      gsap.fromTo('.cta-card-box',
        { y: 40, scale: 0.95, opacity: 0, filter: 'blur(10px)' },
        {
          scrollTrigger: {
            trigger: '.cta-card-box',
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'transform,opacity,filter'
        }
      );

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
  }

  ngOnDestroy(): void {
    this.videoObserver?.disconnect();
    if (typeof window !== 'undefined') {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  scrollToSection(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onVideoError(event: Event): void {
    // Sin grabación disponible: se oculta el <video> y queda visible el fallback del dispositivo
    (event.target as HTMLVideoElement).style.display = 'none';
  }

  // Reproduce las grabaciones solo cuando están en pantalla
  private setupDemoVideos(): void {
    const videos = this.demoVideos.map(ref => ref.nativeElement);
    // Angular no refleja el atributo `muted` como propiedad; sin esto el autoplay es bloqueado
    videos.forEach(video => (video.muted = true));

    // Se reproduce aunque el sistema tenga "reducir movimiento": es el contenido principal del hero
    // (Windows lo activa al apagar los efectos de animación y dejaba los videos congelados)
    this.videoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.25 });

    videos.forEach(video => this.videoObserver!.observe(video));
  }
}
