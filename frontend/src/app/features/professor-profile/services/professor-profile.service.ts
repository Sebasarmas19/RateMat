import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, delay, tap, map } from 'rxjs';

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
  subject: string;
  netScore: number;
  createdAt: Date;
  isAnonymous: boolean;
  userVote?: 'up' | 'down' | null;
  isCollapsed?: boolean;
  isCurrentUser?: boolean;
  tags?: string[];
  reported?: boolean;
  reportReason?: string | null;
}

export interface CreateReviewDto {
  rating: number;
  text: string;
  subject: string;
  isAnonymous: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProfessorProfileService {
  private readonly baseUrl = 'http://localhost:3001/api'; // Or use environment file

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
            subject: 'Cálculo I',
            text: 'Excelente profesor, explica muy bien y los exámenes son justos.',
            netScore: 12,
            createdAt: new Date(Date.now() - 86400000 * 2),
            userVote: null
          },
          {
            id: 'r2',
            authorName: 'María G.',
            isAnonymous: false,
            rating: 3,
            subject: 'Álgebra Lineal',
            text: 'Sabe mucho pero va muy rápido. Si no repasas en casa, te pierdes.',
            netScore: 4,
            createdAt: new Date(Date.now() - 86400000 * 5),
            userVote: 'up' as const
          },
          {
            id: 'r3',
            authorName: 'Anónimo',
            isAnonymous: true,
            rating: 1,
            subject: 'Cálculo I',
            text: 'Las clases son aburridas y califica muy duro.',
            netScore: -2,
            createdAt: new Date(Date.now() - 86400000 * 15),
            userVote: null
          },
          {
            id: 'r4',
            authorName: 'Anónimo',
            isAnonymous: true,
            rating: 1,
            subject: 'Cálculo I',
            text: 'No asiste a clase y asigna evaluaciones de temas que nunca se explicaron.',
            netScore: -4,
            createdAt: new Date(Date.now() - 86400000 * 20),
            userVote: 'down' as const
          }
        ]).pipe(delay(1000));
      })
    );
  }

  createReview(professorId: string, review: CreateReviewDto): Observable<ReviewItem> {
    return this.http.post<ReviewItem>(`${this.baseUrl}/professors/${professorId}/reviews`, review).pipe(
      catchError(err => {
        // Mocking the backend behavior
        if (review.text.toLowerCase().includes('mierda') || review.text.toLowerCase().includes('idiota')) {
          throw { status: 400, error: { message: 'El contenido incluye lenguaje inapropiado y viola nuestras normas comunitarias.' } };
        }
        
        return of({
          id: 'r_new_' + Date.now(),
          authorName: review.isAnonymous ? 'Anónimo' : 'Usuario Actual',
          isAnonymous: review.isAnonymous,
          rating: review.rating,
          subject: review.subject,
          text: review.text,
          netScore: 0,
          createdAt: new Date(),
          userVote: null
        }).pipe(delay(800));
      })
    );
  }

  voteReview(reviewId: string, voteType: 'up' | 'down'): Observable<{ netScore: number }> {
    const payload = { voteType: voteType.toUpperCase() };
    return this.http.post<any>(`${this.baseUrl}/reviews/${reviewId}/vote`, payload).pipe(
      map((res: any) => ({ netScore: res?.netScore ?? 0 })),
      catchError(err => {
        return of({ netScore: 0 }).pipe(delay(400));
      })
    );
  }

  reportItem(itemId: string, itemType: 'review' = 'review'): Observable<{ success: boolean }> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(itemId);
    if (!isUuid) {
      return of({ success: true }).pipe(delay(400));
    }
    const payload = {
      entityType: 'REVIEW',
      entityId: itemId,
      reason: 'Contenido inapropiado reportado por estudiante'
    };
    return this.http.post<any>(`${this.baseUrl}/reports`, payload).pipe(
      map(() => ({ success: true })),
      catchError(err => {
        return of({ success: true }).pipe(delay(600));
      })
    );
  }
}
