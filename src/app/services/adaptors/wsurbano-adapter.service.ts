import { Injectable } from '@angular/core';
import {
	PoComboFilter,
	PoComboOption,
	PoLookupFilter,
	PoLookupFilteredItemsParams,
} from '@po-ui/ng-components';
import { Observable, map } from 'rxjs';
import { ApiService } from '../api.service';
import { HttpParams, HttpClient } from '@angular/common/http';

/**
 * Todos os combos que apontam para API
 */

/**
 * Estrutura de Retorno do Adaptor. Fixado para não haver manipulação ou inclusão de novos elementos
 * Sem que o desenvolvedor tenha de alterar aqui.
 * @
 * Ao alterar essa classe, verificar os locais aonde é utilizado o adaptor.
 */
export class AdaptorReturnStruct implements PoComboOption {
	value: string = '';
	label: string = '';
	cpf: string = '';
}

export class FilterComboStruct implements PoComboOption {
	label: string = '';
	value: string = '';
	desc: string = '';
}

export class EstadoComboStruct implements PoComboOption {
	label: string = '';
	value: string = '';
	uf: string = '';
}

export class TarifaComboStruct implements PoComboOption {
	label: string = '';
	value: string = '';
	desc: string = '';
}

export class OrgaoConcessorPoLookUpService implements PoComboOption {
	label: string = '';
	value: string = '';
	desc: string = '';
}

@Injectable({
	providedIn: 'root',
})
export class MatriculaComboService implements PoComboFilter {
	
	private endpoint: string = 'FRETAMENTOURBANO/matricula';

	constructor(
		private apiService: ApiService	) { }

	getFilteredData(
		params: any,
		filterParams?: any
	): Observable<AdaptorReturnStruct[]> {
		let httpParams = new HttpParams();

		let filter: string = '';

		if (params.value != '')
			filter =
				"AND UPPER(RA_MAT) LIKE '%" +
				params.value +
				"%' OR UPPER(RA_CIC) LIKE '%" +
				params.value +
				"%'OR UPPER(RA_NOME) LIKE '%" +
				params.value +
				"%'";

		httpParams = httpParams.append('FILTER', filter);
		httpParams = httpParams.append('FIELDEMPTY', true);
		httpParams = httpParams.append('FIELDVIRTUAL', true);

		return this.apiService.get(this.endpoint, httpParams).pipe(
			map((response: any) => {
				const items: AdaptorReturnStruct[] = [];
				let hasNext = true;

				response.Matricula.forEach((resource: any) => {
					let itemReturn: AdaptorReturnStruct = new AdaptorReturnStruct();

					itemReturn.value = resource.matricula;
					itemReturn.label = resource.nome;
					itemReturn.cpf = resource.cic;

					items.push(itemReturn);

					if (params.page * params.pageSize >= response.total) {
						hasNext = false;
					}
				});

				return items;
			})
		);
	}

	getObjectByValue(
		value: string | number,
		filterParams?: any
	): Observable<PoComboOption> {
		let params = new HttpParams();

		let filter: string = `AND RA_MAT='${value}'`;

		if (filterParams != undefined) {
			filter += ' AND ' + filterParams;
		}
		params = params.append('FILTER', filter);

		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				let itemReturn = new AdaptorReturnStruct();
				itemReturn.value = response.Matricula[0].matricula;
				itemReturn.label = response.Matricula[0].nome;
				itemReturn.cpf = response.Matricula[0].cic;

				return itemReturn;
			})
		);
	}
}

/**
 * localComboService
 * Utilizado no combo de Local
 */
@Injectable({
	providedIn: 'root',
})
export class localComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) { }

	getFilteredData(
		params: any,
		filterParams?: any
	): Observable<FilterComboStruct[]> {
		let httpParams = new HttpParams();
		let filter: string = '';

		if (filterParams) {
			filter = filterParams;
		}

		if (params.value != '') {
			filter =
				" AND (UPPER(GI1_COD) LIKE UPPER('%" +
				params.value +
				"%') OR " +
				" UPPER(GI1_DESCRI) LIKE UPPER('%" +
				params.value +
				"%') ) ";
		}

		httpParams = httpParams.append('filter', filter);

		return this.apiService.get(this.endpoint, httpParams).pipe(
			map((response: any) => {
				const items: FilterComboStruct[] = [];
				let hasNext = true;

				response.Localidade.forEach((resource: any) => {
					let itemReturn: FilterComboStruct = new FilterComboStruct();
					itemReturn.value = resource.codLocal;
					itemReturn.label = resource.descLocal;
					itemReturn.desc = resource.codMuni;

					items.push(itemReturn);
				});
				return items;
			})
		);
	}

	getObjectByValue(): Observable<PoComboOption> {
		let params = new HttpParams();

		let filter: string = ``;

		params = params.append('FILTER', filter);

		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				let itemReturn = new FilterComboStruct();

				itemReturn.value = response.codLocal;
				itemReturn.label = response.descLocal;
				itemReturn.desc = response.codMuni;

				return itemReturn;
			})
		);
	}
}

