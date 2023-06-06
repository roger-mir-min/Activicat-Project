import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'icon'
})
export class IconPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'ortografia':
        return '<i class="fa-solid fa-user-pen"></i>';
      case 'gramàtica':
        return '<i class="fa-solid fa-gears"></i>';
      case 'dialectes':
        return '<i class="fa-solid fa-earth-europe"></i>';
      case 'literatura':
        return '<i class="fa-solid fa-book"></i>';
      default:
        return '';
    }
  }
}

