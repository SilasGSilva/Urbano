import { PoCheckboxGroupOption, PoRadioGroupOption } from "@po-ui/ng-components";

/**
 * Definição das opções de tipo de documento
 */
export const ListTipoDocumento: Array<PoRadioGroupOption> = [
	{ value: '1', label: 'RG' }, 
	{ value: '2', label: 'CPF' }, 
]

/**
 * Definição das opções de status
 */
export const ListStatus: Array<PoRadioGroupOption> = [
	{ value: '1', label: 'Ativo' }, 
	{ value: '2', label: 'Inativo' }, 
]

/**
 * Definição das opções de turno
 */
export const ListTurno: Array<PoCheckboxGroupOption> = [
	{ value: '1', label: 'Manhã' }, 
	{ value: '2', label: 'Tarde' },
    { value: '3', label: 'Noite' }, 
]

export interface MotoristaForm {
	nome: string;
	turno: string;
	codFuncao: string;
	descFuncao: string;
	status: string;
	codMatricula: string;
	descMatricula: string;
	codTipoRecurso: string;
	descTipoRecurso: string;
	tipoDocumento: string;
	dataNascimento: string;
	numeroDocumento: string;
	//Estrutura de documentos
}

export class MotoristaModel {
	push(motorista: MotoristaModel) {
        throw new Error('Method not implemented.');
    }
    pk: string = '';
	nome: string = '';
	turno: string = '';
	codFuncao: string = '';
	descFuncao: string = '';
	status: string = '';
	codMatricula: string = '';
	descMatricula: string = '';
	codTipoRecurso: string = '';
	descTipoRecurso: string = '';
	tipoDocumento: string = '';
	dataNascimento: string = '';
	numeroDocumento: string = '';
	codigoMotorista: string  = '';
	//Estrutura de documentos
}