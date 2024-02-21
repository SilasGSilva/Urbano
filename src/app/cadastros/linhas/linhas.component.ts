import { 
	Component, 
	ViewChild 
} from '@angular/core';
import {
	PoBreadcrumb,
	PoComboComponent,
	PoPageAction,
	PoSelectOption,
	PoTableAction,
	PoTableColumn,
} from '@po-ui/ng-components';
import { 
	CollumnsLinhas, 
	LinhasModel, 
	ListStatus 
} from './linha.struct';
import { 
	HttpParams 
} from '@angular/common/http';
import { 
	ActivatedRoute, 
	Router 
} from '@angular/router';
import { 
	FwProtheusModel, 
	Resource 
} from 'src/app/services/models/fw-protheus.model';
import { 
	DestinoComboService, 
	OrigemComboService, 
	PrefixoComboService 
} from 'src/app/services/combo-filter.service';

@Component({
	selector: 'app-linhas',
	templateUrl: './linhas.component.html',
	styleUrls: ['./linhas.component.css'],
	providers: [
		PrefixoComboService,
		OrigemComboService,
		DestinoComboService
	],
})
export class LinhasComponent {
	@ViewChild('prefixoFilterCombo', { static: true })
	prefixoFilterCombo!: PoComboComponent;

	@ViewChild('origemFilterCombo', { static: true })
	origemFilterCombo!: PoComboComponent;

	@ViewChild('destinoFilterCombo', { static: true })
	destinoFilterCombo!: PoComboComponent;

	@ViewChild('statusFilterCombo', { static: true })
	statusFilterCombo!: PoComboComponent;

	constructor(
		private _router: Router,
		private _activedRoute: ActivatedRoute,
		private _fwModel: FwProtheusModel,
		public prefixoComboService: PrefixoComboService,
		public origemComboService: OrigemComboService,
		public destinoComboService: DestinoComboService
	) {
		this.setColProperties();
	}
	public nHeightMonitor: number = window.innerHeight * (window.innerHeight > 850 ? 0.6 : 0.45);
	public isShowMoreDisabled: boolean = false;
	public isLoading: boolean = false;

	// Filtros
	public filters: string = '';
	public filterPrefixo: string = '';
	public filterOrigem: string = '';
	public filterDestino: string = '';
	public filterStatus: string = '';
	public modelOrigem: string = '';
	public modelDestino: string = '';

	nNextPage: number = 1;
	nPageSize: number = 10;
	nRegIndex: number = 1;
	nTotal: number = 0;

	// Breadcrumb
	public breadcrumb: PoBreadcrumb = {
		items: [{ label: 'Fretamento Urbano', link: '/' }, { label: 'Linhas' }],
	};

	// Botão incluir
	public actions: Array<PoPageAction> = [
		{
			label: 'Incluir',
			action: () => {
				this.incluir();
			},
		},
	];

	// Ações para as linhas da tabela
	public tableActions: Array<PoTableAction> = [
		{
			action: this.editLinha.bind(this),
			icon: 'po-icon po-icon-edit',
			label: 'editar',
		},
		{
			action: this.visualizar.bind(this),
			icon: 'po-icon po-icon-eye',
			label: 'Visualizar',
		},
	];

	// Lista de status
	public listStatus: Array<PoSelectOption> = ListStatus;

	// Estrutura das colunas da grid
	public itemsColumns: Array<PoTableColumn> = CollumnsLinhas;

	// Modelo de dados da grid linhas
	public listLinhas: Array<LinhasModel> = [];

	ngOnInit() {
		this.isLoading = false;
		this.isShowMoreDisabled = true;
		this.getLinhas();
	}

	/*******************************************************************************
	 * @name incluir
	 * @description Abre tela que permite realizar a inclusão de uma linha
	 * @author    Serviços | Diego Bezerra
	 * @since     2024
	 * @version   v1
	 *******************************************************************************/
	public incluir() {
		this._router.navigate(['./det-linha', 'incluir'], { relativeTo: this._activedRoute });
	}

	/*******************************************************************************
	 * @name visualizar
	 * @description Redireciona para a página de visualização
	 * @author    Serviços | Diego Bezerra
	 * @since     2024
	 * @version   v1
	 *******************************************************************************/
	visualizar(item: any) {
		this._router.navigate(['./viewLinhas', 'visualizar', item.pk], {
			relativeTo: this._activedRoute,
		});
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
		this.getLinhas();
	}

