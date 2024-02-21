import { Component, ViewChild } from '@angular/core';
import {
	PoBreadcrumb,
	PoDynamicFieldType,
	PoDynamicFormField,
	PoDynamicViewField,
	PoModalComponent,
	PoNotificationService,
	PoPageAction,
} from '@po-ui/ng-components';
import { ProgramacaoLinhasStruct, itemsDynamicView } from './det-programacao-linhas.struct';
import { HttpParams } from '@angular/common/http';
import { FindValueByName } from 'src/app/services/functions/util.function';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-det-programacao-linhas',
	templateUrl: './det-programacao-linhas.component.html',
	styleUrls: ['./det-programacao-linhas.component.css'],
	providers: [ProgramacaoLinhasStruct],
})
export class DetProgramacaoLinhasComponent {
	@ViewChild('modalCancel', { static: false })
	modalCancel!: PoModalComponent;

	public isShowLoading: boolean = false;

	public action: string = '';
	public pk: string = '';
	public filial: string = '';
	public title: string = '';

	public columnsDynamicView: Array<PoDynamicViewField> = this._structView.ColumnsDynamicView;
	public itemsDynamicView: itemsDynamicView;

	progLinha!: FormGroup;

	constructor(
		private _activedRoute: ActivatedRoute,
		private _router: Router,
		private _structView: ProgramacaoLinhasStruct,
		private _fwModel: FwProtheusModel,
		private _poNotification: PoNotificationService
	) {
		this.pk = this._activedRoute.snapshot.params['pk'];
		this.filial = this._activedRoute.snapshot.params['filial'];
	}

	public readonly actions: Array<PoPageAction> = [
		{ label: 'Avançar' },
		{
			label: 'Cancelar',
			action: () => {
				this.modalCancel.open();
			},
		},
	];

	public breadcrumb: PoBreadcrumb = {
		items: [
			{ label: 'Fretamento Urbano', link: '/' },
			{ label: 'Programação das linhas', link: '/programacao-linhas' },
			{ label: '' },
		],
	};

	ngOnInit() {
		this.getInfoDynamicView();
	}

	/*******************************************************************************
	 * @name getInfoDynamicView
	 * @description Função responsável por buscar os dados e carregar na tela
	 * preenchendo os campos para visualização
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	getInfoDynamicView() {
		this.changeLoading();
		let params = new HttpParams();
		this._fwModel.reset();
		this._fwModel.setEndPoint('GTPA001/' + this.pk);
		this._fwModel.setVirtualField(true);
		this._fwModel.get(params).subscribe({
			next: (data: any) => {
				this.title = `Programar Linha - Prefixo ${FindValueByName(data.models[0].fields, 'GI1_COD')}`;
				this.breadcrumb.items[2].label = this.title;

				console.log(data.models[0]);
				this.itemsDynamicView = {
					codigo: `${FindValueByName(data.models[0].fields, 'GI1_COD')}`,
					descricao: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
					origem: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
					destino: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
					tarifa: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
					pedagio: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
					kmLinha: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
					categoria: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
				};
			},
			error: (err: any) => {
				this._poNotification.error(err.errorMessage);
			},
			complete: () => {
				this.changeLoading();
			},
		});
	}

	/*******************************************************************************
	 * @name changeLoading
	 * @description Função responsável por trocar o valor da flag isShowLoading,
	 * para mostrar ou esconder o loading na tela
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	changeLoading() {
		if (this.isShowLoading) {
			this.isShowLoading = false;
		} else {
			this.isShowLoading = true;
		}
	}

	backToProg() {
		this._router.navigate(['/programacao-linhas']);
	}
}
