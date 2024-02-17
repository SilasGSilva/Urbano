import { PoTableColumn } from '@po-ui/ng-components';

/**
 * Definição da coluna das roletas
 */
export const ColumnsRoletas: Array<PoTableColumn> = [
	{ property: 'codRoleta', label: 'cod', sortable: false, visible: false },
	{ property: 'descRoleta', label: 'Descrição', visible: false },
	{
		property: 'labelRoleta',
		label: 'Roleta',
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
 * Dados dos itens das roletas
 */
export class RoletasModel {
	pk: string = '';
	codRoleta: string = '';
	identificador: string = '';
	descRoleta: string = '';
	labelRoleta: string = '';
	outrasAcoes?: Array<string>;
	index?: number;
}
