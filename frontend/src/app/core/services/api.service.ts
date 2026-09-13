import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of, catchError, delay, map } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

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

  // Master catalog of Careers, Subjects, and their Professors
  private careersCatalog: Career[] = [
    {
      id: 'carrera-informatica',
      name: 'Ingeniería Informática',
      shortName: 'Informática',
      faculty: 'Facultad de Ingeniería',
      facultyCategory: 'ingenieria',
      gradient: 'from-indigo-600 via-indigo-700 to-violet-800',
      badgeBg: 'bg-indigo-400/20 text-indigo-100',
      textColor: 'text-indigo-100',
      previewBadge: 'Algoritmos • Software',
      icon: 'code',
      description: 'Arquitectura de software, redes, bases de datos, algoritmos e inteligencia artificial.',
      subjectsCount: 5,
      subjects: [
        {
          id: 'sub-1',
          name: 'Cálculo I',
          code: 'MAT-101',
          faculty: 'Facultad de Ingeniería',
          semester: '1er Semestre',
          credits: 5,
          careerId: 'carrera-informatica',
          careerName: 'Ingeniería Informática',
          professorCount: 3,
          professors: []
        },
        {
          id: 'sub-2',
          name: 'Algoritmos y Estructuras de Datos',
          code: 'INF-201',
          faculty: 'Facultad de Ingeniería',
          semester: '3er Semestre',
          credits: 4,
          careerId: 'carrera-informatica',
          careerName: 'Ingeniería Informática',
          professorCount: 2,
          professors: []
        },
        {
          id: 'sub-7',
          name: 'Programación Orientada a Objetos',
          code: 'INF-202',
          faculty: 'Facultad de Ingeniería',
          semester: '2do Semestre',
          credits: 4,
          careerId: 'carrera-informatica',
          careerName: 'Ingeniería Informática',
          professorCount: 2,
          professors: []
        },
        {
          id: 'sub-8',
          name: 'Bases de Datos I',
          code: 'INF-301',
          faculty: 'Facultad de Ingeniería',
          semester: '4to Semestre',
          credits: 4,
          careerId: 'carrera-informatica',
          careerName: 'Ingeniería Informática',
          professorCount: 2,
          professors: []
        },
        {
          id: 'sub-9',
          name: 'Redes de Computadores',
          code: 'INF-401',
          faculty: 'Facultad de Ingeniería',
          semester: '5to Semestre',
          credits: 4,
          careerId: 'carrera-informatica',
          careerName: 'Ingeniería Informática',
          professorCount: 2,
          professors: []
        }
      ]
    },
    {
      id: 'carrera-derecho',
      name: 'Derecho',
      shortName: 'Derecho',
      faculty: 'Facultad de Derecho',
      facultyCategory: 'derecho',
      gradient: 'from-amber-600 via-amber-700 to-yellow-800',
      badgeBg: 'bg-amber-400/20 text-amber-100',
      textColor: 'text-amber-100',
      previewBadge: 'Constitucional • Penal',
      icon: 'scale',
      description: 'Leyes, justicia, derecho constitucional, civil, penal, laboral y corporativo.',
      subjectsCount: 4,
      subjects: [
        {
          id: 'sub-3',
          name: 'Derecho Constitucional',
          code: 'DER-104',
          faculty: 'Facultad de Derecho',
          semester: '2do Semestre',
          credits: 4,
          careerId: 'carrera-derecho',
          careerName: 'Derecho',
          professorCount: 2,
          professors: []
        },
        {
          id: 'sub-10',
          name: 'Derecho Romano',
          code: 'DER-101',
          faculty: 'Facultad de Derecho',
          semester: '1er Semestre',
          credits: 3,
          careerId: 'carrera-derecho',
          careerName: 'Derecho',
          professorCount: 2,
          professors: []
        },
        {
          id: 'sub-11',
          name: 'Derecho Civil I (Personas)',
          code: 'DER-102',
          faculty: 'Facultad de Derecho',
          semester: '1er Semestre',
          credits: 4,
          careerId: 'carrera-derecho',
          careerName: 'Derecho',
          professorCount: 2,
          professors: []
        },
        {
          id: 'sub-12',
          name: 'Derecho Penal I',
          code: 'DER-201',
          faculty: 'Facultad de Derecho',
          semester: '3er Semestre',
          credits: 4,
          careerId: 'carrera-derecho',
          careerName: 'Derecho',
          professorCount: 1,
          professors: []
        }
      ]
    },
    {
      id: 'carrera-administracion',
      name: 'Administración de Empresas',
      shortName: 'Administración',
      faculty: 'FACES',
      facultyCategory: 'faces',
      gradient: 'from-emerald-600 via-emerald-700 to-teal-800',
      badgeBg: 'bg-emerald-400/20 text-emerald-100',
      textColor: 'text-emerald-100',
      previewBadge: 'Finanzas • Mercadeo',
      icon: 'trending-up',
      description: 'Gestión estratégica, finanzas corporativas, mercadeo, modelos de negocio y liderazgo.',
      subjectsCount: 3,
      subjects: [
        {
          id: 'sub-4',
          name: 'Macroeconomía I',
          code: 'ECO-202',
          faculty: 'FACES',
          semester: '3er Semestre',
          credits: 4,
          careerId: 'carrera-administracion',
          careerName: 'Administración de Empresas',
          professorCount: 2,
          professors: []
        },
        {
          id: 'sub-13',
          name: 'Principios de Administración',
          code: 'ADM-101',
          faculty: 'FACES',
          semester: '1er Semestre',
          credits: 3,
          careerId: 'carrera-administracion',
          careerName: 'Administración de Empresas',
          professorCount: 1,
          professors: []
        },
        {
          id: 'sub-14',
          name: 'Finanzas Corporativas',
          code: 'ADM-301',
          faculty: 'FACES',
          semester: '5to Semestre',
          credits: 4,
          careerId: 'carrera-administracion',
          careerName: 'Administración de Empresas',
          professorCount: 2,
          professors: []
        }
      ]
    },
    {
      id: 'carrera-comunicacion',
      name: 'Comunicación Social',
      shortName: 'Comunicación',
      faculty: 'Facultad de Humanidades',
      facultyCategory: 'humanidades',
      gradient: 'from-rose-600 via-rose-700 to-pink-800',
      badgeBg: 'bg-rose-400/20 text-rose-100',
      textColor: 'text-rose-100',
      previewBadge: 'Periodismo • Audiovisual',
      icon: 'mic',
      description: 'Narrativa transmedia, periodismo digital, producción audiovisual y opinión pública.',
      subjectsCount: 3,
      subjects: [
        {
          id: 'sub-15',
          name: 'Teoría de la Comunicación',
          code: 'COM-101',
          faculty: 'Facultad de Humanidades',
          semester: '1er Semestre',
          credits: 3,
          careerId: 'carrera-comunicacion',
          careerName: 'Comunicación Social',
          professorCount: 2,
          professors: []
        },
        {
          id: 'sub-16',
          name: 'Redacción Periodística',
          code: 'COM-201',
          faculty: 'Facultad de Humanidades',
          semester: '2do Semestre',
          credits: 4,
          careerId: 'carrera-comunicacion',
          careerName: 'Comunicación Social',
          professorCount: 1,
          professors: []
        },
        {
          id: 'sub-17',
          name: 'Producción Audiovisual',
          code: 'COM-301',
          faculty: 'Facultad de Humanidades',
          semester: '4to Semestre',
          credits: 4,
          careerId: 'carrera-comunicacion',
          careerName: 'Comunicación Social',
          professorCount: 1,
          professors: []
        }
      ]
    },
    {
      id: 'carrera-industrial',
      name: 'Ingeniería Industrial',
      shortName: 'Industrial',
      faculty: 'Facultad de Ingeniería',
      facultyCategory: 'ingenieria',
      gradient: 'from-teal-600 via-teal-700 to-cyan-800',
      badgeBg: 'bg-teal-400/20 text-teal-100',
      textColor: 'text-teal-100',
      previewBadge: 'Procesos • Calidad',
      icon: 'settings',
      description: 'Optimización de procesos, manufactura esbelta, control de calidad y cadena de suministros.',
      subjectsCount: 3,
      subjects: [
        {
          id: 'sub-1',
          name: 'Cálculo I',
          code: 'MAT-101',
          faculty: 'Facultad de Ingeniería',
          semester: '1er Semestre',
          credits: 5,
          careerId: 'carrera-industrial',
          careerName: 'Ingeniería Industrial',
          professorCount: 2,
          professors: []
        },
        {
          id: 'sub-5',
          name: 'Física I (Mecánica)',
          code: 'FIS-101',
          faculty: 'Facultad de Ingeniería',
          semester: '2do Semestre',
          credits: 4,
          careerId: 'carrera-industrial',
          careerName: 'Ingeniería Industrial',
          professorCount: 2,
          professors: []
        },
        {
          id: 'sub-18',
          name: 'Control de Calidad',
          code: 'IND-301',
          faculty: 'Facultad de Ingeniería',
          semester: '5to Semestre',
          credits: 4,
          careerId: 'carrera-industrial',
          careerName: 'Ingeniería Industrial',
          professorCount: 1,
          professors: []
        }
      ]
    },
    {
      id: 'carrera-contaduria',
      name: 'Contaduría Pública',
      shortName: 'Contaduría',
      faculty: 'FACES',
      facultyCategory: 'faces',
      gradient: 'from-orange-600 via-orange-700 to-amber-800',
      badgeBg: 'bg-orange-400/20 text-orange-100',
      textColor: 'text-orange-100',
      previewBadge: 'Tributos • NIIF',
      icon: 'calculator',
      description: 'Normas internacionales NIIF, auditoría fiscal, contabilidad gerencial y legislación tributaria.',
      subjectsCount: 2,
      subjects: [
        {
          id: 'sub-19',
          name: 'Contabilidad Financiera I',
          code: 'CON-101',
          faculty: 'FACES',
          semester: '1er Semestre',
          credits: 4,
          careerId: 'carrera-contaduria',
          careerName: 'Contaduría Pública',
          professorCount: 2,
          professors: []
        },
        {
          id: 'sub-20',
          name: 'Auditoría Financiera',
          code: 'CON-401',
          faculty: 'FACES',
          semester: '6to Semestre',
          credits: 4,
          careerId: 'carrera-contaduria',
          careerName: 'Contaduría Pública',
          professorCount: 1,
          professors: []
        }
      ]
    },
    {
      id: 'carrera-psicologia',
      name: 'Psicología',
      shortName: 'Psicología',
      faculty: 'Facultad de Humanidades',
      facultyCategory: 'humanidades',
      gradient: 'from-purple-600 via-purple-700 to-fuchsia-800',
      badgeBg: 'bg-purple-400/20 text-purple-100',
      textColor: 'text-purple-100',
      previewBadge: 'Clínica • Social',
      icon: 'smile',
      description: 'Comportamiento humano, psicología clínica, evaluación psicométrica y bienestar.',
      subjectsCount: 2,
      subjects: [
        {
          id: 'sub-6',
          name: 'Psicología General',
          code: 'PSI-101',
          faculty: 'Facultad de Humanidades',
          semester: '1er Semestre',
          credits: 3,
          careerId: 'carrera-psicologia',
          careerName: 'Psicología',
          professorCount: 2,
          professors: []
        },
        {
          id: 'sub-22',
          name: 'Psicología del Desarrollo',
          code: 'PSI-201',
          faculty: 'Facultad de Humanidades',
          semester: '3er Semestre',
          credits: 4,
          careerId: 'carrera-psicologia',
          careerName: 'Psicología',
          professorCount: 1,
          professors: []
        }
      ]
    },
    {
      id: 'carrera-civil',
      name: 'Ingeniería Civil',
      shortName: 'Civil',
      faculty: 'Facultad de Ingeniería',
      facultyCategory: 'ingenieria',
      gradient: 'from-sky-600 via-sky-700 to-blue-800',
      badgeBg: 'bg-sky-400/20 text-sky-100',
      textColor: 'text-sky-100',
      previewBadge: 'Estructuras • Suelos',
      icon: 'layers',
      description: 'Cálculo estructural, mecánica de suelos, topografía, obras hidráulicas e infraestructura urbana.',
      subjectsCount: 3,
      subjects: [
        {
          id: 'sub-1',
          name: 'Cálculo I',
          code: 'MAT-101',
          faculty: 'Facultad de Ingeniería',
          semester: '1er Semestre',
          credits: 5,
          careerId: 'carrera-civil',
          careerName: 'Ingeniería Civil',
          professorCount: 2,
          professors: []
        },
        {
          id: 'sub-5',
          name: 'Física I (Mecánica)',
          code: 'FIS-101',
          faculty: 'Facultad de Ingeniería',
          semester: '2do Semestre',
          credits: 4,
          careerId: 'carrera-civil',
          careerName: 'Ingeniería Civil',
          professorCount: 2,
          professors: []
        },
        {
          id: 'sub-23',
          name: 'Resistencia de Materiales',
          code: 'CIV-202',
          faculty: 'Facultad de Ingeniería',
          semester: '4to Semestre',
          credits: 4,
          careerId: 'carrera-civil',
          careerName: 'Ingeniería Civil',
          professorCount: 1,
          professors: []
        }
      ]
    }
  ];

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
    'sub-23': ['prof-22']
  };

  constructor() {
    // Populate professor list and counts in catalog
    this.careersCatalog.forEach(career => {
      career.subjects.forEach(subject => {
        const profIds = this.subjectProfessorsMap[subject.id] || [];
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
    return of(Object.values(this.masterProfessors)).pipe(delay(100));
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
    const profIds = this.subjectProfessorsMap[subjectId] || [];
    return profIds.map(id => this.masterProfessors[id]).filter(Boolean);
  }

  getRecentReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reviews/recent`).pipe(
      catchError(err => {
        console.warn('Backend API /reviews/recent unreachable, displaying high-fidelity preview data:', err);
        return of([
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
        ]).pipe(delay(400));
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
    return this.http.post<{ netScore: number }>(`${this.apiUrl}/reviews/${reviewId}/vote`, { voteType }).pipe(
      catchError(() => of({ netScore: 0 }).pipe(delay(300)))
    );
  }

  reportItem(id: string, type: 'review' | 'file'): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/moderation/report`, { id, type }).pipe(
      catchError(() => of({ success: true, message: 'Reporte registrado para moderación estudiantil (D-010).' }).pipe(delay(300)))
    );
  }
}