	/*******************************************************************************
	 * @name getLinhas
	 * @description função responsável por buscar as linhas
	 * @author   Serviços | Diego Bezerra
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	public getLinhas() {
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

		this._fwModel.setEndPoint('GTPU003/');
		this._fwModel.setVirtualField(true);
		this._fwModel.get(params).subscribe(() => {
			if (this.filters != '') {
				this.listLinhas = [];
			}
			this._fwModel.resources.forEach((resource: Resource) => {
				let linhas = new LinhasModel();
				linhas.pk = resource.pk;

				linhas.prefixolinha = resource.getModel('H6VMASTER').getValue('H6V_PREFIX');
				linhas.codigolinha = resource.getModel('H6VMASTER').getValue('H6V_CODLIN');
				linhas.descricao = resource.getModel('H6VMASTER').getValue('H6V_DESCRI');
				linhas.tarifa = resource.getModel('H6VMASTER').getValue('H6V_TARIDE');
				linhas.origem =
					resource.getModel('H6VMASTER').getValue('H6V_ORIGEM') +
					' - ' +
					resource.getModel('H6VMASTER').getValue('H6V_ORIDES');

				linhas.destino =
					resource.getModel('H6VMASTER').getValue('H6V_DESTIN') +
					' - ' +
					resource.getModel('H6VMASTER').getValue('H6V_DESTDE');

				linhas.status = resource.getModel('H6VMASTER').getValue('H6V_STATUS');

				linhas.outrasAcoes = ['editar', 'visualizar'];
				this.listLinhas = [...this.listLinhas, linhas];
				this.isLoading = false;
			});

			this.nTotal = this._fwModel.total;
			this.setShowMore(this._fwModel.total);
		});
	}

	/*******************************************************************************
	 * @name editLinha
	 * @description Função responsável por acessar a tela de edição, ao utilizar o botão
	 * Editar
	 * @author   Serviços | Diego Bezerra
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	editLinha(item: any) {
		this._router.navigate(['./det-linha', 'editar', item.pk], { relativeTo: this._activedRoute });
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
	 * @name setFilters
	 * @description função chamada ao alterar o valor dos campos po-combo para
	 *  filtrar o conteúdo baseado no filtro escolhido
	 * @author   Serviços | Diego Bezerra
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	setFilters(event: any, combo: string = '') {
		this.listLinhas = [];
		this.filters = '';
		this.isShowMoreDisabled = false;
		if (event == undefined && combo == 'comboprefixo') {
			this.filterOrigem = '';
			this.filterDestino = '';
		} else if (event == undefined && combo == 'comboorigem') {
			this.filterOrigem = '';
			this.filterDestino = '';
		} else if (event == undefined && combo == 'combodestino') {
			this.filterDestino = '';
		}

		//filtros
		if (this.prefixoFilterCombo !== undefined && this.prefixoFilterCombo.selectedOption !== undefined) {

			this.filterOrigem =
				"UPPER(H6V_PREFIX) LIKE UPPER('" +
				this.prefixoFilterCombo.selectedOption.value +
				"') AND UPPER(H6V_DESCRI) LIKE UPPER('" +
				this.prefixoFilterCombo.selectedOption.label +
				"')";

			this.filterDestino =
				"UPPER(H6V_PREFIX) LIKE UPPER('" +
				this.prefixoFilterCombo.selectedOption.value +
				"') AND UPPER(H6V_DESCRI) LIKE UPPER('" +
				this.prefixoFilterCombo.selectedOption.label +
				"')";

			if (this.filters != '') {
				this.filters += ' AND ';
			}
			this.filters += " H6V_CODIGO = '" + this.prefixoFilterCombo.selectedOption.value + "' ";
		}

		if (this.origemFilterCombo !== undefined && this.origemFilterCombo.selectedOption !== undefined) {

			if (this.filterDestino != '') {
				this.filterDestino +=
					" AND (UPPER(H6V_ORIGEM) LIKE UPPER('" +
					this.origemFilterCombo.selectedOption.value +
					"') AND UPPER(H6V_ORIDES) LIKE UPPER('" +
					this.origemFilterCombo.selectedOption.label +
					"'))";
			} else {
				this.filterDestino =
					"UPPER(H6V_ORIGEM) LIKE UPPER('" +
					this.origemFilterCombo.selectedOption.value +
					"') AND UPPER(H6V_ORIDES) LIKE UPPER('" +
					this.origemFilterCombo.selectedOption.label +
					"')";
			}

			if (this.filters != '') {
				this.filters += ' AND ';
			}
			this.filters += " H6V_ORIGEM = '" + this.origemFilterCombo.selectedOption.value + "' ";
		}

		if (this.destinoFilterCombo !== undefined && this.destinoFilterCombo.selectedOption !== undefined) {

			if (this.filters != '') {
				this.filters += ' AND ';
			}
			this.filters += " H6V_DESTIN = '" + this.destinoFilterCombo.selectedOption.value + "' ";
		}

		if (this.statusFilterCombo.selectedOption !== undefined) {
			if (this.filters != '') {
				this.filters += ' AND ';
			}
			this.filters += "H6V_STATUS = '" + this.statusFilterCombo.selectedOption.value + "' ";
		}
		this.getLinhas();
	}

	/*******************************************************************************
	 * @name setColProperties
	 * @description Seta as demais propriedades das colunas
	 * @author   Serviços | Diego Bezerra
	 * @since       2024
	 * @version v1
	 *******************************************************************************/
	setColProperties() {
		this.itemsColumns.forEach(col => {
			if (col.property === 'outrasAcoes' && col.icons && col.icons.length >= 0) {
				col.icons[0].action = this.editLinha.bind(this); //editar
				col.icons[1].action = this.visualizar.bind(this); //visualizar
			}
		});
	}

	/*******************************************************************************
	 * @name clearFilter
	 * @description Limpa os filtros
	 * @author   Serviços | Silas Gomes
	 * @since       2024
	 * @version v1
	 *******************************************************************************/
	clearFilter(filter: string) {
		switch (filter) {
			case 'comboprefixo':
				this.modelOrigem = ''
				this.modelDestino = ''
				break;

			case 'comboorigem':
				this.modelDestino = ''
				break;
		}

	}
}
