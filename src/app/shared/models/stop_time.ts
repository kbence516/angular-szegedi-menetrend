import { Timestamp } from "firebase/firestore";

export interface StopTime {
  trip_id: string;
  arrival_time: Timestamp;
  departure_time: Timestamp;
  stop_id: number;
  stop_sequence: number;
  pickup_type: number;
  drop_off_type: number;
  shape_dist_traveled: number;
}