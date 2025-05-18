import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, first, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const loggedOffGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.getUser().pipe(
    filter((u) => u !== undefined),
    first(),
    map((u) => {
      if (!u) {
        return true;
      }
      router.navigate(['/profile']);
      return false;
    })
  )
};
