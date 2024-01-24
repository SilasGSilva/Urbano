import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FwProtheusModel } from './models/fw-protheus.model';

@Injectable({
    providedIn: 'root'
})
export class FwmodelProtheusService {
    private apiUrl = 'http://localhost:12173/rest/fwmodel';

    constructor(private http: HttpClient) { }

    public get(endpoint: string, params: HttpParams) {
        const url = `${this.apiUrl}/${endpoint}`;
        //  const headers = new HttpHeaders({'TenantId': 'T1, D MG 01'})
        return this.http.get<FwProtheusModel>(url, {/*headers: headers,*/ params: params},);

    }


    public post(body: any) {
        const url = `${this.apiUrl}/${body.endpoint}`;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json;text/plain' })
        };

        return this.http.post(url, JSON.stringify(body), httpOptions)
    }

    public put(body: any) {
        const url = `${this.apiUrl}/${body.endpoint}`;

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json;text/plain' })
        };

        return this.http.put(url, JSON.stringify(body), httpOptions)
    }    
 
}
