import { Component, inject, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ApiService, Career, SubjectItem, ProfessorSummary } from '../../core/services/api.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { gsap } from 'gsap';

export type SearchMode = 'subjects' | 'professors';
export type ProfessorSort = 'rating_desc' | 'newest' | 'oldest' | 'reviews_desc';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  @ViewChild('searchInput') searchInput!: ElementRef;

  // Brecha 1: Modal de Sugerencia de Profesor (D-004 & D-011)
  showSuggestProfModal = false;
  isSubmittingSuggest = false;
  suggestSuccessMessage = '';
  suggestProfForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    institutionEmailOrSchool: ['', [Validators.required, Validators.minLength(3)]],
    subject: ['', [Validators.required]]
  });

  // Search input & mode state (Dual mode: materias vs profesores)
  searchMode: SearchMode = 'subjects';
  searchQuery = '';
  searchQuery$ = new Subject<string>();
  searchResults: { subjects: SubjectItem[], professors: ProfessorSummary[] } | null = null;
  isSearching = false;

  // University Careers state (Spotify Tiles)
  careers: Career[] = [];
  isLoadingCareers = true;

  // Selected Career view (Level 2: materias y profesores de la carrera)
  selectedCareer: Career | null = null;
  careerActiveTab: 'subjects' | 'professors' = 'subjects';
  careerSearchQuery = '';
  filteredCareerSubjects: SubjectItem[] = [];
  careerProfessors: ProfessorSummary[] = [];
  filteredCareerProfessors: ProfessorSummary[] = [];

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
      if (mode && ['subjects', 'professors'].includes(mode)) {
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

  // --- Career selection (Level 2: Subjects & Professors) ---

  selectCareer(career: Career) {
    this.selectedCareer = career;
    this.careerActiveTab = 'subjects';
    this.careerSearchQuery = '';
    this.filteredCareerSubjects = [...career.subjects];

    // Aggregate all unique professors teaching in this career
    const profMap = new Map<string, ProfessorSummary>();
    if (career.subjects) {
      career.subjects.forEach(subj => {
        if (subj.professors) {
          subj.professors.forEach(p => profMap.set(p.id, p));
        }
      });
    }

    // Also include professors from allProfessors matching career or faculty
    this.allProfessors.forEach(p => {
      const dept = (p.department || '').toLowerCase();
      if (
        dept.includes(career.shortName.toLowerCase()) ||
        dept.includes(career.name.toLowerCase()) ||
        (career.facultyCategory === 'ingenieria' && (dept.includes('ingeniería') || dept.includes('informática') || dept.includes('matemáticas') || dept.includes('ciencias básicas'))) ||
        (career.facultyCategory === 'derecho' && dept.includes('derecho')) ||
        (career.facultyCategory === 'faces' && (dept.includes('económicas') || dept.includes('sociales') || dept.includes('administración') || dept.includes('contaduría')))
      ) {
        profMap.set(p.id, p);
      }
    });

    this.careerProfessors = Array.from(profMap.values());
    this.filteredCareerProfessors = [...this.careerProfessors];
    this.animateCards('.career-subject-card');
  }

  private animateCards(selector: string) {
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        requestAnimationFrame(() => {
          gsap.fromTo(
            selector,
            { y: 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.40,
              stagger: 0.045,
              ease: 'power2.out',
              clearProps: 'transform,opacity'
            }
          );
        });
      }
    }, 40);
  }

  clearSelectedCareer() {
    this.selectedCareer = null;
    this.careerActiveTab = 'subjects';
    this.careerSearchQuery = '';
    this.filteredCareerSubjects = [];
    this.careerProfessors = [];
    this.filteredCareerProfessors = [];
  }

  setCareerActiveTab(tab: 'subjects' | 'professors') {
    this.careerActiveTab = tab;
    this.applyCareerSearch();
    this.animateCards(tab === 'subjects' ? '.career-subject-card' : '.career-prof-card');
  }

  onCareerSearchChange(text: string) {
    this.careerSearchQuery = text;
    this.applyCareerSearch();
  }

  // Backwards compatibility for existing template calls
  onCareerSubjectFilterChange(text: string) {
    this.onCareerSearchChange(text);
  }

  private applyCareerSearch() {
    if (!this.selectedCareer) return;
    const term = (this.careerSearchQuery || '').toLowerCase().trim();

    if (!term) {
      this.filteredCareerSubjects = [...this.selectedCareer.subjects];
      this.filteredCareerProfessors = [...this.careerProfessors];
      return;
    }

    if (this.careerActiveTab === 'subjects') {
      this.filteredCareerSubjects = this.selectedCareer.subjects.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.code.toLowerCase().includes(term) ||
        (s.semester && s.semester.toLowerCase().includes(term))
      );
    } else {
      this.filteredCareerProfessors = this.careerProfessors.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.department.toLowerCase().includes(term) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(term)))
      );
    }
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

  // --- Subject selection (Level 3: Professors) ---

  selectSubject(subject: SubjectItem) {
    this.setBodyScrollLocked(true);
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
    this.setBodyScrollLocked(false);
  }

  // --- Brecha 1: Suggest Professor Modal Methods (D-004 & D-011) ---

  openSuggestProfModal(prefilledSubject?: string, prefilledName?: string) {
    this.setBodyScrollLocked(true);
    this.suggestSuccessMessage = '';
    this.suggestProfForm.reset({
      name: prefilledName || '',
      institutionEmailOrSchool: '',
      subject: prefilledSubject || (this.selectedSubject?.name || '')
    });
    this.showSuggestProfModal = true;
  }

  closeSuggestProfModal() {
    if (!this.isSubmittingSuggest) {
      this.showSuggestProfModal = false;
      this.suggestSuccessMessage = '';
      this.setBodyScrollLocked(false);
    }
  }

  submitSuggestProfessor() {
    if (this.suggestProfForm.invalid) {
      this.suggestProfForm.markAllAsTouched();
      return;
    }

    this.isSubmittingSuggest = true;
    this.suggestSuccessMessage = '';

    setTimeout(() => {
      this.isSubmittingSuggest = false;
      this.suggestSuccessMessage = '¡Gracias por tu aporte! Tu sugerencia ha sido enviada a moderación.';
      setTimeout(() => {
        this.closeSuggestProfModal();
      }, 2500);
    }, 600);
  }

  quickRateProfessor(profId: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/professor', profId], { queryParams: { rate: 'true' } });
  }
}
