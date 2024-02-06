import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FwProtheusModel } from './models/fw-protheus.model';

@Injectable({
  providedIn: 'root',
})
export class FwmodelProtheusService {
  private apiUrl = 'http://localhost:12173/rest/fwmodel';

  constructor(private http: HttpClient) {}

  /**
   * header padrão
   */
  private optionsHeader: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json;text/plain',
    Authorization: 'Basic YWRtaW46MTIzNA==',
  });

  public get(endpoint: string, params: HttpParams) {
    const url = `${this.apiUrl}/${endpoint}`;

    return this.http.get<FwProtheusModel>(url, {
      headers: this.optionsHeader,
      params: params,
    });
  }

  public post(body: any) {
    const url = `${this.apiUrl}/${body.endpoint}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;text/plain',
      }),
    };

    return this.http.post(url, JSON.stringify(body), httpOptions);
  }

  public put(body: any) {
    const url = `${this.apiUrl}/${body.endpoint}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;text/plain',
      }),
    };

    return this.http.put(url, JSON.stringify(body), httpOptions);
  }
}
