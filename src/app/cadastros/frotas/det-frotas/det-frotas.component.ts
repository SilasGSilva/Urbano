import { HttpParams } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
	PoBreadcrumb,
	PoComboComponent,
	PoModalAction,
	PoModalComponent,
	PoNotificationService,
	PoRadioComponent,
	PoTableColumn,
	PoTableColumnSort,
	PoUploadComponent,
} from '@po-ui/ng-components';
import {
	CategoriaComboFrotasComboService,
	LocalComboFrotasComboService,
	RoletasComboFrotasComboService,
	TipoDocumentoComboFrotasComboService,
	ValidadorComboFrotasComboService,
} from 'src/app/services/adaptors/wsurbano-adapter.service';
import { FindValueByName, UtilsService } from 'src/app/services/functions/util.function';
import { FwProtheusModel, Resource } from 'src/app/services/models/fw-protheus.model';
import { ColumnsFrotasDocumento, DadosGeraisForm, DocumentosForm, FrotasModelDocumento } from './det-frotas.struct';

@Component({
	selector: 'app-det-frotas',
	templateUrl: './det-frotas.component.html',
	styleUrls: ['./det-frotas.component.css'],
})
export class DetFrotasComponent {
	@ViewChild('modalCancel', { static: false })
	modalCancel!: PoModalComponent;

	@ViewChild('modalDocument', { static: false })
	modalDocument!: PoModalComponent;

	@ViewChild('poUpload', { static: false }) poUpload: PoUploadComponent;

	// @ViewChild('categoriaCombo', { static: true })
	// categoriaCombo!: PoComboComponent;

	// @ViewChild('localCombo', { static: true })
	// localCombo!: PoComboComponent;

	// @ViewChild('validadorCombo', { static: true })
	// validadorCombo!: PoComboComponent;

	// @ViewChild('roletaCombo', { static: true })
	// roletaCombo!: PoComboComponent;

	// public host = GtpGenerics.getERPConfigParam("api_baseUrl") + "endpoint/arquivo";
	public host = 'localhost:12173/rest/endpoint/arquivo';

	autoUpload: boolean = false;

	dadosGeraisForm!: FormGroup;
	documentForm!: FormGroup;

	public listTable: Array<FrotasModelDocumento> = [];
	public columnsTable: Array<PoTableColumn> = ColumnsFrotasDocumento;

	public isShowLoading: boolean = false;
	public editView: boolean = false;
	public isVisibleBtn: boolean = false;

	public action: string = '';
	public pk: string = '';
	public description: string = '';
	public filial: string = '';
	public title: string = '';
	public subtitle: string = '';
	public textAditional: string = '';

	public categoriaFilter: string = '';
	public localFilter: string = '';
	public validadorFilter: string = '';
	public roletaFilter: string = '';
	public tipoDocumentoFilter: string = '';
	public tipoToletanciaFilter: string = '';
	public tipoVigenciaFilter: string = '';

	nHeightMonitor: number = window.innerHeight * 0.5;

	constructor(
		private _activedRoute: ActivatedRoute,
		private _router: Router,
		private _formBuilder: FormBuilder,
		private _fwModel: FwProtheusModel,
		public categoriaComboService: CategoriaComboFrotasComboService,
		public localComboService: LocalComboFrotasComboService,
		public validadorComboService: ValidadorComboFrotasComboService,
		public roletaComboService: RoletasComboFrotasComboService,
		public tipoDocumentoComboService: TipoDocumentoComboFrotasComboService,
		private _poNotification: PoNotificationService,
		private _utilsService: UtilsService
	) {
		this.action = this._activedRoute.snapshot.params['acao'];
		this.pk = this._activedRoute.snapshot.params['pk'];
	}

	public breadcrumb: PoBreadcrumb = {
		items: [
			{ label: 'Fretamento Urbano', link: '/' },
			{ label: 'Cadastrar Frota', link: '/frota' },
			{ label: 'Incluir veículo', link: '' },
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
			this._router.navigate(['frota']);
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
				this.title = 'Editar veículo';
				this.subtitle = 'Edite as informações do veículo:';
				this.getFrotas();

				break;
			case 'incluir':
				this.title = 'Incluir veículo';
				this.subtitle = 'Preencha as informações do veículo:';
				this.isVisibleBtn = true;
				this.breadcrumb.items[2].label = 'Incluir veículo';
				break;
		}

		//Criando o formulario
		this.createForm();

		if (this.pk != undefined) {
			//Edição, faz a carga dos valores
			this.getFrotas();
		}
	}

