import { Component, ViewChild } from '@angular/core';
import {
  PoBreadcrumb,
  PoComboComponent,
  PoDatepickerRange,
  PoPageAction,
  PoTableColumn,
  PoTableColumnSort,
} from '@po-ui/ng-components';
import {
  GrantingBodyComboService,
  TariffComboService,
} from 'src/app/services/adaptors/wsurbano-adapter.service';
import { ColumnsTariffs, TariffsModel } from './tarifas.struct';
import { HttpParams } from '@angular/common/http';
import {
  FwProtheusModel,
  Resource,
} from 'src/app/services/models/fw-protheus.model';
import { UtilsService } from 'src/app/services/functions/util.function';
import { PoDatepickerBaseComponent } from '@po-ui/ng-components/lib/components/po-field/po-datepicker/po-datepicker-base.component';
import { PoDatepickerRangeBaseComponent } from '@po-ui/ng-components/lib/components/po-field/po-datepicker-range/po-datepicker-range-base.component';

@Component({
  selector: 'app-tarifas',
  templateUrl: './tarifas.component.html',
  styleUrls: ['./tarifas.component.css'],
})
export class TarifasComponent {
  @ViewChild('tariffFilterCombo', { static: true })
  tariffFilterCombo!: PoComboComponent;

  @ViewChild('grantingBodyFilterCombo', { static: true })
  grantingBodyFilterCombo!: PoComboComponent;

  @ViewChild('ValidityfilterRange', { static: true })
  ValidityfilterRange!: PoDatepickerRangeBaseComponent;

  constructor(
    public tariffComboService: TariffComboService,
    public grantingComboService: GrantingBodyComboService,
    private fwModel: FwProtheusModel,
    private _utilsService: UtilsService
  ) {
    this.setColProperties();
  }

  //Declaração de variaveis
  tariffFilter: string = '';
  grantingBodyFilter: string = '';
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
  listTariffs: Array<TariffsModel> = [];

  actions: Array<PoPageAction> = [
    {
      label: 'Incluir',
      action: () => {
        this.addTariff();
      },
    },
  ];

  public breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Fretamento Urbano', link: '/' }, { label: 'Tarifas' }],
  };

  ngOnInit() {
    this.getTariffs();
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

  addTariff() {}

  setFilters() {
    this.listTariffs = [];

    this.filters = '';
    this.isShowMoreDisabled = false;
    this.resetFilters = false;

    //filtros
    if (
      this.tariffFilterCombo !== undefined &&
      this.tariffFilterCombo.selectedOption !== undefined
    ) {
      if (this.filters != '') {
        this.filters += ' AND ';
      }
      this.filters +=
        " GI1_STATUS = '" + this.tariffFilterCombo.selectedOption.value + "' ";
    }
    if (
      this.grantingBodyFilterCombo !== undefined &&
      this.grantingBodyFilterCombo.selectedOption !== undefined
    ) {
      this.grantingBodyFilter =
        " AND ( UPPER(GI1_COD) LIKE UPPER('" +
        this.grantingBodyFilterCombo.selectedOption.value +
        "') OR " +
        " UPPER(GI1_DESCRI) LIKE UPPER('" +
        this.grantingBodyFilterCombo.selectedOption.label +
        "') )";
      if (this.filters != '') {
        this.filters += ' AND ';
      }
      this.filters +=
        " ( UPPER(GI1_COD) LIKE UPPER('" +
        this.grantingBodyFilterCombo.selectedOption.value +
        "') OR " +
        " UPPER(GI1_DESCRI) LIKE UPPER('" +
        this.grantingBodyFilterCombo.selectedOption.value +
        "') )";
    }

    this.getTariffs();
  }

  cleanFilter(filter: string = '') {
    switch (filter) {
      case 'tariff': {
        this.tariffFilter = '';
        break;
      }
      case 'grantingBody': {
        this.grantingBodyFilter = '';
        break;
      }
      case 'validity': {
        this.ValidityfilterRange.dateRange.start = '';
        this.ValidityfilterRange.dateRange.end = '';
        break;
      }
    }
  }

  getTariffs() {
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
    this.fwModel.setEndPoint('GTPA001/');

    this.fwModel.setVirtualField(true);
    this.fwModel.get(params).subscribe(() => {
      this.fwModel.resources.forEach((resource: Resource) => {
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

        this.listTariffs = [...this.listTariffs, tariffs];
        this.isLoading = false;
      });

      this.setShowMore(this.fwModel.total);
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
    const result = [...this.listTariffs];

    result.sort((value, valueToCompare) =>
      this._utilsService.sort(value, valueToCompare, event)
    );
    this.listTariffs = result;
  }

  actionShowMore() {
    this.nNextPage++;
    // se for clicado pela 4a vez carrega o restante dos dados
    if (this.nNextPage === 4) {
      this.nPageSize = this.fwModel.total;
    }

    this.isShowMoreDisabled = true;
    this.getTariffs();
  }

  editTariff() {
    console.log('edit');
  }

  viewTariff() {
    console.log('voew');
  }
}
