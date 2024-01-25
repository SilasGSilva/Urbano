import { Injectable } from '@angular/core';
import { PoTableColumnSort, PoTableColumnSortType } from '@po-ui/ng-components';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  public sort(value: any, valueToCompare: any, sort: PoTableColumnSort) {
    const property = sort.column?.property;
    const type = sort.type;

    if (value[property!] < valueToCompare[property!]) {
      return type === PoTableColumnSortType.Ascending ? -1 : 1;
    }
    return type === PoTableColumnSortType.Ascending ? 1 : -1;
  }
}