	/*******************************************************************************
	 * @name getFrotas
	 * @description Funççao responsável por buscar os dados da frota quando for
	 * editar uma frota
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	getFrotas() {
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

				this.dadosGeraisForm.patchValue({
					prefixo: FindValueByName(data.models[0].fields, 'GI1_CDMUNI'),
					placa: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
					marca: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
					anoFabricacao: FindValueByName(data.models[0].fields, 'GI1_CDMUNI'),
					anoModelo: FindValueByName(data.models[0].fields, 'GI1_CDMUNI'),
					categoria: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
					local: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
					nChassi: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
					codRenavam: FindValueByName(data.models[0].fields, 'GI1_CDMUNI'),
					validador: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
					roleta: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
					statusVeiculo: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
					configPortas: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
					portasEsquerda: FindValueByName(data.models[0].fields, 'GI1_CDMUNI'),
					portasDireita: FindValueByName(data.models[0].fields, 'GI1_CDMUNI'),
					lotacaoSentado: FindValueByName(data.models[0].fields, 'GI1_CDMUNI'),
					lotacaoEmPe: FindValueByName(data.models[0].fields, 'GI1_CDMUNI'),
					caracteristicaRoleta: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
					metragemChassi: FindValueByName(data.models[0].fields, 'GI1_CDMUNI'),
					acessibilidade: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
					postoCobrador: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
				});

				this.documentForm.patchValue({
					tipoDocumento: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
					nomeDocumento: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
					nmrDocumento: FindValueByName(data.models[0].fields, 'GI1_CDMUNI'),
					dataEmissao: '2024-14-02',
					tipoTolerancia: 'dia',
					tempoTolerancia: 12,
					tipoVigencia: 'dia',
					tempoVigencia: 12,
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
	 * @name saveVeiculo
	 * @description Função responsável por salvar um novo veículo ou editar
	 * um veículo escolhido e navegar de volta pro browse
	 * @param stay: boolean - indica se irá ficar na tela atual ou retornará ao
	 * browser
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	saveVeiculo(stay: boolean) {
		if (!this.editView) {
			//novo veículo
			this.changeLoading();
			setTimeout(() => {
				console.log(this.dadosGeraisForm);

				this.changeLoading();
				if (!stay) {
					this.dadosGeraisForm.patchValue({
						prefixo: '',
						placa: '',
						marca: '',
						anoFabricacao: '',
						anoModelo: '',
						categoria: '',
						local: '',
						nChassi: '',
						codRenavam: '',
						validador: '',
						roleta: '',
						statusVeiculo: '',
						configPortas: '',
						portasEsquerda: '',
						portasDireita: '',
						lotacaoSentado: '',
						lotacaoEmPe: '',
						caracteristicaRoleta: '',
						metragemChassi: '',
						acessibilidade: '',
						postoCobrador: '',
					});
					this._router.navigate(['frota']);
				} else {
					this.dadosGeraisForm.patchValue({
						prefixo: '',
						placa: '',
						marca: '',
						anoFabricacao: '',
						anoModelo: '',
						categoria: '',
						local: '',
						nChassi: '',
						codRenavam: '',
						validador: '',
						roleta: '',
						statusVeiculo: '',
						configPortas: '',
						portasEsquerda: '',
						portasDireita: '',
						lotacaoSentado: '',
						lotacaoEmPe: '',
						caracteristicaRoleta: '',
						metragemChassi: '',
						acessibilidade: '',
						postoCobrador: '',
					});
				}
				this._poNotification.success('Veículo criado com sucesso!');
			}, 1000);
		} else {
			//editar veículo

			this.changeLoading();
			setTimeout(() => {
				this.dadosGeraisForm.patchValue({
					prefixo: '',
					placa: '',
					marca: '',
					anoFabricacao: '',
					anoModelo: '',
					categoria: '',
					local: '',
					nChassi: '',
					codRenavam: '',
					validador: '',
					roleta: '',
					statusVeiculo: '',
					configPortas: '',
					portasEsquerda: '',
					portasDireita: '',
					lotacaoSentado: '',
					lotacaoEmPe: '',
					caracteristicaRoleta: '',
					metragemChassi: '',
					acessibilidade: '',
					postoCobrador: '',
				});
				this.changeLoading();
				this._router.navigate(['frota']);
				this._poNotification.success('Veículo alterado com sucesso!');
			}, 1000);
		}
	}

	/*******************************************************************************
	 * @name createForm
	 * @description Função responsável por criar e inicializar o formulário para
	 * criação ou edição das frotas
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	createForm(): any {
		const dadosGerais: DadosGeraisForm = {} as DadosGeraisForm;
		const documentos: DocumentosForm = {} as DocumentosForm;
		this.dadosGeraisForm = this._formBuilder.group({
			prefixo: [dadosGerais.prefixo, Validators.compose([Validators.required])],
			placa: [dadosGerais.placa, Validators.compose([Validators.required])],
			marca: [dadosGerais.marca, Validators.compose([Validators.required])],
			anoFabricacao: [dadosGerais.anoFabricacao, Validators.compose([Validators.required])],
			anoModelo: [dadosGerais.anoModelo, Validators.compose([Validators.required])],
			categoria: [dadosGerais.categoria, Validators.compose([Validators.required])],
			local: [dadosGerais.local, Validators.compose([Validators.required])],
			nChassi: [dadosGerais.nChassi, Validators.compose([Validators.required])],
			codRenavam: [dadosGerais.codRenavam, Validators.compose([Validators.required])],
			validador: [dadosGerais.validador],
			roleta: [dadosGerais.roleta],
			statusVeiculo: [dadosGerais.statusVeiculo, Validators.compose([Validators.required])],
			configPortas: [dadosGerais.configPortas, Validators.compose([Validators.required])],
			portasEsquerda: [dadosGerais.portasEsquerda, Validators.compose([Validators.required])],
			portasDireita: [dadosGerais.portasDireita, Validators.compose([Validators.required])],
			lotacaoSentado: [dadosGerais.lotacaoSentado, Validators.compose([Validators.required])],
			lotacaoEmPe: [dadosGerais.lotacaoEmPe, Validators.compose([Validators.required])],
			caracteristicaRoleta: [dadosGerais.caracteristicaRoleta, Validators.compose([Validators.required])],
			metragemChassi: [dadosGerais.metragemChassi, Validators.compose([Validators.required])],
			acessibilidade: [dadosGerais.acessibilidade, Validators.compose([Validators.required])],
			postoCobrador: [dadosGerais.postoCobrador, Validators.compose([Validators.required])],
		});

		this.documentForm = this._formBuilder.group({
			tipoDocumento: [documentos.tipoDocumento, Validators.compose([Validators.required])],
			nomeDocumento: [documentos.nomeDocumento, Validators.compose([Validators.required])],
			nmrDocumento: [documentos.nmrDocumento, Validators.compose([Validators.required])],
			dataEmissao: [documentos.dataEmissao, Validators.compose([Validators.required])],
			tipoTolerancia: [documentos.tipoTolerancia, Validators.compose([Validators.required])],
			tempoTolerancia: [documentos.tempoTolerancia, Validators.compose([Validators.required])],
			tipoVigencia: [documentos.tipoVigencia, Validators.compose([Validators.required])],
			tempoVigencia: [documentos.tempoVigencia, Validators.compose([Validators.required])],
			arquivo: [documentos.arquivo, Validators.compose([Validators.required])],
		});
	}

	/*******************************************************************************
	 * @name incluirDocumento
	 * @description Responsavel por abrir modal de inclusão de documento
	 * @author  Serviços | Levy Santos
	 * @since   2024
	 * @version	v1
	 *******************************************************************************/
	incluirDocumento() {
		this._poNotification.warning('Pagina em construção');
	}

