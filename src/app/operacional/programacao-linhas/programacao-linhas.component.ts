import { Component, ViewChild } from '@angular/core';
import { ProgLinhaModel, progLinhasService } from './programacao-linhas.struct';
import {
	PoBreadcrumb,
	PoComboComponent,
	PoModalAction,
	PoModalComponent,
	PoPageAction,
	PoTableAction,
	PoTableColumn,
	PoTableColumnSort,
} from '@po-ui/ng-components';
import { LinhasProgramacaoComboService } from 'src/app/services/combo-filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FwProtheusModel, Resource } from 'src/app/services/models/fw-protheus.model';
import { UtilsService } from 'src/app/services/functions/util.function';
import { HttpParams } from '@angular/common/http';

@Component({
	selector: 'app-programacao-linhas',
	templateUrl: './programacao-linhas.component.html',
	styleUrls: ['./programacao-linhas.component.css'],
	providers: [progLinhasService],
})
export class ProgramacaoLinhasComponent {
	@ViewChild('statusFilterCombo', { static: true })
	statusFilterCombo!: PoComboComponent;

	@ViewChild('linhaFilterCombo', { static: true })
	linhaFilterCombo!: PoComboComponent;

	@ViewChild('modalActions', { static: false })
	modalActions!: PoModalComponent;

	public statusFilter: string = '';
	public linhaFilter: string = '';
	public filters: string = '';

	public isLoading: boolean = false;
	public resetFilters: boolean = false;
	public isShowMoreDisabled: boolean = false;

	public listProgLinhas: Array<ProgLinhaModel> = [];
	public columnsProgLinhas: Array<PoTableColumn> = [];

	public nNextPage: number = 1;
	public nTotal: number = 0;
	public nPageSize: number = 10;
	public nRegIndex: number = 1;
	public nHeightMonitor: number = window.innerHeight * (window.innerHeight > 850 ? 0.6 : 0.6);

	public titleModal = '';
	public textModal = '';
	public labelButtonModal = '';

	public typeActive: string = '';
	public eventActive: any;

	constructor(
		public linhaComboService: LinhasProgramacaoComboService,
		private _router: Router,
		private _activedRoute: ActivatedRoute,
		private _fwModel: FwProtheusModel,
		private _utilsService: UtilsService,
		private _progLinhasService: progLinhasService
	) {}

	public breadcrumb: PoBreadcrumb = {
		items: [{ label: 'Fretamento Urbano', link: '/' }, { label: 'Programação das linhas' }],
	};

	actions: Array<PoTableAction> = [
		{
			action: this.openModal.bind(this, 'clone'),
			label: 'Clonar',
			visible: this.verifyCloneAndViewAction.bind(this),
		},
		{
			action: this.openModal.bind(this, 'disable'),
			label: 'Desativar programação',
			visible: this.verifyDisabledAction.bind(this),
		},
		{
			action: this.openModal.bind(this, 'enable'),
			label: 'Ativar programação',
			visible: this.verifyEnableAction.bind(this),
		},
		{
			action: this.openModal.bind(this, 'view'),
			label: 'Visualizar',
			visible: this.verifyCloneAndViewAction.bind(this),
		},
		{
			action: this.openModal.bind(this, 'create'),
			label: 'Criar programação',
			visible: this.verifyCreateAction.bind(this),
		},
	];

	ngOnInit() {
		this.columnsProgLinhas = this._progLinhasService.getColumns();
		this.getProgramacoes();
	}

