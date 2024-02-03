import { Injectable } from "@angular/core";
import { PoTableColumnSort, PoTableColumnSortType } from "@po-ui/ng-components";

/**
 * Função para verificar se é nulo ou indefinido
 * @param value variavel que será verificada
 */
export function isNullOrUndefined(value: any): boolean {
	value = typeof value === 'string' ? value.trim() : value;
	return value === '' || value === null || value === 'null' || value === undefined || value === 'undefined';
}

/**
 * converte a string codificada como entidade HTML (palavras reservadas do HMTL)
 * em seus caracteres correspondentes
 * @param encodedString - string codificada como entidade HTML
 */
export function DecodeHtmlEntities(encodedString: any) {
	let decodedHtmlEntities: string = encodedString;
	decodedHtmlEntities = decodedHtmlEntities.replace(/&quot;/gm, '"');
	decodedHtmlEntities = decodedHtmlEntities.replace(/&amp;/gm, '&');
	decodedHtmlEntities = decodedHtmlEntities.replace(/&#38;/gm, '&');
	decodedHtmlEntities = decodedHtmlEntities.replace(/&#39;/gm, "'");
	decodedHtmlEntities = decodedHtmlEntities.replace(/&gt;/gm, '>');
	decodedHtmlEntities = decodedHtmlEntities.replace(/&lt;/gm, '<');
	decodedHtmlEntities = decodedHtmlEntities.replace(/&#60;/gm, '<');
	decodedHtmlEntities = decodedHtmlEntities.replace(/&#62;/gm, '>');
	decodedHtmlEntities = decodedHtmlEntities.replace(/&#34;/gm, '"');
	decodedHtmlEntities = decodedHtmlEntities.replace(/\u2010/g, '-');

	return decodedHtmlEntities;
}
/**
 * Busca dados a partir de um array. Se não encontrar, retorna `undefined`
 * @param aDados - Array de dados
 * @param cCampo - Campo a ser encontrado
 * @example
 * ```
 * aDados[0].id = "GYG_CODIGO"
 * aDados[0].order = 1
 * aDados[0].value = "0000000111"
 * aDados[1].id = "GYG_FUNCIO"
 * aDados[1].order = 2
 * aDados[1].value = "001"
 *
 * JFwFldGet(aDados, "GYG_CODIGO",'') // Retorna "0000000111"
 * JFwFldGet(aDados, "GYG_FUNCIO",'') // Retorna "001"
 * ```
 */
export function JFwFldGet(aDados: Array<any>, cCampo: string, defaultValue?: any) {
	const aEncontrado = aDados.find(x => x.id === cCampo);

	if (!isNullOrUndefined(aEncontrado) && aEncontrado.hasOwnProperty('value')) {
		return typeof aEncontrado.value === 'string' ? DecodeHtmlEntities(aEncontrado.value) : aEncontrado.value;
	}
	return defaultValue;
}

/**
 * Retorna uma promise que realiza uma pausa no sistema aguardando conforme os ms definidos
 * @param ms milisegundos
 * @example await sleep(500)
 * @example sleep(300).then(x=>{})
 */
export async function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Função que formata o conteúdo de uma string
 * @param valor: Conteúdo há ser formatado
 */
export function JFormatString(valor: string): string {
	return valor
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
}

/**
 * verifica se é uma url válida
 * @param path url
 * @returns Verdadeiro ou falso
 */
export function validUrl(path: string): boolean {
	let url: URL;
	let isValid: boolean = false;
	try {
		url = new URL(path);
		if (url.protocol.search('http') > -1 && !isNullOrUndefined(url.hostname)) {
			isValid = true;
		}
		return isValid;
	} catch {
		return isValid;
	}
}

/**
 * Responsável por validar se um valor possui possui caracteres especiais
 * @param campo - String a ser validada
 * @returns boolean que indica se possui caracteres especiais
 */
export function validacaoCaracteresEsp(campo: string = '') {
	if (!isNullOrUndefined(campo)) {
		return (
			campo.indexOf(' ') > -1 ||
			campo.indexOf('+') > -1 ||
			campo.indexOf('-') > -1 ||
			campo.indexOf('©') > -1 ||
			campo.indexOf('®') > -1 ||
			campo.indexOf('<') > -1 ||
			campo.indexOf('>') > -1 ||
			campo.indexOf('&') > -1 ||
			campo.indexOf('=') > -1 ||
			campo.indexOf('§') > -1 ||
			campo.indexOf('?') > -1 ||
			campo.indexOf('{') > -1 ||
			campo.indexOf('}') > -1 ||
			campo.indexOf('@') > -1 ||
			campo.indexOf('#') > -1 ||
			campo.indexOf('%') > -1 ||
			campo.indexOf('.') > -1 ||
			campo.indexOf(',') > -1 ||
			campo.indexOf('¨¨') > -1 ||
			campo.indexOf(';') > -1 ||
			campo.indexOf(':') > -1 ||
			campo.indexOf('!') > -1 ||
			campo.indexOf('"') > -1 ||
			campo.indexOf('*') > -1
		);
	} else {
		return false;
	}

}

@Injectable({
	providedIn: 'root',
})
export class UtilsService {
	constructor() { }

	public sort(value: any, valueToCompare: any, sort: PoTableColumnSort) {
		const property = sort.column?.property;
		const type = sort.type;

		if (value[property!] < valueToCompare[property!]) {
			return type === PoTableColumnSortType.Ascending ? -1 : 1;
		}
		return type === PoTableColumnSortType.Ascending ? 1 : -1;
	}
}

/**
 * Altera o valor `undefined` para vazio
* @param value - Valor a ser validado
* @returns O valor passado ou vazio `("")`
*/
export function ChangeUndefinedToEmpty(value: string | undefined): string {
	if (value === undefined || value === 'undefined' || value === null) {
		value = '';
	}
	return value;
}

/** Monta a data no formato mm-dd-yyyy para utilizar como Data
 * @param strDate - Recebe a data no formato Protheus (yyyymmdd)
 * @param formato - Formato da mascara. No default será considerado o formato ("mm-dd-yyyy"). Padrão do JavaScript.
 * @param separador - Separador a ser trocado da mascara, caso seja diferente do que está na mascara
 *
 * @example Para utiizar a data "20190129" provinda do Protheus a data precisa estar no formato mm-dd-yyyy
 * makeDate("20190129")  = 01-29-2019
 * makeDate("20190129","dd/mm/yyyy")  = 29/01/2019
 * makeDate("20190129",,"_")  = 01_29_2019
 *
 */
export function MakeDate(strDate: string, formato: string = 'mm-dd-yyyy', separador: string = '-'): string {
	let dataFinal: string;
	let strMes: string = '';

	if (!isNullOrUndefined(strDate)) {
		const dia: string = strDate.substring(6, 8);
		const mes: string = strDate.substring(4, 6);
		const ano: string = strDate.substring(0, 4);;

		dataFinal = formato
			.replace(/dd/g, dia)
			.replace(/MM/g, strMes)
			.replace(/mm/g, mes)
			.replace(/yyyy/g, ano)
			.replace(/-/g, separador);
	} else {
		dataFinal = '';
	}

	return dataFinal;
};

/**
 * Busca dados a partir de um array. Se não encontrar, retorna `undefined`
* @param aDados - Array de dados
* @param cCampo - Campo a ser encontrado
* @example
* ```
* aDados[0].id = "GYG_CODIGO"
* aDados[0].order = 1
* aDados[0].value = "000111"
* aDados[1].id = "GYG_NOME"
* aDados[1].order = 2
* aDados[1].value = "TESTE"
*
* this.findValueByName(aDados, "GYG_CODIGO") // Retorna "000111"
* this.findValueByName(aDados, "GYG_NOME") // Retorna "TESTE"
* ```
*/
export function FindValueByName(aDados: Array<any>, cCampo: string) {
	const aEncontrado = aDados.find(x => x.id == cCampo);

	if (
		!isNullOrUndefined(aEncontrado) &&
		typeof aEncontrado.value === 'string'
	) {
		return typeof aEncontrado.value == 'string'
			? DecodeHtmlEntities(aEncontrado.value)
			: aEncontrado.value;
	} else {
		return '';
	}
}