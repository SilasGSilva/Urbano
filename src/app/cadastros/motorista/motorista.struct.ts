import { PoTableColumn } from "@po-ui/ng-components";

export const CollumnsMotoristas: Array<PoTableColumn> = [
	{ property: 'codigo', label: '' },
	{ property: 'descricao', label: '' },
	{ property: 'uf', label: '' },
	{
		property: 'icons',
		label: ' ',
		type: 'icon',
		icons: [
			{ value: 'editar', icon: 'po-icon po-icon-edit', color: '#29b6c5' },
			{ value: 'deletar', icon: 'po-icon po-icon-delete', color: '#29b6c5' },
		],
	},
];

export interface Motoristas {
	pk?: string;
	codigo?: string;
	descricao: string;
	icons?: Array<string>;
	id?: number;
	index?: number;
}
