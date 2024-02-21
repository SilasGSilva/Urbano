import { PoTableColumn } from '@po-ui/ng-components';

/**
 * Definição da coluna de frotas
 */
export const ColumnsFrotas: Array<PoTableColumn> = [
	{ property: 'codFrota', label: 'codFrota', sortable: false, visible: false },
	{ property: 'prefixo', label: 'Prefixo' },
	{
		property: 'placa',
		label: 'Placa',
	},
	{
		property: 'tipoVeiculo',
		label: 'Tipo de veículo',
	},
	{
		property: 'local',
		label: 'Local',
	},
	{
		property: 'status',
		label: 'Status',
		type: 'label',
		labels: [
			{ value: 1, label: 'Ativo', textColor: '#0F5236', color: '#DEF7ED' },
			{ value: 2, label: 'Inativo', textColor: '#72211D', color: '#F6E6E5' },
		],
	},
	{
		property: 'outrasAcoes',
		label: ' ',
		type: 'icon',
		sortable: false,
		icons: [
			{
				value: 'editar',
				icon: 'po-icon po-icon-edit',
				color: '#29b6c5',
				tooltip: 'Editar',
			},
			{
				value: 'visualizar',
				icon: 'po-icon po-icon-eye',
				color: '#29b6c5',
				tooltip: 'Visualizar',
			},
		],
	},
];

/**
 * Dados dos itens das frotas
 */
export class FrotasModel {
	pk: string = '';
	codFrota: string = '';
	prefixo: string = '';
	placa: string = '';
	tipoVeiculo: string = '';
	local: string = '';
	status: number = 2;
	outrasAcoes: Array<string>;
	index?: number;
}
