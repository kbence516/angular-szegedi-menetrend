import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Route } from '../../shared/models/route';
import { Stop } from '../../shared/models/stop';
import { StopTime } from '../../shared/models/stop_time';
import { Trip } from '../../shared/models/trip';
import { HoursPipe } from '../../shared/pipes/hours.pipe';
import { MinutesPipe } from '../../shared/pipes/minutes.pipe';
import { RouteService } from '../../shared/services/route.service';
import { StopTimeService } from '../../shared/services/stop-time.service';
import { StopService } from '../../shared/services/stop.service';
import { TripService } from '../../shared/services/trip.service';
import { PopupComponent } from '../../shared/util/popup/popup.component';

@Component({
  selector: 'app-route',
  imports: [
    MatSelectModule,
    CommonModule,
    MatTableModule,
    MinutesPipe,
    MatDialogModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    HoursPipe
  ],
  templateUrl: './route.component.html',
  styleUrl: './route.component.scss'
})
export class RouteComponent implements OnInit {
  @Input() route_short_name: string;

  private tripService = inject(TripService);
  private routeService = inject(RouteService);
  private stopTimeService = inject(StopTimeService);
  private stopService = inject(StopService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  trips$: Observable<Trip[]>;
  headsigns$: Observable<Trip[]>;
  stops$: Observable<Stop[]>;
  stopTimes$: Observable<{ hour: number, times: StopTime[] }[]>;


  headsignSelected = false;
  stopSelected = false;

  ngOnInit(): void {
    this.trips$ = this.routeService.fetchByShortName(this.route_short_name).pipe(
      switchMap((route: Route) => this.tripService.fetchByRouteId(route.route_id))
    );

    this.headsigns$ = this.trips$.pipe(
      map((trips: Trip[]) => {
        const uniqueHeadsigns = new Set();
        return trips.filter(trip => {
          if (trip.trip_headsign !== 'Kocsiszínbe' && !uniqueHeadsigns.has(trip.trip_headsign)) {
            uniqueHeadsigns.add(trip.trip_headsign);
            return true;
          }
          return false;
        });
      }),
      switchMap((trips) => {
        if (!trips.length) {
          return this.dialog.open(
            PopupComponent,
            { data: { title: 'Hiba', message: 'Ez a járat a mai napon nem közlekedik', options: ['Vissza a főoldalra'] } })
            .afterClosed().pipe(
              switchMap(() => this.router.navigate(['/'])),
              map(() => trips)
            );
        } else {
          return [trips];
        }
      })
    );
  }

  changeHeadsign(direction: number): void {
    this.headsignSelected = true;
    this.stopSelected = false;
    this.stops$ = this.trips$.pipe(
      map((trips: Trip[]) => trips.find((t) => t.direction_id === direction)),
      switchMap((trip) => this.stopTimeService.fetchByTripId(trip!.trip_id)),
      switchMap((stopTimes: StopTime[]) => forkJoin(stopTimes.map(stopTime => this.stopService.fetchByStopId(stopTime.stop_id))))
    );
  }

  changeStop(stop_id: number): void {
    this.stopSelected = true;
    this.stopTimes$ = this.trips$.pipe(
      map((trips) => trips.map(t => t.trip_id)),
      switchMap((trip_ids) => this.stopTimeService.fetchByStopId(stop_id).pipe(
        map((stopTimes) => stopTimes.filter(st => trip_ids.includes(st.trip_id))),
        map((stopTimes) => {
          stopTimes.forEach(st => {
            if (st.arrival_time.toDate().getHours() === 0) {
              st.arrival_time = Timestamp.fromDate(new Date(st.arrival_time.toDate().getTime() - 24 * 60 * 60 * 1000));
            }
          })
          return stopTimes.sort((st1, st2) => st1.arrival_time.seconds - st2.arrival_time.seconds);
        }),
        map((stoptimes) => {
          let stopTimesByTheHour: { hour: number, times: StopTime[] }[] = [];
          stoptimes.forEach((st) => {
            if (!stopTimesByTheHour.find(s => s.hour === st.arrival_time.toDate().getHours())) {
              stopTimesByTheHour.push({ hour: st.arrival_time.toDate().getHours(), times: [] })
            }
            stopTimesByTheHour.find(s => s.hour === st.arrival_time.toDate().getHours())!.times.push(st)
          })
          return stopTimesByTheHour;
        })
      ))
    )
  }
}
