import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  reviews: any[] = [];
  isLoadingFeed = true;

  // Search logic for desktop overlay
  searchQuery = '';
  searchQuery$ = new Subject<string>();
  searchResults: { subjects: any[], professors: any[] } | null = null;
  isSearching = false;
  showOverlay = false;

  ngOnInit() {
    this.apiService.getRecentReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.isLoadingFeed = false;
      },
      error: (err) => {
        console.error('Error loading feed', err);
        this.isLoadingFeed = false;
      }
    });

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

  onSearchChange(query: string) {
    this.searchQuery = query;
    this.showOverlay = query.length >= 2;
    this.searchQuery$.next(query);
  }

  closeSearch() {
    this.showOverlay = false;
    this.searchQuery = '';
    this.searchResults = null;
  }
}
