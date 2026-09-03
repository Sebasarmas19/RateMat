import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProfessorProfileService, ProfessorProfile, ReviewItem, AcademicFileItem } from './services/professor-profile.service';

@Component({
  selector: 'app-professor-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professor-profile.component.html',
  styleUrls: ['./professor-profile.component.css']
})
export class ProfessorProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private profileService = inject(ProfessorProfileService);

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
}
