import { HttpParams } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoModalComponent, PoNotificationService, PoBreadcrumb, PoModalAction } from '@po-ui/ng-components';
import { ChangeUndefinedToEmpty, FindValueByName } from 'src/app/services/functions/util.function';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { RoletaForm } from './det-roletas.struct';
import { ValidaNotificacao } from 'src/app/services/functions/validateForm';

@Component({
	selector: 'app-det-roletas',
	templateUrl: './det-roletas.component.html',
	styleUrls: ['./det-roletas.component.css'],
	providers: [],
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

	public pk: string = '';
	public title: string = '';
	public action: string = '';
	public filial: string = '';
	public subtitle: string = '';

	nHeightMonitor: number = window.innerHeight * 0.5;

	constructor(
		private _activedRoute: ActivatedRoute,
		private _router: Router,
		private _formBuilder: FormBuilder,
		private _fwModel: FwProtheusModel,
		private _poNotification: PoNotificationService
	) {
		this.action = this._activedRoute.snapshot.params['acao'];
		this.pk = this._activedRoute.snapshot.params['pk'];
		this.createForm();
	}

	public breadcrumb: PoBreadcrumb = {
		items: [
			{ label: 'Fretamento Urbano', link: '/' },
			{ label: 'Roletas', link: '/roletas' },
			{ label: '', link: '' },
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
				break;
			case 'incluir':
				this.title = 'Incluir roleta';
				this.subtitle = 'Preencha as informações da roleta:';
				this.isVisibleBtn = true;
				this.breadcrumb.items[2].label = 'Incluir roleta';
				break;
		}
		this.breadcrumb.items[2].label = this.title;
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
			codigo: [roleta.codigo],
			identificador: [roleta.identificador, Validators.compose([Validators.required])],
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
		this._fwModel.setEndPoint('GTPU006/' + this.pk);
		this._fwModel.setVirtualField(true);
		this._fwModel.get(params).subscribe({
			next: (data: any) => {
				this.breadcrumb.items[2].label = `${FindValueByName(
					data.models[0].fields,
					'H6Z_CODID'
				)} - ${FindValueByName(data.models[0].fields, 'H6Z_DESCR')}`;

				this.roletaForm.patchValue({
					codigo: FindValueByName(data.models[0].fields, 'H6Z_CODIGO'),
					identificador: FindValueByName(data.models[0].fields, 'H6Z_CODID'),
					descricao: FindValueByName(data.models[0].fields, 'H6Z_DESCR'),
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
	saveRoleta(isSaveNew: boolean) {
		let isSubmitable: boolean = this.roletaForm.valid;
		this.changeLoading();
		if (isSubmitable) {
			this._fwModel.reset();
			this._fwModel.setModelId('GTPU006');
			this._fwModel.setEndPoint('GTPU006/');
			this._fwModel.AddModel('H6ZMASTER', 'FIELDS');

			this._fwModel.getModel('H6ZMASTER').addField('H6Z_CODID'); // IDENTIFICADOR
			this._fwModel.getModel('H6ZMASTER').addField('H6Z_DESCR'); // DESCRIÇÃO

			this._fwModel
				.getModel('H6ZMASTER')
				.setValue('H6Z_CODID', ChangeUndefinedToEmpty(this.roletaForm.value.identificador));
			this._fwModel
				.getModel('H6ZMASTER')
				.setValue('H6Z_DESCR', ChangeUndefinedToEmpty(this.roletaForm.value.descricao));
			if (this.editView) {
				this._fwModel.operation = 4;
				this._fwModel.setEndPoint('GTPU006/' + this.pk);

				this._fwModel.put().subscribe({
					next: () => {
						this._poNotification.success('Roleta atualizada com sucesso');
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
							this.roletaForm.reset();
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
						this._poNotification.success('Roleta criada com sucesso!');
					},
				});
			}
		} else {
			this._poNotification.error(ValidaNotificacao(this.roletaForm));
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
		this._router.navigate(['roletas']);
	}
}
