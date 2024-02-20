import {
	Component,
	OnInit,
	ViewChild
} from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	Validators
} from '@angular/forms';
import {
	PoBreadcrumb,
	PoComboComponent,
	PoRadioGroupOption,
	PoSelectOption
} from '@po-ui/ng-components';
import {
	ClassificaoFiscal,
	ListPedagio,
	ListStatus,
	linhaForm
} from './det-linha.struct';
import {
	ActivatedRoute,
	Router
} from '@angular/router';
import {
	PoNotificationService
} from '@po-ui/ng-components';

import {
	FwProtheusModel
} from 'src/app/services/models/fw-protheus.model';
import {
	HttpParams
} from '@angular/common/http';
import {
	ChangeUndefinedToEmpty,
	FindValueByName
} from 'src/app/services/functions/util.function';
import {
	ValidaNotificacao
} from 'src/app/services/functions/validateForm';
import { 
	CategoriaComboService, 
	OrgaoRegulamentadorComboService, 
	TarifaComboService 
} from 'src/app/services/combo-filter.service';
import { LocalidadeComboService } from 'src/app/services/adaptors/wsurbano-adapter.service';

@Component({
	selector: 'app-det-linha',
	templateUrl: './det-linha.component.html',
	styleUrls: ['./det-linha.component.css'],
	providers: [
		LocalidadeComboService,
		OrgaoRegulamentadorComboService,
		TarifaComboService,
		CategoriaComboService
	]
})
export class DetLinhaComponent implements OnInit {
	@ViewChild('origemFilterCombo', { static: true })
	origemFilterCombo!: PoComboComponent

	@ViewChild('origemFilterCombo', { static: true })
	destinoFilterCombo!: PoComboComponent

	@ViewChild('origemFilterCombo', { static: true })
	orgaoregulamentadorFilterCombo!: PoComboComponent

	@ViewChild('origemFilterCombo', { static: true })
	tarifaFilterCombo!: PoComboComponent

	@ViewChild('origemFilterCombo', { static: true })
	pedagioFilterCombo!: PoComboComponent

	@ViewChild('origemFilterCombo', { static: true })
	classificacaofiscalFilterCombo!: PoComboComponent

	public editView: boolean = false;
	public isShowLoading: boolean = false;
	public isVisibleBtn: boolean = true;

	public action: string = '';
	public pk: string = '';
	public title: string = '';

	listStatus: PoRadioGroupOption[] = ListStatus;

	public breadcrumb: PoBreadcrumb = {
		items: [
			{ label: 'Fretamento Urbano', link: '/' },
			{ label: 'Cadastrar Linha', link: '/linhas' },
			{ label: 'Incluir Linha' }]
	};

	public linhaForm!: FormGroup;
	public ListPedagio: Array<PoSelectOption> = ListPedagio;
	public ListClassificacao: Array<PoSelectOption> = ClassificaoFiscal;

	constructor(
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _formBuilder: FormBuilder,
		private _fwModel: FwProtheusModel,
		private _poNotification: PoNotificationService,
		public origemComboService: LocalidadeComboService,
		public destinoComboService: LocalidadeComboService,
		public orgaoRegulamentador: OrgaoRegulamentadorComboService,
		public tarifaComboService: TarifaComboService,
		public categoriaComboService: CategoriaComboService
	) {
		// Ação
		this.action = this._activatedRoute.snapshot.params['acao'];
		// PK do modelo
		this.pk = this._activatedRoute.snapshot.params['id'];
	}

