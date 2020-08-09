import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelToSpace'
})
export class CamelToSpacePipe implements PipeTransform {

  transform(value: string): string {
    if (typeof(value) !== "string") {
      return value;
    }

    let words = value.split(/(?=[A-Z])/);
    return words.join(' ');
  }

}
