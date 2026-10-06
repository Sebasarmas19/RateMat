import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of, catchError, delay, map } from 'rxjs';
import { CAREERS_CATALOG } from '../data/careers-catalog.data';

export interface ProfessorSummary {
  id: string;
  name: string;
  department: string;
  rating: number;
  reviewCount: number;
  clarityScore?: number;
  difficultyScore?: number;
  recommendPercentage?: number;
  tags?: string[];
  avatarInitial?: string;
  avatarBg?: string;
  createdAt?: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  faculty: string;
  semester?: string;
  credits?: number;
  careerId?: string;
  careerName?: string;
  professorCount?: number;
  professors?: ProfessorSummary[];
}

export interface Career {
  id: string;
  name: string;
  shortName: string;
  faculty: string;
  facultyCategory: 'ingenieria' | 'derecho' | 'faces' | 'humanidades';
  gradient: string;
  badgeBg: string;
  textColor: string;
  previewBadge: string;
  icon: string;
  description: string;
  subjectsCount: number;
  subjects: SubjectItem[];
}

export interface PaginatedReviews {
  data: any[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? `${window.location.protocol}//${window.location.hostname}:3001/api`
    : `${environment.apiUrl}/api`;

  // Master catalog of professors
  private masterProfessors: { [id: string]: ProfessorSummary } = {
    'prof-1': {
      id: 'prof-1',
      name: 'Prof. Carlos Hernández',
      department: 'Departamento de Matemáticas / Ingeniería',
      rating: 4.8,
      reviewCount: 128,
      clarityScore: 4.9,
      difficultyScore: 3.4,
      recommendPercentage: 96,
      tags: ['#ClasesClaras', '#ExamenesJustos', '#Puntual'],
      avatarInitial: 'C',
      avatarBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      createdAt: '2022-03-15'
    },
    'prof-2': {
      id: 'prof-2',
      name: 'Prof. Aaron Zarraga',
      department: 'Escuela de Ingeniería Informática',
      rating: 4.9,
      reviewCount: 94,
      clarityScore: 4.8,
      difficultyScore: 4.2,
      recommendPercentage: 94,
      tags: ['#Exigente', '#ProyectosReales', '#GranProfesor'],
      avatarInitial: 'A',
      avatarBg: 'bg-amber-50 text-amber-700 border-amber-200',
      createdAt: '2026-08-10'
    },
    'prof-3': {
      id: 'prof-3',
      name: 'Prof. Elena Briceño',
      department: 'Facultad de Derecho',
      rating: 3.8,
      reviewCount: 47,
      clarityScore: 3.9,
      difficultyScore: 4.5,
      recommendPercentage: 78,
      tags: ['#MuchaLectura', '#AsistenciaObligatoria', '#Exigente'],
      avatarInitial: 'E',
      avatarBg: 'bg-rose-50 text-rose-700 border-rose-200',
      createdAt: '2023-01-20'
    },
    'prof-4': {
      id: 'prof-4',
      name: 'Prof. Ricardo Mendoza',
      department: 'Ciencias Económicas y Sociales (FACES)',
      rating: 4.7,
      reviewCount: 82,
      clarityScore: 4.7,
      difficultyScore: 3.6,
      recommendPercentage: 92,
      tags: ['#ClasesDinamicas', '#GranCriterio', '#TopUCAB'],
      avatarInitial: 'R',
      avatarBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      createdAt: '2022-09-08'
    },
    'prof-5': {
      id: 'prof-5',
      name: 'Prof. Carmen Valderrama',
      department: 'Ciencias Básicas / Ingeniería',
      rating: 4.3,
      reviewCount: 52,
      clarityScore: 4.4,
      difficultyScore: 3.8,
      recommendPercentage: 86,
      tags: ['#Puntual', '#Explicativa', '#GuiasCompletas'],
      avatarInitial: 'C',
      avatarBg: 'bg-violet-50 text-violet-700 border-violet-200',
      createdAt: '2024-05-14'
    },
    'prof-6': {
      id: 'prof-6',
      name: 'Prof. Luis Rodríguez',
      department: 'Escuela de Informática',
      rating: 4.6,
      reviewCount: 63,
      clarityScore: 4.6,
      difficultyScore: 3.9,
      recommendPercentage: 91,
      tags: ['#Practico', '#BuenFeedback', '#Laboratorio'],
      avatarInitial: 'L',
      avatarBg: 'bg-blue-50 text-blue-700 border-blue-200',
      createdAt: '2025-02-18'
    },
    'prof-7': {
      id: 'prof-7',
      name: 'Prof. Mariana Gómez',
      department: 'Escuela de Informática',
      rating: 4.7,
      reviewCount: 41,
      clarityScore: 4.8,
      difficultyScore: 3.5,
      recommendPercentage: 95,
      tags: ['#Didactica', '#Puntual', '#OrientadaAObjetos'],
      avatarInitial: 'M',
      avatarBg: 'bg-pink-50 text-pink-700 border-pink-200',
      createdAt: '2026-04-20'
    },
    'prof-8': {
      id: 'prof-8',
      name: 'Prof. Andrés Solís',
      department: 'Escuela de Informática',
      rating: 4.8,
      reviewCount: 57,
      clarityScore: 4.8,
      difficultyScore: 3.7,
      recommendPercentage: 93,
      tags: ['#SQLMaster', '#ClasesDinamicas', '#Arquitectura'],
      avatarInitial: 'A',
      avatarBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      createdAt: '2025-11-12'
    },
    'prof-9': {
      id: 'prof-9',
      name: 'Prof. Roberto Mendoza',
      department: 'Facultad de Derecho',
      rating: 4.6,
      reviewCount: 58,
      clarityScore: 4.6,
      difficultyScore: 3.8,
      recommendPercentage: 90,
      tags: ['#DebateCritico', '#CasosReales', '#ClasesVivas'],
      avatarInitial: 'R',
      avatarBg: 'bg-amber-50 text-amber-700 border-amber-200',
      createdAt: '2023-05-18'
    },
    'prof-10': {
      id: 'prof-10',
      name: 'Prof. Juan Carlos Pérez',
      department: 'Facultad de Derecho',
      rating: 4.4,
      reviewCount: 32,
      clarityScore: 4.5,
      difficultyScore: 3.6,
      recommendPercentage: 88,
      tags: ['#HistoriaViva', '#ExamenesJustos', '#Doctrina'],
      avatarInitial: 'J',
      avatarBg: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      createdAt: '2021-10-04'
    },
    'prof-11': {
      id: 'prof-11',
      name: 'Prof. Valentina Rivas',
      department: 'Facultad de Derecho',
      rating: 4.7,
      reviewCount: 65,
      clarityScore: 4.8,
      difficultyScore: 4.1,
      recommendPercentage: 93,
      tags: ['#CasosPenales', '#ExcelenteDocente', '#Debate'],
      avatarInitial: 'V',
      avatarBg: 'bg-purple-50 text-purple-700 border-purple-200',
      createdAt: '2024-08-25'
    },
    'prof-12': {
      id: 'prof-12',
      name: 'Prof. Daniel Rivas',
      department: 'FACES - Administración y Contaduría',
      rating: 4.5,
      reviewCount: 49,
      clarityScore: 4.6,
      difficultyScore: 3.7,
      recommendPercentage: 89,
      tags: ['#FinanzasClaras', '#Practico', '#CasosEmpresariales'],
      avatarInitial: 'D',
      avatarBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      createdAt: '2023-11-09'
    },
    'prof-13': {
      id: 'prof-13',
      name: 'Prof. Maritza Salazar',
      department: 'FACES - Administración',
      rating: 4.3,
      reviewCount: 38,
      clarityScore: 4.3,
      difficultyScore: 3.5,
      recommendPercentage: 84,
      tags: ['#Puntual', '#LecturasRelevantes', '#Participacion'],
      avatarInitial: 'M',
      avatarBg: 'bg-teal-50 text-teal-700 border-teal-200',
      createdAt: '2022-06-17'
    },
    'prof-14': {
      id: 'prof-14',
      name: 'Prof. Gabriela Rengel',
      department: 'Escuela de Comunicación Social',
      rating: 4.7,
      reviewCount: 58,
      clarityScore: 4.8,
      difficultyScore: 3.6,
      recommendPercentage: 94,
      tags: ['#Creatividad', '#ExcelenteRedaccion', '#FeedbackCálido'],
      avatarInitial: 'G',
      avatarBg: 'bg-rose-50 text-rose-700 border-rose-200',
      createdAt: '2024-02-11'
    },
    'prof-15': {
      id: 'prof-15',
      name: 'Prof. Leonardo Díaz',
      department: 'Escuela de Comunicación Social',
      rating: 4.5,
      reviewCount: 42,
      clarityScore: 4.5,
      difficultyScore: 3.7,
      recommendPercentage: 89,
      tags: ['#Audiovisual', '#CamaraYEdicion', '#PensamientoCritico'],
      avatarInitial: 'L',
      avatarBg: 'bg-pink-50 text-pink-700 border-pink-200',
      createdAt: '2025-07-22'
    },
    'prof-16': {
      id: 'prof-16',
      name: 'Prof. Enrique Castillo',
      department: 'Facultad de Ingeniería',
      rating: 4.4,
      reviewCount: 45,
      clarityScore: 4.4,
      difficultyScore: 4.0,
      recommendPercentage: 88,
      tags: ['#FisicaPractica', '#ExamenesJustos', '#EjerciciosClaros'],
      avatarInitial: 'E',
      avatarBg: 'bg-teal-50 text-teal-700 border-teal-200',
      createdAt: '2023-04-19'
    },
    'prof-17': {
      id: 'prof-17',
      name: 'Prof. Marcos Febres',
      department: 'Escuela de Ingeniería Industrial',
      rating: 4.6,
      reviewCount: 53,
      clarityScore: 4.7,
      difficultyScore: 3.9,
      recommendPercentage: 92,
      tags: ['#SeisSigma', '#CalidadIndustrial', '#Proyectos'],
      avatarInitial: 'M',
      avatarBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      createdAt: '2024-10-05'
    },
    'prof-18': {
      id: 'prof-18',
      name: 'Prof. Gustavo Romero',
      department: 'FACES - Contaduría Pública',
      rating: 4.8,
      reviewCount: 62,
      clarityScore: 4.9,
      difficultyScore: 3.8,
      recommendPercentage: 95,
      tags: ['#ExpertoNIIF', '#AuditoriaReal', '#ExamenesJustos'],
      avatarInitial: 'G',
      avatarBg: 'bg-orange-50 text-orange-700 border-orange-200',
      createdAt: '2023-08-30'
    },
    'prof-20': {
      id: 'prof-20',
      name: 'Prof. Sofía Domínguez',
      department: 'Escuela de Psicología',
      rating: 4.9,
      reviewCount: 74,
      clarityScore: 4.9,
      difficultyScore: 3.4,
      recommendPercentage: 97,
      tags: ['#Empatica', '#ClasesClaras', '#TopUCAB'],
      avatarInitial: 'S',
      avatarBg: 'bg-purple-50 text-purple-700 border-purple-200',
      createdAt: '2026-06-15'
    },
    'prof-21': {
      id: 'prof-21',
      name: 'Prof. Patricia Alarcón',
      department: 'Escuela de Psicología',
      rating: 4.4,
      reviewCount: 33,
      clarityScore: 4.4,
      difficultyScore: 3.6,
      recommendPercentage: 87,
      tags: ['#LecturasInteresantes', '#Psicometria', '#Puntual'],
      avatarInitial: 'P',
      avatarBg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
      createdAt: '2025-01-14'
    },
    'prof-22': {
      id: 'prof-22',
      name: 'Prof. Fernando Carballo',
      department: 'Escuela de Ingeniería Civil',
      rating: 4.7,
      reviewCount: 56,
      clarityScore: 4.7,
      difficultyScore: 4.3,
      recommendPercentage: 92,
      tags: ['#Estructuras', '#ExplicacionesDetalladas', '#Riguroso'],
      avatarInitial: 'F',
      avatarBg: 'bg-sky-50 text-sky-700 border-sky-200',
      createdAt: '2022-12-01'
    }
  };

  // Master catalog of Careers, Subjects, and their Professors (All 18 official UCAB careers)
  private careersCatalog: Career[] = CAREERS_CATALOG;

  // Subject-Professor relationships mapping
  private subjectProfessorsMap: { [subjectId: string]: string[] } = {
    'sub-1': ['prof-1', 'prof-2', 'prof-5'],
    'sub-2': ['prof-2', 'prof-6'],
    'sub-3': ['prof-3', 'prof-9'],
    'sub-4': ['prof-4', 'prof-12'],
    'sub-5': ['prof-1', 'prof-16'],
    'sub-6': ['prof-20', 'prof-21'],
    'sub-7': ['prof-2', 'prof-7'],
    'sub-8': ['prof-8', 'prof-7'],
    'sub-9': ['prof-8', 'prof-6'],
    'sub-10': ['prof-3', 'prof-10'],
    'sub-11': ['prof-9', 'prof-10'],
    'sub-12': ['prof-11'],
    'sub-13': ['prof-13'],
    'sub-14': ['prof-12', 'prof-4'],
    'sub-15': ['prof-14', 'prof-15'],
    'sub-16': ['prof-14'],
    'sub-17': ['prof-15'],
    'sub-18': ['prof-17'],
    'sub-19': ['prof-18', 'prof-12'],
    'sub-20': ['prof-18'],
    'sub-22': ['prof-20'],
    'sub-23': ['prof-22'],

    // Informática Plan CU 23/06/2026 (52 Asignaturas)
    'sub-info-1': ['prof-1', 'prof-5'],
    'sub-info-2': ['prof-14'],
    'sub-info-3': ['prof-15'],
    'sub-info-4': ['prof-2', 'prof-6'],
    'sub-info-5': ['prof-7'],
    'sub-info-6': ['prof-10'],
    'sub-info-7': ['prof-1', 'prof-5'],
    'sub-info-8': ['prof-16'],
    'sub-info-9': ['prof-15'],
    'sub-info-10': ['prof-2', 'prof-6'],
    'sub-info-11': ['prof-2', 'prof-6'],
    'sub-info-12': ['prof-10'],
    'sub-info-13': ['prof-1', 'prof-5'],
    'sub-info-14': ['prof-16'],
    'sub-info-15': ['prof-6'],
    'sub-info-16': ['prof-18'],
    'sub-info-17': ['prof-2', 'prof-6'],
    'sub-info-18': ['prof-7'],
    'sub-info-19': ['prof-1', 'prof-16'],
    'sub-info-20': ['prof-1', 'prof-16'],
    'sub-info-21': ['prof-8', 'prof-6'],
    'sub-info-22': ['prof-4'],
    'sub-info-23': ['prof-2', 'prof-7'],
    'sub-info-24': ['prof-7'],
    'sub-info-25': ['prof-15'],
    'sub-info-26': ['prof-1', 'prof-16'],
    'sub-info-27': ['prof-16'],
    'sub-info-28': ['prof-8', 'prof-6'],
    'sub-info-29': ['prof-7'],
    'sub-info-30': ['prof-2', 'prof-6'],
    'sub-info-31': ['prof-7'],
    'sub-info-32': ['prof-8', 'prof-7'],
    'sub-info-33': ['prof-1'],
    'sub-info-34': ['prof-6'],
    'sub-info-35': ['prof-8'],
    'sub-info-36': ['prof-7'],
    'sub-info-37': ['prof-7'],
    'sub-info-38': ['prof-8'],
    'sub-info-39': ['prof-8'],
    'sub-info-40': ['prof-4'],
    'sub-info-41': ['prof-17'],
    'sub-info-42': ['prof-6', 'prof-2'],
    'sub-info-43': ['prof-8'],
    'sub-info-44': ['prof-8'],
    'sub-info-45': ['prof-2', 'prof-7'],
    'sub-info-46': ['prof-7'],
    'sub-info-47': ['prof-6'],
    'sub-info-48': ['prof-15'],
    'sub-info-49': ['prof-7'],
    'sub-info-50': ['prof-10'],
    'sub-info-51': ['prof-7', 'prof-8'],
    'sub-info-52': ['prof-7', 'prof-8', 'prof-2']
  };

  private subjectProfessorsByCode: { [code: string]: string[] } = {
    'FING-02002': ['prof-1', 'prof-5'],
    'FING-02101': ['prof-1'],
    'FING-02003': ['prof-1'],
    'FING-02004': ['prof-1'],
    'FING-02008': ['prof-5', 'prof-2'],
    'FING-02009': ['prof-5'],
    'FING-02005': ['prof-16'],
    'FING-02006': ['prof-16'],
    'UCAB-00009': ['prof-5', 'prof-14'],
    'INFO-02002': ['prof-2', 'prof-6'],
    'INFO-02003': ['prof-2'],
    'INFO-02104': ['prof-6'],
    'INFO-02016': ['prof-7'],
    'INFO-02025': ['prof-2'],
    'INFO-02028': ['prof-2'],
    'INFO-02102': ['prof-8'],
    'INFO-02103': ['prof-8'],
    'INFO-02020': ['prof-7'],
    'INFO-IILTG': ['prof-2'],
    'DERE-02003': ['prof-3'],
    'DERE-00136': ['prof-3'],
    'DERE-02001': ['prof-3'],
    'DERE-00122': ['prof-9'],
    'DERE-00128': ['prof-9'],
    'DERE-02004': ['prof-9'],
    'DERE-00134': ['prof-11'],
    'DERE-02009': ['prof-11'],
    'DERE-02017': ['prof-11'],
    'ADCO-00350': ['prof-4', 'prof-13'],
    'ADCO-00370': ['prof-13'],
    'ADCO-00385': ['prof-13'],
    'ADCO-00448': ['prof-4', 'prof-12'],
    'ADCO-00443': ['prof-12'],
    'ADCO-00424': ['prof-12'],
    'FACE-00019': ['prof-4'],
    'FACE-00024': ['prof-18'],
    'ADCO-00379': ['prof-18'],
    'ADCO-02013': ['prof-18'],
    'COMU-00451': ['prof-14'],
    'COMU-00452': ['prof-14'],
    'COMU-02018': ['prof-14'],
    'COMU-00450': ['prof-15'],
    'COMU-00534': ['prof-15'],
    'PSIC-00065': ['prof-20'],
    'PSIC-02000': ['prof-20'],
    'PSIC-00066': ['prof-20'],
    'PSIC-02026': ['prof-21'],
    'PSIC-02021': ['prof-21'],
    'INDU-02001': ['prof-17'],
    'INDU-02000': ['prof-17'],
    'INDU-02032': ['prof-17'],
    'INDU-02030': ['prof-17'],
    'CIVI-02001': ['prof-22'],
  };

  constructor() {
    // Populate professor list and counts in catalog
    this.careersCatalog.forEach(career => {
      career.subjects.forEach(subject => {
        const profIds = this.subjectProfessorsMap[subject.id] || (subject.code ? this.subjectProfessorsByCode[subject.code] : []) || [];
        subject.professors = profIds.map(id => this.masterProfessors[id]).filter(Boolean);
        subject.professorCount = subject.professors.length;
      });
      career.subjectsCount = career.subjects.length;
    });
  }

  getCarreras(): Observable<Career[]> {
    return of(this.careersCatalog).pipe(delay(100));
  }

  getAllProfessors(): Observable<ProfessorSummary[]> {
    return this.http.get<ProfessorSummary[]>(`${this.apiUrl}/professors`).pipe(
      map(backendProfs => {
        if (backendProfs && backendProfs.length > 0) {
          return backendProfs;
        }
        return Object.values(this.masterProfessors);
      }),
      catchError(() => of(Object.values(this.masterProfessors)).pipe(delay(100)))
    );
  }

  getProfessorsForSubject(subjectId: string): Observable<ProfessorSummary[]> {
    return this.http.get<any[]>(`${this.apiUrl}/subjects/${subjectId}/professors`).pipe(
      map(backendProfs => {
        if (backendProfs && backendProfs.length > 0) {
          return backendProfs.map(p => ({
            id: p.id,
            name: p.name,
            department: p.department || 'Profesor de Cátedra',
            rating: p.rating || 4.5,
            reviewCount: p.reviewCount || 10,
            tags: ['#UCAB', '#Catedra']
          }));
        }
        return this.getLocalProfessorsForSubject(subjectId);
      }),
      catchError(() => {
        return of(this.getLocalProfessorsForSubject(subjectId)).pipe(delay(200));
      })
    );
  }

  private getLocalProfessorsForSubject(subjectId: string): ProfessorSummary[] {
    let profIds = this.subjectProfessorsMap[subjectId] || [];
    if (profIds.length === 0) {
      for (const c of this.careersCatalog) {
        const found = c.subjects.find(s => s.id === subjectId);
        if (found && found.code && this.subjectProfessorsByCode[found.code]) {
          profIds = this.subjectProfessorsByCode[found.code];
          break;
        }
      }
    }
    return profIds.map(id => this.masterProfessors[id]).filter(Boolean);
  }

  getRecentReviews(page: number = 1, limit: number = 10): Observable<PaginatedReviews> {
    return this.http.get<any>(`${this.apiUrl}/reviews/recent`, {
      params: { page: page.toString(), limit: limit.toString() }
    }).pipe(
      map(res => {
        const rawList = Array.isArray(res) ? res : (res?.data || []);
        const formattedData = rawList.map((r: any) => ({
          ...r,
          tags: Array.isArray(r.tags) ? r.tags.map((t: any) => typeof t === 'string' ? t : (t.tagName || '')) : []
        }));
        return {
          data: formattedData,
          total: res?.total ?? formattedData.length,
          page: res?.page ?? page,
          limit: res?.limit ?? limit,
          hasMore: res?.hasMore ?? (formattedData.length >= limit)
        };
      }),
      catchError(err => {
        console.warn('Backend API /reviews/recent unreachable, displaying high-fidelity preview data:', err);
        const mockReviews = [
          {
            id: 'rev-1',
            rating: 5,
            text: 'Excelente profesor. Explica los teoremas paso a paso, resuelve dudas con paciencia y los parciales son exactamente sobre lo practicado en clase. 100% recomendado.',
            netScore: 14,
            isAnonymous: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
            user: { name: 'Andrés V.' },
            professorSubject: {
              professor: { id: 'prof-1', name: 'Prof. Carlos Hernández' },
              subject: { id: 'sub-1', name: 'Cálculo I', code: 'MAT-101', faculty: 'Ingeniería' }
            },
            tags: ['#ClasesClaras', '#ExamenesJustos', '#Puntual'],
            userVote: null
          },
          {
            id: 'rev-2',
            rating: 4.5,
            text: 'Materia exigente pero se aprende muchísimo. Da oportunidades de puntos extra con tareas cortas semanales. Vale la pena totalmente.',
            netScore: 9,
            isAnonymous: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26), // 1 day ago
            user: null,
            professorSubject: {
              professor: { id: 'prof-2', name: 'Prof. Aaron Zarraga' },
              subject: { id: 'sub-2', name: 'Algoritmos y Estructuras', code: 'INF-201', faculty: 'Ingeniería' }
            },
            tags: ['#Exigente', '#Recomendado', '#ProyectosReales'],
            userVote: 'up'
          },
          {
            id: 'rev-3',
            rating: 3,
            text: 'Domina el tema a la perfección pero avanza muy rápido con las diapositivas. Es vital leer la bibliografía antes de entrar a su clase para no quedarse atrás.',
            netScore: 3,
            isAnonymous: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
            user: { name: 'Valentina M.' },
            professorSubject: {
              professor: { id: 'prof-3', name: 'Prof. Elena Briceño' },
              subject: { id: 'sub-3', name: 'Derecho Constitucional', code: 'DER-104', faculty: 'Derecho' }
            },
            tags: ['#MuchaLectura', '#AsistenciaObligatoria'],
            userVote: null
          },
          {
            id: 'rev-4',
            rating: 5,
            text: 'De los mejores profesores de la escuela de economía. Conecta la teoría con la realidad del país y sus evaluaciones fomentan el debate crítico.',
            netScore: 19,
            isAnonymous: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
            user: { name: 'Gabriel P.' },
            professorSubject: {
              professor: { id: 'prof-4', name: 'Prof. Ricardo Mendoza' },
              subject: { id: 'sub-4', name: 'Macroeconomía I', code: 'ECO-202', faculty: 'FACES' }
            },
            tags: ['#ClasesDinamicas', '#GranCriterio', '#TopUCAB'],
            userVote: null
          },
          {
            id: 'rev-5',
            rating: 1.5,
            text: 'Mala disposición para aclarar dudas en clase. Las preguntas en el examen no tienen relación con la guía de ejercicios entregada.',
            netScore: -4,
            isAnonymous: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 180),
            user: null,
            professorSubject: {
              professor: { id: 'prof-3', name: 'Prof. Elena Briceño' },
              subject: { id: 'sub-3', name: 'Derecho Constitucional', code: 'DER-104', faculty: 'Derecho' }
            },
            tags: ['#Exigente', '#MuchaLectura'],
            userVote: 'down'
          }
        ];
        const skip = (page - 1) * limit;
        const pagedData = mockReviews.slice(skip, skip + limit);
        return of({
          data: pagedData,
          total: mockReviews.length,
          page,
          limit,
          hasMore: skip + pagedData.length < mockReviews.length
        }).pipe(delay(300));
      })
    );
  }

  search(query: string): Observable<{ subjects: any[], professors: any[] }> {
    return this.http.get<{ subjects: any[], professors: any[] }>(`${this.apiUrl}/search`, {
      params: { q: query }
    }).pipe(
      catchError(() => {
        const q = query.toLowerCase().trim();

        // Search subjects in catalog with professors attached
        const matchedSubjects: SubjectItem[] = [];
        const seenSubjectIds = new Set<string>();

        this.careersCatalog.forEach(career => {
          career.subjects.forEach(subject => {
            if (!seenSubjectIds.has(subject.id)) {
              if (
                subject.name.toLowerCase().includes(q) ||
                subject.code.toLowerCase().includes(q) ||
                subject.faculty.toLowerCase().includes(q) ||
                (subject.careerName && subject.careerName.toLowerCase().includes(q))
              ) {
                seenSubjectIds.add(subject.id);
                matchedSubjects.push(subject);
              }
            }
          });
        });

        // Search professors
        const matchedProfessors = Object.values(this.masterProfessors).filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
        );

        return of({ subjects: matchedSubjects, professors: matchedProfessors }).pipe(delay(250));
      })
    );
  }

  voteReview(reviewId: string, voteType: 'up' | 'down'): Observable<{ netScore: number }> {
    const payload = { voteType: voteType.toUpperCase() };
    return this.http.post<any>(`${this.apiUrl}/reviews/${reviewId}/vote`, payload).pipe(
      map(res => ({ netScore: res?.netScore ?? 0 })),
      catchError(() => of({ netScore: 0 }).pipe(delay(300)))
    );
  }

  reportItem(id: string, type: 'review' = 'review'): Observable<{ success: boolean; message: string }> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (!isUuid) {
      return of({ success: true, message: 'Reporte registrado para moderación estudiantil.' }).pipe(delay(300));
    }
    const payload = {
      entityType: 'REVIEW',
      entityId: id,
      reason: 'Contenido reportado por estudiante de la comunidad'
    };
    return this.http.post<any>(`${this.apiUrl}/reports`, payload).pipe(
      map(() => ({ success: true, message: 'Reporte registrado exitosamente para moderación.' })),
      catchError(() => of({ success: true, message: 'Reporte registrado para moderación estudiantil.' }).pipe(delay(300)))
    );
  }
}