/**
 * muniComboService
 * Utilizado no combo de municipio
 */
@Injectable({
	providedIn: 'root',
})
export class muniComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/municipio';

	constructor(private apiService: ApiService) { }

	getFilteredData(
		params: any,
		filterParams: any
	): Observable<FilterComboStruct[]> {
		let httpParams = new HttpParams();
		let filter: string = '';

		if (filterParams) {
			filter = filterParams;
		}

		if (params.value != '')
			filter =
				" AND (UPPER(GI1_CDMUNI) LIKE UPPER('%" +
				params.value +
				"%') OR " +
				" UPPER(GI1_DSMUNI) LIKE UPPER('%" +
				params.value +
				"%') ) ";

		httpParams = httpParams.append('FILTER', filter);

		return this.apiService.get(this.endpoint, httpParams).pipe(
			map((response: any) => {
				const items: FilterComboStruct[] = [];
				let hasNext = true;

				response.Municipio.forEach((resource: any) => {
					let itemReturn: FilterComboStruct = new FilterComboStruct();

					itemReturn.value = resource.codMuni;
					itemReturn.label = resource.descMuni;
					itemReturn.desc = resource.uf;

					items.push(itemReturn);
				});
				return items;
			})
		);
	}

	getObjectByValue(): Observable<PoComboOption> {
		let params = new HttpParams();
		return this.apiService.get(this.endpoint, params).pipe(
			map(() => {
				let itemReturn = new AdaptorReturnStruct();

				itemReturn.value = '';
				itemReturn.label = '';
				itemReturn.cpf = '';

				return itemReturn;
			})
		);
	}
}

/**
 * comboFormService
 * Utilizado no combo de municipio
 */
@Injectable({
	providedIn: 'root',
})
export class comboFormService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/estadoMun';
	private filterUf: string = '';

	constructor(private apiService: ApiService) { }

	getFilteredData(
		params: any,
		filterParams: any
	): Observable<EstadoComboStruct[]> {
		let httpParams = new HttpParams();
		let filter: string = '';

		if (typeof filterParams === 'boolean' && true) {
			httpParams = httpParams.set('lUf', filterParams);
			if (params.value != '') {
				filter = " AND (UPPER(CC2_EST) LIKE UPPER('%" + params.value + "%')) ";
			}
		} else {
			if (filterParams) {
				filter = filterParams;
			}

			if (params.value != '') {
				if (filter != '') {
					filter +=
						" AND (UPPER(CC2_MUN) LIKE UPPER('" + params.value + "%') OR UPPER(CC2_CODMUN) LIKE UPPER('%" + params.value + "%')) ";
				} else {
					filter = " AND (UPPER(CC2_MUN) LIKE UPPER('" + params.value + "%') OR UPPER(CC2_CODMUN) LIKE UPPER('%" + params.value + "%')) ";
				}
			}
		}

		httpParams = httpParams.append('FILTER', filter);

		return this.apiService.get(this.endpoint, httpParams).pipe(
			map((response: any) => {
				const items: EstadoComboStruct[] = [];

				response.EstadoMun.forEach((resource: any) => {
					let itemReturn: EstadoComboStruct = new EstadoComboStruct();

					if (typeof filterParams === 'boolean') {
						itemReturn.value = resource.uf;
						itemReturn.label = resource.uf;
						itemReturn.uf = resource.uf;
					} else {
						itemReturn.value = resource.codigo;
						itemReturn.label = resource.municipio;
						itemReturn.uf = resource.uf;
					}
					items.push(itemReturn);
				});
				return items;
			})
		);
	}

	getObjectByValue(
		value: string | number,
		filterParams?: any
	): Observable<PoComboOption> {
		let params = new HttpParams();
		let filter: string = ``;

		if (typeof filterParams === 'boolean' && filterParams) {
			params = params.set('lUf', filterParams);
			filter = `AND(UPPER(CC2_EST) LIKE UPPER('%${value}'))`;
		} else {
			filter = `AND(UPPER(CC2_CODMUN) LIKE UPPER('%${value}') ${this.filterUf} `;
		}

		params = params.append('FILTER', filter);

		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				let itemReturn = new EstadoComboStruct();

				if (typeof filterParams === 'boolean') {
					itemReturn.value = response.EstadoMun[0].uf;
					itemReturn.label = response.EstadoMun[0].uf;
					itemReturn.uf = response.EstadoMun[0].uf;
				} else {
					itemReturn.value = response.EstadoMun[0].codigo;
					itemReturn.label = response.EstadoMun[0].municipio;
					itemReturn.uf = response.EstadoMun[0].uf;
				}

				return itemReturn;
			})
		);
	}

	setFilterUf(value: string) {
		this.filterUf = value;
	}
}

