import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from 'firebase/auth';
import { catchError, Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { fieldsMatchValidator, nonEmptyStringValidator } from '../../shared/util/validators';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../../shared/util/popup/popup.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, MatProgressSpinnerModule, MatFormFieldModule, ReactiveFormsModule, MatIconModule, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['../../app.component.scss', './profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  stop$ = new Subject<void>();
  loading: boolean;

  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  currentUser$: Observable<User | null | undefined>;
  changePasswordForm = new FormGroup(
    {
      newPassword: new FormControl('', [nonEmptyStringValidator(), Validators.minLength(8)]),
      newPasswordConfirm: new FormControl('', [nonEmptyStringValidator(), Validators.minLength(8)]),
    },
    { validators: fieldsMatchValidator('newPassword', 'newPasswordConfirm') }
  );

  ngOnInit(): void {
    this.currentUser$ = this.authService.getUser().pipe(takeUntil(this.stop$));
  }

  changePassword(): void {
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.authService.changePassword(this.changePasswordForm.controls.newPassword.value!).pipe(
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