	/*******************************************************************************
	 * @name setFilters
	 * @description função chamada ao alterar o valor dos campos po-combo para
	 *  filtrar o conteúdo baseado no filtro escolhido
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	setFilters() {
		this.listProgLinhas = [];

		this.filters = '';
		this.isShowMoreDisabled = false;
		this.resetFilters = false;

		//filtros
		if (this.statusFilterCombo !== undefined && this.statusFilterCombo.selectedOption !== undefined) {
			if (this.filters != '') {
				this.filters += ' AND ';
			}
			this.filters += " GI1_COD = '" + this.statusFilterCombo.selectedOption.value + "' ";
		}

		if (this.linhaFilterCombo !== undefined && this.linhaFilterCombo.selectedOption !== undefined) {
			if (this.filters != '') {
				this.filters += ' AND ';
			}
			this.filters += " GI1_COD = '" + this.linhaFilterCombo.selectedOption.value + "' ";
		}
		if (this.filters === '') {
			this.nRegIndex = 1;
		}
		this.getProgramacoes();
	}

	/*******************************************************************************
	 * @name clearFilter
	 * @description função chamada ao alterar o valor dos campos po-combo
	 * @param filer: string - nome do filtro clicado para saber qual limpar
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	clearFilter(filter: string = '') {
		switch (filter) {
			case 'status': {
				this.statusFilter = '';
				break;
			}
			case 'linha': {
				this.linhaFilter = '';
				break;
			}
		}
	}

	getProgramacoes() {
		let params = new HttpParams();
		this.isLoading = true;

		//Caso haja filtro, não realizar paginação
		if (this.filters != '') {
			params = params.append('FILTER', this.filters);
		} else {
			if (this.nPageSize.toString() != '') params = params.append('COUNT', this.nPageSize.toString());
			if (this.nRegIndex.toString() != '') params = params.append('STARTINDEX', this.nRegIndex.toString());
		}
		this._fwModel.setEndPoint('GTPA001/');

		let count = 0;
		this._fwModel.setVirtualField(true);
		this._fwModel.get(params).subscribe(() => {
			this._fwModel.resources.forEach((resource: Resource) => {
				count++;
				let progLinhas = new ProgLinhaModel();
				progLinhas.pk = resource.pk;
				progLinhas.codProg = resource.getModel('GI1MASTER').getValue('GI1_COD');
				if (count === 2) {
					progLinhas.programacao = 'sem-programacao';
				} else {
					progLinhas.programacao = 'programacao-gerada';
				}
				if (count === 2 || count === 6) {
					progLinhas.status = 'Inativa';
				} else {
					progLinhas.status = 'Ativa';
				}
				progLinhas.periodo = resource.getModel('GI1MASTER').getValue('GI1_COD');

				progLinhas.prefixoLinha = resource.getModel('GI1MASTER').getValue('GI1_DESCRI');
				progLinhas.codLinha = resource.getModel('GI1MASTER').getValue('GI1_DESCRI');
				progLinhas.descLinha = resource.getModel('GI1MASTER').getValue('GI1_DESCRI');
				if (count === 1 || count === 4 || count === 6 || count === 7)
					progLinhas.details = [
						{ versaoAnterior: '000005', status: 'Inativa', periodo: '01/01/2023 - 31/12/2023' },
					];

				this.listProgLinhas = [...this.listProgLinhas, progLinhas];
				// this.listProgLinhas = this._progLinhasService.getItems();
				this.isLoading = false;
			});

			this.nTotal = this._fwModel.total;
			this.setShowMore(this._fwModel.total);
		});
	}

	/*******************************************************************************
	 * @name setShowMore
	 * @description função responsável por verificar  se habilita ou não o botão
	 * de carregar mais dados
	 * @param total: number - contador com o valor total de registros
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	setShowMore(total: number) {
		this.isLoading = false;
		if (this.nRegIndex === 1) {
			this.nRegIndex = this.nPageSize;
		} else {
			this.nRegIndex += this.nPageSize;
		}

		if (this.nRegIndex <= total) {
			this.isShowMoreDisabled = false;
		} else {
			this.isShowMoreDisabled = true;
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
		const result = [...this.listProgLinhas];

		result.sort((value, valueToCompare) => this._utilsService.sort(value, valueToCompare, event));
		this.listProgLinhas = result;
	}

	/*******************************************************************************
	 * @name actionShowMore
	 * @description Função responsável permitir a carga dos dados ao clicar em
	 * 'Carregar mais dados' na tabela e desabilitar ou habilitar o botão
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	actionShowMore() {
		this.nNextPage++;
		// se for clicado pela 4a vez carrega o restante dos dados
		if (this.nNextPage === 4) {
			this.nPageSize = this._fwModel.total;
		}

		this.isShowMoreDisabled = true;
		this.getProgramacoes();
	}

	/*******************************************************************************
	 * @name editProgramacao
	 * @description Função responsável por ir para tela de edição
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	editProgramacao(event: any) {
		this._router.navigate(['programacao-linhas/detFrota', 'editar', btoa(event.pk), event.pk]);
	}

	/*******************************************************************************
	 * @name viewProgramacao
	 * @description Função responsável por ir para tela de visualização
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	viewProgramacao(event: any) {
		console.log(event);
		// this._router.navigate(['programacao-linhas/viewFrota', btoa(event.pk), event.pk]);
	}

	/*******************************************************************************
	 * @name createProgramacao
	 * @description Função responsável por ir para tela de criação
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	createProgramacao(event: any) {
		console.log(event);
		// this._router.navigate(['programacao-linhas/viewFrota', btoa(event.pk), event.pk]);
	}

	/*******************************************************************************
	 * @name verifyDetails
	 * @description Função responsável por mostrar ou esconder a 'setinha' de
	 * expansão da linha na tabela
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	verifyDetails(row, index: number) {
		return row.details !== undefined;
	}

	/*******************************************************************************
	 * @name cloneProgramacao
	 * @description Função responsável por fazer o clone da programação e
	 * desabilitar a programação referência
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	cloneProgramacao() {}

	/*******************************************************************************
	 * @name enableProgramacao
	 * @description Função responsável por ativar uma programação
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	enableProgramacao() {}

	/*******************************************************************************
	 * @name disableProgramacao
	 * @description Função responsável por desativar uma programação
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	disableProgramacao() {}

	/*******************************************************************************
	 * @name verifyDisabledAction
	 * @description Função responsável verificar se o botão de desabilitar pode ser
	 * mostrado nas ações da tabela
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	verifyDisabledAction(event: any) {
		if (event.programacao === 'programacao-gerada' && event.status === 'Ativa') return true;
		else return false;
	}

	/*******************************************************************************
	 * @name verifyEnableAction
	 * @description Função responsável verificar se o botão de habilitar pode ser
	 * mostrado nas ações da tabela
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	verifyEnableAction(event: any) {
		if (event.programacao === 'programacao-gerada' && event.status === 'Inativa') return true;
		else return false;
	}

	/*******************************************************************************
	 * @name verifyCloneAndViewAction
	 * @description Função responsável verificar se os botões de clone e visualização
	 * podem ser mostrados nas ações da tabela
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	verifyCloneAndViewAction(event: any) {
		if (event.programacao === 'sem-programacao') return false;
		else return true;
	}

	/*******************************************************************************
	 * @name verifyCreateAction
	 * @description Função responsável verificar se o botão de criar programação
	 *  pode ser mostrado nas ações da tabela
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	verifyCreateAction(event: any) {
		if (event.programacao === 'sem-programacao' && event.status === 'Inativa') return true;
		else return false;
	}

	/*******************************************************************************
	 * @name openModal
	 * @description Função responsável abrir o modal de ações e definir os textos
	 * do modal, assim como os textos dos botões
	 * pode ser mostrado nas ações da tabela
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	openModal(type: string, event: any) {
		this.typeActive = type;
		this.eventActive = event;
		switch (type) {
			case 'clone':
				this.titleModal = 'Clonar programação';
				this.textModal = 'Deseja clonar essa programação e desativar a atual?';
				this.labelButtonModal = 'Clonar e desativar atual';
				this.modalActions.open();
				break;

			case 'enable':
				this.titleModal = 'Ativar programação';
				this.textModal = 'Tem certeza que deseja ativar a programação?';
				this.labelButtonModal = 'Ativar programação';
				this.modalActions.open();
				break;

			case 'disable':
				this.titleModal = 'Desativar programação';
				this.textModal = 'Tem certeza que deseja desativar a programação atual?';
				this.labelButtonModal = 'Desativar programação';
				this.modalActions.open();
				break;

			case 'view':
				console.log(this.eventActive);
				this._router.navigate(['./viewProgramacao-linhas', btoa(this.eventActive.pk), this.eventActive.codProg], {
					relativeTo: this._activedRoute,
				});
				break;

			case 'create':
				this.titleModal = 'Desativar programação';
				this.textModal = 'Tem certeza que deseja desativar a programação atual?';
				this.labelButtonModal = 'Desativar programação';
				break;
		}
	}

	/*******************************************************************************
	 * @name callActions
	 * @description Função responsável por chamar as funções de acordo com cada
	 * ação selecionada
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	callActions() {
		switch (this.typeActive) {
			case 'clone':
				this.cloneProgramacao();
				break;

			case 'enable':
				this.enableProgramacao();
				break;

			case 'disable':
				this.disableProgramacao();
				break;
		}
	}
}
