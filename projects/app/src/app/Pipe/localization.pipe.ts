import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localization',
})
export class LocalizationPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
