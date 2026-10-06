import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfessorProfileService, ProfessorProfile, ReviewItem } from './services/professor-profile.service';
import { AuthService } from '../../core/auth/auth.service';
import { MorphIconComponent } from '../../shared/components/morph-icon/morph-icon.component';
import { Eye, EyeOff, ThumbsUp, ThumbsDown, Check, Flag, Shield, AlertCircle } from 'lucide';
import gsap from 'gsap';

@Component({
  selector: 'app-professor-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MorphIconComponent, RouterLink],
  templateUrl: './professor-profile.component.html',
  styleUrls: ['./professor-profile.component.css']
})
export class ProfessorProfileComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  authService = inject(AuthService);
  private profileService = inject(ProfessorProfileService);
  private fb = inject(FormBuilder);

  get isAuthenticated(): boolean {
    return this.authService.hasActiveSession();
  }

  showStickyFloatingPill = false;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      this.showStickyFloatingPill = scrollY > 260;
    }
  }

  // Morphicons icons for animated eye/eye-off toggle, thumbs, and flag
  iconEye = Eye;
  iconEyeOff = EyeOff;
  iconThumbsUp = ThumbsUp;
  iconThumbsDown = ThumbsDown;
  iconCheck = Check;
  iconFlag = Flag;
  iconShield = Shield;
  iconAlertCircle = AlertCircle;

  professorId: string | null = null;
  
  profile: ProfessorProfile | null = null;
  reviews: ReviewItem[] = [];

  isLoadingProfile = true;
  isLoadingReviews = true;

  errorProfile = false;
  errorReviews = false;

  // Review Form State
  showReviewModal = false;
  isSubmittingReview = false;
  reviewSubmitError: string | null = null;
  reviewForm: FormGroup;

  // D-010: Modal Educativo e Institucional (Protocolo 2.83 UCAB)
  showCrimeAlertModal = false;

  // Brecha 4: Edit Review Mode State (D-003)
  isEditingReview = false;
  existingUserReview: ReviewItem | null = null;

  // Point 4: Report and Undo Report Modal State (D-010)
  showReportModal = false;
  reviewToReport: ReviewItem | null = null;
  selectedReportReason = 'Lenguaje inapropiado, insultos o difamación personal';
  availableReportReasons = [
    'Lenguaje inapropiado, insultos o difamación personal',
    'Información falsa o engañosa sobre evaluaciones o exigencias',
    'Spam, publicidad no autorizada o contenido sin relación académica'
  ];
  reportToastMessage: string | null = null;
  private reportToastTimer: any = null;

  // Brecha 1.B: Suggest Subject Modal State (D-004 & D-011)
  showSuggestSubjectModal = false;
  isSubmittingSuggestSubject = false;
  suggestSubjectSuccessMessage = '';
  suggestSubjectForm: FormGroup;

  // D-007 Subject Filter Tabs (Rating & Filter by Course)
  selectedSubjectTab = 'all';

  // Quick Tags for Reviews (D-003)
  availableTags = [
    '#ClasesClaras', 
    '#ExamenesJustos', 
    '#Puntual', 
    '#MuchaLectura', 
    '#Exigente', 
    '#ClasesDinamicas'
  ];
  selectedTags: string[] = [];

  // Metrics for Cascal 3-column / Aaron Zarraga layout
  ratingDistribution = [
    { stars: 5, percentage: 68 },
    { stars: 4, percentage: 22 },
    { stars: 3, percentage: 6 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 2 }
  ];

  clarityScore = 4.8;
  difficultyScore = 3.4;
  recommendPercentage = 93;

  // Dynamic Star Hover Rating for Interactive Feedback
  hoverRating = 0;

  setHoverRating(rating: number): void {
    this.hoverRating = rating;
  }

  clearHoverRating(): void {
    this.hoverRating = 0;
  }

  constructor() {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      subject: ['', [Validators.required]],
      text: [''],
      isAnonymous: [false]
    });

    this.suggestSubjectForm = this.fb.group({
      subjectName: ['', [Validators.required, Validators.minLength(3)]],
      career: ['Ingeniería Informática', [Validators.required]]
    });
  }

  private pendingAutoRate = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.professorId = params.get('id');
      if (this.professorId) {
        this.loadData();
      }
    });

    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['action'] === 'rate' || queryParams['rate'] === 'true') {
        this.pendingAutoRate = true;
        this.checkAutoRate();
      }
    });
  }

  private checkAutoRate(): void {
    if (this.pendingAutoRate && this.profile && !this.isLoadingProfile) {
      this.pendingAutoRate = false;
      if (!this.isAuthenticated) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: `/professor/${this.professorId}?rate=true` } });
        return;
      }
      setTimeout(() => {
        this.openReviewModal();
      }, 100);
    }
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
        setTimeout(() => this.animateRatingBars(), 60);
        this.checkAutoRate();
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
        // Brecha 2: initialize isCollapsed if netScore <= -3 (D-003 & D-008)
        this.reviews = data.map(r => ({
          ...r,
          isCollapsed: (r.netScore !== undefined && r.netScore <= -3) ? true : false,
          reported: false,
          reportReason: null
        }));
        this.checkExistingReview();
        this.isLoadingReviews = false;
        setTimeout(() => this.animateReviewCards(), 60);
        this.checkAutoRate();
      },
      error: () => {
        this.errorReviews = true;
        this.isLoadingReviews = false;
      }
    });
  }

  getStarArray(count: number = 5): number[] {
    return Array(count).fill(0).map((_, i) => i + 1);
  }

  // --- D-007 Subject Filter Tabs ---
  selectSubjectTab(subject: string): void {
    this.selectedSubjectTab = subject;
    this.checkExistingReview();
    setTimeout(() => this.animateReviewCards(), 40);
  }

  checkExistingReview(): void {
    const subj = this.selectedSubjectTab !== 'all' ? this.selectedSubjectTab : null;
    const found = this.reviews.find(r => 
      (r.isCurrentUser || r.authorName === 'Usuario Actual') &&
      (!subj || r.subject === subj)
    );
    this.existingUserReview = found || null;
  }

  get filteredReviews(): ReviewItem[] {
    if (this.selectedSubjectTab === 'all') {
      return this.reviews;
    }
    return this.reviews.filter(r => r.subject === this.selectedSubjectTab);
  }

  // --- Brecha 1.B: Sugerir Nueva Materia / Cátedra (D-004 & D-011) ---

  openSuggestSubjectModal(): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/professor/${this.professorId}` } });
      return;
    }
    this.setBodyScrollLocked(true);
    this.suggestSubjectSuccessMessage = '';
    this.suggestSubjectForm.reset({
      subjectName: '',
      career: 'Ingeniería Informática'
    });
    this.showSuggestSubjectModal = true;
  }

  closeSuggestSubjectModal(): void {
    if (!this.isSubmittingSuggestSubject) {
      this.showSuggestSubjectModal = false;
      this.suggestSubjectSuccessMessage = '';
      this.setBodyScrollLocked(false);
    }
  }

  submitSuggestSubject(): void {
    if (this.suggestSubjectForm.invalid || !this.professorId) {
      this.suggestSubjectForm.markAllAsTouched();
      return;
    }

    this.isSubmittingSuggestSubject = true;
    this.suggestSubjectSuccessMessage = '';

    setTimeout(() => {
      this.isSubmittingSuggestSubject = false;
      this.suggestSubjectSuccessMessage = '¡Cátedra propuesta con éxito! Ha sido enviada a moderación.';
      const newSubj = this.suggestSubjectForm.value.subjectName;
      if (this.profile && !this.profile.subjects.includes(newSubj)) {
        this.profile.subjects.push(newSubj);
      }
      setTimeout(() => {
        this.closeSuggestSubjectModal();
      }, 2200);
    }, 600);
  }

  // --- Brecha 2: Toggle Collapse for Negative Score Reviews (D-003) ---

  toggleCollapse(review: ReviewItem): void {
    review.isCollapsed = !review.isCollapsed;
  }

  private setBodyScrollLocked(locked: boolean): void {
    if (typeof window !== 'undefined') {
      if (locked) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
      } else {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.style.touchAction = '';
      }
    }
  }

  ngOnDestroy(): void {
    this.setBodyScrollLocked(false);
  }

  // --- D-003 & D-010 Review Creation & Edit Flow (Brecha 4) ---

  openReviewModal(defaultSubject?: string): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/professor/${this.professorId}?rate=true` } });
      return;
    }
    this.setBodyScrollLocked(true);
    this.showReviewModal = true;
    this.reviewSubmitError = null;
    const subj = defaultSubject || (this.selectedSubjectTab !== 'all' ? this.selectedSubjectTab : (this.profile?.subjects?.[0] || ''));
    
    // Check if user already reviewed this subject (Brecha 4: Edit my review mode)
    const found = this.reviews.find(r => 
      (r.isCurrentUser || r.authorName === 'Usuario Actual') &&
      r.subject === subj
    ) || this.existingUserReview;

    if (found) {
      this.isEditingReview = true;
      this.existingUserReview = found;
      this.selectedTags = found.tags ? [...found.tags] : [];
      this.reviewForm.reset({
        rating: found.rating,
        subject: found.subject,
        text: found.text,
        isAnonymous: found.isAnonymous
      });
      this.updateTextValidators(found.rating);
    } else {
      this.isEditingReview = false;
      this.selectedTags = [];
      this.reviewForm.reset({ 
        rating: 0, 
        subject: subj, 
        text: '', 
        isAnonymous: false 
      });
      this.updateTextValidators(0);
    }
  }

  closeReviewModal(): void {
    if (!this.isSubmittingReview) {
      this.showReviewModal = false;
      this.setBodyScrollLocked(false);
    }
  }

  setRating(rating: number): void {
    this.reviewForm.patchValue({ rating });
    this.updateTextValidators(rating);
  }

  toggleTag(tag: string): void {
    const idx = this.selectedTags.indexOf(tag);
    if (idx > -1) {
      this.selectedTags.splice(idx, 1);
    } else {
      this.selectedTags.push(tag);
    }
  }

  /**
   * D-003 & D-009 Rules:
   * Text is MANDATORY if rating is 1 or 5 stars.
   * Text is OPTIONAL if rating is 2, 3, or 4 stars.
   * MaxLength is strictly capped at 1000 characters (D-009).
   */
  private updateTextValidators(rating: number): void {
    const textControl = this.reviewForm.get('text');
    if (!textControl) return;

    if (rating === 1 || rating === 5) {
      textControl.setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(1000)]);
    } else {
      textControl.setValidators([Validators.minLength(10), Validators.maxLength(1000)]);
    }
    textControl.updateValueAndValidity();
  }

  get isTextRequired(): boolean {
    const rating = this.reviewForm.get('rating')?.value;
    return rating === 1 || rating === 5;
  }

  submitReview(): void {
    if (this.reviewForm.invalid || !this.professorId) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.isSubmittingReview = true;
    this.reviewSubmitError = null;

    const formValue = this.reviewForm.value;
    const payload = {
      rating: formValue.rating,
      subject: formValue.subject,
      text: formValue.text ? formValue.text.trim() : '',
      isAnonymous: !!formValue.isAnonymous
    };

    // D-010: Filtro Preventivo contra Imputaciones Delictivas (Protocolo 2.83 UCAB)
    if (payload.text && this.containsCrimeKeywords(payload.text)) {
      this.isSubmittingReview = false;
      this.showCrimeAlertModal = true;
      return;
    }

    // Brecha 4: If editing an existing review, update in-place optimistically
    if (this.isEditingReview && this.existingUserReview) {
      this.existingUserReview.rating = payload.rating;
      this.existingUserReview.subject = payload.subject;
      this.existingUserReview.text = payload.text;
      this.existingUserReview.isAnonymous = payload.isAnonymous;
      this.existingUserReview.tags = [...this.selectedTags];
      this.existingUserReview.isCollapsed = false;

      this.isSubmittingReview = false;
      this.showReviewModal = false;
      this.setBodyScrollLocked(false);
      return;
    }

    this.profileService.createReview(this.professorId, payload).subscribe({
      next: (newReview) => {
        newReview.isCurrentUser = true;
        newReview.tags = [...this.selectedTags];
        this.reviews.unshift(newReview);
        this.existingUserReview = newReview;
        if (this.profile) {
          this.profile.totalReviews++;
        }
        this.isSubmittingReview = false;
        this.showReviewModal = false;
        this.setBodyScrollLocked(false);
      },
      error: (err) => {
        this.isSubmittingReview = false;
        // D-010: Keep the user's written text, only show the error alert in red
        if (err.status === 400 && err.error?.message) {
          this.reviewSubmitError = err.error.message;
        } else {
          this.reviewSubmitError = 'Tu reseña contiene lenguaje que viola las normas comunitarias o no pudo procesarse. Por favor revisa el contenido.';
        }
      }
    });
  }

  // --- D-010 Protocolo 2.83 UCAB Crime Prevention Logic ---

  containsCrimeKeywords(text: string): boolean {
    if (!text) return false;
    const normalized = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const criminalRegex = /\b(acoso|acosador|soborno|sobornar|plata por nota|dolares para pasar|abuso sexual|violacion|violar|violo|extorsion|extorsionar)\b/i;
    return criminalRegex.test(normalized);
  }

  closeCrimeAlertModal(): void {
    this.showCrimeAlertModal = false;
  }

  // --- D-003 Community Interaction (Optimistic) ---

  animateRatingBars(): void {
    if (typeof window !== 'undefined') {
      gsap.fromTo(
        '.rating-bar-fill',
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left center',
          duration: 0.55,
          ease: 'power2.out',
          stagger: 0.05
        }
      );
    }
  }

  animateReviewCards(): void {
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        gsap.fromTo(
          '.review-item-card',
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.42,
            stagger: 0.05,
            ease: 'power2.out',
            clearProps: 'transform,opacity'
          }
        );
      });
    }
  }

  voteReview(review: ReviewItem, voteType: 'up' | 'down', event?: MouseEvent): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/professor/${this.professorId}` } });
      return;
    }

    if (event?.currentTarget) {
      const btn = event.currentTarget as HTMLElement;
      gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.18, ease: 'back.out(1.6)' });
    }

    const previousVote = review.userVote;
    let netChange = 0;

    if (previousVote === voteType) {
      review.userVote = null;
      netChange = voteType === 'up' ? -1 : 1;
    } else {
      review.userVote = voteType;
      if (previousVote === 'up') netChange = -2;
      else if (previousVote === 'down') netChange = 2;
      else netChange = voteType === 'up' ? 1 : -1;
    }

    review.netScore += netChange;

    this.profileService.voteReview(review.id, voteType).subscribe({
      error: () => {
        review.userVote = previousVote;
        review.netScore -= netChange;
      }
    });
  }

  // Point 4: Report with Undo & Modal (D-010)
  onReportClick(review: ReviewItem): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/professor/${this.professorId}` } });
      return;
    }

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

  closeReportModal(): void {
    this.showReportModal = false;
    this.reviewToReport = null;
  }

  confirmReport(): void {
    if (!this.reviewToReport) return;
    const target = this.reviewToReport;
    target.reported = true;
    target.reportReason = this.selectedReportReason;
    const reasonText = this.selectedReportReason.split('(')[0].trim();
    this.showReportModal = false;
    this.showToast('Reseña reportada correctamente. Enviada a moderación.');

    this.profileService.reportItem(target.id, 'review').subscribe();
    this.reviewToReport = null;
  }

  showToast(message: string): void {
    this.reportToastMessage = message;
    if (this.reportToastTimer) clearTimeout(this.reportToastTimer);
    this.reportToastTimer = setTimeout(() => {
      this.reportToastMessage = null;
    }, 3500);
  }
}
