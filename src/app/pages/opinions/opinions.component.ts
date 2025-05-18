import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from 'firebase/auth';
import { catchError, filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { Opinion } from '../../shared/models/opinion';
import { HungarianDatePipe } from '../../shared/pipes/hungarian-date.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { OpinionService } from '../../shared/services/opinion.service';
import { PopupComponent } from '../../shared/util/popup/popup.component';
import { nonEmptyStringValidator } from '../../shared/util/validators';

@Component({
  selector: 'app-opinions',
  imports: [CommonModule, MatProgressSpinnerModule, MatFormFieldModule, ReactiveFormsModule, MatIconModule, MatCardModule, MatInputModule, MatButtonModule, HungarianDatePipe],
  templateUrl: './opinions.component.html',
  styleUrl: './opinions.component.scss'
})
export class OpinionsComponent implements OnInit, OnDestroy {
  stop$ = new Subject<void>();
  loading: boolean;

  private authService = inject(AuthService);
  private opinionService = inject(OpinionService);
  private dialog = inject(MatDialog);

  currentUser$: Observable<User | null | undefined>;
  opinions$: Observable<Opinion[]>;
  opinionFormGroup = new FormGroup(
    {
      opinion: new FormControl('', [nonEmptyStringValidator()]),
    }
  );

  ngOnInit(): void {
    this.currentUser$ = this.authService.getUser().pipe(takeUntil(this.stop$));
    this.opinions$ = this.opinionService.getAll().pipe(takeUntil(this.stop$));
  }

  authorsOpinion$(opinion: Opinion): Observable<boolean> {
    return this.currentUser$.pipe(
      filter((u) => !!u),
      map((u) => opinion.author === u.email)
    )
  }

  addOpinion(): void {
    if (this.opinionFormGroup.invalid) {
      return;
    }
    this.opinionService.create(this.opinionFormGroup.controls.opinion.value!).pipe(
      catchError((e: Error) =>
        this.dialog.open(
          PopupComponent,
          { data: { title: 'Hiba', message: e, options: ['Vissza'] } })
          .afterClosed()
      )
    ).subscribe();
  }

  delete(id: string): void {
    console.log('deleting', id);
    this.opinionService.delete(id).pipe(
      catchError((e: Error) =>
        this.dialog.open(
          PopupComponent,
          { data: { title: 'Hiba', message: e, options: ['Vissza'] } })
          .afterClosed()
      )
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }
}