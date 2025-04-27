
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Route } from '../../shared/models/route';
import { RouteService } from '../../shared/services/route.service';
import { MatCardModule } from '@angular/material/card'

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatGridListModule, MatButtonModule, MatProgressSpinnerModule, MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private routeService = inject(RouteService);
  private router = inject(Router);

  routes$: Observable<Route[]>;

  ngOnInit(): void {
    this.routes$ = this.routeService.fetchAll().pipe(
      map((routes: Route[]) => routes.sort((a, b) => a.route_short_name.toString().localeCompare(b.route_short_name.toString())))
    );
  }

  selectRoute(route_short_name: string): void {
    this.router.navigate(['/route/' + route_short_name]);
  }
}