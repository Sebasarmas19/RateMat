import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { MorphIconComponent } from '../../shared/components/morph-icon/morph-icon.component';
import { Eye, EyeOff, ThumbsUp, ThumbsDown, Check, Flag } from 'lucide';
import { gsap } from 'gsap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MorphIconComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);

  // Morphicons icons for smooth spring state transitions
  iconEye = Eye;
  iconEyeOff = EyeOff;
  iconThumbsUp = ThumbsUp;
  iconThumbsDown = ThumbsDown;
  iconCheck = Check;
  iconFlag = Flag;

  // Community Reviews Feed State
  reviews: any[] = [];
  filteredReviews: any[] = [];
  isLoadingFeed = true;
  feedFilter = 'all'; // 'all' | 'high_rated' | 'positive' | 'critical'

  // Brecha 3 & Point 4: Report Modal & Reasons State
  showReportModal = false;
  reviewToReport: any = null;
  selectedReportReason = 'Lenguaje ofensivo, agresiones o insultos personales (D-010)';
  availableReportReasons = [
    'Lenguaje ofensivo, agresiones o insultos personales (D-010)',
    'Información falsa o difamación sobre el profesor',
    'Spam, publicidad o contenido no académico',
    'Violación de derechos de autor o examen activo filtrado'
  ];

  // Feedback Toast State
  reportToastMessage: string | null = null;
  private reportToastTimer: any = null;

  ngOnInit() {
    this.loadFeed();
  }

  loadFeed() {
    this.isLoadingFeed = true;
    this.apiService.getRecentReviews().subscribe({
      next: (data) => {
        // Brecha 2: Initialize isCollapsed = true if netScore <= -3 (D-003 & D-008)
        this.reviews = data.map(r => ({
          ...r,
          isCollapsed: (r.netScore !== undefined && r.netScore <= -3) ? true : false,
          reported: false,
          reportReason: null
        }));
        this.applyFeedFilter();
        this.isLoadingFeed = false;
      },
      error: (err) => {
        console.error('Error loading feed', err);
        this.isLoadingFeed = false;
      }
    });
  }

  setFeedFilter(filterId: string) {
    this.feedFilter = filterId;
    this.applyFeedFilter();
    setTimeout(() => {
      gsap.from('.review-feed-card', {
        y: 8,
        autoAlpha: 0,
        duration: 0.22,
        stagger: 0.03,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }, 15);
  }

  applyFeedFilter() {
    if (this.feedFilter === 'all') {
      this.filteredReviews = [...this.reviews];
    } else if (this.feedFilter === 'high_rated') {
      this.filteredReviews = this.reviews.filter(r => r.rating >= 4.5);
    } else if (this.feedFilter === 'positive') {
      this.filteredReviews = this.reviews.filter(r => r.rating >= 4.0);
    } else if (this.feedFilter === 'critical') {
      this.filteredReviews = this.reviews.filter(r => r.rating <= 2.5);
    }
  }

  // Star array helper for 5-star visual display (Point 2)
  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  // Brecha 2: Toggle Collapse for negative netScore reviews (D-003)
  toggleCollapse(review: any) {
    review.isCollapsed = !review.isCollapsed;
  }

  // Point 4: Report and Undo Report with Reasons (D-010)
  onReportClick(review: any) {
    if (review.reported) {
      if (window.confirm('¿Deseas retirar tu denuncia sobre esta reseña?')) {
        review.reported = false;
        review.reportReason = null;
        this.showToast('Has cancelado tu reporte sobre esta reseña.');
      }
      return;
    }

    this.reviewToReport = review;
    this.selectedReportReason = this.availableReportReasons[0];
    this.showReportModal = true;
  }

  closeReportModal() {
    this.showReportModal = false;
    this.reviewToReport = null;
  }

  confirmReport() {
    if (!this.reviewToReport) return;
    this.reviewToReport.reported = true;
    this.reviewToReport.reportReason = this.selectedReportReason;
    const reasonText = this.selectedReportReason.split('(')[0].trim();
    this.showReportModal = false;
    this.showToast(`Reseña reportada por: "${reasonText}". Enviada a moderación (D-010).`);

    this.apiService.reportItem(this.reviewToReport.id, 'review').subscribe();
    this.reviewToReport = null;
  }

  showToast(message: string) {
    this.reportToastMessage = message;
    if (this.reportToastTimer) clearTimeout(this.reportToastTimer);
    this.reportToastTimer = setTimeout(() => {
      this.reportToastMessage = null;
    }, 3500);
  }

  voteReview(review: any, voteType: 'up' | 'down', event?: Event) {
    if (event?.currentTarget) {
      gsap.fromTo(event.currentTarget,
        { scale: 0.95 },
        { scale: 1, duration: 0.18, ease: 'back.out(1.6)' }
      );
    }

    const prevVote = review.userVote;
    let netChange = 0;

    if (prevVote === voteType) {
      review.userVote = null;
      netChange = voteType === 'up' ? -1 : 1;
    } else {
      review.userVote = voteType;
      if (prevVote === 'up') netChange = -2;
      else if (prevVote === 'down') netChange = 2;
      else netChange = voteType === 'up' ? 1 : -1;
    }

    review.netScore = (review.netScore || 0) + netChange;

    this.apiService.voteReview(review.id, voteType).subscribe({
      error: () => {
        review.userVote = prevVote;
        review.netScore -= netChange;
      }
    });
  }
}
