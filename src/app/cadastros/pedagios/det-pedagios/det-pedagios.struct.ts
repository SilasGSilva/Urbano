import { Injectable } from '@angular/core';
import { PoDynamicViewField, PoTableColumn } from '@po-ui/ng-components';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { of } from 'rxjs';
import { validUrl } from 'src/app/services/functions/util.function';

export interface PedagioForm {
	codigo: string;
	descricao: string;
	valor: string;
	vigencia: string;
}

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
				property: 'valorTarifa',
				label: 'Valor da tarifa',
				type: 'currency',
				format: 'BRL',
				width: '20% ',
			},
			{ property: 'dataIni', label: 'Data inicial da vigência' },
			{ property: 'dataFim', label: 'Data final da vigência' },
		];
	}

	getItemsTable(): Array<any> {
		return [
			{
				codigo: 'AAA12',
				valorTarifa: 5.5,
				dataIni: '01/02/2024',
				dataFim: '01/04/2024',
			},
			{
				codigo: 'AAA12',
				valorTarifa: 3.5,
				dataIni: '01/02/2022',
				dataFim: '01/01/2023',
			},
			{
				codigo: 'AAA12',
				valorTarifa: 4.5,
				dataIni: '01/02/2023',
				dataFim: '31/01/2024',
			},
		];
	}
}

export function verifyDatePickerRange(control: AbstractControl): ValidationErrors | null {
	if (
		control.value.start !== '' &&
		control.value.start !== undefined &&
		control.value.end !== '' &&
		control.value.end !== undefined
	) {
		return of(null);
	} else {
		return of({ datePickerValidity: true });
	}
}
