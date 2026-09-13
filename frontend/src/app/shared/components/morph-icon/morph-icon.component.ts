import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { createMorph } from 'morphicons/dom';

@Component({
  selector: 'app-morph-icon',
  standalone: true,
  template: `
    <svg 
      [attr.width]="size" 
      [attr.height]="size" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      [attr.stroke-width]="strokeWidth" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      [class]="svgClass">
      <path #pathEl d=""></path>
    </svg>
  `,
  styles: [`:host { display: inline-flex; align-items: center; justify-content: center; line-height: 0; }`]
})
export class MorphIconComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('pathEl', { static: false }) pathElRef!: ElementRef<SVGPathElement>;
  
  @Input() icon: any; // Lucide IconNode or string d
  @Input() size: number = 16;
  @Input() strokeWidth: number = 2;
  @Input() svgClass: string = '';
  @Input() spring: 'snappy' | 'bouncy' | 'default' = 'snappy';

  private morphInstance: any = null;
  private isInitialized = false;

  ngAfterViewInit(): void {
    if (this.pathElRef?.nativeElement && this.icon) {
      this.initMorph();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isInitialized && changes['icon'] && !changes['icon'].isFirstChange()) {
      if (this.morphInstance) {
        this.morphInstance.morphTo(this.icon, this.spring);
      }
    } else if (!this.isInitialized && this.pathElRef?.nativeElement && this.icon) {
      this.initMorph();
    }
  }

  private initMorph(): void {
    try {
      this.morphInstance = createMorph(this.pathElRef.nativeElement, this.icon);
      this.isInitialized = true;
    } catch (e) {
      console.warn('MorphIcon init error:', e);
    }
  }

  ngOnDestroy(): void {
    this.morphInstance?.destroy();
  }
}
