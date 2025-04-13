import { Injectable } from '@angular/core';
import { collection } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { first, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Route } from '../models/route';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  collectionName = 'routes';

  fetchAll(): Observable<Route[]> {
    return (collectionData(collection(environment.db, this.collectionName)) as Observable<Route[]>).pipe(first());
  }
}
