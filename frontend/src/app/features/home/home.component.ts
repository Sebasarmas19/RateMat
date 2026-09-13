import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);

  // Community Reviews Feed State
  reviews: any[] = [];
  filteredReviews: any[] = [];
  isLoadingFeed = true;
  feedFilter = 'all'; // 'all' | 'high_rated' | 'positive' | 'critical'

  ngOnInit() {
    this.loadFeed();
  }

  loadFeed() {
    this.isLoadingFeed = true;
    this.apiService.getRecentReviews().subscribe({
      next: (data) => {
        this.reviews = data;
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

  voteReview(review: any, voteType: 'up' | 'down') {
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
