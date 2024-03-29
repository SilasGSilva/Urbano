import { Injectable } from '@angular/core';
import { PoComboFilter, PoComboOption, PoLookupFilter, PoLookupFilteredItemsParams } from '@po-ui/ng-components';
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


export class LocalidadePoLookUpService implements PoComboOption {
	label: string = '';
	value: string = '';
	desc: string = '';
}
export class PrefixoVeiculoFrotasComboStruct implements PoComboOption {
	label: string = '';
	value: string = '';
}

export class PlacaFrotasComboStruct implements PoComboOption {
	label: string = '';
	value: string = '';
}

export class LocalFrotasComboStruct implements PoComboOption {
	label: string = '';
	value: string = '';
}

export class StatusFrotasComboStruct implements PoComboOption {
	label: string = '';
	value: string = '';
}

export class ComboPadraoFrotasComboStruct implements PoComboOption {
	label: string = '';
	value: string = '';
}

export class ComboLocalidadeStruct {
	label: string;
	value: string;
	desc: string;
}


@Injectable({
	providedIn: 'root',
})
export class MatriculaComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/matricula';

	constructor(private apiService: ApiService) {}

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

	constructor(private apiService: ApiService) {}

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

	constructor(private apiService: ApiService) {}

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

	constructor(private apiService: ApiService) {}

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

// ##### PEDÁGIOS #####
// ##### COMBO PEDÁGIO #####
@Injectable({
	providedIn: 'root',
})
export class PedagioComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) {}

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

		let filter: string = ``;

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

	constructor(private apiService: ApiService) {}

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

// ##### TELA DE SEÇÕES #####

// ##### COMBO SEÇÕES #####
@Injectable({
	providedIn: 'root',
})
export class SecaoComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) {}

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

//  ##### COMBO LINHAS #####
@Injectable({
	providedIn: 'root',
})
export class LinhasComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) {}

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

	constructor(private apiService: ApiService) {}

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

// ##### TELA DET SEÇÕES #####

// ##### LookUp Origem #####
@Injectable({
	providedIn: 'root',
})
export class poLookUpOrigem implements PoLookupFilter {
	private endpoint: string = 'fwmodel/GTPA001';

	constructor(private apiService: ApiService) {}

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

	constructor(private apiService: ApiService) {}

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

	constructor(private apiService: ApiService) {}

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

// ##### TELA DE FROTAS #####

// ##### COMBO PREFIXO VEÍCULO | FROTAS #####
@Injectable({
	providedIn: 'root',
})
export class PrefixoVeiculoFrotasComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) {}

	getFilteredData(params: any, filterParams?: any): Observable<PrefixoVeiculoFrotasComboStruct[]> {
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
				const items: PrefixoVeiculoFrotasComboStruct[] = [];
				let hasNext = true;

				response.Localidade.forEach((resource: any) => {
					let itemReturn: PrefixoVeiculoFrotasComboStruct = new PrefixoVeiculoFrotasComboStruct();

					itemReturn.value = resource.codLocal;
					itemReturn.label = resource.descLocal;

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
				let itemReturn = new PrefixoVeiculoFrotasComboStruct();

				itemReturn.value = response.codLocal;
				itemReturn.label = response.descLocal;

				return itemReturn;
			})
		);
	}
}

// ##### COMBO PLACA | FROTAS #####
@Injectable({
	providedIn: 'root',
})
export class PlacaFrotasComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) {}

	getFilteredData(params: any, filterParams?: any): Observable<PlacaFrotasComboStruct[]> {
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
				const items: PlacaFrotasComboStruct[] = [];
				let hasNext = true;

				response.Localidade.forEach((resource: any) => {
					let itemReturn: PlacaFrotasComboStruct = new PlacaFrotasComboStruct();

					itemReturn.value = resource.codLocal;
					itemReturn.label = resource.descLocal;

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
				let itemReturn = new PlacaFrotasComboStruct();

				itemReturn.value = response.codLocal;
				itemReturn.label = response.descLocal;

				return itemReturn;
			})
		);
	}
}

// ##### COMBO LOCAL | FROTAS #####
@Injectable({
	providedIn: 'root',
})
export class LocalFrotasComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) {}

	getFilteredData(params: any, filterParams?: any): Observable<LocalFrotasComboStruct[]> {
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
				const items: LocalFrotasComboStruct[] = [];
				let hasNext = true;

				response.Localidade.forEach((resource: any) => {
					let itemReturn: LocalFrotasComboStruct = new LocalFrotasComboStruct();

					itemReturn.value = resource.codLocal;
					itemReturn.label = resource.descLocal;

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
				let itemReturn = new LocalFrotasComboStruct();

				itemReturn.value = response.codLocal;
				itemReturn.label = response.descLocal;

				return itemReturn;
			})
		);
	}
}

