import { Injectable } from '@angular/core';
import { StopTime } from '../models/stop_time';
import { collection } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { Observable, first } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StopTimeService {

  collectionName = 'stop_times';

  fetchAll(): Observable<StopTime[]> {
    return (collectionData(collection(environment.db, this.collectionName)) as Observable<StopTime[]>).pipe(first());
  }
}