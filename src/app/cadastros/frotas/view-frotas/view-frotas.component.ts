import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	PoDynamicViewField,
	PoNotificationService,
	PoPageAction,
	PoBreadcrumb,
	PoTableColumnSort,
	PoTableColumn,
} from '@po-ui/ng-components';
import { FindValueByName, UtilsService } from 'src/app/services/functions/util.function';
import { FwProtheusModel, Resource } from 'src/app/services/models/fw-protheus.model';
import { itemsDynamicView, FrotasStruct, FrotasModelView, ColumnsFrotasView } from './view-frotas.struct';

@Component({
	selector: 'app-view-frotas',
	templateUrl: './view-frotas.component.html',
	styleUrls: ['./view-frotas.component.css'],
	providers: [FrotasStruct],
})
export class ViewFrotasComponent {
	public isShowLoading: boolean = false;

	public action: string = '';
	public pk: string = '';
	public filial: string = '';
	public title: string = '';

	public listTable: Array<FrotasModelView> = [];
	public columnsTable: Array<PoTableColumn> = ColumnsFrotasView;

	public columnsDynamicView: Array<PoDynamicViewField> = this._structView.ColumnsDynamicView;

	public itemsDynamicView: itemsDynamicView;

	public nHeightMonitor: number = window.innerHeight * (window.innerHeight > 850 ? 0.6 : 0.6);

	constructor(
		private _activedRoute: ActivatedRoute,
		private _router: Router,
		private _fwModel: FwProtheusModel,
		private _poNotification: PoNotificationService,
		private _structView: FrotasStruct,
		private _utilsService: UtilsService
	) {
		this.pk = this._activedRoute.snapshot.params['pk'];
		this.filial = this._activedRoute.snapshot.params['filial'];
	}

	/*******************************************************************************
	 * @name actions
	 * @description Ações no menu superior direito da tela, botão de editar e fechar
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	actions: Array<PoPageAction> = [
		{
			label: 'Editar',
			action: () => {
				this._router.navigate(['frota/detFrota', 'editar', btoa(this.filial), this.pk]);
			},
		},
		{
			label: 'Fechar',
			action: () => {
				this._router.navigate(['frota']);
			},
		},
	];

	public breadcrumb: PoBreadcrumb = {
		items: [
			{ label: 'Fretamento Urbano', link: '/' },
			{ label: 'Cadastrar Frota', link: '/frota' },
			{ label: '', link: '' },
		],
	};

	ngOnInit() {
		this.getFrotasDynamicView();
		this.getDocumentosDynamicView();
	}

	/*******************************************************************************
	 * @name getFrotasDynamicView
	 * @description Função responsável por buscar os dados e carregar na tela
	 * preenchendo os campos para visualização
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	getFrotasDynamicView() {
		this.changeLoading();
		let params = new HttpParams();
		this._fwModel.reset();
		this._fwModel.setEndPoint('GTPA001/' + this.pk);
		this._fwModel.setVirtualField(true);
		this._fwModel.get(params).subscribe({
			next: (data: any) => {
				this.title = `${FindValueByName(data.models[0].fields, 'GI1_CDMUNI')}`;
				this.breadcrumb.items[2].label = this.title;

				this.itemsDynamicView = {
					prefixo: parseInt(FindValueByName(data.models[0].fields, 'GI1_CDMUNI')),
					placa: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
					marca: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
					anoFabricacao: parseInt(FindValueByName(data.models[0].fields, 'GI1_CDMUNI')),
					anoModelo: parseInt(FindValueByName(data.models[0].fields, 'GI1_CDMUNI')),
					categoria: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
					local: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
					nChassi: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
					codRenavam: parseInt(FindValueByName(data.models[0].fields, 'GI1_CDMUNI')),
					validador: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
					roleta: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
					statusVeiculo: '1',
					configPortas: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
					nPortasEsquerda: parseInt(FindValueByName(data.models[0].fields, 'GI1_CDMUNI')),
					nPortasDireita: parseInt(FindValueByName(data.models[0].fields, 'GI1_CDMUNI')),
					lotacaoSentado: parseInt(FindValueByName(data.models[0].fields, 'GI1_CDMUNI')),
					lotacaoEmPe: parseInt(FindValueByName(data.models[0].fields, 'GI1_CDMUNI')),
					caracteristicasRoleta: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
					metragemChassi: parseInt(FindValueByName(data.models[0].fields, 'GI1_CDMUNI')),
					acessibilidade: parseInt(FindValueByName(data.models[0].fields, 'GI1_CDMUNI')),
					postoCobrador: parseInt(FindValueByName(data.models[0].fields, 'GI1_CDMUNI')),
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

	/*******************************************************************************
	 * @name sortTable
	 * @description Função chamada ao ordenar uma coluna na tabela, chama a
	 * função de ordenação no utils
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	sortTable(event: PoTableColumnSort) {
		const result = [...this.listTable];

		result.sort((value, valueToCompare) => this._utilsService.sort(value, valueToCompare, event));
		this.listTable = result;
	}

	/*******************************************************************************
	 * @name getDocumentosDynamicView
	 * @description Função responsável por buscar os dados e carregar na tela
	 * preenchendo os campos para visualização
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	getDocumentosDynamicView() {
		let params = new HttpParams();

		this._fwModel.setEndPoint('GTPA001/');

		this._fwModel.setVirtualField(true);
		this._fwModel.get(params).subscribe(() => {
			this._fwModel.resources.forEach((resource: Resource) => {
				let documento = new FrotasModelView();
				documento.nDocumento = resource.getModel('GI1MASTER').getValue('GI1_COD');

				documento.dataEmissao = new Date().toLocaleString().substr(0, 10);
				documento.dataVencimento = new Date().toLocaleString().substr(0, 10);
				documento.dataTolerancia = new Date().toLocaleString().substr(0, 10);

				documento.status = 1;

				this.listTable = [...this.listTable, documento];
			});
		});
	}
}
