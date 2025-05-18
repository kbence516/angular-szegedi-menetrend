import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
@Pipe({
  name: 'hungarianDate',
})
export class HungarianDatePipe implements PipeTransform {
  transform(timestamp: Timestamp): string {
    return Intl.DateTimeFormat('hu-HU', {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    }).format(timestamp.toDate())
  }
}