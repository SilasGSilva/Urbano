import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoDynamicViewField, PoNotificationService, PoPageAction } from '@po-ui/ng-components';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { FindValueByName, MakeDate } from 'src/app/services/functions/util.function';
import { ColumnsDynamicView, ColumnsHistorico, Historico } from './view-tarifas.struct';

@Component({
	selector: 'app-view-tarifas',
	templateUrl: './view-tarifas.component.html',
	styleUrls: ['./view-tarifas.component.css'],
	providers: [],
})
export class ViewTarifasComponent {
	public isShowLoading: boolean = false;

	public action: string = '';
	public pk: string = '';
	public filial: string = '';
	public title: string = '';

	itemsHistorico: Array<any> = [];
	columnsHistorico: Array<any> = ColumnsHistorico;
	columnsDynamicView: Array<PoDynamicViewField> = ColumnsDynamicView;
	itemsDynamicView: any = {};

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
				this._router.navigate(['tarifas/detTarifas', 'editar', btoa(this.filial), this.pk]);
			},
		},
		{
			label: 'Fechar',
			action: () => {
				this._router.navigate(['tarifas']);
			},
		},
	];

	public breadcrumb: PoBreadcrumb = {
		items: [
			{ label: 'Fretamento Urbano', link: '/' },
			{ label: 'Tarifas', link: '/tarifas' },
			{ label: '', link: '' },
		],
	};

	constructor(
		private _activedRoute: ActivatedRoute,
		private _router: Router,
		private _fwModel: FwProtheusModel,
		private _poNotification: PoNotificationService
	) {
		this.pk = this._activedRoute.snapshot.params['pk'];
		this.filial = this._activedRoute.snapshot.params['filial'];
	}
	ngOnInit() {
		this.getTarifaDynamicView();
	}

	/*******************************************************************************
	 * @name getTarifaDynamicView
	 * @description Função responsável por buscar os dados e carregar na tela
	 * preenchendo os campos para visualização
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	getTarifaDynamicView() {
		this.changeLoading();
		this.itemsHistorico = [];
		let params = new HttpParams();
		this._fwModel.reset();
		this._fwModel.setEndPoint('GTPU002/' + this.pk);
		this._fwModel.setVirtualField(true);
		this._fwModel.get(params).subscribe({
			next: (data: any) => {
				this.title = `${FindValueByName(
					data.models[0].fields,
					'H6S_CODIGO'
				)} - ${FindValueByName(data.models[0].fields, 'H6S_DESCRI')}`;
				this.breadcrumb.items[2].label = this.title;
				let details = data.models[0].models;
				let formaPag: string = '';
				details.forEach(details => {
					if (details.id == 'H6TDETAIL') {
						details.items.forEach(historico => {
							let detHistorico = {} as Historico;
							detHistorico.valorTarifa = FindValueByName(historico.fields, 'H6T_VALOR');
							detHistorico.dataIniVigencia = MakeDate(
								FindValueByName(historico.fields, 'H6T_DTINIV'),
								'yyyy-mm-dd'
							);
							detHistorico.dataFimVigencia = MakeDate(
								FindValueByName(historico.fields, 'H6T_DTFIMV'),
								'yyyy-mm-dd'
							);

							this.itemsHistorico = [...this.itemsHistorico, detHistorico];
						});
					} else {
						details.items.forEach(itemFormaPag => {
							if (formaPag != '') {
								formaPag += '; ';
							}
							formaPag += FindValueByName(itemFormaPag.fields, 'H6U_CODH6R');
						});
					}
				});
				this.itemsDynamicView = {
					codigo: FindValueByName(data.models[0].fields, 'H6S_CODIGO'),
					descricao: FindValueByName(data.models[0].fields, 'H6S_DESCRI'),
					orgaoConcessor:
						FindValueByName(data.models[0].fields, 'H6S_CODGI0') +
						' - ' +
						FindValueByName(data.models[0].fields, 'H6S_DESORG'),
					valor: FindValueByName(data.models[0].fields, 'H6S_VALOR'),
					vigencia:
						MakeDate(FindValueByName(data.models[0].fields, 'H6S_DTINIV'), 'dd/mm/yyyy') +
						' - ' +
						MakeDate(FindValueByName(data.models[0].fields, 'H6S_DTFIMV'), 'dd/mm/yyyy'),

					formasDePagamento: formaPag,
				};
			},
			error: (err: any) => {
				this._poNotification.error(err.errorMessage);
				this.changeLoading();
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
}
