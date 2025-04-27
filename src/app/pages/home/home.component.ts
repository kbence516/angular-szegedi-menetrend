
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { map, Observable, tap } from 'rxjs';
import { Route } from '../../shared/models/route';
import { RouteService } from '../../shared/services/route.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-home',
  imports: [CommonModule, MatGridListModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private routeService = inject(RouteService);

  routes$: Observable<Route[]>;

  ngOnInit(): void {
    this.routes$ = this.routeService.fetchAll().pipe(
      map((routes: Route[]) => routes.sort((a, b) => a.route_short_name.toString().localeCompare(b.route_short_name.toString())))
    );
  }
}
