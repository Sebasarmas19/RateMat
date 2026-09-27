import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { HomeComponent } from './features/home/home.component';
import { SearchComponent } from './features/search/search.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AdminComponent } from './features/admin/admin.component';
import { LandingComponent } from './features/landing/landing.component';
import { authGuard, landingGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    canActivate: [landingGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
    canActivate: [landingGuard]
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'search', component: SearchComponent },
      { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
      { path: 'admin', component: AdminComponent, canActivate: [authGuard, adminGuard] },
      { path: 'professor/:id', loadComponent: () => import('./features/professor-profile/professor-profile.component').then(m => m.ProfessorProfileComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
