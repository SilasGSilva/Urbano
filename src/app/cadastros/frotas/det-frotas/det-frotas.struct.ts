import { PoTableColumn } from '@po-ui/ng-components';

export interface DadosGeraisForm {
	prefixo: number;
	placa: string;
	marca: string;
	anoFabricacao: number;
	anoModelo: number;
	categoria: string;
	local: string;
	nChassi: string;
	codRenavam: number;
	validador: string;
	roleta: string;
	statusVeiculo: number;
	configPortas: string;
	portasEsquerda: number;
	portasDireita: number;
	lotacaoSentado: number;
	lotacaoEmPe: number;
	caracteristicaRoleta: string;
	metragemChassi: number;
	acessibilidade: number;
	postoCobrador: number;
}

export interface DocumentosForm {
	tipoDocumento: string;
	nomeDocumento: string;
	nmrDocumento: string;
	dataEmissao: string;
	tipoTolerancia: string;
	tempoTolerancia: string;
	tipoVigencia: string;
	tempoVigencia: string;
	arquivo: string;
}

export const ColumnsFrotasDocumento: Array<PoTableColumn> = [
	{ property: 'nDocumento', label: 'Nº ' },
	{ property: 'dataEmissao', label: 'Data de emissão' },
	{ property: 'dataVencimento', label: 'Data de vencimento' },
	{ property: 'dataTolerancia', label: 'Data Máx. Tolerância' },
	{
		property: 'status',
		label: 'Status',
		type: 'label',
		labels: [
			{ value: 1, label: 'Ativo', textColor: '#0F5236', color: '#DEF7ED' },
			{ value: 2, label: 'Inativo', textColor: '#72211D', color: '#F6E6E5' },
		],
	},
];

export class FrotasModelDocumento {
	nDocumento: string = '';
	dataEmissao: string;
	dataVencimento: string;
	dataTolerancia: string;
	status: number = 2;
}
