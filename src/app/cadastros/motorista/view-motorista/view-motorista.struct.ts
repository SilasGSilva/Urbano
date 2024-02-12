import { PoDynamicViewField } from '@po-ui/ng-components';

/**
 * Coluna para visualização dos motoristas
 */
export const ColunaDados: Array<PoDynamicViewField> = [
	{
		property: 'codigo',
		divider: 'Dados gerais',
		gridColumns: 4,
		order: 1,
		label: 'Código',
	}, //dados 1
	{ property: 'matricula', label: 'Matrícula', gridColumns: 4, order: 1 },
	{ property: 'nome', label: 'Nome', gridColumns: 4, order: 1 },

	{
		property: 'dataNascimento',
		gridColumns: 4,
		label: 'Data de nascimento',
		type: 'date',
		order: 2,
	}, //dados 2
	{
		property: 'tipoDocumento',
		gridColumns: 4,
		label: 'Tipo de documento',
		order: 2,
	},
	{
		property: 'numeroDocumento',
		label: 'Nº do documento',
		gridColumns: 4,
		order: 2,
	},

	{ property: 'numeroCNH', label: 'Nº da CNH', gridColumns: 4, order: 3 },
	{
		property: 'dataVencimentoCNH',
		label: 'data de vencimento da CNH',
		gridColumns: 4,
		order: 3,
	},
	{
		property: 'status',
		gridColumns: 4,
		order: 3,
		label: 'Status',
		tag: true,
		options: [
			{ value: '1', label: 'Ativo' },
			{ value: '2', label: 'Inativo' },
		],
	},

	{
		property: 'tipoRecurso',
		gridColumns: 4,
		label: 'Tipo de recurso',
		divider: 'Dados do funcionário',
	},
	{ property: 'funcao', label: 'Função' },
	{ property: 'turno', label: 'Turno' },
];