// ##### COMBO STATUS | FROTAS #####
@Injectable({
	providedIn: 'root',
})
export class StatusFrotasComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) {}

	getFilteredData(params: any, filterParams?: any): Observable<StatusFrotasComboStruct[]> {
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
				const items: StatusFrotasComboStruct[] = [];
				let hasNext = true;

				response.Localidade.forEach((resource: any) => {
					let itemReturn: StatusFrotasComboStruct = new StatusFrotasComboStruct();

					itemReturn.value = resource.codLocal;
					itemReturn.label = resource.descLocal;

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
				let itemReturn = new StatusFrotasComboStruct();

				itemReturn.value = response.codLocal;
				itemReturn.label = response.descLocal;

				return itemReturn;
			})
		);
	}
}

// ##### TELA DE DET FROTAS #####

// ##### COMBO CATEGORIA | FROTAS #####
@Injectable({
	providedIn: 'root',
})
export class CategoriaComboFrotasComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) {}

	getFilteredData(params: any, filterParams?: any): Observable<ComboPadraoFrotasComboStruct[]> {
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
				const items: ComboPadraoFrotasComboStruct[] = [];
				let hasNext = true;

				response.Localidade.forEach((resource: any) => {
					let itemReturn: ComboPadraoFrotasComboStruct = new ComboPadraoFrotasComboStruct();

					itemReturn.value = resource.codLocal;
					itemReturn.label = resource.descLocal;

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
				let itemReturn = new ComboPadraoFrotasComboStruct();

				itemReturn.value = response.codLocal;
				itemReturn.label = response.descLocal;

				return itemReturn;
			})
		);
	}
}

// ##### COMBO LOCAL | FROTAS #####
@Injectable({
	providedIn: 'root',
})
export class LocalComboFrotasComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) {}

	getFilteredData(params: any, filterParams?: any): Observable<ComboPadraoFrotasComboStruct[]> {
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
				const items: ComboPadraoFrotasComboStruct[] = [];
				let hasNext = true;

				response.Localidade.forEach((resource: any) => {
					let itemReturn: ComboPadraoFrotasComboStruct = new ComboPadraoFrotasComboStruct();

					itemReturn.value = resource.codLocal;
					itemReturn.label = resource.descLocal;

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
				let itemReturn = new ComboPadraoFrotasComboStruct();

				itemReturn.value = response.codLocal;
				itemReturn.label = response.descLocal;

				return itemReturn;
			})
		);
	}
}

// ##### COMBO VALIDADOR | FROTAS #####
@Injectable({
	providedIn: 'root',
})
export class ValidadorComboFrotasComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) {}

	getFilteredData(params: any, filterParams?: any): Observable<ComboPadraoFrotasComboStruct[]> {
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
				const items: ComboPadraoFrotasComboStruct[] = [];
				let hasNext = true;

				response.Localidade.forEach((resource: any) => {
					let itemReturn: ComboPadraoFrotasComboStruct = new ComboPadraoFrotasComboStruct();

					itemReturn.value = resource.codLocal;
					itemReturn.label = resource.descLocal;

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
				let itemReturn = new ComboPadraoFrotasComboStruct();

				itemReturn.value = response.codLocal;
				itemReturn.label = response.descLocal;

				return itemReturn;
			})
		);
	}
}

// ##### COMBO ROLETAS | FROTAS #####
@Injectable({
	providedIn: 'root',
})
export class RoletasComboFrotasComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) {}

	getFilteredData(params: any, filterParams?: any): Observable<ComboPadraoFrotasComboStruct[]> {
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
				const items: ComboPadraoFrotasComboStruct[] = [];
				let hasNext = true;

				response.Localidade.forEach((resource: any) => {
					let itemReturn: ComboPadraoFrotasComboStruct = new ComboPadraoFrotasComboStruct();

					itemReturn.value = resource.codLocal;
					itemReturn.label = resource.descLocal;

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
				let itemReturn = new ComboPadraoFrotasComboStruct();

				itemReturn.value = response.codLocal;
				itemReturn.label = response.descLocal;

				return itemReturn;
			})
		);
	}
}

// ##### COMBO TIPO DE DOCUMENTO | FROTAS #####
@Injectable({
	providedIn: 'root',
})
export class TipoDocumentoComboFrotasComboService implements PoComboFilter {
	private endpoint: string = 'FRETAMENTOURBANO/local';

	constructor(private apiService: ApiService) {}

	getFilteredData(params: any, filterParams?: any): Observable<ComboPadraoFrotasComboStruct[]> {
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
				const items: ComboPadraoFrotasComboStruct[] = [];
				let hasNext = true;

				response.Localidade.forEach((resource: any) => {
					let itemReturn: ComboPadraoFrotasComboStruct = new ComboPadraoFrotasComboStruct();

					itemReturn.value = resource.codLocal;
					itemReturn.label = resource.descLocal;

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
				let itemReturn = new ComboPadraoFrotasComboStruct();

				itemReturn.value = response.codLocal;
				itemReturn.label = response.descLocal;

				return itemReturn;
			})
		);
	}
}
