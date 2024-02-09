import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
    PoTableColumn,
    PoPageAction,
    PoBreadcrumb,
    PoTableColumnSort,
} from '@po-ui/ng-components';
import { UtilsService } from 'src/app/services/functions/util.function';
import {
    FwProtheusModel,
    Resource,
} from 'src/app/services/models/fw-protheus.model';
import { ColumnsRoletas, RoletasModel } from './roletas.struct';

@Component({
    selector: 'app-roletas',
    templateUrl: './roletas.component.html',
    styleUrls: ['./roletas.component.css'],
})
export class RoletasComponent {
    constructor(
        private _fwModel: FwProtheusModel,
        private _utilsService: UtilsService,
        private _router: Router
    ) {
        this.setColProperties();
    }

    //Declaração de variaveis
    filters: string = '';
    isLoading: boolean = false;
    resetFilters: boolean = false;
    isShowMoreDisabled: boolean = false;

    nNextPage: number = 1;
    nTotal: number = 0;
    nPageSize: number = 10;
    nRegIndex: number = 1;
    nHeightMonitor: number =
        window.innerHeight * (window.innerHeight > 850 ? 0.6 : 0.6);

    columns: Array<PoTableColumn> = ColumnsRoletas;
    listRoletas: Array<RoletasModel> = [];

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
                this.addRoletas();
            },
        },
    ];

    public breadcrumb: PoBreadcrumb = {
        items: [
            { label: 'Fretamento Urbano', link: '/' },
            { label: 'Cadastrar Roletas' },
        ],
    };

    ngOnInit() {
        this.getRoletas();
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
        this.columns.forEach(col => {
            if (
                col.property === 'outrasAcoes' &&
                col.icons &&
                col.icons.length >= 0
            ) {
                col.icons[0].action = this.editValiddador.bind(this);
            }
        });
    }

    /*******************************************************************************
     * @name addRoletas
     * @description função responsável por redirecionar para tela de incluir um
     * validador, chamada ao clicar no botão 'incluir' no canto superior direito da tela
     * @author   Serviços | Levy Santos
     * @since    2024
     * @version  v1
     *******************************************************************************/
    addRoletas() {
        this._router.navigate(['roletas/detRoletas/incluir']);
    }

    /*******************************************************************************
     * @name getRoletas
     * @description função responsável por buscar as roletas e carregar a lista
     * @author   Serviços | Levy Santos
     * @since    2024
     * @version  v1
     *******************************************************************************/
    getRoletas() {
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
                    params = params.append(
                        'STARTINDEX',
                        this.nRegIndex.toString()
                    );
                }
        }
        this._fwModel.setEndPoint('GTPA001/');

        this._fwModel.setVirtualField(true);
        this._fwModel.get(params).subscribe(() => {
            this._fwModel.resources.forEach((resource: Resource) => {
                let roletas = new RoletasModel();
                roletas.pk = resource.pk;

                roletas.codRoleta = resource
                    .getModel('GI1MASTER')
                    .getValue('GI1_COD');

                roletas.descRoleta = resource
                    .getModel('GI1MASTER')
                    .getValue('GI1_DESCRI');

                roletas.labelRoleta =
                    resource.getModel('GI1MASTER').getValue('GI1_COD') +
                    ' - ' +
                    resource.getModel('GI1MASTER').getValue('GI1_DESCRI');

                roletas.outrasAcoes = ['edit'];

                this.listRoletas = [...this.listRoletas, roletas];
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
        const result = [...this.listRoletas];

        result.sort((value, valueToCompare) =>
            this._utilsService.sort(value, valueToCompare, event)
        );
        this.listRoletas = result;
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
        this.getRoletas();
    }

    /*******************************************************************************
     * @name editValiddador
     * @description Função responsável por ir para tela de edição quando o
     * ícone de 'lápis' é clicado na tabela
     * @author   Serviços | Levy Santos
     * @since    2024
     * @version  v1
     *******************************************************************************/
    editValiddador(event: any) {
        this._router.navigate([
            'roletas/detRoletas',
            'editar',
            btoa(event.pk),
            event.pk,
        ]);
    }
}
