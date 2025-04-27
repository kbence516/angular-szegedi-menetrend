import { Routes } from '@angular/router';

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
];
