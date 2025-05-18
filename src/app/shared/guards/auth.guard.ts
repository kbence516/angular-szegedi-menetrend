import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanActivateFn, Router } from '@angular/router';
import { filter, first, map, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { PopupComponent } from '../util/popup/popup.component';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const dialog = inject(MatDialog);
  const router = inject(Router);
  return authService.getUser().pipe(
    filter((u) => u !== undefined),
    first(),
    switchMap((u) => {
      if (u) {
        return of(true);
      }
      return dialog.open(
        PopupComponent,
        { data: { title: 'Hiba', message: 'Jelentkezz be a folytatáshoz!', options: ['Bejelentkezés'] } })
        .afterClosed().pipe(
          map(() => {
            router.navigate(['/login']);
            return false;
          })
        )
    })
  )
};
