import { Injectable } from '@angular/core';
import { PoDynamicViewField } from '@po-ui/ng-components';

@Injectable()
export class SecoesStruct {
	/**
	 * Coluna para visualização das seções
	 */
	ColumnsDynamicView: Array<PoDynamicViewField> = [
		{
			property: 'codigo',
			gridColumns: 4,
			order: 1,
			label: 'Frefixo da linha',
		},
		{ property: 'descricao', label: 'Descrição', gridColumns: 8, order: 1 },
		{ property: 'origem', label: 'Origem', gridColumns: 4, order: 2 },
		{
			property: 'destino',
			label: 'Destino',
			gridColumns: 4,
			order: 2,
		},
		{ property: 'sentido', label: 'Sentido', gridColumns: 4, order: 2 },
		{
			property: 'linhasAssociadas',
			label: 'Linhas associadas',
			gridColumns: 8,
			order: 3,
		},
		{
			property: 'status',
			label: 'Status',
			gridColumns: 4,
			order: 3,
			// tag: true,
			options: [
				{ value: 1, label: 'Ativa' },
				{ value: 2, label: 'Inativa' },
			],
		},
	];
}

export interface itemsDynamicView {
	codigo: string;
	descricao: string;
	origem: string;
	destino: string;
	sentido: string;
	linhasAssociadas: Array<any>;
	status: number;
}
