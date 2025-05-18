import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { User } from '@firebase/auth';
import { from, Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-navigation',
  imports: [MatButtonModule, CommonModule, RouterModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['../../app.component.scss', './navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  currentUser$: Observable<User | null | undefined>;
  stop$ = new Subject<void>();
  private router = inject(Router);
  private authService = inject(AuthService);

  loading: boolean;

  ngOnInit(): void {
    this.currentUser$ = this.authService.getUser().pipe(takeUntil(this.stop$));
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }

  logout(): void {
    from(this.authService.logout()).subscribe(() => { this.router.navigate(['/']) });
  }

  goTo(url: string): void {
    from(this.router.navigate([url])).subscribe();
  }
}
