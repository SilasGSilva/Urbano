import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PoBreadcrumb,
  PoDynamicViewField,
  PoNotificationService,
  PoPageAction,
} from '@po-ui/ng-components';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { FindValueByName } from 'src/app/services/functions/util.function';
import { TariffStruct } from './view-tarifas.struct';

@Component({
  selector: 'app-view-tarifas',
  templateUrl: './view-tarifas.component.html',
  styleUrls: ['./view-tarifas.component.css'],
  providers: [TariffStruct],
})
export class ViewTarifasComponent {
  public action: string = '';
  public pk: string = '';
  public filial: string = '';
  public title: string = '';
  public columnsDynamicView: Array<PoDynamicViewField> =
    this.structTarrif.ColumnsDynamicView;
  public columnsTable: Array<any> = this.structTarrif.getColumnsTable();

  public itemsDynamicView: any = {};
  public itemsTable: Array<any> = [];

  constructor(
    private _activedRoute: ActivatedRoute,
    private _router: Router,
    private _fwModel: FwProtheusModel,
    private _poNotification: PoNotificationService,
    private structTarrif: TariffStruct
  ) {
    this.pk = this._activedRoute.snapshot.params['pk'];
    this.filial = this._activedRoute.snapshot.params['filial'];
  }

  actions: Array<PoPageAction> = [
    {
      label: 'Editar',
      action: () => {
        this._router.navigate([
          'tarifas/detTarifas',
          'editar',
          btoa(this.filial),
          this.pk,
        ]);
      },
    },
    {
      label: 'Fechar',
      action: () => {
        this._router.navigate(['tarifas']);
      },
    },
  ];

  public breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Fretamento Urbano', link: '/' },
      { label: 'Cadastrar Tarifas', link: '/tarifas' },
      { label: '', link: '' },
    ],
  };

  ngOnInit() {
    this.getTarifaDynamicView();
    this.getTarifaTable();
  }

  getTarifaDynamicView() {
    let params = new HttpParams();
    this._fwModel.reset();
    this._fwModel.setEndPoint('GTPA001/' + this.pk);
    this._fwModel.setVirtualField(true);
    this._fwModel.get(params).subscribe({
      next: (data: any) => {
        this.title = `${FindValueByName(
          data.models[0].fields,
          'GI1_COD'
        )} - ${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`;
        this.breadcrumb.items[2].label = this.title;

        this.itemsDynamicView = {
          codigo: `${FindValueByName(data.models[0].fields, 'GI1_COD')}`,
          descricao: `${FindValueByName(data.models[0].fields, 'GI1_COD')}`,
          orgaoConcessor: `${FindValueByName(
            data.models[0].fields,
            'GI1_COD'
          )}`,
          valor: `${FindValueByName(data.models[0].fields, 'GI1_COD')}`,
          vigencia: `${FindValueByName(data.models[0].fields, 'GI1_COD')}`,
          formasDePagamento: `${FindValueByName(
            data.models[0].fields,
            'GI1_COD'
          )}`,
        };
      },
      error: (err: any) => {
        this._poNotification.error(err.errorMessage);
      },
      complete: () => {},
    });
  }

  getTarifaTable() {
    this.itemsTable = this.structTarrif.getItemsTable();
  }

  edit() {}

  close() {}
}
