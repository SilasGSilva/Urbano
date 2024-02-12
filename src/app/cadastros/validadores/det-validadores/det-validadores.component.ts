import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoModalComponent, PoNotificationService, PoLookupColumn, PoBreadcrumb, PoModalAction } from '@po-ui/ng-components';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { ValidadorForm, ValidadorStruct } from './det-validadores.struct';
import { HttpParams } from '@angular/common/http';
import { FindValueByName } from 'src/app/services/functions/util.function';

@Component({
	selector: 'app-det-validadores',
	templateUrl: './det-validadores.component.html',
	styleUrls: ['./det-validadores.component.css'],
	providers: [ValidadorStruct],
})
export class DetValidadoresComponent {
	@ViewChild('modalCancel', { static: false })
	modalCancel!: PoModalComponent;

	@ViewChild('modalConfirmation', { static: false })
	modalConfirmation!: PoModalComponent;

	validadorForm!: FormGroup;

	public isShowLoading: boolean = false;
	public editView: boolean = false;
	public isVisibleBtn: boolean = false;

	public action: string = '';
	public pk: string = '';
	public description: string = '';
	public filial: string = '';
	public title: string = '';
	public subtitle: string = '';
	public orgaoConcessor: string = '';
	public formasDePagamento: string = '';
	public vigenciaStartFilter: string = '';
	public vigenciaEndFilter: string = '';
	public filterParamOrgaoConcessor: string = '';
	public filterParamFormasDePagamento: string = '';

	nHeightMonitor: number = window.innerHeight * 0.5;

	constructor(
		private _activedRoute: ActivatedRoute,
		private _router: Router,
		private _formBuilder: FormBuilder,
		private _fwModel: FwProtheusModel,
		private _poNotification: PoNotificationService,
		private _structValidador: ValidadorStruct
	) {
		this.action = this._activedRoute.snapshot.params['acao'];
		this.pk = this._activedRoute.snapshot.params['pk'];
	}

	public breadcrumb: PoBreadcrumb = {
		items: [
			{ label: 'Fretamento Urbano', link: '/' },
			{ label: 'Cadastrar Validadores', link: '/validadores' },
			{ label: 'Incluir validador', link: '' },
		],
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
			this._router.navigate(['validadores']);
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

	ngOnInit() {
		switch (this.action) {
			case 'editar':
				this.editView = true;
				this.filial = atob(this._activedRoute.snapshot.params['filial']);
				this.title = 'Editar validador';
				this.subtitle = 'Edite as informações do validador:';
				this.getValidador();

				break;
			case 'incluir':
				this.title = 'Incluir validador';
				this.subtitle = 'Preencha as informações do validador:';
				this.isVisibleBtn = true;
				this.breadcrumb.items[2].label = 'Incluir validador';
				break;
		}

		//Criando o formulario
		this.createForm();

		if (this.pk != undefined) {
			//Edição, faz a carga dos valores
			this.getValidador();
		}
	}

	/*******************************************************************************
	 * @name createForm
	 * @description Função responsável por criar e inicializar o formulário para
	 * criação ou edição dos validadores
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	createForm(): any {
		const validador: ValidadorForm = {} as ValidadorForm;
		this.validadorForm = this._formBuilder.group({
			codigo: [validador.codigo, Validators.compose([Validators.required])],
			descricao: [validador.descricao, Validators.compose([Validators.required])],
		});
	}

	/*******************************************************************************
	 * @name getValidador
	 * @description Função responsável por buscar os dados do validador quando for
	 * editar um validador
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	getValidador() {
		this.changeLoading();
		let params = new HttpParams();
		this._fwModel.reset();
		this._fwModel.setEndPoint('GTPA001/' + this.pk);
		this._fwModel.setVirtualField(true);
		this._fwModel.get(params).subscribe({
			next: (data: any) => {
				this.breadcrumb.items[2].label = `${FindValueByName(
					data.models[0].fields,
					'GI1_COD'
				)} - ${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`;

				this.validadorForm.patchValue({
					codigo: FindValueByName(data.models[0].fields, 'GI1_COD'),
					descricao: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
				});
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
	 * @name saveValidador
	 * @description Função responsável por salvar o novo validador ou editar
	 * um validador escolhido e navegar de volta pro browse
	 * @param stay: boolean - indica se irá ficar na tela atual ou retornará ao
	 * browser
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	saveValidador(stay: boolean) {
		if (!this.editView) {
			//novo validador
			this.changeLoading();
			setTimeout(() => {
				this.changeLoading();
				if (!stay) {
					this.validadorForm.patchValue({
						codigo: '',
						descricao: '',
						valor: '',
						orgaoConcessor: '',
						vigencia: '',
						formasDePagamento: '',
					});
					this._router.navigate(['validadores']);
				} else {
					this.validadorForm.patchValue({
						codigo: '',
						descricao: '',
						valor: '',
						orgaoConcessor: '',
						vigencia: '',
						formasDePagamento: '',
					});
				}
				this._poNotification.success('Validador criado com sucesso!');
			}, 1000);
		} else {
			//editar validador
			this.changeLoading();
			setTimeout(() => {
				this.validadorForm.patchValue({
					codigo: '',
					descricao: '',
					valor: '',
					orgaoConcessor: '',
					vigencia: '',
					formasDePagamento: '',
				});
				this.changeLoading();
				this._router.navigate(['validadores']);
				this._poNotification.success('Validador alterado com sucesso!');
			}, 1000);
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
}
