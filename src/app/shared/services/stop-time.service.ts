import { Injectable } from '@angular/core';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { StopTime } from '../models/stop_time';

@Injectable({
  providedIn: 'root'
})
export class StopTimeService {

  collectionName = 'stop_times';

  fetchByStopId(stop_id: number): Observable<StopTime[]> {
    return from(getDocs(query(
      collection(environment.db, this.collectionName),
      where('stop_id', '==', stop_id),
      where('pickup_type', '==', 0)
    ))).pipe(
      map((dd) => dd.docs.map((d) => d.data() as StopTime))
    )
  }

  fetchByTripId(trip_id: string): Observable<StopTime[]> {
    return from(getDocs(query(
      collection(environment.db, this.collectionName),
      where('trip_id', '==', trip_id),
      orderBy('stop_sequence')
    ))).pipe(map((dd) => dd.docs.map((d) => d.data() as StopTime)))
  }
}