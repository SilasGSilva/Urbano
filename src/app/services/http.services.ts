import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
	private optionGetHeader: HttpHeaders | undefined;
	constructor(private http: HttpClient) {}
	/**
	 * Função de decisão para requisições GET
	 *
	 * @param host - Host da requisição
	 * @param url - Url da Requisição
	 * @param optionGetHeader - Headers da requisição
	 * @param optionGetParam - Parâmetros da requisição
	 * @returns Observable da Requisição para manipulação
	 */
	get(
		host: string,
		url: string,
		optionGetHeader?: HttpHeaders,
		optionGetParam?: HttpParams
	): Observable<any> {
		return this.http.get<any>(host + url, {
			headers: optionGetHeader,
			params: optionGetParam,
		});
	}

	/**
	 * Método de chamada POST
	 * @param host - Host da requisição
	 * @param url - Url da Requisição
	 * @param body - Body da requisição
	 * @param optionGetHeader - Headers da requisição
	 * @param optionGetParam - Parâmetros da requisição
	 * @returns Observable da Requisição para manipulação
	 */
	post( host: string,
		  url: string,
		  body: string,
		  optionGetHeader?: HttpHeaders,
		  optionGetParam?: HttpParams
		): Observable<any> {

		this.optionGetHeader = optionGetHeader;

		//return this.httpCallPost(host, url, body, optionGetParam);
		return this.http.post<any>(host + url, body, {
			headers: this.optionGetHeader,
			params: optionGetParam,
		});
	}
}
