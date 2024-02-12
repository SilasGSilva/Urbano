import { HttpParams } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoModalComponent, PoNotificationService, PoBreadcrumb, PoModalAction } from '@po-ui/ng-components';
import { FindValueByName } from 'src/app/services/functions/util.function';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { RoletaForm, RoletaStruct } from './det-roletas.struct';

@Component({
	selector: 'app-det-roletas',
	templateUrl: './det-roletas.component.html',
	styleUrls: ['./det-roletas.component.css'],
	providers: [RoletaStruct],
})
export class DetRoletasComponent {
	@ViewChild('modalCancel', { static: false })
	modalCancel!: PoModalComponent;

	@ViewChild('modalConfirmation', { static: false })
	modalConfirmation!: PoModalComponent;

	roletaForm!: FormGroup;

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
		private _structRoleta: RoletaStruct
	) {
		this.action = this._activedRoute.snapshot.params['acao'];
		this.pk = this._activedRoute.snapshot.params['pk'];
	}

	public breadcrumb: PoBreadcrumb = {
		items: [
			{ label: 'Fretamento Urbano', link: '/' },
			{ label: 'Cadastrar Roletas', link: '/roletas' },
			{ label: 'Incluir roleta', link: '' },
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
			this._router.navigate(['roletas']);
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
				this.title = 'Editar roleta';
				this.subtitle = 'Edite as informações da roleta:';
				this.getRoleta();

				break;
			case 'incluir':
				this.title = 'Incluir roleta';
				this.subtitle = 'Preencha as informações da roleta:';
				this.isVisibleBtn = true;
				this.breadcrumb.items[2].label = 'Incluir roleta';
				break;
		}

		//Criando o formulario
		this.createForm();

		if (this.pk != undefined) {
			//Edição, faz a carga dos valores
			this.getRoleta();
		}
	}

	/*******************************************************************************
	 * @name createForm
	 * @description Função responsável por criar e inicializar o formulário para
	 * criação ou edição das roletas
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	createForm(): any {
		const roleta: RoletaForm = {} as RoletaForm;
		this.roletaForm = this._formBuilder.group({
			codigo: [roleta.codigo, Validators.compose([Validators.required])],
			descricao: [roleta.descricao, Validators.compose([Validators.required])],
		});
	}

	/*******************************************************************************
	 * @name getRoleta
	 * @description Função responsável por buscar os dados da roleta quando for
	 * editar uma roleta
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	getRoleta() {
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

				this.roletaForm.patchValue({
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
	 * @name saveRoleta
	 * @description Função responsável por salvar a nova roleta ou editar
	 * uma roleta escolhida e navegar de volta pro browse
	 * @param stay: boolean - indica se irá ficar na tela atual ou retornará ao
	 * browser
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	saveRoleta(stay: boolean) {
		if (!this.editView) {
			//nova roleta
			this.changeLoading();
			setTimeout(() => {
				this.changeLoading();
				if (!stay) {
					this.roletaForm.patchValue({
						codigo: '',
						descricao: '',
						valor: '',
						orgaoConcessor: '',
						vigencia: '',
						formasDePagamento: '',
					});
					this._router.navigate(['roletas']);
				} else {
					this.roletaForm.patchValue({
						codigo: '',
						descricao: '',
						valor: '',
						orgaoConcessor: '',
						vigencia: '',
						formasDePagamento: '',
					});
				}
				this._poNotification.success('Roleta criada com sucesso!');
			}, 1000);
		} else {
			//editar roletas
			this.changeLoading();
			setTimeout(() => {
				this.roletaForm.patchValue({
					codigo: '',
					descricao: '',
					valor: '',
					orgaoConcessor: '',
					vigencia: '',
					formasDePagamento: '',
				});
				this.changeLoading();
				this._router.navigate(['roletas']);
				this._poNotification.success('Roleta alterada com sucesso!');
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
