import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'hours',
})
export class HoursPipe implements PipeTransform {
  transform(hoursRaw: number): string {
    return hoursRaw.toString().padStart(2, '0');
  }
}