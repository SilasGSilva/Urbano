import { Component } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Route, Router } from '@angular/router';
import {
  PoBreadcrumb,
  PoNotificationService,
  PoPageAction,
  PoTableColumn,
  PoTableColumnSort,
} from '@po-ui/ng-components';
import {
  PaymentMethodColumns,
  PaymentMethodModel,
} from './formas-de-pagamento-struct';
import { UtilsService } from 'src/app/services/functions/util.function';
import {
  FwProtheusModel,
  Resource,
} from 'src/app/services/models/fw-protheus.model';

@Component({
  selector: 'app-formas-de-pagamento',
  templateUrl: './formas-de-pagamento.component.html',
  styleUrls: ['./formas-de-pagamento.component.css'],
  providers: [UtilsService],
})
export class FormasDePagamentoComponent {
  constructor(
    private poNotification: PoNotificationService,
    private _router: Router,
    private _utilsService: UtilsService,
    private fwModel: FwProtheusModel
  ) {
    this.setColProperties();
  }

  columns: Array<PoTableColumn> = PaymentMethodColumns;
  listPagamento: Array<PaymentMethodModel> = [];

  nNextPage: number = 1;
  nPageSize: number = 10;
  nRegIndex: number = 1;
  nHeightMonitor: number = window.innerHeight * 0.7;

  isTableLoading: boolean = false;
  isShowMoreDisabled: boolean = false;

  actions: Array<PoPageAction> = [
    {
      label: 'Incluir',
      action: () => {
        this.incluir();
      },
    },
  ];

  public breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Fretamento Urbano', link: '/' },
      { label: 'Formas de pagamento' },
    ],
  };

  ngOnInit() {
    this.getFormaPagamento();
  }

  setColProperties() {
    this.columns.forEach(col => {
      if (
        col.property === 'otherActions' &&
        col.icons &&
        col.icons.length >= 0
      ) {
        col.icons[0].action = this.editRow.bind(this);
      }
    });
  }

  /**
   * Redireciona para a página de inclusao
   * @param row linha selecionada
   */
  incluir() {
    this._router.navigate([
      `formas-de-pagamento/det-forma-pagamento`,
      'incluir',
    ]);
  }

  /**
   * Ordena colunas da tabela de crescente para decrescente
   * @param event
   */
  sortTable(event: PoTableColumnSort) {
    const result = [...this.listPagamento];

    result.sort((value, valueToCompare) =>
      this._utilsService.sort(value, valueToCompare, event)
    );
    this.listPagamento = result;
  }

  getFormaPagamento() {
    let params = new HttpParams();
    this.isTableLoading = true;

    //Caso haja filtro, não realizar paginação

    if (this.nPageSize.toString() != '')
      params = params.append('COUNT', this.nPageSize.toString());
    if (this.nRegIndex.toString() != '')
      params = params.append('STARTINDEX', this.nRegIndex.toString());

    this.fwModel.setEndPoint('GTPU001/');

    this.fwModel.setVirtualField(true);
    this.fwModel.get(params).subscribe(() => {
      this.fwModel.resources.forEach((resource: Resource) => {
        let paymentMethod = new PaymentMethodModel();

        paymentMethod.id = resource.pk;
        paymentMethod.codPayment = resource
          .getModel('H6RMASTER')
          .getValue('H6R_CODIGO');

        paymentMethod.labelPayment =
          resource.getModel('H6RMASTER').getValue('H6R_CODIGO') +
          ' - ' +
          resource.getModel('H6RMASTER').getValue('H6R_DESCRI');

        paymentMethod.descPayment = resource
          .getModel('H6RMASTER')
          .getValue('H6R_DESCRI');

        paymentMethod.otherActions = ['editar'];
        this.listPagamento = [...this.listPagamento, paymentMethod];
        this.isTableLoading = false;
      });
      this.setShowMore(this.fwModel.total);
    });
  }
  /**
   * setShowMore - Responsavel pelo controle do carregar mais
   * @param total numero total de cadastro de forma de pagamento
   */
  setShowMore(total: number) {
    this.isTableLoading = false;
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

  actionShowMore() {
    this.nNextPage++;
    // se for clicado pela 4a vez carrega o restante dos dados
    if (this.nNextPage === 4) {
      this.nPageSize = this.fwModel.total;
    }

    this.isShowMoreDisabled = true;
    this.getFormaPagamento();
  }

  /*******************************************************************************
   * @name editRow
   * @description Função responsável por abrir a tela de edição da linha
   * selecionada
   * @param row Linha qual foi clicada
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  editRow(row: any) {
    this._router.navigate([
      `formas-de-pagamento/det-forma-pagamento`,
      'editar',
      row.id,
    ]);
  }
}
