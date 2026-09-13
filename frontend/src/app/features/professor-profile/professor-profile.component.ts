import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfessorProfileService, ProfessorProfile, ReviewItem, AcademicFileItem } from './services/professor-profile.service';
import { MorphIconComponent } from '../../shared/components/morph-icon/morph-icon.component';
import { Eye, EyeOff, ThumbsUp, ThumbsDown, Check, Flag } from 'lucide';

@Component({
  selector: 'app-professor-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MorphIconComponent],
  templateUrl: './professor-profile.component.html',
  styleUrls: ['./professor-profile.component.css']
})
export class ProfessorProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private profileService = inject(ProfessorProfileService);
  private fb = inject(FormBuilder);

  // Morphicons icons for animated eye/eye-off toggle, thumbs, and flag
  iconEye = Eye;
  iconEyeOff = EyeOff;
  iconThumbsUp = ThumbsUp;
  iconThumbsDown = ThumbsDown;
  iconCheck = Check;
  iconFlag = Flag;

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

  // Brecha 4: Edit Review Mode State (D-003)
  isEditingReview = false;
  existingUserReview: ReviewItem | null = null;

  // Point 4: Report and Undo Report Modal State (D-010)
  showReportModal = false;
  reviewToReport: ReviewItem | null = null;
  selectedReportReason = 'Lenguaje inapropiado, insultos o difamación personal (D-010)';
  availableReportReasons = [
    'Lenguaje inapropiado, insultos o difamación personal (D-010)',
    'Información falsa o engañosa sobre evaluaciones o exigencias',
    'Spam, publicidad no autorizada o contenido sin relación académica',
    'Violación de derechos de autor o examen activo filtrado'
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

  // D-005 Hub Académico Upload Modal State
  showUploadModal = false;
  isUploadingFile = false;
  uploadError: string | null = null;
  selectedFileObj: File | null = null;
  selectedFileSizeMB = 0;
  uploadForm: FormGroup;

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

    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      subject: ['', [Validators.required]]
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
        // Brecha 2: initialize isCollapsed if netScore <= -3 (D-003 & D-008)
        this.reviews = data.map(r => ({
          ...r,
          isCollapsed: (r.netScore !== undefined && r.netScore <= -3) ? true : false,
          reported: false,
          reportReason: null
        }));
        this.checkExistingReview();
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

  getStarArray(count: number = 5): number[] {
    return Array(count).fill(0).map((_, i) => i + 1);
  }

  // --- D-007 Subject Filter Tabs ---
  selectSubjectTab(subject: string): void {
    this.selectedSubjectTab = subject;
    this.checkExistingReview();
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

  get filteredFiles(): AcademicFileItem[] {
    if (this.selectedSubjectTab === 'all') {
      return this.files;
    }
    return this.files.filter(f => !f.subject || f.subject === this.selectedSubjectTab);
  }

  // --- Brecha 1.B: Sugerir Nueva Materia / Cátedra (D-004 & D-011) ---

  openSuggestSubjectModal(): void {
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
      this.suggestSubjectSuccessMessage = '¡Cátedra propuesta con éxito! Ha sido enviada a la cola de moderación estudiantil (D-004 & D-011).';
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

  // --- D-003 & D-010 Review Creation & Edit Flow (Brecha 4) ---

  openReviewModal(defaultSubject?: string): void {
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

  // --- D-005 Hub Académico File Upload ---

  openUploadModal(): void {
    this.showUploadModal = true;
    this.uploadError = null;
    this.selectedFileObj = null;
    this.selectedFileSizeMB = 0;
    const subj = this.selectedSubjectTab !== 'all' ? this.selectedSubjectTab : (this.profile?.subjects?.[0] || '');
    this.uploadForm.reset({
      title: '',
      subject: subj
    });
  }

  closeUploadModal(): void {
    if (!this.isUploadingFile) {
      this.showUploadModal = false;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        this.uploadError = 'Únicamente se permiten documentos en formato PDF.';
        this.selectedFileObj = null;
        return;
      }
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > 10) {
        this.uploadError = 'El archivo supera el límite máximo de 10 MB.';
        this.selectedFileObj = null;
        return;
      }
      this.uploadError = null;
      this.selectedFileObj = file;
      this.selectedFileSizeMB = Math.round(sizeMB * 10) / 10;
      if (!this.uploadForm.get('title')?.value) {
        this.uploadForm.patchValue({ title: file.name.replace(/\.pdf$/i, '') });
      }
    }
  }

  submitUpload(): void {
    if (this.uploadForm.invalid || !this.selectedFileObj || !this.professorId) {
      this.uploadForm.markAllAsTouched();
      if (!this.selectedFileObj) {
        this.uploadError = 'Por favor selecciona un archivo PDF para subir.';
      }
      return;
    }

    this.isUploadingFile = true;
    this.uploadError = null;

    const { title, subject } = this.uploadForm.value;
    const fileName = title.endsWith('.pdf') ? title : `${title}.pdf`;

    this.profileService.uploadAcademicFile(this.professorId, {
      fileName,
      subject,
      sizeMB: this.selectedFileSizeMB || 1.0
    }).subscribe({
      next: (newFile) => {
        this.files.unshift(newFile);
        this.isUploadingFile = false;
        this.showUploadModal = false;
      },
      error: () => {
        this.isUploadingFile = false;
        this.uploadError = 'Hubo un error al subir el archivo. Inténtalo de nuevo.';
      }
    });
  }

  // --- D-003 Community Interaction (Optimistic) ---

  voteReview(review: ReviewItem, voteType: 'up' | 'down'): void {
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
    this.showToast(`Reseña reportada por: "${reasonText}". Enviada a moderación (D-010).`);

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

  reportFile(fileId: string): void {
    if (window.confirm('¿Deseas reportar este archivo por violación de Copyright o contenido indebido?')) {
      this.profileService.reportItem(fileId, 'file').subscribe({
        next: () => {
          this.showToast('Archivo reportado. Se revisará ante los estándares de derechos de autor.');
        },
        error: () => {
          this.showToast('No se pudo reportar el archivo.');
        }
      });
    }
  }
}
