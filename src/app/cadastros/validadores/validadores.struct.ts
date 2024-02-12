import { PoTableColumn } from '@po-ui/ng-components';

/**
 * Definição da coluna de validadores
 */
export const ColumnsValidadores: Array<PoTableColumn> = [
	{ property: 'codValidador', label: 'cod', sortable: false, visible: false },
	{ property: 'descValidador', label: 'Descrição', visible: false },
	{
		property: 'labelValidador',
		label: 'Validador',
	},

	{
		property: 'outrasAcoes',
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
		],
	},
];

/**
 * Dados dos itens dos validadores
 */
export class ValidadoresModel {
	pk: string = '';
	codValidador: string = '';
	descValidador: string = '';
	labelValidador: string = '';
	outrasAcoes?: Array<string>;
	index?: number;
}
