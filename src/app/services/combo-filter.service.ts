import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { PoComboFilter, PoComboOption } from '@po-ui/ng-components';
import { ApiService } from './api.service';

export class PoComboStruct implements PoComboOption {
	label: string = '';
	value: string = '';
}
export class PoComboMatriculaStruct implements PoComboOption {
	label: string = '';
	value: string = '';
	matricula?: string = ''
}
/**
 * RecursoComboService
 * Utilizado no combo de tipo de recurso
 */
@Injectable()
export class RecursoComboService implements PoComboFilter {

	private endpoint: string = 'GTPA010'	

	constructor(private apiService: ApiService) { }

	getFilteredData(params: any): Observable<PoComboOption[]> {

		let httpParams = new HttpParams();
		let filter: string = '';

		if (params.value != ''){
			filter = "UPPER(GYK_CODIGO) LIKE UPPER('%" + params.value + "%') OR UPPER(GYK_DESCRI) LIKE UPPER('%" + params.value + "%') "
		}
		httpParams = httpParams.append('FILTER', filter);

		return this.apiService.get(this.endpoint, httpParams).pipe(map((response: any) => {

			const items: PoComboStruct[] = [];
			let hasNext = true;

			response.resources.forEach((resource : any) => {

				let itemReturn: PoComboStruct = new PoComboStruct();

				itemReturn.value = resource.models[0].fields.find((field : any) => field.id == 'GYK_CODIGO').value;
				itemReturn.label = resource.models[0].fields.find((field : any) => field.id == 'GYK_DESCRI').value;

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
		let filter: string = `GYK_CODIGO='${value}'`;

		params = params.append('FILTER', filter)

		return this.apiService.get(this.endpoint, params).pipe(map((response: any) => {

			let itemReturn = new PoComboStruct();

			itemReturn.value = response.models[0].fields.find((field : any) => field.id == 'GYK_CODIGO').value;
			itemReturn.label = response.models[0].fields.find((field : any) => field.id == 'GYK_DESCRI').value;

			return itemReturn
		}))
	}
}

/**
 * MatriculaComboService
 * Utilizado no combo de matricula
 */
@Injectable()
export class MatriculaComboService implements PoComboFilter {

	private endpoint: string = 'GTPA008'	

	constructor(private apiService: ApiService) { }

	getFilteredData(params: any): Observable<PoComboMatriculaStruct[]> {

		let httpParams = new HttpParams();
		let filter: string = '';
		filter = "GYG_CODIGO != ''"
		if (params.value != ''){
			filter += " AND UPPER(GYG_CODIGO) LIKE UPPER('%" + params.value + "%') OR UPPER(GYG_FUNCIO) LIKE UPPER('%" + params.value +
				"%') OR UPPER(GYG_NOME) LIKE UPPER('%" + params.value + "%')"
		}
		httpParams = httpParams.append('FILTER', filter);
		httpParams = httpParams.append('FIELDVIRTUAL', true);
	

		return this.apiService.get(this.endpoint, httpParams).pipe(map((response: any) => {

			const items: PoComboMatriculaStruct[] = [];
			let hasNext = true;

			response.resources.forEach((resource : any) => {

				let itemReturn: PoComboMatriculaStruct = new PoComboMatriculaStruct();
				let codMatricula = resource.models[0].fields.find((field : any) => field.id == 'GYG_FUNCIO')
				
				itemReturn.value = resource.models[0].fields.find((field : any) => field.id == 'GYG_CODIGO').value;
				itemReturn.label = resource.models[0].fields.find((field : any) => field.id == 'GYG_NOME').value;
				itemReturn.matricula = codMatricula != undefined ? codMatricula.value : '';

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
		let filter: string = `GYG_FUNCIO='${value}' OR GYG_CODIGO='${value}'`;

		params = params.append('FILTER', filter)

		return this.apiService.get(this.endpoint, params).pipe(map((response: any) => {

			let itemReturn = new PoComboMatriculaStruct();

			itemReturn.value = response.models[0].fields.find((field : any) => field.id == 'GYG_CODIGO').value;
			itemReturn.label = response.models[0].fields.find((field : any) => field.id == 'GYG_NOME').value;
			itemReturn.matricula = response.models[0].fields.find((field : any) => field.id == 'GYG_FUNCIO').value;

			return itemReturn
		}))
	}
}