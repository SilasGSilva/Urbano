import {
	PoRadioGroupOption,
	PoSelectOption
} from "@po-ui/ng-components";

export const ListStatus: Array<PoRadioGroupOption> = [
	{ value: '1', label: 'Ativo' },
	{ value: '2', label: 'Inativo' },
];

/**
 * Definição da listagem de Pedagios
 */
export const ListPedagio: Array<PoSelectOption> = [
	{ value: '1', label: 'Rodoanel - R$ 3,00', },
	{ value: '2', label: 'Anhaguera - R$ 5,30', },
	{ value: '3', label: 'Castelo Branco - R$ 8,30', },
	{ value: '4', label: 'Anchieta - R$ 10,30', },
]

/**
 * Definição da listagem de Classificação Fiscal
 */
export const ClassificaoFiscal: Array<PoSelectOption> = [
	{ value: '1', label: 'ISENTO PIS CONFINS URBANO', },
	{ value: '2', label: 'ISENTO PIS CONFINS METROPOLITANO', },
	{ value: '3', label: 'RECOLHE PIS CONFINS URBANO', },
	{ value: '4', label: 'RECOLHE PIS CONFINS METROPOLITANO', },
]

export interface linhaForm {
	prefixo: string;
	codlinha: string;
	descricao: string;
	origem: string;
	destino: string;
	orgaoregulamentador: string;
	tarifa: string;
	pedagio: string;
	classificacaofiscal: string;
	kmdalinha: Number;
	categoria: string;
	status: string

}