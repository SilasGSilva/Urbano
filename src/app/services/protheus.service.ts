import { Injectable } from '@angular/core';
import { HttpService } from './http.services';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UrbanoGenericService } from './urbano-generic.service';

//const host = MesaGenericService.getERPConfigParam('api_baseUrl');
// const erpToken = MesaGenericService.getRequestAuth();
const host = 'http://localhost:12173/rest/';
// const host = 'http://10.171.81.16:8084/rest';
@Injectable({
  providedIn: 'root',
})
export class ProtheusService {
    pathParam: string = '';
    private cBody: string = '{}';
    constructor(private httpServ: HttpService) {}

    /**
     * params padrão
     */
    private optionsGetParams: HttpParams = new HttpParams({});

    /**
     * header padrão
     */
    private optionsGetHeader: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json;text/plain',
        Authorization: UrbanoGenericService.getRequestAuth(),
        Tenantid: UrbanoGenericService.getTenantIdHeader()
    });

    /**
     * metodo GET
     * consome os serviços REST do Protheus
     * @param endpoint - Endpoint a ser consultado
     * @param optHeader - Header opcional
     * @param optParams - Parametros opcional
     */
    get(endpoint: string, optHeader?: HttpHeaders, optParams?: HttpParams) {
        if (optHeader != undefined) {
        	this.optionsGetHeader = optHeader;
        }

        if (optParams != undefined) {
        	this.optionsGetParams = optParams;
        }

        return this.httpServ.get(
								  host,
								  endpoint,
								  this.optionsGetHeader,
								  this.optionsGetParams
        );
    }

    /**
     * metodo POST
     * consome os serviços REST do Protheus
     * @param endpoint
     */
    post(endpoint: string, optHeader?: HttpHeaders, optParams?: HttpParams) {
        if (optHeader != undefined) {
        	this.optionsGetHeader = optHeader;
        }

        if (optParams != undefined) {
       		this.optionsGetParams = optParams;
        }

        return this.httpServ.post(
					host,
					endpoint,
					this.cBody,
					this.optionsGetHeader,
					this.optionsGetParams
       			);
    }
    /**
     * Define o Body da requisição
     * @param cBody - Corpo da requisição
     */
    setBody(cBody: string = '') {
        this.cBody = cBody;
    }

    /**
	 * acrescenta um novo valor de cabeçalho ao conjunto já existente
	 * @param name Nome do parametro
	 * @param value Valor do parametro
	 */
	setOptionsHeaders(name: string, value: string[] | string) {
		// Tratamento para chamada pelo Mingle
		this.optionsGetHeader = this.optionsGetHeader.set(name, value);
	}

    /**
	 * Retorna o valor do Header passado por parâmetro
	 * @param paramName - Header solicitado
	 */
	getHeaderValue(paramName: string): string | null {
		// Tratamento para chamada pelo Mingle
		return this.optionsGetHeader.get(paramName);
	}
    /**
	 * constroi um novo corpo URL acrescentando ao parametro o valor fornecido
	 * @param param Nome do parametro
	 * @param value Valor do parametro
	 */
	setOptionsParams(param: string, value: string) {
		// Tratamento para chamada pelo Mingle
		this.optionsGetParams = this.optionsGetParams.set(param, value);
	}

    /**
	 * Retorna o valor do QueryParam passado por parâmetro
	 * @param paramName - QueryParam solicitado
	 */
	getParamValue(paramName: string): string | null {
		// Tratamento para chamada pelo Mingle
		return this.optionsGetParams.get(paramName);
	}
    
}
