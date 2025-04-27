import { Injectable } from '@angular/core';
import { collection, query, where } from 'firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { first, map, Observable, shareReplay } from 'rxjs';
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

  fetchByShortName(route_short_name: string): Observable<Route> {
    return collectionData(query(collection(environment.db, this.collectionName), where('route_short_name', '==', route_short_name))).pipe(
      first(),
      map((routes: any[]) => routes[0] as Route),
      shareReplay(1)
    );
  }
}
