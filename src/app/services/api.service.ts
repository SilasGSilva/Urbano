import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { VldFormStruct } from './gtpgenerics.struct';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
	private apiUrl = 'http://localhost:12173/rest/';
	
	constructor(private http: HttpClient) {}
	/**
	 * Metodo get http
	 * @param endpoint 
	 * @param params 
	 * @returns 
	 */
	get<T>(endpoint: string, params?: HttpParams): Observable<T> {
		const url = `${this.apiUrl}${endpoint}`;
		return this.http.get<T>(url, { params }).pipe(
		catchError(error => {
			return this.handleError(error);
		})
		);
	}
	/**
	 * Metodo post http
	 * @param endpoint 
	 * @param data 
	 * @returns 
	 */
	post<T>(endpoint: string, data: any): Observable<T> {
		const url = `${this.apiUrl}/${endpoint}`;
		return this.http.post<T>(url, data).pipe(
		catchError(error => {
			return this.handleError(error);
		})
		);
	}
	/**
	 * Metodo put HTTP
	 * @param endpoint 
	 * @param data 
	 * @returns 
	 */
	put<T>(endpoint: string, data: any): Observable<T> {
		const url = `${this.apiUrl}/${endpoint}`;
		return this.http.put<T>(url, data).pipe(
		catchError(error => {
			return this.handleError(error);
		})
		);
	}
	/**
	 * Método delete HTTP
	 * @param endpoint 
	 * @returns 
	 */
	delete<T>(endpoint: string): Observable<T> {
		const url = `${this.apiUrl}/${endpoint}`;
		return this.http.delete<T>(url).pipe(

		catchError(error => {
			return this.handleError(error);
		})
		);
	}

	private handleError(error: any): Observable<never> {
		console.error('An error occurred:', error);
		return throwError(() => new Error('Something went wrong. Please try again later.'));
	}

	/**
	 * Responsável por realizar validação de Formulário
	 * @param form - Estrutura do Formulário
	 */
	validateForm(form: FormGroup) {
		const formControls = form.controls;
		const listReturn: Array<VldFormStruct> = [];

		for (const campo in formControls) {
			if (
				Object.prototype.hasOwnProperty.call(formControls, campo) &&
				formControls[campo].status === 'INVALID'
			) {
				const iMessage: number = this.indexMessageErro(formControls[campo]);
				let tpError: string = '';

				if (iMessage === 0) {
					tpError = this.getFormError(formControls[campo]);
				}

				const index: number = listReturn.findIndex(
					x => x.iMessage === iMessage && x.tpErro === tpError
				);
				if (index > -1) {
					listReturn[index].field.push(campo.toString());
				} else {
					const infValidated: VldFormStruct = {} as VldFormStruct;
					infValidated.iMessage = iMessage;
					infValidated.tpErro = tpError;
					infValidated.field = [campo.toString()];
					listReturn.push(infValidated);
				}
			}
		}

		return listReturn;
	}

	/**
	 * Responsável por obter erro do campo do formulário
	 * @param formControl - Form Control do campo
	 */
	getFormError(formControl) {
		for (const erro in formControl.errors) {
			if (Object.prototype.hasOwnProperty.call(formControl.errors, erro)) {
				return erro.toString();
			}
		}
		return '';
	}

	/**
	 * Responsável por obter o indice do tipo de menságem que iremos apresentar
	 * na notificação
	 * @param formControl - Form Control do campo
	 */
	indexMessageErro(formControl) {
		let iMessage: number = 0;

		if (formControl.errors.hasOwnProperty('required')) {
			iMessage = 1;
		} else if (formControl.errors.hasOwnProperty('maxlength')) {
			iMessage = 2;
		}

		return iMessage;
	}

}