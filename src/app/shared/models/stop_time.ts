export interface StopTime {
  trip_id: string;
  arrival_time: Date;
  departure_time: Date;
  stop_id: number;
  stop_sequence: number;
  pickup_type: number;
  drop_off_type: number;
  shape_dist_travele: number;
}