import { inject, Injectable } from '@angular/core';
import { collection, orderBy, query, where } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { first, Observable, shareReplay, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Trip } from '../models/trip';
import { CalendarService } from './calendar.service';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  collectionName = 'trips';
  private calendarService = inject(CalendarService);

  fetchByRouteId(route_id: number): Observable<Trip[]> {
    return this.calendarService.fetchTodaysServices().pipe(
      switchMap((services) =>
        collectionData(
          query(
            collection(environment.db, this.collectionName),
            where('route_id', '==', route_id),
            where('service_id', 'in', services),
            orderBy('direction_id')
          )) as Observable<Trip[]>
        ),
        first(),
        shareReplay(1)
      )
  }
}
