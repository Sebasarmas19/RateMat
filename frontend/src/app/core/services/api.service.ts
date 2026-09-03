import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getRecentReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reviews/recent`);
  }

  search(query: string): Observable<{ subjects: any[], professors: any[] }> {
    return this.http.get<{ subjects: any[], professors: any[] }>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }
}
