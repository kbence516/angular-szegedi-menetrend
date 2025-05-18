import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updatePassword, User } from '@firebase/auth';
import { FirebaseError } from 'firebase/app';
import { BehaviorSubject, catchError, filter, from, map, Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = environment.auth;
  private user$ = new BehaviorSubject<User | null | undefined>(undefined);

  constructor() {
    onAuthStateChanged(this.auth, (au: User | null) => {
      this.user$.next(au);
    })
  }

  getUser(): Observable<User | null | undefined> {
    return this.user$;
  }

  login(email: string, password: string): Observable<void> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(() => { }),
      catchError((e: FirebaseError) => throwError(() => this.resolveError(e.code)))
    )
  }

  register(email: string, password: string): Observable<void> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      map(() => { }),
      catchError((e: FirebaseError) => throwError(() => this.resolveError(e.code)))
    )
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  changePassword(newPassword: string): Observable<void> {
    return this.user$.pipe(
      filter((u) => !!u),
      switchMap((u) =>
        from(updatePassword(u, newPassword)).pipe(
          catchError((e: FirebaseError) => throwError(() => this.resolveError(e.code)))
        )
      )
    );
  }

  resolveError(errorCode: string) {
    switch (errorCode) {
      case 'auth/invalid-credential':
        return 'Hibás felhasználónév vagy jelszó!';
      case 'auth/email-already-in-use':
        return 'Ezzel az email címmel már létezik regisztrált felhasználó!';
      case 'auth/requires-recent-login':
        return 'Jelentkezz be újra a művelet elvégzéséhez!';
      default:
        return errorCode;
    }
  }
}
