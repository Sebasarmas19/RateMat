import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, PaginatedReviews } from '../../core/services/api.service';
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

  // Community Reviews Feed State & Pagination
  reviews: any[] = [];
  filteredReviews: any[] = [];
  isLoadingFeed = true;
  isLoadingMore = false;
  currentPage = 1;
  pageSize = 10;
  totalReviews = 0;
  hasMore = false;
  feedFilter = 'all'; // 'all' | 'high_rated' | 'positive' | 'critical'

  // Brecha 3 & Point 4: Report Modal & Reasons State
  showReportModal = false;
  reviewToReport: any = null;
  selectedReportReason = 'Lenguaje ofensivo, agresiones o insultos personales';
  availableReportReasons = [
    'Lenguaje ofensivo, agresiones o insultos personales',
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

  private formatReview(r: any) {
    return {
      ...r,
      user: r.user ? {
        ...r.user,
        name: r.user.name || (r.user.email ? r.user.email.split('@')[0] : 'Estudiante verificado')
      } : null,
      tags: Array.isArray(r.tags) ? r.tags.map((t: any) => typeof t === 'string' ? t : (t.tagName || '')) : [],
      isCollapsed: (r.netScore !== undefined && r.netScore <= -3) ? true : false,
      reported: false,
      reportReason: null
    };
  }

  loadFeed() {
    this.isLoadingFeed = true;
    this.currentPage = 1;
    this.apiService.getRecentReviews(this.currentPage, this.pageSize).subscribe({
      next: (res: PaginatedReviews) => {
        this.reviews = (res.data || []).map(r => this.formatReview(r));
        this.totalReviews = res.total;
        this.hasMore = res.hasMore;
        this.applyFeedFilter();
        this.isLoadingFeed = false;
      },
      error: (err) => {
        console.error('Error loading feed', err);
        this.isLoadingFeed = false;
      }
    });
  }

  loadMoreReviews() {
    if (this.isLoadingMore || !this.hasMore) return;
    this.isLoadingMore = true;
    const nextPage = this.currentPage + 1;

    this.apiService.getRecentReviews(nextPage, this.pageSize).subscribe({
      next: (res: PaginatedReviews) => {
        const incoming = (res.data || []).map(r => this.formatReview(r));
        const existingIds = new Set(this.reviews.map(r => r.id));
        const newReviews = incoming.filter(r => !existingIds.has(r.id));

        this.reviews = [...this.reviews, ...newReviews];
        this.currentPage = nextPage;
        this.hasMore = res.hasMore;
        this.totalReviews = res.total;
        this.applyFeedFilter();
        this.isLoadingMore = false;

        setTimeout(() => {
          gsap.from('.review-feed-card:nth-last-child(-n+' + newReviews.length + ')', {
            y: 12,
            autoAlpha: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: 'power2.out',
            clearProps: 'all'
          });
        }, 20);
      },
      error: (err) => {
        console.error('Error loading more reviews', err);
        this.isLoadingMore = false;
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

  // Smart truncation tracking for long review text
  expandedReviews = new Set<string>();

  isExpanded(id: string): boolean {
    return this.expandedReviews.has(id);
  }

  toggleExpand(id: string): void {
    if (this.expandedReviews.has(id)) {
      this.expandedReviews.delete(id);
    } else {
      this.expandedReviews.add(id);
    }
  }

  // Point 4: Report and Undo Report with Reasons (D-010)
  onReportClick(review: any) {
    if (review.reported) {
      review.reported = false;
      review.reportReason = null;
      this.showToast('Has retirado tu reporte sobre esta reseña.');
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
