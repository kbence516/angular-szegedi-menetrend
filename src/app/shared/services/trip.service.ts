import { Injectable } from '@angular/core';
import { collection } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { first, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  collectionName = 'trips';

  fetchAll(): Observable<Trip[]> {
    return (collectionData(collection(environment.db, this.collectionName)) as Observable<Trip[]>).pipe(first());
  }
}
