import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterValues'
})
export class FilterValuesPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }

    let data = items.filter((item) => item.type.indexOf(filter) !== -1);
    let value = data.reduce((a, b) => a + (b['value'] || 0), 0);

    return value;
  }
}
