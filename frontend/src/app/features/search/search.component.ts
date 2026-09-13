import { Component, inject, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService, Career, SubjectItem, ProfessorSummary } from '../../core/services/api.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

export type SearchMode = 'all' | 'subjects' | 'professors';
export type ProfessorSort = 'rating_desc' | 'newest' | 'oldest' | 'reviews_desc';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, AfterViewInit {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);

  @ViewChild('searchInput') searchInput!: ElementRef;

  // Search input & mode state
  searchMode: SearchMode = 'all';
  searchQuery = '';
  searchQuery$ = new Subject<string>();
  searchResults: { subjects: SubjectItem[], professors: ProfessorSummary[] } | null = null;
  isSearching = false;

  // University Careers state (Spotify Tiles)
  careers: Career[] = [];
  isLoadingCareers = true;

  // Selected Career view (Level 2: materias de la carrera)
  selectedCareer: Career | null = null;
  careerSubjectFilter = '';
  filteredCareerSubjects: SubjectItem[] = [];

  // Selected Subject view / modal (Level 3: profesores que dan esa materia)
  selectedSubject: SubjectItem | null = null;
  subjectProfessors: ProfessorSummary[] = [];
  isLoadingSubjectProfessors = false;

  // Master professors list & filtered view
  allProfessors: ProfessorSummary[] = [];
  filteredProfessors: ProfessorSummary[] = [];
  isLoadingProfessors = true;

  // Professor Filters & Sorting (Only concrete, measurable metrics)
  profSortBy: ProfessorSort = 'rating_desc';
  profMinRating = 0;
  profSelectedTag = '';

  availableProfTags = ['#ClasesClaras', '#ExamenesJustos', '#Puntual', '#ProyectosReales', '#TopUCAB', '#DebateCritico'];

  ngOnInit() {
    // 1. Load University Careers Catalog
    this.apiService.getCarreras().subscribe({
      next: (data) => {
        this.careers = data;
        this.isLoadingCareers = false;
      },
      error: (err) => {
        console.error('Error loading careers catalog', err);
        this.isLoadingCareers = false;
      }
    });

    // 2. Load All Professors
    this.apiService.getAllProfessors().subscribe({
      next: (profs) => {
        this.allProfessors = profs;
        this.updateFilteredProfessors();
        this.isLoadingProfessors = false;
      },
      error: (err) => {
        console.error('Error loading professors', err);
        this.isLoadingProfessors = false;
      }
    });

    // 3. Live search debounced pipe
    this.searchQuery$.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.trim().length < 2) {
          return of(null);
        }
        this.isSearching = true;
        return this.apiService.search(query);
      })
    ).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isSearching = false;
        this.updateFilteredProfessors();
      },
      error: (err) => {
        console.error('Error searching', err);
        this.isSearching = false;
        this.searchResults = null;
      }
    });

    // 4. Query params check
    this.route.queryParams.subscribe(params => {
      const q = params['q'];
      if (q) {
        this.searchQuery = q;
        this.searchQuery$.next(q);
      }
      const mode = params['mode'] as SearchMode;
      if (mode && ['all', 'subjects', 'professors'].includes(mode)) {
        this.searchMode = mode;
      }
      const careerId = params['career'];
      if (careerId && this.careers.length > 0) {
        const found = this.careers.find(c => c.id === careerId);
        if (found) this.selectCareer(found);
      }
    });
  }

  ngAfterViewInit() {
    if (!this.searchQuery) {
      setTimeout(() => {
        this.searchInput?.nativeElement?.focus();
      }, 150);
    }
  }

  // --- Search Mode & Actions ---

  setSearchMode(mode: SearchMode) {
    this.searchMode = mode;
    this.clearSelectedCareer();
    this.updateFilteredProfessors();
  }

  onSearchChange(query: string) {
    this.searchQuery = query;
    if (query.trim().length < 2) {
      this.searchResults = null;
    }
    this.searchQuery$.next(query);
    this.updateFilteredProfessors();
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = null;
    this.searchQuery$.next('');
    this.updateFilteredProfessors();
  }

  // --- Professor Filtering & Sorting Logic ---

  setProfSortBy(sort: ProfessorSort) {
    this.profSortBy = sort;
    this.updateFilteredProfessors();
  }

  toggleRatingFilter(rating: number) {
    this.profMinRating = this.profMinRating === rating ? 0 : rating;
    this.updateFilteredProfessors();
  }

  toggleProfTag(tag: string) {
    this.profSelectedTag = this.profSelectedTag === tag ? '' : tag;
    this.updateFilteredProfessors();
  }

  get activeProfFilterCount(): number {
    let count = 0;
    if (this.profMinRating > 0) count++;
    if (this.profSelectedTag) count++;
    if (this.profSortBy !== 'rating_desc') count++;
    return count;
  }

  clearProfFilters() {
    this.profSortBy = 'rating_desc';
    this.profMinRating = 0;
    this.profSelectedTag = '';
    this.updateFilteredProfessors();
  }

  updateFilteredProfessors() {
    const baseList = (this.searchResults && this.searchResults.professors.length > 0 && this.searchQuery.trim().length >= 2)
      ? this.searchResults.professors
      : this.allProfessors;

    this.filteredProfessors = this.applyProfessorFilters(baseList);
  }

  private applyProfessorFilters(sourceList: ProfessorSummary[]): ProfessorSummary[] {
    let list = [...sourceList];

    // Filter by search query if we are searching within allProfessors
    if (this.searchQuery && this.searchQuery.trim().length >= 2 && (!this.searchResults || this.searchResults.professors.length === 0)) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Min rating
    if (this.profMinRating > 0) {
      list = list.filter(p => p.rating >= this.profMinRating);
    }

    // Tag
    if (this.profSelectedTag) {
      list = list.filter(p => p.tags && p.tags.includes(this.profSelectedTag));
    }

    // Sorting (Only concrete, measurable metrics)
    list.sort((a, b) => {
      switch (this.profSortBy) {
        case 'rating_desc':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt || '2023-01-01').getTime() - new Date(a.createdAt || '2023-01-01').getTime();
        case 'oldest':
          return new Date(a.createdAt || '2023-01-01').getTime() - new Date(b.createdAt || '2023-01-01').getTime();
        case 'reviews_desc':
          return b.reviewCount - a.reviewCount;
        default:
          return b.rating - a.rating;
      }
    });

    return list;
  }

  // --- Career selection (Level 2: Subjects) ---

  selectCareer(career: Career) {
    this.selectedCareer = career;
    this.careerSubjectFilter = '';
    this.filteredCareerSubjects = [...career.subjects];
  }

  clearSelectedCareer() {
    this.selectedCareer = null;
    this.careerSubjectFilter = '';
    this.filteredCareerSubjects = [];
  }

  onCareerSubjectFilterChange(text: string) {
    this.careerSubjectFilter = text;
    if (!this.selectedCareer) return;

    if (!text || text.trim().length === 0) {
      this.filteredCareerSubjects = [...this.selectedCareer.subjects];
    } else {
      const term = text.toLowerCase().trim();
      this.filteredCareerSubjects = this.selectedCareer.subjects.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.code.toLowerCase().includes(term) ||
        (s.semester && s.semester.toLowerCase().includes(term))
      );
    }
  }

  // --- Subject selection (Level 3: Professors) ---

  selectSubject(subject: SubjectItem) {
    this.selectedSubject = subject;
    this.isLoadingSubjectProfessors = true;
    this.subjectProfessors = [];

    this.apiService.getProfessorsForSubject(subject.id).subscribe({
      next: (profs) => {
        this.subjectProfessors = profs;
        this.isLoadingSubjectProfessors = false;
      },
      error: (err) => {
        console.error('Error loading subject professors', err);
        this.isLoadingSubjectProfessors = false;
        this.subjectProfessors = subject.professors || [];
      }
    });
  }

  closeSubjectModal() {
    this.selectedSubject = null;
    this.subjectProfessors = [];
  }
}
