import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfessorProfileService, ProfessorProfile, ReviewItem, AcademicFileItem } from './services/professor-profile.service';

@Component({
  selector: 'app-professor-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './professor-profile.component.html',
  styleUrls: ['./professor-profile.component.css']
})
export class ProfessorProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private profileService = inject(ProfessorProfileService);
  private fb = inject(FormBuilder);

  professorId: string | null = null;
  
  profile: ProfessorProfile | null = null;
  reviews: ReviewItem[] = [];
  files: AcademicFileItem[] = [];

  isLoadingProfile = true;
  isLoadingReviews = true;
  isLoadingFiles = true;

  errorProfile = false;
  errorReviews = false;
  errorFiles = false;

  // Review Form State
  showReviewModal = false;
  isSubmittingReview = false;
  reviewSubmitError: string | null = null;
  reviewForm: FormGroup;

  constructor() {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      text: ['', [Validators.required, Validators.minLength(10)]],
      isAnonymous: [false]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.professorId = params.get('id');
      if (this.professorId) {
        this.loadData();
      }
    });
  }

  loadData(): void {
    if (!this.professorId) return;

    // Load Profile
    this.isLoadingProfile = true;
    this.errorProfile = false;
    this.profileService.getProfessorInfo(this.professorId).subscribe({
      next: (data) => {
        this.profile = data;
        this.isLoadingProfile = false;
      },
      error: () => {
        this.errorProfile = true;
        this.isLoadingProfile = false;
      }
    });

    // Load Reviews
    this.isLoadingReviews = true;
    this.errorReviews = false;
    this.profileService.getProfessorReviews(this.professorId).subscribe({
      next: (data) => {
        this.reviews = data;
        this.isLoadingReviews = false;
      },
      error: () => {
        this.errorReviews = true;
        this.isLoadingReviews = false;
      }
    });

    // Load Files
    this.isLoadingFiles = true;
    this.errorFiles = false;
    this.profileService.getProfessorFiles(this.professorId).subscribe({
      next: (data) => {
        this.files = data;
        this.isLoadingFiles = false;
      },
      error: () => {
        this.errorFiles = true;
        this.isLoadingFiles = false;
      }
    });
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  // --- 4.4 Review Creation Flow ---

  openReviewModal(): void {
    this.showReviewModal = true;
    this.reviewSubmitError = null;
    this.reviewForm.reset({ rating: 0, text: '', isAnonymous: false });
  }

  closeReviewModal(): void {
    if (!this.isSubmittingReview) {
      this.showReviewModal = false;
    }
  }

  setRating(rating: number): void {
    this.reviewForm.patchValue({ rating });
  }

  submitReview(): void {
    if (this.reviewForm.invalid || !this.professorId) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.isSubmittingReview = true;
    this.reviewSubmitError = null;

    const payload = this.reviewForm.value;

    this.profileService.createReview(this.professorId, payload).subscribe({
      next: (newReview) => {
        this.reviews.unshift(newReview);
        this.profile!.totalReviews++;
        // We might want to recalculate the global score here, but for now we'll leave it as is or fake it
        this.isSubmittingReview = false;
        this.showReviewModal = false;
      },
      error: (err) => {
        this.isSubmittingReview = false;
        // Keep the text, only show the error message.
        if (err.status === 400 && err.error?.message) {
          this.reviewSubmitError = err.error.message;
        } else {
          this.reviewSubmitError = 'Ocurrió un error al enviar la reseña. Intenta de nuevo.';
        }
      }
    });
  }

  // --- 4.5 Community Interaction ---

  voteReview(review: ReviewItem, voteType: 'up' | 'down'): void {
    // Optimistic UI Update
    const previousVote = review.userVote;
    let netChange = 0;

    // Calculate score change based on previous state
    if (previousVote === voteType) {
      // Toggle off
      review.userVote = null;
      netChange = voteType === 'up' ? -1 : 1;
    } else {
      // New vote or change vote
      review.userVote = voteType;
      if (previousVote === 'up') netChange = -2; // changed from up to down
      else if (previousVote === 'down') netChange = 2; // changed from down to up
      else netChange = voteType === 'up' ? 1 : -1; // new vote
    }

    review.netScore += netChange;

    // Send to API
    this.profileService.voteReview(review.id, voteType).subscribe({
      next: (res) => {
        // Backend could return exact score, but we trust optimistic update for now
        // if needed: review.netScore = res.netScore;
      },
      error: () => {
        // Revert on error
        review.userVote = previousVote;
        review.netScore -= netChange;
      }
    });
  }

  reportReview(reviewId: string): void {
    if (window.confirm('¿Estás seguro de que quieres reportar esta reseña por contenido inapropiado?')) {
      this.profileService.reportItem(reviewId, 'review').subscribe({
        next: () => {
          alert('Reseña reportada exitosamente. Gracias por mantener la comunidad segura.');
        },
        error: () => {
          alert('Hubo un error al enviar el reporte.');
        }
      });
    }
  }

  reportFile(fileId: string): void {
    if (window.confirm('¿Estás seguro de que quieres reportar este archivo (spam, virus, irrelevante)?')) {
      this.profileService.reportItem(fileId, 'file').subscribe({
        next: () => {
          alert('Archivo reportado exitosamente.');
        },
        error: () => {
          alert('Hubo un error al enviar el reporte.');
        }
      });
    }
  }
}
