import { Injectable } from '@angular/core';
import { collection } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { Observable, first } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Calendar } from '../models/calendar';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  collectionName = 'calendar';

  fetchAll(): Observable<Calendar[]> {
    return (collectionData(collection(environment.db, this.collectionName)) as Observable<Calendar[]>).pipe(first());
  }
}