import { Injectable } from '@angular/core';
import { PoDynamicViewField, PoTableColumn } from '@po-ui/ng-components';

export const ColumnsDynamicView: Array<PoDynamicViewField> = [
	{
		property: 'codigo',
		gridColumns: 4,
		order: 1,
		label: 'Código',
	}, //dados 1
	{ property: 'descricao', label: 'Descrição', gridColumns: 8, order: 1 },
	{ property: 'valor', label: 'Valor', type: 'currency', format: 'BRL', gridColumns: 4, order: 2 },
	{
		property: 'orgaoConcessor',
		label: 'Orgão Concessor',
		gridColumns: 4,
		order: 2,
	},
	{ property: 'vigencia', label: 'Vigência', gridColumns: 4, order: 2 },
	{
		property: 'formasDePagamento',
		label: 'Formas de pagamento',
		gridColumns: 12,
		order: 3,
	},
];

export interface Historico {
	codigo?: string;
	valorTarifa: string;
	dataIniVigencia: string;
	dataFimVigencia: string;
}
export const ColumnsHistorico: Array<PoTableColumn> = [
	{ property: 'codigo', visible: false },
	{
		property: 'valorTarifa',
		label: 'Valor da tarifa',
		type: 'currency',
		format: 'BRL',
	},
	{ property: 'dataIniVigencia', type: 'date', label: 'Data inicial da vigência' },
	{ property: 'dataFimVigencia', type: 'date', label: 'Data final da vigência' },
];
