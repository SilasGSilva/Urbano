import { PoCheckboxGroupOption, PoRadioGroupOption } from "@po-ui/ng-components";

// Enum para representar as opções de tipo de localidade
export enum TipoLocalidade {
	Garagem = '1',
	PontoDeRecolhe = '2',
}

/**
 * Definição das opções de tipo de localidade
 */
export const listTipoLocalidade: Array<PoCheckboxGroupOption> = [
	{ value: TipoLocalidade.Garagem, label: 'Garagem' },
	{ value: TipoLocalidade.PontoDeRecolhe, label: 'Ponto de recolhe' },
];

/**
 * Definição das opções de status
 */
export const ListStatus: Array<PoRadioGroupOption> = [
	{ value: '1', label: 'Ativo' },
	{ value: '2', label: 'Inativo' },
];

export interface LocalidadeForm {
	descricao: string;
	cep: string;
	endereco: string;
	bairro: string;
	municipio: string;
	estado: string;
	tipoLocalidade: TipoLocalidade; // Usando o enum aqui
	status: string;
}

export class LocalidadeModel {
	pk: string = '';
	descricao: string = '';
	cep: string = '';
	endereco: string = '';
	bairro: string = '';
	municipio: string = '';
	estado: string = '';
	tipoLocalidade: string = '';
	status: string = '';
}