	ngOnInit() {

		switch (this.action) {
			case 'editar':
				this.editView = true;
				this.title = 'Editar linha'
				this.isVisibleBtn = false;
				this.breadcrumb.items[2].label = 'Editar linha';
				this.getLinha();
				break;
			case 'incluir':
				this.title = 'Incluir linha';
				this.isVisibleBtn = true;
				this.breadcrumb.items[2].label = 'Incluir linha';
				break;
		}

		this.createForm();

		if (this.pk != undefined) {
			//Edição, faz a carga dos valores
			this.getLinha();
		} else {
			//Inclusão, seta o status como ativo
			this.linhaForm.patchValue({
				status: '1',
			});
		}
	}
	/*******************************************************************************
   * @name createForm
   * @description Realiza a criação do formulário e a inclusão dos validadores
   * @author   Serviços | Diego Bezerra
   * @since    2024
   * @version  v1
   *******************************************************************************/
	createForm(): any {
		const linha: linhaForm = {} as linhaForm;
		this.changeLoading();
		this.linhaForm = this._formBuilder.group({

			prefixo: [
				linha.prefixo,
				Validators.compose([Validators.required])
			],
			codlinha: [
				linha.codlinha
			],
			descricao: [
				linha.descricao,
				Validators.compose([Validators.required])
			],
			origem: [
				linha.origem,
				Validators.compose([Validators.required])
			],
			destino: [
				linha.destino,
				Validators.compose([Validators.required])
			],
			orgaoregulamentador: [
				linha.orgaoregulamentador,
				Validators.compose([Validators.required])
			],
			tarifa: [
				linha.tarifa,
				Validators.compose([Validators.required])
			],
			pedagio: [
				linha.pedagio
			],
			classificacaofiscal: [
				linha.classificacaofiscal
			],
			kmdalinha: [
				linha.kmdalinha,
				Validators.compose([Validators.required])
			],
			categoria: [
				linha.categoria
			],
			status: [
				linha.status,
				Validators.compose([Validators.required])
			]
		})
	}

	/*******************************************************************************
   * @name getLinha
   * @description Obtem os dados da linha que será alterada
   * @author   Serviços | Diego Bezerra
   * @since    2024
   * @version  v1
   *******************************************************************************/
	getLinha() {
		this.changeLoading();
		let params = new HttpParams();
		this._fwModel.reset();
		this._fwModel.setEndPoint('GTPU003/' + this.pk);
		this._fwModel.setVirtualField(true);
		this._fwModel.get(params).subscribe({
			next: (data: any) => {

				this.breadcrumb.items[2].label = `${FindValueByName(
					data.models[0].fields,
					'H6V_CODIGO'
				)} - ${FindValueByName(data.models[0].fields, 'H6V_DESCRI')}`;

				this.linhaForm.patchValue({
					prefixo: FindValueByName(data.models[0].fields, 'H6V_PREFIX'),
					codlinha: FindValueByName(data.models[0].fields, 'H6V_CODLIN'),
					descricao: FindValueByName(data.models[0].fields, 'H6V_DESCRI'),
					origem: FindValueByName(data.models[0].fields, 'H6V_ORIGEM'),
					destino: FindValueByName(data.models[0].fields, 'H6V_DESTIN'),
					orgaoregulamentador: FindValueByName(data.models[0].fields, 'H6V_ORGAO'),
					tarifa: FindValueByName(data.models[0].fields, 'H6V_TARIFA'),
					pedagio: FindValueByName(data.models[0].fields, 'H6V_PEDAGI'),
					classificacaofiscal: FindValueByName(data.models[0].fields, 'H6V_CLSFIS'),
					kmdalinha: FindValueByName(data.models[0].fields, 'H6V_KMLINH'),
					categoria: FindValueByName(data.models[0].fields, 'H6V_CATEGO'),
					status: FindValueByName(data.models[0].fields, 'H6V_STATUS'),
				});
			},
			error: (err: any) => {
				this._poNotification.error(err.errorMessage);
				this._fwModel.reset();
			},
			complete: () => {
				this.changeLoading();
			},
		});

	}

	/*******************************************************************************
   * @name onClickCancel
   * @description Ação realizado ao clicar em cancelar
   * @author   Serviços | Diego Bezerra
   * @since    2024
   * @version  v1
   *******************************************************************************/
	onClickCancel(): void {
		this._fwModel.reset();
		this._router.navigate(['./linhas']);
	}

