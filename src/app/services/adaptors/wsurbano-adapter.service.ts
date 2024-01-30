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

