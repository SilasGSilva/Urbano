import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class UrbanoGenericService {
	constructor() {}

	static getRequestAuth(): string {
		let arrERPTOKEN;
		let valueRet;

		if (window.sessionStorage.getItem('ERPTOKEN') !== null) {
			arrERPTOKEN = JSON.parse(window.sessionStorage['ERPTOKEN']);
			valueRet = arrERPTOKEN['token_type'] + ' ' + arrERPTOKEN['access_token'];
		}

		if (valueRet === undefined) {
			valueRet = '';
		}

		return valueRet;
	}
	// Obter filial do session storage
	static getTenantIdHeader(): string {
		let empresa;
		let valueRet;
		if (window.sessionStorage.getItem('ProBranch') !== null) {
		  empresa = JSON.parse(window.sessionStorage['ProBranch']);
		  valueRet = empresa['CompanyCode'] + ',' + empresa['Code'];
		}
	
		if (valueRet === undefined) {
		  valueRet = '';
		}
	
		return valueRet;
	  }
	
}
