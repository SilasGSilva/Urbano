import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
	PoBreadcrumb,
	PoComboComponent,
	PoDatepickerRange,
	PoLookupColumn,
	PoModalAction,
	PoModalComponent,
	PoNotificationService,
} from '@po-ui/ng-components';
import { ColumnsHistorico, Historico, TarifaForm } from './det-tarifas.struct';
import { HttpParams } from '@angular/common/http';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { ChangeUndefinedToEmpty, FindValueByName, MakeDate } from 'src/app/services/functions/util.function';
import { OrgaoConcedenteComboService } from 'src/app/services/combo-filter.service';
import { FormaPagamentoComboService } from 'src/app/services/lookups.service';
import { ValidaNotificacao } from 'src/app/services/functions/validateForm';
@Component({
	selector: 'app-det-tarifas',
	templateUrl: './det-tarifas.component.html',
	styleUrls: ['./det-tarifas.component.css'],
	providers: [OrgaoConcedenteComboService, FormaPagamentoComboService],
})
export class DetTarifasComponent {
	tarifaForm!: FormGroup;

	public isShowLoading: boolean = false;
	public editView: boolean = false;
	public isVisibleBtn: boolean = false;

	public action: string = '';
	public pk: string = '';
	public filial: string = '';
	public title: string = '';
	public subtitle: string = '';

	dataIniVigencia: string = '';
	dataFimVigencia: string = '';
	valorVigenciaOld: string = '';
	dataOldIniVigencia: string = '';
	dataOldFimVigencia: string = '';
	listFormaPag: Array<any> = [];
	listOldFormaPag: Array<any> = [];
	columnsHistorico: Array<any> = ColumnsHistorico;

	nHeightMonitor: number = window.innerHeight * 0.5;

	public itemsHistorico: Array<any> = [];
	public columns: PoLookupColumn[] = [
		{ property: 'value', label: 'Código' },
		{ property: 'label', label: 'Descrição' },
	];

	public breadcrumb: PoBreadcrumb = {
		items: [{ label: 'Fretamento Urbano', link: '/' }, { label: 'Tarifas', link: '/tarifas' }, { label: '' }],
	};

