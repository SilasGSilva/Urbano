import { Injectable } from '@angular/core';
import { PoDynamicViewField } from '@po-ui/ng-components';

@Injectable()
export class ProgramacaoLinhasStruct {
	/**
	 * Coluna para visualização das programações das linhas
	 */
	ColumnsDynamicView: Array<PoDynamicViewField> = [
		{ property: 'codigo', gridColumns: 3, order: 1, label: 'Código da linha' },
		{ property: 'descricao', label: 'Descrição da linha', gridColumns: 3, order: 1 },
		{ property: 'origem', label: 'Origem', gridColumns: 3, order: 1,},
		{ property: 'destino', label: 'Destino', gridColumns: 3, order: 1 },
		{ property: 'tarifa', label: 'Tarifa', gridColumns: 3, order: 2 },
		{ property: 'pedagio', label: 'Pedágio', gridColumns: 3, order: 2 },
		{ property: 'kmLinha', label: 'Km da linha', gridColumns: 3, order: 2 },
		{ property: 'categoria', label: 'Categoria', gridColumns: 3, order: 2 },
	];
}

export interface itemsDynamicView {
	codigo: string;
	descricao: string;
	origem: string;
	destino: string;
	tarifa: string;
	pedagio: string;
	kmLinha: string;
	categoria: string;
}
