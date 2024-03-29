import { PoSelectOption, PoTableColumn } from '@po-ui/ng-components';

/**
 * Definição da coluna de tarifas
 */
export const ColumnsTariffs: Array<PoTableColumn> = [
	{ property: 'codTariff', label: 'cod', sortable: false, visible: false },
	{ property: 'labelTariff', label: 'Tarifa' },
	{
		property: 'valor',
		label: 'Valor',
		type: 'currency',
		format: 'BRL',
	},
	{
		property: 'orgaoConcessor',
		label: 'Órgão Concessor',
	},
	{
		property: 'vigencia',
		label: 'Vigência',
	},
	{
		property: 'otherActions',
		label: ' ',
		type: 'icon',
		sortable: false,
		icons: [
			{
				value: 'edit',
				icon: 'po-icon po-icon-edit',
				color: '#29b6c5',
				tooltip: 'Editar',
			},
			{
				value: 'view',
				icon: 'po-icon po-icon-eye',
				color: '#29b6c5',
				tooltip: 'Visualizar',
			},
		],
	},
];

/**
 * Dados dos itens das tarifas
 */
export class TariffsModel {
	pk: string = '';
	filial: string = '';
	codTariff: string = '';
	descTariff: string = '';
	labelTariff: string = '';
	orgaoConcessor?: string = '';
	valor: number = 0;
	vigencia?: string = '';
	otherActions?: Array<string>;
	index?: number;
}
