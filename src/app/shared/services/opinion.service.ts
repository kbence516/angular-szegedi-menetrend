import { Injectable } from '@angular/core';
import { FirebaseError } from 'firebase/app';
import { collection, deleteDoc, doc, orderBy, query, setDoc, Timestamp } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { catchError, from, Observable, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../../environments/environment.development';
import { Opinion } from '../models/opinion';

@Injectable({
  providedIn: 'root'
})
export class OpinionService {

  private auth = environment.auth;
  private collectionName = 'opinions';

  getAll(): Observable<Opinion[]> {
    return (collectionData(query(collection(environment.db, this.collectionName), orderBy('created', 'desc'))) as Observable<Opinion[]>);
  }

  create(content: string): Observable<void> {
    const opinion = { id: uuidv4(), content, created: Timestamp.fromDate(new Date()), author: this.auth.currentUser!.email };
    return from(setDoc(doc(environment.db, this.collectionName, opinion.id), opinion)).pipe(
      catchError((e: FirebaseError) => throwError(() => e.message))
    );
  }

  delete(id: string): Observable<void> {
    return from(deleteDoc(doc(environment.db, this.collectionName, id))).pipe(
      catchError((e: FirebaseError) => throwError(() => e.message))
    );
  }
}