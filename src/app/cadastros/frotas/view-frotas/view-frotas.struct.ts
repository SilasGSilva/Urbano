import { Injectable } from '@angular/core';
import { PoDynamicViewField, PoTableColumn } from '@po-ui/ng-components';

@Injectable()
export class FrotasStruct {
	/**
	 * Coluna para visualização das seções
	 */
	ColumnsDynamicView: Array<PoDynamicViewField> = [
		{
			property: 'prefixo',
			divider: 'Dados gerais',
			gridColumns: 4,
			order: 1,
			label: 'Frefixo veículo',
		},
		{ property: 'placa', label: 'Placa', gridColumns: 4, order: 1 },
		{ property: 'marca', label: 'Marca / Modelo / Versão', gridColumns: 4, order: 1 },
		{
			property: 'anoFabricacao',
			gridColumns: 4,
			order: 2,
			label: 'Ano fabricação',
		},
		{ property: 'anoModelo', label: 'Ano modelo', gridColumns: 4, order: 2 },
		{ property: 'categoria', label: 'Categoria', gridColumns: 4, order: 2 },
		{
			property: 'local',
			gridColumns: 4,
			order: 3,
			label: 'Local',
		},
		{ property: 'nChassi', label: 'Nº do chassi', gridColumns: 4, order: 3 },
		{ property: 'codRenavam', label: 'Código Renavam', gridColumns: 4, order: 3 },
		{
			property: 'validador',
			gridColumns: 4,
			order: 4,
			label: 'Validador',
		},
		{ property: 'roleta', label: 'Roleta', gridColumns: 4, order: 4 },
		{
			property: 'statusVeiculo',
			gridColumns: 4,
			order: 4,
			label: 'Status do veículo',
			tag: true,
			options: [
				{ value: '1', label: 'Ativo' },
				{ value: '2', label: 'Inativo' },
			],
		},

		//CARACTERÍSTICAS DO VEÍCULO

		{
			property: 'configPortas',
			divider: 'Características do veículo',
			label: 'Configuração de portas',
			gridColumns: 4,
			order: 5,
		},
		{ property: 'nPortasEsquerda', label: 'Nº de portas (lado esquerdo)', gridColumns: 4, order: 5 },
		{ property: 'nPortasDireita', label: 'Nº de portas (lado direito)', gridColumns: 4, order: 5 },
		{ property: 'lotacaoSentado', label: 'Lotação sentado', gridColumns: 2, order: 6 },
		{ property: 'lotacaoEmPe', label: 'Lotação em pé', gridColumns: 2, order: 6 },

		{ property: 'caracteristicasRoleta', label: 'Característica da roleta', gridColumns: 4, order: 6 },
		{ property: 'metragemChassi', label: 'Metragem do chassi', gridColumns: 4, order: 6 },
		{ property: 'acessibilidade', label: 'Possui acessibilidade?', gridColumns: 4, order: 7 },
		{ property: 'postoCobrador', label: 'Possui posto de cobrador?', gridColumns: 4, order: 7 },
	];
}

export interface itemsDynamicView {
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
	statusVeiculo: string;
	configPortas: string;
	nPortasEsquerda: number;
	nPortasDireita: number;
	lotacaoSentado: number;
	lotacaoEmPe: number;
	caracteristicasRoleta: string;
	metragemChassi: number;
	acessibilidade: number;
	postoCobrador: number;
}

export const ColumnsFrotasView: Array<PoTableColumn> = [
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

export class FrotasModelView {
	nDocumento: string = '';
	dataEmissao: string;
	dataVencimento: string;
	dataTolerancia: string;
	status: number = 2;
}
