import { Injectable } from '@angular/core';
import { collection, query, where } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { Observable, first, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Calendar } from '../models/calendar';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  collectionName = 'calendar';

  private days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  private today(): string {
    return this.days[new Date().getDay()];
  }

  fetchAll(): Observable<Calendar[]> {
    return (collectionData(collection(environment.db, this.collectionName)) as Observable<Calendar[]>).pipe(first());
  }

  /** Az adott napra érvényes szolgáltatások id-jaival tér vissza */
  fetchTodaysServices(): Observable<string[]> {
    return (collectionData(query(collection(environment.db, this.collectionName), where(this.today(), '==', 1))) as Observable<Calendar[]>).pipe(
      map((cal) => cal.map(c => c.service_id))
    )
  }
}