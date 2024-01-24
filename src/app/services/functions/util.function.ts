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
export function DecodeHtmlEntities(encodedString : any) {
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