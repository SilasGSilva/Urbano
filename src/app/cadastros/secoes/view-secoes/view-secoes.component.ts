import { Component } from '@angular/core';
import {
  PoBreadcrumb,
  PoDynamicViewField,
  PoNotificationService,
  PoPageAction,
} from '@po-ui/ng-components';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { FindValueByName } from 'src/app/services/functions/util.function';
import { ActivatedRoute, Router } from '@angular/router';
import { SecoesStruct, itemsDynamicView } from './view-secoes.struct';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-view-secoes',
  templateUrl: './view-secoes.component.html',
  styleUrls: ['./view-secoes.component.css'],
  providers: [SecoesStruct],
})
export class ViewSecoesComponent {
  public isShowLoading: boolean = false;

  public action: string = '';
  public pk: string = '';
  public filial: string = '';
  public title: string = '';

  public columnsDynamicView: Array<PoDynamicViewField> =
    this._structView.ColumnsDynamicView;

  public itemsDynamicView: itemsDynamicView;

  constructor(
    private _activedRoute: ActivatedRoute,
    private _router: Router,
    private _fwModel: FwProtheusModel,
    private _poNotification: PoNotificationService,
    private _structView: SecoesStruct
  ) {
    this.pk = this._activedRoute.snapshot.params['pk'];
    this.filial = this._activedRoute.snapshot.params['filial'];
  }

  /*******************************************************************************
   * @name actions
   * @description Ações no menu superior direito da tela, botão de editar e fechar
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  actions: Array<PoPageAction> = [
    {
      label: 'Editar',
      action: () => {
        this._router.navigate([
          'secoes/detSecoes',
          'editar',
          btoa(this.filial),
          this.pk,
        ]);
      },
    },
    {
      label: 'Fechar',
      action: () => {
        this._router.navigate(['secoes']);
      },
    },
  ];

  public breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Fretamento Urbano', link: '/' },
      { label: 'Cadastrar Seções', link: '/secoes' },
      { label: '', link: '' },
    ],
  };

  ngOnInit() {
    this.getSecaoDynamicView();
  }

  /*******************************************************************************
   * @name getSecaoDynamicView
   * @description Função responsável por buscar os dados e carregar na tela
   * preenchendo os campos para visualização
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  getSecaoDynamicView() {
    this.changeLoading();
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
          descricao: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
          origem: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
          destino: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
          sentido: `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
          linhasAssociadas: [
            `${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
            ` ${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`,
          ],
          status: 1,
        };
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
}
