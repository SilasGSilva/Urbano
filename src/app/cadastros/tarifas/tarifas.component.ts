import { Component, ViewChild } from '@angular/core';
import {
  PoBreadcrumb,
  PoComboComponent,
  PoPageAction,
  PoTableColumn,
  PoTableColumnSort,
} from '@po-ui/ng-components';
import {
  OrgaoConcessorComboService,
  TarifaComboService,
} from 'src/app/services/adaptors/wsurbano-adapter.service';
import { ColumnsTariffs, TariffsModel } from './tarifas.struct';
import { HttpParams } from '@angular/common/http';
import {
  FwProtheusModel,
  Resource,
} from 'src/app/services/models/fw-protheus.model';
import { UtilsService } from 'src/app/services/functions/util.function';
import { PoDatepickerRangeBaseComponent } from '@po-ui/ng-components/lib/components/po-field/po-datepicker-range/po-datepicker-range-base.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarifas',
  templateUrl: './tarifas.component.html',
  styleUrls: ['./tarifas.component.css'],
})
export class TarifasComponent {
  @ViewChild('tarifaFilterCombo', { static: true })
  tarifaFilterCombo!: PoComboComponent;

  @ViewChild('orgaoConcessorFilterCombo', { static: true })
  orgaoConcessorFilterCombo!: PoComboComponent;

  @ViewChild('vigenciafilterRange', { static: true })
  vigenciafilterRange!: PoDatepickerRangeBaseComponent;

  constructor(
    public tarifaComboService: TarifaComboService,
    public orgaoConcessorComboService: OrgaoConcessorComboService,
    private _fwModel: FwProtheusModel,
    private _utilsService: UtilsService,
    private _router: Router
  ) {
    this.setColProperties();
  }

  //Declaração de variaveis
  tarifaFilter: string = '';
  orgaoConcessorFilter: string = '';
  validityStartFilter: string = '';
  validityEndFilter: string = '';

  filters: string = '';
  isLoading: boolean = false;
  resetFilters: boolean = false;
  isShowMoreDisabled: boolean = false;

  nNextPage: number = 1;
  nPageSize: number = 10;
  nRegIndex: number = 1;
  nHeightMonitor: number =
    window.innerHeight * (window.innerHeight > 850 ? 0.6 : 0.45);

  columns: Array<PoTableColumn> = ColumnsTariffs;
  listTarifas: Array<TariffsModel> = [];

  actions: Array<PoPageAction> = [
    {
      label: 'Incluir',
      action: () => {
        this.addTarifas();
      },
    },
  ];

  public breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Fretamento Urbano', link: '/' }, { label: 'Tarifas' }],
  };

  ngOnInit() {
    this.getTarifas();
  }

  setColProperties() {
    this.columns.forEach((col) => {
      if (
        col.property === 'otherActions' &&
        col.icons &&
        col.icons.length >= 0
      ) {
        col.icons[0].action = this.editTariff.bind(this);
        col.icons[1].action = this.viewTariff.bind(this);
      }
    });
  }

  addTarifas() {
    this._router.navigate(['tarifas/detTarifas/incluir'])
  }

  setFilters() {
    this.listTarifas = [];

    this.filters = '';
    this.isShowMoreDisabled = false;
    this.resetFilters = false;

    //filtros
    if (
      this.tarifaFilterCombo !== undefined &&
      this.tarifaFilterCombo.selectedOption !== undefined
    ) {
      if (this.filters != '') {
        this.filters += ' AND ';
      }
      this.filters +=
        " GI1_STATUS = '" + this.tarifaFilterCombo.selectedOption.value + "' ";
    }
    if (
      this.orgaoConcessorFilterCombo !== undefined &&
      this.orgaoConcessorFilterCombo.selectedOption !== undefined
    ) {
      this.orgaoConcessorFilter =
        " AND ( UPPER(GI1_COD) LIKE UPPER('" +
        this.orgaoConcessorFilterCombo.selectedOption.value +
        "') OR " +
        " UPPER(GI1_DESCRI) LIKE UPPER('" +
        this.orgaoConcessorFilterCombo.selectedOption.label +
        "') )";
      if (this.filters != '') {
        this.filters += ' AND ';
      }
      this.filters +=
        " ( UPPER(GI1_COD) LIKE UPPER('" +
        this.orgaoConcessorFilterCombo.selectedOption.value +
        "') OR " +
        " UPPER(GI1_DESCRI) LIKE UPPER('" +
        this.orgaoConcessorFilterCombo.selectedOption.value +
        "') )";
    }

    this.getTarifas();
  }

  cleanFilter(filter: string = '') {
    switch (filter) {
      case 'tarifa': {
        this.tarifaFilter = '';
        break;
      }
      case 'orgaoConcessor': {
        this.orgaoConcessorFilter = '';
        break;
      }
      case 'vigencia': {
        this.vigenciafilterRange.dateRange.start = '';
        this.vigenciafilterRange.dateRange.end = '';
        break;
      }
    }
  }

  getTarifas() {
    let params = new HttpParams();
    this.isLoading = true;

    //Caso haja filtro, não realizar paginação
    if (this.filters != '') {
      params = params.append('FILTER', this.filters);
    } else {
      if (this.nPageSize.toString() != '')
        params = params.append('COUNT', this.nPageSize.toString());
      if (this.nRegIndex.toString() != '')
        params = params.append('STARTINDEX', this.nRegIndex.toString());
    }
    this._fwModel.setEndPoint('GTPA001/');

    this._fwModel.setVirtualField(true);
    this._fwModel.get(params).subscribe(() => {
      this._fwModel.resources.forEach((resource: Resource) => {
        let tariffs = new TariffsModel();
        let status: string = resource
          .getModel('GI1MASTER')
          .getValue('GI1_STATUS');

        tariffs.codTariff = resource.getModel('GI1MASTER').getValue('GI1_COD');
        tariffs.labelTariff =
          resource.getModel('GI1MASTER').getValue('GI1_COD') +
          ' - ' +
          resource.getModel('GI1MASTER').getValue('GI1_DESCRI');

        tariffs.descTariff = resource
          .getModel('GI1MASTER')
          .getValue('GI1_DESCRI');

        tariffs.otherActions = ['edit', 'view'];

        this.listTarifas = [...this.listTarifas, tariffs];
        this.isLoading = false;
      });

      this.setShowMore(this._fwModel.total);
    });
  }

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

  setRangeFilter(event: any) {
    this.validityStartFilter = event.start;
    this.validityEndFilter = event.end;
  }

  sortTable(event: PoTableColumnSort) {
    const result = [...this.listTarifas];

    result.sort((value, valueToCompare) =>
      this._utilsService.sort(value, valueToCompare, event)
    );
    this.listTarifas = result;
  }

  actionShowMore() {
    this.nNextPage++;
    // se for clicado pela 4a vez carrega o restante dos dados
    if (this.nNextPage === 4) {
      this.nPageSize = this._fwModel.total;
    }

    this.isShowMoreDisabled = true;
    this.getTarifas();
  }

  editTariff() {
    console.log('edit');
  }

  viewTariff() {
    console.log('voew');
  }
}
