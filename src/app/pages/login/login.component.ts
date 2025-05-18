import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { catchError, Observable, tap } from 'rxjs';
import { fieldsMatchValidator, nonEmptyStringValidator } from '../../shared/util/validators';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../../shared/util/popup/popup.component';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['../../app.component.scss', './login.component.scss']
})

export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  registerForm = new FormGroup(
    {
      rEmail: new FormControl('', [nonEmptyStringValidator(), Validators.email]),
      rPassword: new FormControl('', [nonEmptyStringValidator(), Validators.minLength(8)]),
      rPasswordAgain: new FormControl('', [nonEmptyStringValidator(), Validators.minLength(8)]),
    },
    {
      validators: fieldsMatchValidator('rPassword', 'rPasswordAgain')
    }
  );

  loginForm = new FormGroup(
    {
      lEmail: new FormControl('', [nonEmptyStringValidator(), Validators.email]),
      lPassword: new FormControl('', [nonEmptyStringValidator(), Validators.minLength(8)]),
    },
  );


  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.login(this.loginForm.controls.lEmail.value!, this.loginForm.controls.lPassword.value!).pipe(
      tap((login) => {
        if (login) {
          this.router.navigate(['/']);
        }
      }),
      catchError((e: Error) =>
        this.dialog.open(
          PopupComponent,
          { data: { title: 'Hiba', message: e.message, options: ['Vissza'] } })
          .afterClosed()
      )
    ).subscribe();
  }

  register(): void {
    if (this.registerForm.invalid) {
      return;
    }
    this.authService.register(this.registerForm.controls.rEmail.value!, this.registerForm.controls.rPassword.value!).pipe(
      tap((register) => {
        if (register) {
          this.router.navigate(['/']);
        }
      }),
      catchError((e: Error) =>
        this.dialog.open(
          PopupComponent,
          { data: { title: 'Hiba', message: e.message, options: ['Vissza'] } })
          .afterClosed()
      )
    ).subscribe();
  }
}

