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
    constructor(private httpServ: HttpService, private http: HttpClient) {}
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
}
