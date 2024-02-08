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
    vigenciaStartFilter: string = '';
    vigenciaEndFilter: string = '';

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

    columns: Array<PoTableColumn> = ColumnsTariffs;
    listTarifas: Array<TariffsModel> = [];

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
                this.addTarifas();
            },
        },
    ];

    public breadcrumb: PoBreadcrumb = {
        items: [
            { label: 'Fretamento Urbano', link: '/' },
            { label: 'Tarifas' },
        ],
    };

    ngOnInit() {
        this.getTarifas();
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
                col.property === 'otherActions' &&
                col.icons &&
                col.icons.length >= 0
            ) {
                col.icons[0].action = this.editTariff.bind(this);
                col.icons[1].action = this.viewTariff.bind(this);
            }
        });
    }

    /*******************************************************************************
     * @name addTarifas
     * @description função responsável por redirecionar para tela de incluir uma
     * tarifa, chamada ao clicar no botão 'incluir' no canto superior direito da tela
     * @author   Serviços | Levy Santos
     * @since    2024
     * @version  v1
     *******************************************************************************/
    addTarifas() {
        this._router.navigate(['tarifas/detTarifas/incluir']);
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
                " GI1_COD = '" +
                this.tarifaFilterCombo.selectedOption.value +
                "' ";
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

    /*******************************************************************************
     * @name getTarifas
     * @description função responsável por buscar as tarifas e carregar a lista
     * @author   Serviços | Levy Santos
     * @since    2024
     * @version  v1
     *******************************************************************************/
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
                let tariffs = new TariffsModel();
                tariffs.pk = resource.pk;

                tariffs.codTariff = resource
                    .getModel('GI1MASTER')
                    .getValue('GI1_COD');
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
     * @name setRangeFilter
     * @description função chamada ao alterar o valor do campo vigência
     * @param event: any - objeto do datepicker range com o start e end
     * @author   Serviços | Levy Santos
     * @since    2024
     * @version  v1
     *******************************************************************************/
    setRangeFilter(event: any) {
        this.vigenciaStartFilter = event.start;
        this.vigenciaEndFilter = event.end;
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
        const result = [...this.listTarifas];

        result.sort((value, valueToCompare) =>
            this._utilsService.sort(value, valueToCompare, event)
        );
        this.listTarifas = result;
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
        this.getTarifas();
    }

    /*******************************************************************************
     * @name editTariff
     * @description Função responsável por ir para tela de edição quando o
     * ícone de 'lápis' é clicado na tabela
     * @author   Serviços | Levy Santos
     * @since    2024
     * @version  v1
     *******************************************************************************/
    editTariff(event: any) {
        this._router.navigate([
            'tarifas/detTarifas',
            'editar',
            btoa(event.pk),
            event.pk,
        ]);
    }

    /*******************************************************************************
     * @name viewTariff
     * @description Função responsável por ir para tela de visualização quando o
     * ícone de 'olho' é clicado na tabela
     * @author   Serviços | Levy Santos
     * @since    2024
     * @version  v1
     *******************************************************************************/
    viewTariff(event: any) {
        this._router.navigate([
            'tarifas/viewTarifas',
            btoa(event.pk),
            event.pk,
        ]);
    }
}
