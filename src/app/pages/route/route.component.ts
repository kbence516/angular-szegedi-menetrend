import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Route } from '../../shared/models/route';
import { Stop } from '../../shared/models/stop';
import { StopTime } from '../../shared/models/stop_time';
import { Trip } from '../../shared/models/trip';
import { RouteService } from '../../shared/services/route.service';
import { StopTimeService } from '../../shared/services/stop-time.service';
import { StopService } from '../../shared/services/stop.service';
import { TripService } from '../../shared/services/trip.service';
import { MinutesPipe } from '../../shared/pipes/minutes.pipe';

@Component({
  selector: 'app-route',
  imports: [MatSelectModule, CommonModule, MatTableModule, MinutesPipe],
  templateUrl: './route.component.html',
  styleUrl: './route.component.scss'
})
export class RouteComponent implements OnInit {
  @Input() route_short_name: string;

  private tripService = inject(TripService);
  private routeService = inject(RouteService);
  private stopTimeService = inject(StopTimeService);
  private stopService = inject(StopService);

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
          if (!uniqueHeadsigns.has(trip.trip_headsign)) {
            uniqueHeadsigns.add(trip.trip_headsign);
            return true;
          }
          return false;
        });
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
        map((stopTimes) => stopTimes.sort((st1, st2) => st1.arrival_time.seconds - st2.arrival_time.seconds)),
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
