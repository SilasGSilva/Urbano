import { PoSelectOption, PoTableColumn } from "@po-ui/ng-components";

/**
 * Definição da coluna de localidades
 */
export const CollumnsLocalidade: Array<PoTableColumn> = [
   
	{ property: 'local', label: 'Descrição do Local', sortable: false },
	{ property: 'municipio', label: 'Município', sortable: false },
	{ property: 'status',type: 'label', label: 'Status',
        width: '8%',
        labels: [
        { value: '1', textColor: "#0F5236", color: '#DEF7ED', label: 'Ativo'},
        { value: '2', textColor: "#72211D", color: '#F6E6E5', label: 'Inativo'},
    ]},
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
 * Definição da listagem de status
 */
export const ListStatus: Array<PoSelectOption> = [
	{ value: '1', label: 'Ativo' }, 
	{ value: '2', label: 'Inativo' }, 
]
/**
 * Dados dos itens de localidades
 */
export class LocalidadesModel {
    push() {
        throw new Error('Method not implemented.');
    }

	local: string = '';
	municipio: string = '';
    status: string = '';
	outrasAcoes?: Array<string>;
	index?: number;
}
