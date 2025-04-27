import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
@Pipe({
  name: 'minutes',
})
export class MinutesPipe implements PipeTransform {
  transform(timestamp: Timestamp): string {
    return timestamp.toDate().getMinutes().toString().padStart(2, '0');
  }
}