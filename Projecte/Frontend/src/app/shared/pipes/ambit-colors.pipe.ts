import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ambitColor'
})
export class AmbitColorPipe implements PipeTransform {
  transform(ambit: string): string {
    if (ambit === 'ortografia') {
      return 'text-ortografia-600';
    } else if (ambit === 'gramàtica') {
      return 'text-gramàtica-600';
    } else if (ambit === 'dialectes') {
      return 'text-dialectes-600';
    } else if (ambit === 'literatura') {
      return 'text-literatura-600';
    } else {
      return 'inherit';
    }
  }
}

