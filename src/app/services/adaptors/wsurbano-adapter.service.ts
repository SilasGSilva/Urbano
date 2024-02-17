import { Injectable } from '@angular/core';
import { PoComboFilter, PoComboOption, PoLookupFilter, PoLookupFilteredItemsParams } from '@po-ui/ng-components';
import { Observable, map } from 'rxjs';
import { ApiService } from '../api.service';
import { HttpParams, HttpClient } from '@angular/common/http';

/**
 * Todos os combos que apontam para API
 */

/**
 * Estrutura de Retorno do Adaptor. Fixado para nÃ£o haver manipulaÃ§Ã£o ou inclusÃ£o de novos elementos
 * Sem que o desenvolvedor tenha de alterar aqui.
 * @
 * Ao alterar essa classe, verificar os locais aonde Ã© utilizado o adaptor.
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

export class PedagioComboStruct implements PoComboOption {
	label: string = '';
	value: string = '';
	desc: string = '';
}

export class ValorComboStruct implements PoComboOption {
	label: string = '';
	value: string = '';
	desc: string = '';
}

export class LocalidadePoLookUpService implements PoComboOption {
	label: string = '';
	value: string = '';
	desc: string = '';
}

export class ComboLocalidadeStruct {
	label: string;
	value: string;
	desc: string;
}

export class OrigemPoLookUpService {
	codLocal: string = '';
	local: string = '';
	municipio: string = '';
	bairro: string = '';
	endereco: string = '';
}

export class DestinoPoLookUpService {
	codLocal: string = '';
	local: string = '';
	municipio: string = '';
	bairro: string = '';
	endereco: string = '';
}

export class AssociarLinhasPoLookUpService {
	codLinha: string = '';
	linhas: string = '';
}

@Injectable({
	providedIn: 'root',
})
export class MatriculaComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/matricula';

	constructor(private apiService: ApiService) { }
	getFilteredData(params: any, filterParams?: any): Observable<AdaptorReturnStruct[]> {
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
	getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {
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
	getFilteredData(params: any, filterParams?: any): Observable<FilterComboStruct[]> {
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
	getFilteredData(params: any, filterParams: any): Observable<FilterComboStruct[]> {
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
	getFilteredData(params: any, filterParams: any): Observable<EstadoComboStruct[]> {
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
						" AND (UPPER(CC2_MUN) LIKE UPPER('" +
						params.value +
						"%') OR UPPER(CC2_CODMUN) LIKE UPPER('%" +
						params.value +
						"%')) ";
				} else {
					filter =
						" AND (UPPER(CC2_MUN) LIKE UPPER('" +
						params.value +
						"%') OR UPPER(CC2_CODMUN) LIKE UPPER('%" +
						params.value +
						"%')) ";
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

	getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {
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
	getFilteredData(params: any, filterParams?: any): Observable<TarifaComboStruct[]> {
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
	getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {
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
	getFilteredData(params: any, filterParams?: any): Observable<TarifaComboStruct[]> {
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
	getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {
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
	getFilteredItems(filteredParams: PoLookupFilteredItemsParams): Observable<any> {
		const { filterParams, advancedFilters, ...restFilteredItemsParams } = filteredParams;
		const params = {
			...restFilteredItemsParams,
			...filterParams,
			...advancedFilters,
		};
		return this._http.get(this.endpoint, params);
	}
}

// ##### PEDÃ�GIOS #####
// ##### COMBO PEDÃ�GIO #####

@Injectable({
	providedIn: 'root',
})
export class PedagioComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) { }

	getFilteredData(params: any, filterParams?: any): Observable<PedagioComboStruct[]> {
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
				const items: PedagioComboStruct[] = [];
				let hasNext = true;

				response.Localidade.forEach((resource: any) => {
					let itemReturn: PedagioComboStruct = new PedagioComboStruct();

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

	getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {
		let params = new HttpParams();

		let filter: string = '';
		params = params.append('FILTER', filter);

		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				let itemReturn = new PedagioComboStruct();
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
export class ValorComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';
	constructor(private apiService: ApiService) { }
	getFilteredData(params: any, filterParams?: any): Observable<ValorComboStruct[]> {
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
				const items: ValorComboStruct[] = [];
				let hasNext = true;
				response.Localidade.forEach((resource: any) => {
					let itemReturn: ValorComboStruct = new ValorComboStruct();
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

	getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {
		let params = new HttpParams();

		let filter: string = ``;

		params = params.append('FILTER', filter);

		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				let itemReturn = new ValorComboStruct();

				itemReturn.value = response.codLocal;
				itemReturn.label = response.descLocal;
				itemReturn.desc = response.codMuni;
				return itemReturn;
			})
		);
	}
}

// ##### TELA DE SEÃ‡Ã•ES #####

// ##### COMBO SEÃ‡Ã•ES #####
@Injectable({
	providedIn: 'root',
})
export class SecaoComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) { }

	getFilteredData(params: any, filterParams?: any): Observable<TarifaComboStruct[]> {
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
	getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {
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

//  ##### COMBO LINHAS #####
@Injectable({
	providedIn: 'root',
})
export class LinhasComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) { }

	getFilteredData(params: any, filterParams?: any): Observable<TarifaComboStruct[]> {
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

	getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {
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

//  ##### COMBO STATUS #####

@Injectable({
	providedIn: 'root',
})
export class StatusComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) { }

	getFilteredData(params: any, filterParams?: any): Observable<TarifaComboStruct[]> {
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

	getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {
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
export class LocalidadeComboService implements PoComboFilter {
	private endpoint: string = 'fwmodel/GTPA001';

	constructor(private apiService: ApiService) { }

	getFilteredData(params: any, filterParams?: any): Observable<ComboLocalidadeStruct[]> {
		let httpParams = new HttpParams();
		let filter: string = '';

		params.STARTINDEX = params.page * params.pageSize - 9;
		params.FIELDVIRTUAL = true;
		params.FIELDEMPTY = true;

		if (filterParams) {
			filter = filterParams;
		}

		if (params.value != '') {
			filter =
				" (UPPER(GI1_COD) LIKE UPPER('%" +
				params.value +
				"%') OR " +
				" UPPER(GI1_DESCRI) LIKE UPPER('%" +
				params.value +
				"%') ) ";
		}

		httpParams = httpParams.append('filter', filter);
		httpParams = httpParams.append('FIELDEMPTY', true);
		httpParams = httpParams.append('FIELDVIRTUAL', true);

		return this.apiService.get(this.endpoint, httpParams).pipe(
			map((response: any) => {
				const items: ComboLocalidadeStruct[] = [];
				let hasNext = true;
				response.resources.forEach((resource: any) => {
					let itemReturn: ComboLocalidadeStruct = new ComboLocalidadeStruct();
					const tipoLocalidadeMap = {
						'1': 'PONTO DE RECOLHE',
						'2': 'GARAGEM',
					};
					// Assegura que o valor existe antes de acessá-lo
					let field = resource.models[0].fields.find(field => field.id == 'GI1_TPLOC');
					let codigoTipoLocalidade = field ? field.value : '';

					// Convertendo o valor para a descrição correspondente
					let descricaoTipoLocalidade = '';
					if (codigoTipoLocalidade && codigoTipoLocalidade.includes('1') && codigoTipoLocalidade.includes('2')) {
						descricaoTipoLocalidade = codigoTipoLocalidade
							.split('')
							.map(codigo => tipoLocalidadeMap[codigo])
							.join(' - ');
					} else if (codigoTipoLocalidade) {
						descricaoTipoLocalidade = tipoLocalidadeMap[codigoTipoLocalidade] || '';
					}

					itemReturn.label = resource.models[0].fields.find(field => field.id == 'GI1_DESCRI')?.value;
					itemReturn.value = resource.models[0].fields.find(field => field.id == 'GI1_COD')?.value;
					itemReturn.desc = descricaoTipoLocalidade;

					items.push(itemReturn);
					if (params.page * params.pageSize >= response.total) {
						hasNext = false;
					}
				});
				return items;
			})
		);
	}

	getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {
		let params = new HttpParams();
		let filter: string = `GI1_COD='${value}'`;

		if (filterParams != undefined) {
			filter += ' AND ' + filterParams;
		}
		params = params.append('FILTER', filter);

		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				let itemReturn = new AdaptorReturnStruct();
				itemReturn.value = response.resources[0].models[0].fields.find(field => field.id == 'GI1_COD')?.value;
				itemReturn.label = response.resources[0].models[0].fields.find(field => field.id == 'GI1_DESCRI')?.value;

				return itemReturn;
			})
		);
	}
}
@Injectable({
	providedIn: 'root',
})
export class poLookUpOrigem implements PoLookupFilter {
	private endpoint: string = 'fwmodel/GTPA001';

	constructor(private apiService: ApiService) { }

	getFilteredItems(filteredParams: PoLookupFilteredItemsParams): Observable<any> {
		const { filterParams, advancedFilters, ...restFilteredItemsParams } = filteredParams;
		let params = {
			...restFilteredItemsParams,
			...filterParams,
			...advancedFilters,
		};

		params.STARTINDEX = params.page * params.pageSize - 9;

		if (params.filter != '') {
			params.filter = "GI1_COD LIKE '%" + params.filter + "%' OR GI1_DESCRI LIKE '%" + params.filter + "%'";
		}

		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				let items: OrigemPoLookUpService[] = [];
				let hasNext = true;

				response.resources.forEach(resource => {
					let itemReturn: OrigemPoLookUpService = new OrigemPoLookUpService();

					itemReturn.codLocal = resource.models[0].fields.find(field => field.id === 'GI1_COD').value;

					itemReturn.local = resource.models[0].fields.find(field => field.id === 'GI1_DESCRI').value;

					items.push(itemReturn);

					if (params.page * params.pageSize >= response.total) {
						hasNext = false;
					}
				});

				return { items: items, hasNext: hasNext };
			})
		);
	}

	getObjectByValue(value: any): Observable<OrigemPoLookUpService> {
		let params = new HttpParams();

		let filter: string = `GI1_COD='${value}'`;

		params = params.append('FILTER', filter);
		params = params.append('FIELDEMPTY', true);
		params = params.append('FIELDVIRTUAL', true);

		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				let itemReturn = new OrigemPoLookUpService();

				response.resources.forEach(resource => {
					itemReturn.codLocal = resource.models[0].fields.find(field => field.id == 'GI1_COD').value;

					itemReturn.local = resource.models[0].fields.find(field => field.id == 'GI1_DESCRI').value;

					itemReturn.municipio = resource.models[0].fields.find(field => field.id == 'GI1_DESCRI').value;

					itemReturn.bairro = resource.models[0].fields.find(field => field.id == 'GI1_DESCRI').value;

					itemReturn.endereco = resource.models[0].fields.find(field => field.id == 'GI1_DESCRI').value;
				});

				return itemReturn;
			})
		);
	}
}

// ##### LookUp Destino #####
@Injectable({
	providedIn: 'root',
})
export class poLookUpDestino implements PoLookupFilter {
	private endpoint: string = 'fwmodel/GTPA001';

	constructor(private apiService: ApiService) { }

	getFilteredItems(filteredParams: PoLookupFilteredItemsParams): Observable<any> {
		const { filterParams, advancedFilters, ...restFilteredItemsParams } = filteredParams;
		let params = {
			...restFilteredItemsParams,
			...filterParams,
			...advancedFilters,
		};

		params.STARTINDEX = params.page * params.pageSize - 9;

		if (params.filter != '') {
			params.filter = "GI1_COD LIKE '%" + params.filter + "%' OR GI1_DESCRI LIKE '%" + params.filter + "%'";
		}

		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				let items: DestinoPoLookUpService[] = [];
				let hasNext = true;

				response.resources.forEach(resource => {
					let itemReturn: DestinoPoLookUpService = new DestinoPoLookUpService();

					itemReturn.codLocal = resource.models[0].fields.find(field => field.id === 'GI1_COD').value;

					itemReturn.local = resource.models[0].fields.find(field => field.id === 'GI1_DESCRI').value;

					items.push(itemReturn);

					if (params.page * params.pageSize >= response.total) {
						hasNext = false;
					}
				});

				return { items: items, hasNext: hasNext };
			})
		);
	}

	getObjectByValue(value: any): Observable<DestinoPoLookUpService> {
		let params = new HttpParams();

		let filter: string = `GI1_COD='${value}'`;

		params = params.append('FILTER', filter);
		params = params.append('FIELDEMPTY', true);
		params = params.append('FIELDVIRTUAL', true);

		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				let itemReturn = new DestinoPoLookUpService();

				response.resources.forEach(resource => {
					itemReturn.codLocal = resource.models[0].fields.find(field => field.id == 'GI1_COD').value;

					itemReturn.local = resource.models[0].fields.find(field => field.id == 'GI1_DESCRI').value;

					itemReturn.municipio = resource.models[0].fields.find(field => field.id == 'GI1_DESCRI').value;

					itemReturn.bairro = resource.models[0].fields.find(field => field.id == 'GI1_DESCRI').value;

					itemReturn.endereco = resource.models[0].fields.find(field => field.id == 'GI1_DESCRI').value;
				});

				return itemReturn;
			})
		);
	}
}

// ##### LookUp Associar Linhas #####
@Injectable({
	providedIn: 'root',
})
export class poLookUpAssociarLinhas implements PoLookupFilter {
	private endpoint: string = 'fwmodel/GTPA001';

	constructor(private apiService: ApiService) { }

	getFilteredItems(filteredParams: PoLookupFilteredItemsParams): Observable<any> {
		const { filterParams, advancedFilters, ...restFilteredItemsParams } = filteredParams;
		let params = {
			...restFilteredItemsParams,
			...filterParams,
			...advancedFilters,
		};

		params.STARTINDEX = params.page * params.pageSize - 9;

		if (params.filter != '') {
			params.filter = "GI1_COD LIKE '%" + params.filter + "%' OR GI1_DESCRI LIKE '%" + params.filter + "%'";
		}

		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				let items: AssociarLinhasPoLookUpService[] = [];
				let hasNext = true;

				response.resources.forEach(resource => {
					let itemReturn: AssociarLinhasPoLookUpService = new AssociarLinhasPoLookUpService();

					itemReturn.codLinha = resource.models[0].fields.find(field => field.id === 'GI1_COD').value;

					itemReturn.linhas = resource.models[0].fields.find(field => field.id === 'GI1_DESCRI').value;

					items.push(itemReturn);

					if (params.page * params.pageSize >= response.total) {
						hasNext = false;
					}
				});
				return { items: items, hasNext: hasNext };
			})
		);
	}

	getObjectByValue(value: any): Observable<AssociarLinhasPoLookUpService> {
		let params = new HttpParams();

		let filter: string = `GI1_COD='${value}'`;

		params = params.append('FILTER', filter);
		params = params.append('FIELDEMPTY', true);
		params = params.append('FIELDVIRTUAL', true);
		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				let itemReturn = new AssociarLinhasPoLookUpService();
				response.resources.forEach(resource => {
					itemReturn.codLinha = resource.models[0].fields.find(field => field.id == 'GI1_COD').value;
					itemReturn.linhas = resource.models[0].fields.find(field => field.id == 'GI1_DESCRI').value;
				});
				return itemReturn;
			})
		);
	}
}

@Injectable({
	providedIn: 'root',
})
export class PrefixoComboService implements PoComboFilter {
	private endpoint: string = 'fwmodel/GTPU003';

	constructor(private apiService: ApiService) { }

	getFilteredData(params: any, filterParams?: any): Observable<FilterComboStruct[]> {
		let httpParams = new HttpParams();
		let filter: string = '';
		if (filterParams) {
			filter = filterParams;
		}

		if (params.value != '') {
			filter =
				" UPPER(H6V_PREFIX) LIKE UPPER('%" +
				params.value +
				"%') OR " +
				" UPPER(H6V_DESCRI) LIKE UPPER('%" +
				params.value +
				"%') ";
		}
		httpParams = httpParams.append('filter', filter);

		// return of(items);
		return this.apiService.get(this.endpoint, httpParams).pipe(
			map((response: any) => {
				const items: FilterComboStruct[] = [];
				let hasNext = true;

				response.resources.forEach((resource: any) => {
					let itemReturn: FilterComboStruct = new FilterComboStruct();

					itemReturn.value = resource.models[0].fields.find(field => field.id === 'H6V_PREFIX').value;
					itemReturn.label = resource.models[0].fields.find(field => field.id === 'H6V_DESCRI').value;
					itemReturn.desc = resource.models[0].fields.find(field => field.id === 'H6V_PREFIX').value;

					items.push(itemReturn);

					if (params.page * params.pageSize >= response.total) {
						hasNext = false;
					}
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

@Injectable({
	providedIn: 'root',
})
export class OrigemComboService implements PoComboFilter {
	private endpoint: string = 'fwmodel/GTPU003';

	constructor(private apiService: ApiService) { }

	getFilteredData(params: any, filterParams?: any): Observable<FilterComboStruct[]> {
		let httpParams = new HttpParams();
		let filter: string = '';
		if (filterParams) {
			filter = filterParams;
		}

		if (params.value != '') {
			filter =
				" UPPER(H6V_ORIGEM) LIKE UPPER('%" +
				params.value +
				"%') OR " +
				" UPPER(H6V_ORIDES) LIKE UPPER('%" +
				params.value +
				"%') ";
		}
		httpParams = httpParams.append('filter', filter);

		// return of(items);
		return this.apiService.get(this.endpoint, httpParams).pipe(
			map((response: any) => {
				const items: FilterComboStruct[] = [];
				let hasNext = true;

				response.resources.forEach((resource: any) => {
					let itemReturn: FilterComboStruct = new FilterComboStruct();

					itemReturn.value = resource.models[0].fields.find(field => field.id === 'H6V_ORIGEM').value;
					itemReturn.label = resource.models[0].fields.find(field => field.id === 'H6V_ORIDES').value;
					itemReturn.desc = resource.models[0].fields.find(field => field.id === 'H6V_ORIGEM').value;

					items.push(itemReturn);

					if (params.page * params.pageSize >= response.total) {
						hasNext = false;
					}
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

@Injectable({
	providedIn: 'root',
})
export class DestinoComboService implements PoComboFilter {
	private endpoint: string = 'fwmodel/GTPU003';

	constructor(private apiService: ApiService) { }

	getFilteredData(params: any, filterParams?: any): Observable<FilterComboStruct[]> {
		let httpParams = new HttpParams();
		let filter: string = '';
		if (filterParams) {
			filter = filterParams;
		}

		if (params.value != '') {
			filter =
				" UPPER(H6V_DESTIN) LIKE UPPER('%" +
				params.value +
				"%') OR " +
				" UPPER(H6V_DESTDE) LIKE UPPER('%" +
				params.value +
				"%') ";
		}
		httpParams = httpParams.append('filter', filter);

		// return of(items);
		return this.apiService.get(this.endpoint, httpParams).pipe(
			map((response: any) => {
				const items: FilterComboStruct[] = [];
				let hasNext = true;

				response.resources.forEach((resource: any) => {
					let itemReturn: FilterComboStruct = new FilterComboStruct();

					itemReturn.value = resource.models[0].fields.find(field => field.id === 'H6V_DESTIN').value;
					itemReturn.label = resource.models[0].fields.find(field => field.id === 'H6V_DESTDE').value;
					itemReturn.desc = resource.models[0].fields.find(field => field.id === 'H6V_DESTIN').value;

					items.push(itemReturn);

					if (params.page * params.pageSize >= response.total) {
						hasNext = false;
					}
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

@Injectable({
	providedIn: 'root',
})
export class OrgaoRegulamentadorComboService implements PoComboFilter {
	private endpoint: string = 'fwmodel/GTPA000';

	constructor(private apiService: ApiService) { }

	getFilteredData(params: any, filterParams?: any): Observable<FilterComboStruct[]> {
		let httpParams = new HttpParams();
		let filter: string = '';
		if (filterParams) {
			filter = filterParams;
		}

		if (params.value != '') {
			filter =
				" UPPER(GI0_COD) LIKE UPPER('%" +
				params.value +
				"%') OR " +
				" UPPER(GI0_DESCRI) LIKE UPPER('%" +
				params.value +
				"%') ";
		}
		httpParams = httpParams.append('filter', filter);

		// return of(items);
		return this.apiService.get(this.endpoint, httpParams).pipe(
			map((response: any) => {
				const items: FilterComboStruct[] = [];
				let hasNext = true;

				response.resources.forEach((resource: any) => {
					let itemReturn: FilterComboStruct = new FilterComboStruct();

					itemReturn.value = resource.models[0].fields.find(field => field.id === 'GI0_COD').value;
					itemReturn.label = resource.models[0].fields.find(field => field.id === 'GI0_DESCRI').value;

					items.push(itemReturn);

					if (params.page * params.pageSize >= response.total) {
						hasNext = false;
					}
				});
				return items;
			})
		);
	}

	getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {
		let params = new HttpParams();
		let filter: string = `GI0_COD='${value}'`;

		if (filterParams != undefined) {
			filter += ' AND ' + filterParams;
		}
		params = params.append('FILTER', filter);

		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				let itemReturn = new FilterComboStruct();
				itemReturn.value = response.resources[0].models[0].fields.find(field => field.id == 'GI0_COD')?.value;
				itemReturn.label = response.resources[0].models[0].fields.find(field => field.id == 'GI0_DESCRI')?.value;

				return itemReturn;
			})
		);
	}
}

@Injectable({
	providedIn: 'root',
})
export class PagarComboService implements PoComboFilter {
	private endpoint: string = 'fwmodel/GTPU002';

	constructor(private apiService: ApiService) { }

	getFilteredData(params: any, filterParams?: any): Observable<FilterComboStruct[]> {
		let httpParams = new HttpParams();
		let filter: string = '';
		if (filterParams) {
			filter = filterParams;
		}

		if (params.value != '') {
			filter =
				" UPPER(H6S_CODIGO) LIKE UPPER('%" +
				params.value +
				"%') OR " +
				" UPPER(H6S_DESCRI) LIKE UPPER('%" +
				params.value +
				"%') ";
		}
		httpParams = httpParams.append('filter', filter);

		// return of(items);
		return this.apiService.get(this.endpoint, httpParams).pipe(
			map((response: any) => {
				const items: FilterComboStruct[] = [];

				response.resources.forEach((resource: any) => {
					let itemReturn: FilterComboStruct = new FilterComboStruct();

					itemReturn.value = resource.models[0].fields.find(field => field.id === 'H6S_CODIGO').value;
					itemReturn.label = resource.models[0].fields.find(field => field.id === 'H6S_DESCRI').value;

					items.push(itemReturn);

				});
				return items;
			})
		);
	}

	getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {
		let params = new HttpParams();
		let filter: string = `H6S_CODIGO='${value}'`;

		if (filterParams != undefined) {
			filter += ' AND ' + filterParams;
		}
		params = params.append('FILTER', filter);

		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				let itemReturn = new FilterComboStruct();
				itemReturn.value = response.resources[0].models[0].fields.find(field => field.id == 'H6S_CODIGO')?.value;
				itemReturn.label = response.resources[0].models[0].fields.find(field => field.id == 'H6S_DESCRI')?.value;

				return itemReturn;
			})
		);
	}
}

@Injectable({
	providedIn: 'root',
})
export class CategoriaComboService implements PoComboFilter {
	private endpoint: string = 'fwmodel/GTPA011';

	constructor(private apiService: ApiService) { }

	getFilteredData(params: any, filterParams?: any): Observable<FilterComboStruct[]> {
		let httpParams = new HttpParams();
		let filter: string = '';
		if (filterParams) {
			filter = filterParams;
		}

		if (params.value != '') {
			filter =
				" UPPER(GYR_CODIGO) LIKE UPPER('%" +
				params.value +
				"%') OR " +
				" UPPER(GYR_DESCRI) LIKE UPPER('%" +
				params.value +
				"%') ";
		}
		httpParams = httpParams.append('filter', filter);

		// return of(items);
		return this.apiService.get(this.endpoint, httpParams).pipe(
			map((response: any) => {
				const items: FilterComboStruct[] = [];

				response.resources.forEach((resource: any) => {
					let itemReturn: FilterComboStruct = new FilterComboStruct();

					itemReturn.value = resource.models[0].fields.find(field => field.id === 'GYR_CODIGO').value;
					itemReturn.label = resource.models[0].fields.find(field => field.id === 'GYR_DESCRI').value;

					items.push(itemReturn);
				});
				return items;
			})
		);
	}

	getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {
		let params = new HttpParams();
		let filter: string = `GYR_CODIGO='${value}'`;

		if (filterParams != undefined) {
			filter += ' AND ' + filterParams;
		}
		params = params.append('FILTER', filter);

		return this.apiService.get(this.endpoint, params).pipe(
			map((response: any) => {
				let itemReturn = new FilterComboStruct();
				itemReturn.value = response.resources[0].models[0].fields.find(field => field.id == 'GYR_CODIGO')?.value;
				itemReturn.label = response.resources[0].models[0].fields.find(field => field.id == 'GYR_DESCRI')?.value;

				return itemReturn;
			})
		);
	}
}



