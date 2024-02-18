import { Component, ViewChild } from '@angular/core';
import { PoBreadcrumb, PoComboComponent, PoPageAction, PoTableColumn, PoTableColumnSort } from '@po-ui/ng-components';
import { FrotasModel, ColumnsFrotas } from './frotas.struct';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { FwProtheusModel, Resource } from 'src/app/services/models/fw-protheus.model';
import { UtilsService } from 'src/app/services/functions/util.function';
import {
	LocalFrotasComboService,
	PlacaFrotasComboService,
	PrefixoVeiculoFrotasComboService,
	StatusFrotasComboService,
} from 'src/app/services/adaptors/wsurbano-adapter.service';

@Component({
	selector: 'app-frotas',
	templateUrl: './frotas.component.html',
	styleUrls: ['./frotas.component.css'],
})
export class FrotasComponent {
	@ViewChild('prefixoFilterCombo', { static: true })
	prefixoFilterCombo!: PoComboComponent;

	@ViewChild('placaFilterCombo', { static: true })
	placaFilterCombo!: PoComboComponent;

	@ViewChild('localFilterCombo', { static: true })
	localFilterCombo!: PoComboComponent;

	@ViewChild('statusFilterCombo', { static: true })
	statusFilterCombo!: PoComboComponent;

	public prefixoFilter: string = '';
	public placaFilter: string = '';
	public localFilter: string = '';
	public statusFilter: string = '';
	public filters: string = '';

	public isLoading: boolean = false;
	public resetFilters: boolean = false;
	public isShowMoreDisabled: boolean = false;

	public listFrotas: Array<FrotasModel> = [];
	public columnsFrotas: Array<PoTableColumn> = ColumnsFrotas;

	public nNextPage: number = 1;
	public nTotal: number = 0;
	public nPageSize: number = 10;
	public nRegIndex: number = 1;
	public nHeightMonitor: number = window.innerHeight * (window.innerHeight > 850 ? 0.6 : 0.6);

	constructor(
		private _router: Router,
		public prefixoComboService: PrefixoVeiculoFrotasComboService,
		public placaComboService: PlacaFrotasComboService,
		public localComboService: LocalFrotasComboService,
		public statusComboService: StatusFrotasComboService,
		private _fwModel: FwProtheusModel,
		private _utilsService: UtilsService
	) {
		this.setColProperties();
	}

	/*******************************************************************************
	 * @name actions
	 * @description Ações no menu superior direito da tela, botão de incluir
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	actions: Array<PoPageAction> = [
		{
			label: 'Incluir',
			action: () => {
				this._router.navigate(['frota/detFrota/incluir']);
			},
		},
	];

	public breadcrumb: PoBreadcrumb = {
		items: [{ label: 'Fretamento Urbano', link: '/' }, { label: 'Cadastrar Frota' }],
	};

	ngOnInit() {
		this.getFrotas();
	}

	/*******************************************************************************
	 * @name setColProperties
	 * @description função responsável por setar as funções aos dois botões de ação
	 * da tabela
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	setColProperties() {
		this.columnsFrotas.forEach(col => {
			if (col.property === 'outrasAcoes' && col.icons && col.icons.length >= 0) {
				col.icons[0].action = this.editFrota.bind(this);
				col.icons[1].action = this.viewFrota.bind(this);
			}
		});
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
		this.listFrotas = [];

		this.filters = '';
		this.isShowMoreDisabled = false;
		this.resetFilters = false;

		//filtros
		if (this.prefixoFilterCombo !== undefined && this.prefixoFilterCombo.selectedOption !== undefined) {
			if (this.filters != '') {
				this.filters += ' AND ';
			}
			this.filters += " GI1_COD = '" + this.prefixoFilterCombo.selectedOption.value + "' ";
		}

		if (this.placaFilterCombo !== undefined && this.placaFilterCombo.selectedOption !== undefined) {
			if (this.filters != '') {
				this.filters += ' AND ';
			}
			this.filters += " GI1_COD = '" + this.placaFilterCombo.selectedOption.value + "' ";
		}
		if (this.localFilterCombo !== undefined && this.localFilterCombo.selectedOption !== undefined) {
			if (this.filters != '') {
				this.filters += ' AND ';
			}
			this.filters += " GI1_COD = '" + this.localFilterCombo.selectedOption.value + "' ";
		}
		if (this.statusFilterCombo !== undefined && this.statusFilterCombo.selectedOption !== undefined) {
			if (this.filters != '') {
				this.filters += ' AND ';
			}
			this.filters += " GI1_COD = '" + this.statusFilterCombo.selectedOption.value + "' ";
		}

		this.getFrotas();
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
			case 'prefixo': {
				this.prefixoFilter = '';
				break;
			}
			case 'placa': {
				this.placaFilter = '';
				break;
			}
			case 'local': {
				this.localFilter = '';
				break;
			}
			case 'status': {
				this.statusFilter = '';
				break;
			}
		}
	}

	getFrotas() {
		let params = new HttpParams();
		this.isLoading = true;

		//Caso haja filtro, não realizar paginação
		if (this.filters != '') {
			params = params.append('FILTER', this.filters);
		} else {
			if (this.nPageSize.toString() != '') params = params.append('COUNT', this.nPageSize.toString());
			if (this.nRegIndex.toString() != '')
				if (this.nTotal !== 0 && this.nRegIndex > this.nTotal) {
					params = params.append('STARTINDEX', 1);
				} else {
					params = params.append('STARTINDEX', this.nRegIndex.toString());
				}
		}
		this._fwModel.setEndPoint('GTPA001/');

		this._fwModel.setVirtualField(true);
		this._fwModel.get(params).subscribe(() => {
			this._fwModel.resources.forEach((resource: Resource) => {
				let frotas = new FrotasModel();
				frotas.pk = resource.pk;

				frotas.codFrota = resource.getModel('GI1MASTER').getValue('GI1_COD');
				frotas.prefixo =
					resource.getModel('GI1MASTER').getValue('GI1_COD') +
					' - ' +
					resource.getModel('GI1MASTER').getValue('GI1_DESCRI');

				frotas.placa = resource.getModel('GI1MASTER').getValue('GI1_DESCRI');
				frotas.tipoVeiculo = resource.getModel('GI1MASTER').getValue('GI1_DESCRI');

				frotas.local = resource.getModel('GI1MASTER').getValue('GI1_DESCRI');

				frotas.status = 1;

				frotas.outrasAcoes = ['editar', 'visualizar'];

				this.listFrotas = [...this.listFrotas, frotas];
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
		const result = [...this.listFrotas];

		result.sort((value, valueToCompare) => this._utilsService.sort(value, valueToCompare, event));
		this.listFrotas = result;
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
		this.getFrotas();
	}

	/*******************************************************************************
	 * @name editSecao
	 * @description Função responsável por ir para tela de edição quando o
	 * ícone de 'lápis' é clicado na tabela
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	editFrota(event: any) {
		this._router.navigate(['frota/detFrota', 'editar', btoa(event.pk), event.pk]);
	}

	/*******************************************************************************
	 * @name viewSecao
	 * @description Função responsável por ir para tela de visualização quando o
	 * ícone de 'olho' é clicado na tabela
	 * @author   Serviços | Levy Santos
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	viewFrota(event: any) {
		this._router.navigate(['frota/viewFrota', btoa(event.pk), event.pk]);
	}
}