	/*******************************************************************************
	 * @name confirmCancel
	 * @description Ação responsável por cancelar o processo atual quando perguntado
	 * no modal e navega de volta para o browse
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	public confirmCancel: PoModalAction = {
		label: 'Sim',
		action: () => {
			this.modalCancel.close();
			this._router.navigate(['tarifas']);
		},
	};

	/*******************************************************************************
	 * @name exitCancel
	 * @description Ação responsável por manter no processo atual quando perguntado
	 * no modal e permanece na mesma tela
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	public exitCancel: PoModalAction = {
		label: 'Não',
		action: () => this.modalCancel.close(),
	};

	@ViewChild('modalCancel', { static: false }) modalCancel!: PoModalComponent;
	@ViewChild('modalConfirmation', { static: false }) modalConfirmation!: PoModalComponent;
	@ViewChild('orgaoConcessorFilterCombo', { static: true }) orgaoConcessorFilterCombo!: PoComboComponent;
	@ViewChild('formasDePagamento', { static: true }) formasDePagamento!: PoLookupColumn;
	@ViewChild('vigenciafilterRange', { static: true }) vigenciafilterRange!: PoDatepickerRange;
	constructor(
		private _activedRoute: ActivatedRoute,
		private _router: Router,
		private _formBuilder: FormBuilder,
		public orgaoConcessorComboService: OrgaoConcedenteComboService,
		public poLookUpFormasDePagamento: FormaPagamentoComboService,
		private _fwModel: FwProtheusModel,
		private _poNotification: PoNotificationService
	) {
		this.action = this._activedRoute.snapshot.params['acao'];
		this.pk = this._activedRoute.snapshot.params['pk'];
	}

	ngOnInit(): void {
		switch (this.action) {
			case 'editar':
				this.editView = true;
				this.filial = atob(this._activedRoute.snapshot.params['filial']);
				this.title = 'Editar tarifa';
				this.subtitle = 'Edite as informações da tarifa:';
				this.breadcrumb.items[2].label = 'Alterar Tarifa';
				break;
			case 'incluir':
				this.title = 'Incluir tarifa';
				this.subtitle = 'Preencha as informações da tarifa:';
				this.isVisibleBtn = true;
				this.breadcrumb.items[2].label = 'Incluir tarifa';
				break;
		}

		//Criando o formulario
		this.createForm();

		if (this.pk != undefined) {
			//Edição, faz a carga dos valores
			this.getTarifa();
		}
	}

	/*******************************************************************************
	 * @name createForm
	 * @description Função responsável por criar e inicializar o formulário para
	 * criação ou edição das tarifas
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	createForm(): any {
		const tarifa: TarifaForm = {} as TarifaForm;
		this.tarifaForm = this._formBuilder.group({
			codigo: [tarifa.codigo],
			descricao: [tarifa.descricao, Validators.compose([Validators.required])],
			valor: [tarifa.valor, Validators.compose([Validators.required])],
			orgaoConcessor: [tarifa.orgaoConcessor, Validators.compose([Validators.required])],
			vigencia: [tarifa.vigencia, Validators.compose([Validators.required])],
		});
	}

	/*******************************************************************************
	 * @name getTarifa
	 * @description Funççao responsável por buscar os dados da tarifa quando for
	 * editar uma tarifa
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	getTarifa() {
		this.changeLoading();
		let params = new HttpParams();
		let formaPag: Array<any> = [];
		this.itemsHistorico = [];
		this._fwModel.reset();
		this._fwModel.setEndPoint('GTPU002/' + this.pk);
		this._fwModel.setVirtualField(true);
		this._fwModel.setFirstLevel(true);
		this._fwModel.get(params).subscribe({
			next: (data: any) => {
				this.breadcrumb.items[2].label = `${FindValueByName(
					data.models[0].fields,
					'H6S_CODIGO'
				)} - ${FindValueByName(data.models[0].fields, 'H6S_DESCRI')}`;

				this._fwModel
					.getModel('H6SMASTER')
					.getModel('H6UDETAIL')
					.items.forEach(item => {
						formaPag.push(item.getValue('H6U_CODH6R'));
					});
				this.listFormaPag = [...this.listFormaPag, formaPag]; //Carrega as formas de pagamentos selecionadas
				this.listOldFormaPag = this.listFormaPag;
				this._fwModel
					.getModel('H6SMASTER')
					.getModel('H6TDETAIL')
					.items.forEach(item => {
						let detHistorico = {} as Historico;
						detHistorico.valorTarifa = item.getValue('H6T_VALOR');
						detHistorico.dataIniVigencia = MakeDate(item.getValue('H6T_DTINIV'), 'yyyy-mm-dd');
						detHistorico.dataFimVigencia = MakeDate(item.getValue('H6T_DTFIMV'), 'yyyy-mm-dd');
						this.itemsHistorico = [...this.itemsHistorico, detHistorico];
					});

				this.tarifaForm.patchValue({
					codigo: FindValueByName(data.models[0].fields, 'H6S_CODIGO'),
					descricao: FindValueByName(data.models[0].fields, 'H6S_DESCRI'),
					valor: FindValueByName(data.models[0].fields, 'H6S_VALOR'),
					orgaoConcessor: FindValueByName(data.models[0].fields, 'H6S_CODGI0'),
					vigencia: {
						start: MakeDate(FindValueByName(data.models[0].fields, 'H6S_DTINIV'), 'yyyy-mm-dd'),
						end: MakeDate(FindValueByName(data.models[0].fields, 'H6S_DTFIMV'), 'yyyy-mm-dd'),
					},
				});
				this.valorVigenciaOld = FindValueByName(data.models[0].fields, 'H6S_VALOR');
				this.dataOldIniVigencia = FindValueByName(data.models[0].fields, 'H6S_DTINIV');
				this.dataOldFimVigencia = FindValueByName(data.models[0].fields, 'H6S_DTFIMV');
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
	/**
	 * @name setRangeFilter
	 * @description Seta a data inicial e final se for selecionada
	 * @param event
	 * @author   Serviços | Breno Gomes
	 * @since    2024
	 * @version  v1
	 */
	setRangeFilter(event: any) {
		this.dataIniVigencia = event.start != '' ? event.start : '';
		this.dataFimVigencia = event.end != '' ? event.end : '';
	}
	/*******************************************************************************
	 * @name saveTarifa
	 * @description Função responsável por salvar a nova tarifa ou editar
	 * uma tarifa escolhida e navegar de volta pro browse
	 * @param isSaveNew: boolean - indica se irá ficar na tela atual ou retornará ao
	 * browser
	 * @param generateHistory: boolean - indica se ao alterar, irá gerar histórico
	 * sim ou não
	 * @author   Serviços | Levy Santos, Breno Gomes
	 * @since    2024
	 * @version  v2
	 *******************************************************************************/
	saveTarifa(isSaveNew: boolean, generateHistory?: boolean) {
		this.changeLoading();
		let isSubmitable: boolean = this.tarifaForm.valid;

		if (isSubmitable) {
			this.dataIniVigencia = this.dataIniVigencia == '' ? this.tarifaForm.value.vigencia.start : this.dataIniVigencia;
			this.dataFimVigencia = this.dataFimVigencia == '' ? this.tarifaForm.value.vigencia.end : this.dataFimVigencia;
			let formaPagSel: Array<any> =
				this.formasDePagamento['disclaimers'].length > 0
					? this.formasDePagamento['disclaimers']
					: this.formasDePagamento['selectedOptions'];
			this._fwModel.reset();
			this._fwModel.setModelId('GTPU002');
			this._fwModel.setEndPoint('GTPU002/');
			this._fwModel.AddModel('H6SMASTER', 'FIELDS');

			this._fwModel.getModel('H6SMASTER').addField('H6S_DESCRI'); // DESCRIÇÃO
			this._fwModel.getModel('H6SMASTER').addField('H6S_VALOR'); // VALOR
			this._fwModel.getModel('H6SMASTER').addField('H6S_CODGI0'); // CODIGO ORGAO
			this._fwModel.getModel('H6SMASTER').addField('H6S_DTINIV'); // DATA INICIAL
			this._fwModel.getModel('H6SMASTER').addField('H6S_DTFIMV'); // DATA FINAL

			this._fwModel
				.getModel('H6SMASTER')
				.setValue('H6S_DESCRI', ChangeUndefinedToEmpty(this.tarifaForm.value.descricao));
			this._fwModel
				.getModel('H6SMASTER')
				.setValue('H6S_VALOR', ChangeUndefinedToEmpty(this.tarifaForm.value.valor.toString()));
			this._fwModel
				.getModel('H6SMASTER')
				.setValue('H6S_CODGI0', ChangeUndefinedToEmpty(this.orgaoConcessorFilterCombo.selectedValue));
			this._fwModel
				.getModel('H6SMASTER')
				.setValue('H6S_DTINIV', this.dataIniVigencia != '' ? this.dataIniVigencia.replace(/-/g, '') : '');
			this._fwModel
				.getModel('H6SMASTER')
				.setValue('H6S_DTFIMV', this.dataFimVigencia != '' ? this.dataFimVigencia.replace(/-/g, '') : '');

			formaPagSel.forEach(item => {
				//Adiciona as formas de pagamento ao grid
				this._fwModel.getModel('H6SMASTER').getModel('H6UDETAIL').AddItem();
				this._fwModel
					.getModel('H6SMASTER')
					.getModel('H6UDETAIL')
					.setValue('H6U_CODH6R', ChangeUndefinedToEmpty(item.value));
			});

			if (this.editView) {
				//Verifica se foi retirado alguma forma de pagamento do combo, e faz a deleção do grid
				for (let i = 0; i < this.listOldFormaPag[0].length; i++) {
					const item = this.listOldFormaPag[0][i];
					if (!this.formasDePagamento['disclaimers'].some(disclaimer => disclaimer.value === item)) {
						this._fwModel.getModel('H6SMASTER').getModel('H6UDETAIL').AddItem();
						this._fwModel
							.getModel('H6SMASTER')
							.getModel('H6UDETAIL')
							.setValue('H6U_CODH6R', ChangeUndefinedToEmpty(item));
						this._fwModel.getModel('H6SMASTER').getModel('H6UDETAIL').delete();
					}
				}
				//Gera o histórico
				if (generateHistory) {
					this.itemsHistorico.forEach(hist => {
						this._fwModel.getModel('H6SMASTER').getModel('H6TDETAIL').AddItem();
						this._fwModel.getModel('H6SMASTER').getModel('H6TDETAIL').addField('H6T_VALOR'); // VALOR
						this._fwModel.getModel('H6SMASTER').getModel('H6TDETAIL').addField('H6T_DTINIV'); // DATA FINAL
						this._fwModel.getModel('H6SMASTER').getModel('H6TDETAIL').addField('H6T_DTFIMV'); // DATA FINAL
						this._fwModel
							.getModel('H6SMASTER')
							.getModel('H6TDETAIL')
							.setValue('H6T_VALOR', ChangeUndefinedToEmpty(hist.valorTarifa));
						this._fwModel
							.getModel('H6SMASTER')
							.getModel('H6TDETAIL')
							.setValue('H6T_DTINIV', hist.dataIniVigencia.replace(/-/g, ''));
						this._fwModel
							.getModel('H6SMASTER')
							.getModel('H6TDETAIL')
							.setValue('H6T_DTFIMV', hist.dataFimVigencia.replace(/-/g, ''));
					});
					this._fwModel.getModel('H6SMASTER').getModel('H6TDETAIL').AddItem();
					this._fwModel.getModel('H6SMASTER').getModel('H6TDETAIL').addField('H6T_VALOR'); // VALOR
					this._fwModel.getModel('H6SMASTER').getModel('H6TDETAIL').addField('H6T_DTINIV'); // DATA FINAL
					this._fwModel.getModel('H6SMASTER').getModel('H6TDETAIL').addField('H6T_DTFIMV'); // DATA FINAL
					this._fwModel
						.getModel('H6SMASTER')
						.getModel('H6TDETAIL')
						.setValue('H6T_VALOR', ChangeUndefinedToEmpty(this.valorVigenciaOld));
					this._fwModel
						.getModel('H6SMASTER')
						.getModel('H6TDETAIL')
						.setValue('H6T_DTINIV', this.dataOldIniVigencia);
					this._fwModel
						.getModel('H6SMASTER')
						.getModel('H6TDETAIL')
						.setValue('H6T_DTFIMV', this.dataOldFimVigencia);
				}
				this._fwModel.operation = 4;
				this._fwModel.setEndPoint('GTPU002/' + this.pk);

				this._fwModel.put().subscribe({
					next: () => {
						this._poNotification.success('Tarifa atualizada com sucesso');
						this.close();
						this.changeLoading();
					},
					error: error => {
						this._poNotification.error(error.error.errorMessage);
						this._fwModel.reset();
						this.changeLoading();
					},
				});
			} else {
				this._fwModel.operation = 3;
				this._fwModel.post().subscribe({
					next: () => {
						if (isSaveNew) {
							this._fwModel.reset();
							this.tarifaForm.reset();
							this.formasDePagamento['disclaimers'] = [];
							this.formasDePagamento['valueToModel'] = [];
							this.formasDePagamento['visibleDisclaimers'] = [];
						} else {
							this.close();
						}
					},
					error: error => {
						this._poNotification.error(error.error.errorMessage);
						this._fwModel.reset();
						this.changeLoading();
					},
					complete: () => {
						this.changeLoading();
						this._poNotification.success('Tarifa criada com sucesso!');
					},
				});
			}
		} else {
			this._poNotification.error(ValidaNotificacao(this.tarifaForm));
			this.changeLoading();
		}
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
	 * @name close
	 * @description Função responsável por redirecionar para a tela de tarifas
	 * @author	    Serviços | Breno Gomes
	 * @since		2024
	 * @version     v1
	 *******************************************************************************/
	close() {
		this._router.navigate(['tarifas']);
	}
}
