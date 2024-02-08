import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const endpoint = 'http://localhost:12173/rest/FRETAMENTOURBANO/';

@Injectable({
    providedIn: 'root',
})
export class WsurbanoService {
    pathParam: string = '';
    constructor() {} //private protheus_service: protheusService

    /**
     * Define o valor do QueryParam passado
     * @param cNameParam - QueryParam a ser definido
     * @param value - Valor a ser inserido no QueryParam
     */
    setParam(cNameParam: string, value: string) {
        //this.protheus_service.setOptionsParams(cNameParam, value);
    }
    /**
     * Define o valor do PathParam passado
     * @param value - Valor a ser inserido no QueryParam
     */
    setPathParam(value: string) {
        this.pathParam += `/${value}`;
    }

    /**
     * Define o valor do QueryParam passado
     * @param cNameParam - QueryParam a ser definido
     * @param value - Valor a ser inserido no QueryParam
     */
    setHeader(cNameParam: string, value: string) {
        //this.protheus_service.setOptionsHeaders(cNameParam, value);
    }

    // seta a quantidade de itens por página
    /**
     * Seta a quantidade de itens por página
     * @param pageSize - quantidade de itens
     */
    setPageSize(pageSize: string) {
        //this.protheus_service.setOptionsParams('pageSize', pageSize);
    }

    /**
     * Restaura o serviço Protheus
     */

    restore() {
        this.pathParam = '';
        //this.protheus_service.restore(endpoint);
    }

    /**
     * Realiza a requisição HTTP GET
     * @param pathUrl - Path a ser requisitado
     * @param nameOperation - Nome da operação
     */
    get(pathUrl: string, nameOperation: string = 'getUrbano') {
        //return this.protheus_service.get(endpoint + pathUrl + this.pathParam, nameOperation);
    }

    /**
     * metodo POST
     * consome os serviços REST do Protheus
     * @param pathUrl Url que será requisitada
     * @param body body que será enviado
     * @param nameOperation Nome da operação
     */
    /*post(
		pathUrl: string,
		body: string,
		nameOperation: string = 'postUrbano'
	): Observable<any> {
		//this.protheus_service.setBody(body);
		return //this.protheus_service.post(endpoint + pathUrl + this.pathParam, nameOperation);
	}*/

    /**
	 * Realiza a requisição HTTP PUT
	 * @param pathUrl - Path a ser requisitado
	 * @param nameOperation - Nome da operação
	 *
	put(pathUrl: string, bodyReq: string, nameOperation: string = 'putUrbano') {
		this.protheus_service.setBody(bodyReq);
		return this.protheus_service.put(endpoint + pathUrl + this.pathParam, nameOperation);
	}/

	/**
	 * Preenche a propriedade throwError, indicando se deve ou não retornar o valor do erro.
	 * @param value Informa se retora o erro do serviço
	 *
	setThrowError(value: boolean) {
		this.protheus_service.setThrowError(value);
	}*/
}