	/*******************************************************************************
	 * @name onSuccess
	 * @description Função chamada ao enviar com sucesso um arquivo
	 * @author  Serviços | Levy Santos
	 * @since   2024
	 * @version	v1
	 *******************************************************************************/
	onSuccess() {
		if (!this.autoUpload) {
			if (!this.poUpload.hasFileNotUploaded) {
			}
		}
	}

	/*******************************************************************************
	 * @name onError
	 * @description Função chamada ao acontecer algum erro com o envio do arquivo
	 * @author  Serviços | Levy Santos
	 * @since   2024
	 * @version	v1
	 *******************************************************************************/
	onError() {
		console.log('error');
	}

	/*******************************************************************************
	 * @name uploadFiles
	 * @description Função chamada ao fazer upload de um arquivo
	 * @author  Serviços | Levy Santos
	 * @since   2024
	 * @version	v1
	 *******************************************************************************/
	uploadFiles(event: any) {
		console.log('event: ', event);
	}

	/*******************************************************************************
	 * @name getDocumentos
	 * @description Função responsável por buscar os dados e carregar na tela
	 * preenchendo os campos para visualização
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	getDocumentos() {
		let params = new HttpParams();

		this._fwModel.setEndPoint('GTPA001/');

		this._fwModel.setVirtualField(true);
		this._fwModel.get(params).subscribe(() => {
			this._fwModel.resources.forEach((resource: Resource) => {
				let documento = new FrotasModelDocumento();
				documento.nDocumento = resource.getModel('GI1MASTER').getValue('GI1_COD');

				documento.dataEmissao = new Date().toLocaleString().substr(0, 10);
				documento.dataVencimento = new Date().toLocaleString().substr(0, 10);
				documento.dataTolerancia = new Date().toLocaleString().substr(0, 10);

				documento.status = 1;

				this.listTable = [...this.listTable, documento];
			});
		});
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
}
