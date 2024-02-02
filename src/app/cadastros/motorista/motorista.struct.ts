import { PoComboOption, PoSelectOption, PoTableColumn } from "@po-ui/ng-components";

/**
 * Definição da coluna de motoristas
 */
export const CollumnsMotoristas: Array<PoTableColumn> = [
   
	{ property: 'matricula', label: 'Matrícula', sortable: false },
	{ property: 'descMotorista', label: 'Motorista/Colaborador', sortable: false },
	{ property: 'descRecurso', label: 'Tipo de Recurso' },
    { property: 'turno', label: 'Turno'},
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
 * Definição da listagem de turnos
 */
export const ListTurno: Array<PoSelectOption> = [
	{ value: '1', label: 'Manhã' }, 
	{ value: '2', label: 'Tarde' }, 
	{ value: '3', label: 'Noite' }
]
/**
 * Dados dos itens de motoristas
 */
export class MotoristaModel {
    push() {
        throw new Error('Method not implemented.');
    }

    id: string = '';
    pk?: string;
	filial:string = '';
	matricula?: string;
	descMotorista: string = '';
	codRecurso: string = '';
    descRecurso: string = '';
    turno: string= '';
    status: string = '1';
	outrasAcoes?: Array<string>;
	index?: number;
}

export interface ComboFilial extends PoComboOption {
	[x: string]: any;
	selectedOption: any;
	filial?: string;
}