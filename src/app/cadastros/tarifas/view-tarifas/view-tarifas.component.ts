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
    public isShowLoading: boolean = false;

    public action: string = '';
    public pk: string = '';
    public filial: string = '';
    public title: string = '';

    public columnsDynamicView: Array<PoDynamicViewField> =
        this._structTariff.ColumnsDynamicView;
    public columnsTable: Array<any> = this._structTariff.getColumnsTable();

    public itemsDynamicView: any = {};
    public itemsTable: Array<any> = [];

    constructor(
        private _activedRoute: ActivatedRoute,
        private _router: Router,
        private _fwModel: FwProtheusModel,
        private _poNotification: PoNotificationService,
        private _structTariff: TariffStruct
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

    /*******************************************************************************
     * @name getTarifaDynamicView
     * @description Função responsável por buscar os dados e carregar na tela
     * preenchendo os campos para visualização
     * @author   Serviços | Levy Santos
     * @since    2024
     * @version  v1
     *******************************************************************************/
    getTarifaDynamicView() {
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
            complete: () => {
                this.changeLoading();
            },
        });
    }

    /*******************************************************************************
     * @name getTarifaTable
     * @description Ação responsável por buscar os itens da tabela de histórico
     * de vigências
     * @author   Serviços | Levy Santos
     * @since    2024
     * @version  v1
     *******************************************************************************/
    getTarifaTable() {
        this.changeLoading();
        this.itemsTable = this._structTariff.getItemsTable();
        this.changeLoading();
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
