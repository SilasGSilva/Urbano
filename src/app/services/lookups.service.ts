import { Injectable } from '@angular/core';
import { PoLookupFilter, PoLookupFilteredItemsParams, PoLookupResponseApi } from '@po-ui/ng-components';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';
import { HttpParams } from '@angular/common/http';

export class LookupStruct {
	value: string;
	label: string;
	$selected: boolean = false;
}
/*******************************************************************************
 * @name TarifasComboService
 * @description Combo de tarifas
 * @author   Serviços | Breno Gomes
 * @since    2024
 * @version  v1
 *******************************************************************************/
@Injectable()
export class FormaPagamentoComboService implements PoLookupFilter {
	private endpoint: string = 'fwmodel/GTPU001';

	constructor(private apiService: ApiService) {}

	getFilteredItems(filteredParams: PoLookupFilteredItemsParams): Observable<any> {
		let httpParams = new HttpParams();
		const { filterParams, advancedFilters, ...restFilteredItemsParams } = filteredParams;
		let params = { ...restFilteredItemsParams, ...filterParams, ...advancedFilters };
		let filter: string = '';
		params.STARTINDEX = params.page * params.pageSize - 9;
		if (params.filter != '') {
			filter +=
				"(UPPER(H6R_CODIGO) LIKE UPPER('%" +
				params.filter +
				"%') OR UPPER(H6R_DESCRI) LIKE UPPER('%" +
				params.filter +
				"%'))";
		}

		httpParams = httpParams.append('FILTER', filter);
		httpParams = httpParams.append('FIELDEMPTY', true);
		httpParams = httpParams.append('FIELDVIRTUAL', true);

		return this.apiService.get(this.endpoint, httpParams).pipe(
			map((response: any) => {
				let items: LookupStruct[] = [];
				let hasNext = true;
				response.resources.map((resource: any) => {
					let itemReturn: LookupStruct = new LookupStruct();

					(itemReturn.value = resource.models[0].fields.find((field: any) => field.id === 'H6R_CODIGO').value),
						(itemReturn.label = resource.models[0].fields.find((field: any) => field.id === 'H6R_DESCRI').value),
						items.push(itemReturn);
					if (params.page * params.pageSize >= response.total) {
						hasNext = false;
					}
				});
				return { items, hasNext: hasNext };
			})
		);
	}
	getObjectByValue(value: Array<any>, filterParams?: any): Observable<any> {
		let params = new HttpParams();

		let filter = `H6R_CODIGO in (${value})`;

		filter = filter.replace(/\(([^)]+)\)/g, p1 => {
			return p1.replace(/(\d+)/g, "'$1'");
		});

		params = params.append('FILTER', filter);

		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				const items: LookupStruct[] = [];
				response.resources.forEach((resource: any) => {
					items.push({
						value: resource.models[0].fields.find((field: any) => field.id === 'H6R_CODIGO').value,
						label: resource.models[0].fields.find((field: any) => field.id === 'H6R_DESCRI').value,
						$selected: true,
					});
				});
				return items;
			})
		);
	}
}
