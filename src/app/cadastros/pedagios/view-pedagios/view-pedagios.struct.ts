import { Injectable } from '@angular/core';
import { PoDynamicViewField, PoTableColumn } from '@po-ui/ng-components';

@Injectable()
export class PedagioStruct {
	/**
	 * Coluna para visualização dos pedágios
	 */
	ColumnsDynamicView: Array<PoDynamicViewField> = [
		{
			property: 'codigo',
			gridColumns: 4,
			order: 1,
			label: 'Código',
		},
		{ property: 'descricao', label: 'Descrição', gridColumns: 8, order: 1 },
		{ property: 'valor', label: 'Valor', gridColumns: 4, order: 2 },
		{ property: 'vigencia', label: 'Vigência', gridColumns: 4, order: 2 },
	];

	getColumnsTable(): Array<PoTableColumn> {
		return [
			{ property: 'codigo', visible: false },
			{
				property: 'valorPedagios',
				label: 'Valor do pedágio',
				type: 'currency',
				format: 'BRL',
				width: '20% ',
			},
			{
				property: 'dataIni',
				label: 'Data inicial da vigência' /**type: 'date'**/,
			},
			{
				property: 'dataFim',
				label: 'Data final da vigência' /**type: 'date'**/,
			},
		];
	}

	getItemsTable(): Array<any> {
		return [
			{
				codigo: 'AAA12',
				valorPedagios: 5.5,
				dataIni: '01/02/2024',
				dataFim: '01/04/2024',
			},
			{
				codigo: 'AAA12',
				valorPedagios: 3.5,
				dataIni: '01/02/2022',
				dataFim: '01/01/2023',
			},
			{
				codigo: 'AAA12',
				valorPedagios: 4.5,
				dataIni: '01/02/2023',
				dataFim: '31/01/2024',
			},
		];
	}
}
