import { Component, inject, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, AfterViewInit {
  private apiService = inject(ApiService);

  @ViewChild('searchInput') searchInput!: ElementRef;

  searchQuery = '';
  searchQuery$ = new Subject<string>();
  searchResults: { subjects: any[], professors: any[] } | null = null;
  isSearching = false;

  ngOnInit() {
    this.searchQuery$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.length < 2) {
          return of(null);
        }
        this.isSearching = true;
        return this.apiService.search(query);
      })
    ).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isSearching = false;
      },
      error: (err) => {
        console.error('Error searching', err);
        this.isSearching = false;
        this.searchResults = null;
      }
    });
  }

  ngAfterViewInit() {
    // Auto-focus on mobile for better UX
    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    }, 100);
  }

  onSearchChange(query: string) {
    this.searchQuery = query;
    this.searchQuery$.next(query);
  }
}