	/*******************************************************************************
   * @name saveLinha
   * @description realiza a gravação de uma nova linha
   * @param stay parâmetro booleano. true == salvar e incluir novo
   * @author   Serviços | Diego Bezerra
   * @since    2024
   * @version  v1
   *******************************************************************************/
	saveLinha(stay: boolean): void {
		const isSubmitable: boolean = this.linhaForm.valid;
		this.changeLoading();
		if (isSubmitable) {
			this._fwModel.reset();
			this._fwModel.setModelId('GTPU003');
			this._fwModel.setEndPoint('GTPU003/')
			this._fwModel.AddModel('H6VMASTER', 'FIELDS');

			//Adiciona Campos
			this._fwModel.getModel('H6VMASTER').addField('H6V_PREFIX');
			this._fwModel.getModel('H6VMASTER').addField('H6V_CODLIN');
			this._fwModel.getModel('H6VMASTER').addField('H6V_DESCRI');
			this._fwModel.getModel('H6VMASTER').addField('H6V_ORIGEM');
			this._fwModel.getModel('H6VMASTER').addField('H6V_DESTIN');
			this._fwModel.getModel('H6VMASTER').addField('H6V_ORGAO');
			this._fwModel.getModel('H6VMASTER').addField('H6V_TARIFA');
			this._fwModel.getModel('H6VMASTER').addField('H6V_PEDAGI');
			this._fwModel.getModel('H6VMASTER').addField('H6V_CLSFIS');
			this._fwModel.getModel('H6VMASTER').addField('H6V_KMLINH');
			this._fwModel.getModel('H6VMASTER').addField('H6V_CATEGO');
			this._fwModel.getModel('H6VMASTER').addField('H6V_STATUS');

			//Seta valor para os campos
			this._fwModel
				.getModel('H6VMASTER')
				.setValue('H6V_PREFIX', ChangeUndefinedToEmpty(this.linhaForm.value.prefixo.toUpperCase()));
			this._fwModel
				.getModel('H6VMASTER')
				.setValue('H6V_CODLIN', ChangeUndefinedToEmpty(this.linhaForm.value.codlinha.toUpperCase()));
			this._fwModel
				.getModel('H6VMASTER')
				.setValue('H6V_DESCRI', ChangeUndefinedToEmpty(this.linhaForm.value.descricao.toUpperCase()));
			this._fwModel
				.getModel('H6VMASTER')
				.setValue('H6V_ORIGEM', ChangeUndefinedToEmpty(this.linhaForm.value.origem.toUpperCase()));
			this._fwModel
				.getModel('H6VMASTER')
				.setValue('H6V_DESTIN', ChangeUndefinedToEmpty(this.linhaForm.value.destino.toUpperCase()));
			this._fwModel
				.getModel('H6VMASTER')
				.setValue('H6V_ORGAO', ChangeUndefinedToEmpty(this.linhaForm.value.orgaoregulamentador.toUpperCase()));
			this._fwModel
				.getModel('H6VMASTER')
				.setValue('H6V_TARIFA', ChangeUndefinedToEmpty(this.linhaForm.value.tarifa.toUpperCase()));
			this._fwModel
				.getModel('H6VMASTER')
				.setValue('H6V_PEDAGI', ChangeUndefinedToEmpty(this.linhaForm.value.pedagio.toUpperCase()));
			this._fwModel
				.getModel('H6VMASTER')
				.setValue('H6V_CLSFIS', ChangeUndefinedToEmpty(this.linhaForm.value.classificacaofiscal.toUpperCase()));
			this._fwModel
				.getModel('H6VMASTER')
				.setValue('H6V_KMLINH', ChangeUndefinedToEmpty(this.linhaForm.value.kmdalinha.toUpperCase()));
			this._fwModel
				.getModel('H6VMASTER')
				.setValue('H6V_CATEGO', ChangeUndefinedToEmpty(this.linhaForm.value.categoria.toUpperCase()));
			this._fwModel
				.getModel('H6VMASTER')
				.setValue('H6V_STATUS', ChangeUndefinedToEmpty(this.linhaForm.value.status.toUpperCase()));

			if (this.action == 'incluir') {
				this._fwModel.operation = 3;
				this._fwModel.post().subscribe({
					next: () => {
						if (stay) {
							this._fwModel.reset();
							this.linhaForm.reset();							
							this.linhaForm.patchValue({
								status: '1',
							});
						} else {
							this.onClickCancel();
						}
					},
					error: error => {
						this._poNotification.error(error.error.errorMessage);
						this._fwModel.reset();
						this.changeLoading();
					},
					complete: () => {
						this.changeLoading();
						this._poNotification.success('Linha cadastra com sucesso!');
					},
				});
			} else {
				this._fwModel.operation = 4;
				this._fwModel.setEndPoint('GTPU003/' + this.pk);

				this._fwModel.put().subscribe({
					next: () => {
						this._poNotification.success('Linha alterada com sucesso!');
						this.onClickCancel();
						this.changeLoading();
					},
					error: error => {
						this._poNotification.error(error.error.errorMessage);
						this._fwModel.reset();
						this.changeLoading();
					},
				});
			}
		} else {
			this._poNotification.error(ValidaNotificacao(this.linhaForm));
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
}	
