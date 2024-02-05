import { Injectable } from '@angular/core';
import { PoComboFilter, PoComboOption } from '@po-ui/ng-components';
import { Observable, map } from 'rxjs';
import { ApiService } from '../api.service';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

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

@Injectable({
	providedIn: 'root'
  })
export class MatriculaComboService implements PoComboFilter {

	private	endpoint: string = 'FRETAMENTOURBANO/matricula'	

	constructor(private apiService: ApiService,
		private route: ActivatedRoute,) { }

	getFilteredData(params: any, filterParams?: any): Observable<AdaptorReturnStruct[]> {

		let httpParams = new HttpParams();

		let filter: string = '';

		if (params.value != '')
			filter = "AND UPPER(RA_MAT) LIKE '%" + params.value + "%' OR UPPER(RA_CIC) LIKE '%" + params.value + "%'OR UPPER(RA_NOME) LIKE '%" + params.value + "%'"

		httpParams = httpParams.append('FILTER', filter);
		httpParams = httpParams.append('FIELDEMPTY', true)
		httpParams = httpParams.append('FIELDVIRTUAL', true)

		return this.apiService.get(this.endpoint, httpParams).pipe(map((response: any) => {

			const items: AdaptorReturnStruct[] = [];
			let hasNext = true;

			response.Matricula.forEach((resource: any) => {

				let itemReturn: AdaptorReturnStruct = new AdaptorReturnStruct();

				itemReturn.value = resource.matricula
				itemReturn.label = resource.nome
				itemReturn.cpf = resource.cic

				items.push(itemReturn)

				if ((params.page * params.pageSize) >= response.total) {

					hasNext = false;

				}

			})

			return items

		}))

	}

	getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {

		let params = new HttpParams();
		let filter: string = `AND RA_MAT='${value}'`;

		if (filterParams != undefined){
			filter += ' AND ' + filterParams
		}
		params = params.append('FILTER', filter)

		return this.apiService.get(this.endpoint, params).pipe(map((response: any) => {

			let itemReturn = new AdaptorReturnStruct();

			itemReturn.value = response.Matricula[0].matricula
			itemReturn.label = response.Matricula[0].nome
			itemReturn.cpf = response.Matricula[0].cic

			return itemReturn

		}))

	}
}

/**
 * localComboService
 * Utilizado no combo de Local
 */
@Injectable({
	providedIn: 'root'
})
export class localComboService implements PoComboFilter {

	private	endpoint: string = 'FRETAMENTOURBANO/local'	

	constructor(private apiService: ApiService) { }

	getFilteredData(params: any, filterParams?: any): Observable<FilterComboStruct[]> {

		let httpParams = new HttpParams();
		let filter: string = '';

		if (filterParams) {
			filter = filterParams
		}		

		if (params.value != '') {
			filter = " AND (UPPER(GI1_COD) LIKE UPPER('%" + params.value + "%') OR " +
				" UPPER(GI1_DESCRI) LIKE UPPER('%" + params.value + "%') ) "
		}

		httpParams = httpParams.append('filter', filter);

		return this.apiService.get(this.endpoint, httpParams).pipe(map((response: any) => {

			const items: FilterComboStruct[] = [];
			let hasNext = true;

			response.Localidade.forEach((resource: any) => {

				let itemReturn: FilterComboStruct = new FilterComboStruct();

				itemReturn.value = resource.codLocal
				itemReturn.label = resource.descLocal
				itemReturn.desc = resource.codMuni

				items.push(itemReturn)

				if ((params.page * params.pageSize) >= response.total) {
					hasNext = false;
				}
			})
			return items
		}))

	}

	getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {

		let params = new HttpParams();

		let filter: string = ``;

		params = params.append('FILTER', filter)

		return this.apiService.get(this.endpoint, params).pipe(map((response: any) => {

			let itemReturn = new FilterComboStruct();

			itemReturn.value = response.codLocal
			itemReturn.label = response.descLocal
			itemReturn.desc = response.codMuni

			return itemReturn

		}))

	}
}

/**
 * muniComboService
 * Utilizado no combo de municipio
 */
@Injectable({
	providedIn: 'root'
})
export class muniComboService implements PoComboFilter {

	private	endpoint: string = 'FRETAMENTOURBANO/municipio'	

	constructor(private apiService: ApiService) { }

	getFilteredData(params: any, filterParams: any): Observable<FilterComboStruct[]> {

		let httpParams = new HttpParams();
		let filter: string = '';

		if (filterParams) {
			filter = filterParams;
		}		

		if (params.value != '')
			filter = " AND (UPPER(GI1_CDMUNI) LIKE UPPER('%" + params.value + "%') OR " +
				" UPPER(GI1_DSMUNI) LIKE UPPER('%" + params.value + "%') ) "

		httpParams = httpParams.append('FILTER', filter);

		return this.apiService.get(this.endpoint, httpParams).pipe(map((response: any) => {

			const items: FilterComboStruct[] = [];
			let hasNext = true;

			response.Municipio.forEach((resource: any) => {

				let itemReturn: FilterComboStruct = new FilterComboStruct();

				itemReturn.value = resource.codMuni
				itemReturn.label = resource.descMuni
				itemReturn.desc = resource.uf

				items.push(itemReturn)

				if ((params.page * params.pageSize) >= response.total) {
					hasNext = false;
				}
			})
			return items
		}))

	}

	getObjectByValue(value: string | number): Observable<PoComboOption> {

		let params = new HttpParams();
		return this.apiService.get(this.endpoint, params).pipe(map((response: any) => {

			let itemReturn = new AdaptorReturnStruct();

			itemReturn.value = ''
			itemReturn.label = ''
			itemReturn.cpf =  ''

			return itemReturn

		}))

	}
}