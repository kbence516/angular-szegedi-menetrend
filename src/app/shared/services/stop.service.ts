import { Injectable } from '@angular/core';
import { collection, query, where } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { first, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Stop } from '../models/stop';

@Injectable({
  providedIn: 'root'
})
export class StopService {

  collectionName = 'stops';

  fetchByStopId(stop_id: number) {
    return collectionData(query(collection(environment.db, this.collectionName), where('stop_id', '==', stop_id))).pipe(
      first(),
      map((stops: any[]) => stops[0] as Stop)
    );
  }
}