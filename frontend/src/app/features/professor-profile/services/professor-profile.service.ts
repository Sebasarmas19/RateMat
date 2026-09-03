import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, delay, tap } from 'rxjs';

export interface ProfessorProfile {
  id: string;
  name: string;
  globalScore: number;
  totalReviews: number;
  subjects: string[];
}

export interface ReviewItem {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  netScore: number;
  createdAt: Date;
  isAnonymous: boolean;
}

export interface AcademicFileItem {
  id: string;
  fileName: string;
  sizeMB: number;
  uploadedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProfessorProfileService {
  private readonly baseUrl = 'http://localhost:3000/api'; // Or use environment file

  constructor(private http: HttpClient) { }

  getProfessorInfo(id: string): Observable<ProfessorProfile> {
    return this.http.get<ProfessorProfile>(`${this.baseUrl}/professors/${id}`).pipe(
      catchError(err => {
        console.warn('API getProfessorInfo failed, returning mock data (Edge Case Handled)', err);
        return of({
          id,
          name: 'Prof. Carlos Hernández',
          globalScore: 4.2,
          totalReviews: 128,
          subjects: ['Cálculo I', 'Álgebra Lineal']
        }).pipe(delay(800)); // Simulate network latency
      })
    );
  }

  getProfessorReviews(id: string): Observable<ReviewItem[]> {
    return this.http.get<ReviewItem[]>(`${this.baseUrl}/professors/${id}/reviews`).pipe(
      catchError(err => {
        console.warn('API getProfessorReviews failed, returning mock data', err);
        return of([
          {
            id: 'r1',
            authorName: 'Anónimo',
            isAnonymous: true,
            rating: 5,
            text: 'Excelente profesor, explica muy bien y los exámenes son justos.',
            netScore: 12,
            createdAt: new Date(Date.now() - 86400000 * 2)
          },
          {
            id: 'r2',
            authorName: 'María G.',
            isAnonymous: false,
            rating: 3,
            text: 'Sabe mucho pero va muy rápido. Si no repasas en casa, te pierdes.',
            netScore: 4,
            createdAt: new Date(Date.now() - 86400000 * 5)
          },
          {
            id: 'r3',
            authorName: 'Anónimo',
            isAnonymous: true,
            rating: 1,
            text: 'Las clases son aburridas y califica muy duro.',
            netScore: -2,
            createdAt: new Date(Date.now() - 86400000 * 15)
          }
        ]).pipe(delay(1000));
      })
    );
  }

  getProfessorFiles(id: string): Observable<AcademicFileItem[]> {
    return this.http.get<AcademicFileItem[]>(`${this.baseUrl}/professors/${id}/academic-files`).pipe(
      catchError(err => {
        console.warn('API getProfessorFiles failed, returning mock data', err);
        return of([
          {
            id: 'f1',
            fileName: 'Guia_Derivadas_Parciales.pdf',
            sizeMB: 2.4,
            uploadedAt: new Date(Date.now() - 86400000 * 10)
          },
          {
            id: 'f2',
            fileName: 'Examen_Viejo_2022.pdf',
            sizeMB: 1.1,
            uploadedAt: new Date(Date.now() - 86400000 * 30)
          }
        ]).pipe(delay(1200));
      })
    );
  }
}
