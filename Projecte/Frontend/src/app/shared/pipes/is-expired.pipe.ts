import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isExpired'
})
export class IsExpiredPipe implements PipeTransform {
  transform(value: any): boolean {
    const currentDate = Date.now();
    const finalDate = new Date(value).getTime();
    return finalDate < currentDate;
  }
}