@Injectable({
	providedIn: 'root',
})
export class TarifaComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) { }

	getFilteredData(
		params: any,
		filterParams?: any
	): Observable<TarifaComboStruct[]> {
		let httpParams = new HttpParams();
		let filter: string = '';

		if (filterParams) {
			filter = filterParams;
		}

		if (params.value != '') {
			filter =
				" AND (UPPER(GI1_COD) LIKE UPPER('%" +
				params.value +
				"%') OR " +
				" UPPER(GI1_DESCRI) LIKE UPPER('%" +
				params.value +
				"%') ) ";
		}

		httpParams = httpParams.append('filter', filter);

		let items: TarifaComboStruct[] = [];
		items = [
			{ label: '0001 - Tarifa 1', value: '0001', desc: 'Tarifa 1' },
			{ label: '0002 - Tarifa 2', value: '0002', desc: 'Tarifa 2' },
			{ label: '0003 - Tarifa 3', value: '0003', desc: 'Tarifa 3' },
		];

		// return of(items);
		return this.apiService.get(this.endpoint, httpParams).pipe(
			map((response: any) => {
				const items: FilterComboStruct[] = [];
				let hasNext = true;

				response.Localidade.forEach((resource: any) => {
					let itemReturn: FilterComboStruct = new FilterComboStruct();

					itemReturn.value = resource.codLocal;
					itemReturn.label = resource.descLocal;
					itemReturn.desc = resource.codMuni;

					items.push(itemReturn);

					if (params.page * params.pageSize >= response.total) {
						hasNext = false;
					}
				});
				return items;
			})
		);
	}

	getObjectByValue(
		value: string | number,
		filterParams?: any
	): Observable<PoComboOption> {
		let params = new HttpParams();

		let filter: string = ``;

		params = params.append('FILTER', filter);

		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				let itemReturn = new FilterComboStruct();

				itemReturn.value = response.codLocal;
				itemReturn.label = response.descLocal;
				itemReturn.desc = response.codMuni;

				return itemReturn;
			})
		);
	}
}

@Injectable({
	providedIn: 'root',
})
export class OrgaoConcessorComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) { }

	getFilteredData(
		params: any,
		filterParams?: any
	): Observable<TarifaComboStruct[]> {
		let httpParams = new HttpParams();
		let filter: string = '';

		if (filterParams) {
			filter = filterParams;
		}

		if (params.value != '') {
			filter =
				" AND (UPPER(GI1_COD) LIKE UPPER('%" +
				params.value +
				"%') OR " +
				" UPPER(GI1_DESCRI) LIKE UPPER('%" +
				params.value +
				"%') ) ";
		}

		httpParams = httpParams.append('filter', filter);

		return this.apiService.get(this.endpoint, httpParams).pipe(
			map((response: any) => {
				const items: FilterComboStruct[] = [];
				let hasNext = true;

				response.Localidade.forEach((resource: any) => {
					let itemReturn: FilterComboStruct = new FilterComboStruct();

					itemReturn.value = resource.codLocal;
					itemReturn.label = resource.descLocal;
					itemReturn.desc = resource.codMuni;

					items.push(itemReturn);

					if (params.page * params.pageSize >= response.total) {
						hasNext = false;
					}
				});
				return items;
			})
		);
	}

	getObjectByValue(
		value: string | number,
		filterParams?: any
	): Observable<PoComboOption> {
		let params = new HttpParams();

		let filter: string = ``;

		params = params.append('FILTER', filter);

		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				let itemReturn = new FilterComboStruct();

				itemReturn.value = response.codLocal;
				itemReturn.label = response.descLocal;
				itemReturn.desc = response.codMuni;

				return itemReturn;
			})
		);
	}
}

@Injectable({
	providedIn: 'root',
})
export class poLookUpOrgaoConcessor implements PoLookupFilter {
	// private endpoint: string = 'FRETAMENTOURBANO/local';
	private endpoint: string = 'https://po-sample-api.onrender.com/v1/heroes';

	constructor(
		private apiService: ApiService,
		private _http: HttpClient
	) { }

	getObjectByValue(value: any): Observable<any> {
		return this.apiService.get(this.endpoint, value);
	}

	getFilteredItems(
		filteredParams: PoLookupFilteredItemsParams
	): Observable<any> {
		const { filterParams, advancedFilters, ...restFilteredItemsParams } =
			filteredParams;
		const params = {
			...restFilteredItemsParams,
			...filterParams,
			...advancedFilters,
		};

		return this._http.get(this.endpoint, params);
	}
}

@Injectable({
	providedIn: 'root',
})
export class poLookUpFormasDePagamento implements PoLookupFilter {
	// private endpoint: string = 'FRETAMENTOURBANO/local';
	private endpoint: string = 'https://po-sample-api.onrender.com/v1/heroes';

	constructor(
		private apiService: ApiService,
		private _http: HttpClient
	) { }

	getObjectByValue(value: any): Observable<any> {
		return this.apiService.get(this.endpoint, value);
	}

	getFilteredItems(
		filteredParams: PoLookupFilteredItemsParams
	): Observable<any> {
		const { filterParams, advancedFilters, ...restFilteredItemsParams } =
			filteredParams;
		const params = {
			...restFilteredItemsParams,
			...filterParams,
			...advancedFilters,
		};

		return this._http.get(this.endpoint, params);
	}
}
