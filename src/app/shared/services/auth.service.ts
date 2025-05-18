import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@firebase/auth';
import { FirebaseError } from 'firebase/app';
import { catchError, from, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = environment.auth;

  getUser(): User | null {
    return this.auth.currentUser;
  }

  login(email: string, password: string): Observable<boolean> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map((uc) => !!uc),
      catchError((e: FirebaseError) => throwError(() => e.code))
    )
  }

  register(email: string, password: string): Observable<boolean> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      map((uc) => !!uc),
      catchError((e: FirebaseError) => throwError(() => e.code))
    )
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}
