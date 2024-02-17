import { PoTableColumn } from '@po-ui/ng-components';

export interface TarifaForm {
	codigo: string;
	descricao: string;
	valor: string;
	orgaoConcessor: string;
	vigencia: string;
}
export class FormaPagamentoForm {
	codigoFormaPag: string;
}
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
