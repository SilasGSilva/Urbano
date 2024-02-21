import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoModalComponent, PoNotificationService, PoBreadcrumb, PoModalAction } from '@po-ui/ng-components';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { ValidadorForm, ValidadorStruct } from './det-validadores.struct';
import { HttpParams } from '@angular/common/http';
import { ChangeUndefinedToEmpty, FindValueByName } from 'src/app/services/functions/util.function';
import { ValidaNotificacao } from 'src/app/services/functions/validateForm';

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

	nHeightMonitor: number = window.innerHeight * 0.5;

	constructor(
		private _activedRoute: ActivatedRoute,
		private _router: Router,
		private _formBuilder: FormBuilder,
		private _fwModel: FwProtheusModel,
		private _poNotification: PoNotificationService,
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
		this._fwModel.setEndPoint('GTPU005/' + this.pk);
		this._fwModel.setVirtualField(true);
		this._fwModel.get(params).subscribe({
			next: (data: any) => {
				this.breadcrumb.items[2].label = `${FindValueByName(
					data.models[0].fields,
					'H6Y_CODID'
				)} - ${FindValueByName(data.models[0].fields, 'H6Y_DESCR')}`;

				this.validadorForm.patchValue({
					codigo: FindValueByName(data.models[0].fields, 'H6Y_CODID'),
					descricao: FindValueByName(data.models[0].fields, 'H6Y_DESCR'),
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
	saveValidador(stay: boolean) : void {
		const isSubmitable: boolean = this.validadorForm.valid;

		if (isSubmitable) {
			
			this._fwModel.reset();
			this._fwModel.setModelId('GTPU005');
			this._fwModel.setEndPoint('GTPU005/');
			this._fwModel.AddModel('H6YMASTER', 'FIELDS');

			// ADICIONA CAMPOS
			this._fwModel.getModel('H6YMASTER').addField('H6Y_CODID');
			this._fwModel.getModel('H6YMASTER').addField('H6Y_DESCR');

			this._fwModel
				.getModel('H6YMASTER')
				.setValue('H6Y_CODID', ChangeUndefinedToEmpty(this.validadorForm.value.codigo.toUpperCase()));
			
			this._fwModel
				.getModel('H6YMASTER')
				.setValue('H6Y_DESCR', ChangeUndefinedToEmpty(this.validadorForm.value.descricao.toUpperCase()));

			if (this.action == 'incluir') {
				this._fwModel.operation = 3;
				this._fwModel.post().subscribe({
					next: () => {
						this._poNotification.success('Validador cadastro com sucesso!');
						if (stay) {
							this.changeLoading();
							this._fwModel.reset();
							this.validadorForm.reset();
						} else {
							this.onClickClose();
							this._fwModel.reset();
						}
					},
					error: error => {
						this._poNotification.error(error.error.errorMessage);
						this._fwModel.reset();
					},
					complete: () => {
						this.changeLoading();
					},
				});
			} else {
				this._fwModel.operation = 4;
				this._fwModel.setEndPoint('GTPU005/' + this.pk);

				this._fwModel.put().subscribe({
					next: () => {
						this._poNotification.success('Validador alterado com sucesso!');
					},
					error: error => {
						this._poNotification.error(error.error.errorMessage);
						this._fwModel.reset();
					},
					complete: () => {
						this.changeLoading();
					},
				});
			}
		} else {
			this._poNotification.error(ValidaNotificacao(this.validadorForm));
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
	 * @name onClickClose
	 * @description Função responsavél por cancelar a ação e voltar para a tela
	 * inicial de validadores.
	 * @author   Serviços | Silas Gomes
	 * @since       2024
	 * @version v1
	 *******************************************************************************/
	onClickClose(): void {
		this._fwModel.reset();
		this._router.navigate(['validadores']);
	}
}
