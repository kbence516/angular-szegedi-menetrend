import { Routes } from '@angular/router';
import { loggedOffGuard } from './shared/guards/logged-off.guard';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    pathMatch: 'full'
  },
  {
    path: 'home',
    redirectTo: '',
  },
  {
    path: 'route/:route_short_name',
    loadComponent: () => import('./pages/route/route.component').then(m => m.RouteComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [loggedOffGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
];
