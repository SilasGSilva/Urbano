import { map } from "rxjs";
import { ProtheusService } from "./protheus.service";
import { Injectable } from "@angular/core";


const endpoint = 'FRETAMENTOURBANO/';
@Injectable({
    providedIn: 'root',
  })
export class FretamentoUrbanoService {
    pathParam: string = '';
    constructor(private protheus_service: ProtheusService) {}

    /**
   * Realiza a requisição HTTP GET
   * @param pathUrl - Path a ser requisitado
   * @param nameOperation - Nome da operação
   */
	get(pathUrl: string) {
		return this.protheus_service.get(endpoint + pathUrl + this.pathParam).pipe(
		map((response) => {
			return response;
		})
		);
	}
}