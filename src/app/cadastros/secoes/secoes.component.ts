import { HttpParams } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  PoBreadcrumb,
  PoComboComponent,
  PoPageAction,
  PoTableColumn,
  PoTableColumnSort,
} from '@po-ui/ng-components';
import {
  LinhasComboService,
  SecaoComboService,
  StatusComboService,
} from 'src/app/services/adaptors/wsurbano-adapter.service';
import { ColumnsSecao, SecoesModel } from './secoes.struct';
import {
  FwProtheusModel,
  Resource,
} from 'src/app/services/models/fw-protheus.model';
import { UtilsService } from 'src/app/services/functions/util.function';

@Component({
  selector: 'app-secoes',
  templateUrl: './secoes.component.html',
  styleUrls: ['./secoes.component.css'],
})
export class SecoesComponent {
  @ViewChild('secaoFilterCombo', { static: true })
  secaoFilterCombo!: PoComboComponent;

  @ViewChild('linhasFilterCombo', { static: true })
  linhasFilterCombo!: PoComboComponent;

  @ViewChild('statusFilterCombo', { static: true })
  statusFilterCombo!: PoComboComponent;

  public secaoFilter: string = '';
  public linhasFilter: string = '';
  public statusFilter: string = '';
  public filters: string = '';

  public isLoading: boolean = false;
  public resetFilters: boolean = false;
  public isShowMoreDisabled: boolean = false;

  public listSecoes: Array<SecoesModel> = [];
  public columnsSecoes: Array<PoTableColumn> = ColumnsSecao;

  public nNextPage: number = 1;
  public nTotal: number = 0;
  public nPageSize: number = 10;
  public nRegIndex: number = 1;
  public nHeightMonitor: number =
    window.innerHeight * (window.innerHeight > 850 ? 0.6 : 0.6);

  constructor(
    private _router: Router,
    public secaoComboService: SecaoComboService,
    public linhasComboService: LinhasComboService,
    public statusComboService: StatusComboService,
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
        this._router.navigate(['secoes/detSecoes/incluir']);
      },
    },
  ];

  public breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Fretamento Urbano', link: '/' }, { label: 'Seções' }],
  };

  ngOnInit() {
    this.getSecao();
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
    this.columnsSecoes.forEach(col => {
      if (
        col.property === 'otherActions' &&
        col.icons &&
        col.icons.length >= 0
      ) {
        col.icons[0].action = this.editSecao.bind(this);
        col.icons[1].action = this.viewSecao.bind(this);
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
    this.listSecoes = [];

    this.filters = '';
    this.isShowMoreDisabled = false;
    this.resetFilters = false;

    //filtros
    if (
      this.secaoFilterCombo !== undefined &&
      this.secaoFilterCombo.selectedOption !== undefined
    ) {
      if (this.filters != '') {
        this.filters += ' AND ';
      }
      this.filters +=
        " GI1_COD = '" + this.secaoFilterCombo.selectedOption.value + "' ";
    }
    // if (
    //   this.orgaoConcessorFilterCombo !== undefined &&
    //   this.orgaoConcessorFilterCombo.selectedOption !== undefined
    // ) {
    //   this.orgaoConcessorFilter =
    //     " AND ( UPPER(GI1_COD) LIKE UPPER('" +
    //     this.orgaoConcessorFilterCombo.selectedOption.value +
    //     "') OR " +
    //     " UPPER(GI1_DESCRI) LIKE UPPER('" +
    //     this.orgaoConcessorFilterCombo.selectedOption.label +
    //     "') )";
    //   if (this.filters != '') {
    //     this.filters += ' AND ';
    //   }
    //   this.filters +=
    //     " ( UPPER(GI1_COD) LIKE UPPER('" +
    //     this.orgaoConcessorFilterCombo.selectedOption.value +
    //     "') OR " +
    //     " UPPER(GI1_DESCRI) LIKE UPPER('" +
    //     this.orgaoConcessorFilterCombo.selectedOption.value +
    //     "') )";
    // }

    this.getSecao();
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
      case 'secao': {
        this.secaoFilter = '';
        break;
      }
      case 'linhas': {
        this.linhasFilter = '';
        break;
      }
      case 'status': {
        this.statusFilter = '';

        break;
      }
    }
  }

  getSecao() {
    let params = new HttpParams();
    this.isLoading = true;

    //Caso haja filtro, não realizar paginação
    if (this.filters != '') {
      params = params.append('FILTER', this.filters);
    } else {
      if (this.nPageSize.toString() != '')
        params = params.append('COUNT', this.nPageSize.toString());
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
        let secoes = new SecoesModel();
        secoes.pk = resource.pk;

        secoes.codSecao = resource.getModel('GI1MASTER').getValue('GI1_COD');
        secoes.labelSecao =
          resource.getModel('GI1MASTER').getValue('GI1_COD') +
          ' - ' +
          resource.getModel('GI1MASTER').getValue('GI1_DESCRI');

        secoes.linhas = [
          `${resource.getModel('GI1MASTER').getValue('GI1_DESCRI')}`,
          `${resource.getModel('GI1MASTER').getValue('GI1_DESCRI')}`,
        ];

        secoes.sentido = resource.getModel('GI1MASTER').getValue('GI1_DESCRI');

        secoes.status = 1;

        secoes.otherActions = ['edit', 'view'];

        this.listSecoes = [...this.listSecoes, secoes];
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
    const result = [...this.listSecoes];

    result.sort((value, valueToCompare) =>
      this._utilsService.sort(value, valueToCompare, event)
    );
    this.listSecoes = result;
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
    this.getSecao();
  }

  /*******************************************************************************
   * @name editSecao
   * @description Função responsável por ir para tela de edição quando o
   * ícone de 'lápis' é clicado na tabela
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  editSecao(event: any) {
    this._router.navigate([
      'secoes/detSecoes',
      'editar',
      btoa(event.pk),
      event.pk,
    ]);
  }

  /*******************************************************************************
   * @name viewSecao
   * @description Função responsável por ir para tela de visualização quando o
   * ícone de 'olho' é clicado na tabela
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  viewSecao(event: any) {
    this._router.navigate(['secoes/viewSecoes', btoa(event.pk), event.pk]);
  }
}
