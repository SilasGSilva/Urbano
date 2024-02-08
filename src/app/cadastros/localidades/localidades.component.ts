import { Component, OnInit, ViewChild } from '@angular/core';
import {
    PoBreadcrumb,
    PoComboComponent,
    PoNotificationService,
    PoPageAction,
    PoSelectOption,
    PoTableColumn,
    PoTableColumnSort,
} from '@po-ui/ng-components';
import { HttpParams } from '@angular/common/http';
import {
    FwProtheusModel,
    Resource,
} from 'src/app/services/models/fw-protheus.model';
import {
    CollumnsLocalidade,
    ListStatus,
    LocalidadesModel,
} from './localidade.struct';
import { UtilsService } from 'src/app/services/functions/util.function';
import {
    localComboService,
    muniComboService,
} from 'src/app/services/adaptors/wsurbano-adapter.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-localidades',
    templateUrl: './localidades.component.html',
    styleUrls: ['./localidades.component.css'],
    providers: [],
})
export class LocalidadesComponent implements OnInit {
    //Declaração de variaveis
    filters: string = '';
    filtroLocal: string = '';
    filtroMuni: string = '';

    isLoading: boolean = true;
    isShowMoreDisabled: boolean = false;

    nNextPage: number = 1;
    nPageSize: number = 10;
    nRegIndex: number = 1;
    nHeightMonitor: number =
        window.innerHeight * (window.innerHeight > 850 ? 0.6 : 0.45);

    itemsColumns: Array<PoTableColumn> = CollumnsLocalidade;
    listStatus: Array<PoSelectOption> = ListStatus;
    listLocalidade: Array<LocalidadesModel> = [];

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
            { label: 'Localidades' },
        ],
    };

    @ViewChild('filterLocal', { static: true }) filterLocal!: PoComboComponent;
    @ViewChild('filterMuni', { static: true }) filterMuni!: PoComboComponent;
    @ViewChild('cmbStatus', { static: true }) cmbStatus!: PoComboComponent;

    constructor(
        public poNotification: PoNotificationService,
        public localComboService: localComboService,
        public municipioComboService: muniComboService,
        private route: ActivatedRoute,
        private router: Router,
        private fwModel: FwProtheusModel,
        private _utilsService: UtilsService
    ) {
        this.setColProperties();
    }

    ngOnInit() {
        this.getLocalidades();
    }

    /*******************************************************************************
     * @name setColProperties
     * @description Seta as demais propriedades das colunas
     * @author   Serviços | Silas Gomes
     * @since       2024
     * @version v1
     *******************************************************************************/
    setColProperties() {
        this.itemsColumns.forEach(col => {
            if (
                col.property === 'outrasAcoes' &&
                col.icons &&
                col.icons.length >= 0
            ) {
                col.icons[0].action = this.editar.bind(this); //editar
                col.icons[1].action = this.visualizar.bind(this); //visualizar
            }
        });
    }

    /*******************************************************************************
     * @name setFilters
     * @description Ação do combo, ao selecionar o registro ele busca novamente
     * @author   Serviços | Silas Gomes
     * @since       2024
     * @version v1
     *******************************************************************************/
    setFilters(event: any) {
        this.listLocalidade = [];

        this.filters = '';
        this.isShowMoreDisabled = false;

        if (event == undefined) {
            this.filtroLocal = '';
            this.filtroMuni = '';
            this.getLocalidades();
        } else {
            //filtros
            if (this.cmbStatus.selectedOption != undefined) {
                if (this.filters != '') {
                    this.filters += ' AND ';
                }
                this.filters +=
                    " GI1_STATUS = '" +
                    this.cmbStatus.selectedOption.value +
                    "' ";
            }
            if (this.filterLocal.selectedOption != undefined) {
                this.filtroMuni =
                    " AND ( UPPER(GI1_COD) LIKE UPPER('" +
                    this.filterLocal.selectedOption.value +
                    "') OR " +
                    " UPPER(GI1_DESCRI) LIKE UPPER('" +
                    this.filterLocal.selectedOption.label +
                    "') )";
                if (this.filters != '') {
                    this.filters += ' AND ';
                }
                this.filters +=
                    " ( UPPER(GI1_COD) LIKE UPPER('" +
                    this.filterLocal.selectedOption.value +
                    "') OR " +
                    " UPPER(GI1_DESCRI) LIKE UPPER('" +
                    this.filterLocal.selectedOption.value +
                    "') )";
            }

            if (this.filterMuni.selectedOption != undefined) {
                this.filtroLocal =
                    " AND ( UPPER(GI1_CDMUNI) LIKE UPPER('" +
                    this.filterMuni.selectedOption.value +
                    "') OR " +
                    " UPPER(GI1_DSMUNI) LIKE UPPER('" +
                    this.filterMuni.selectedOption.label +
                    "') )";

                if (this.filters != '') {
                    this.filters += ' AND ';
                }
                this.filters +=
                    " ( UPPER(GI1_CDMUNI) LIKE UPPER('" +
                    this.filterMuni.selectedOption.value +
                    "') OR " +
                    " UPPER(GI1_DSMUNI) LIKE UPPER('" +
                    this.filterMuni.selectedOption.value +
                    "') )";
            }

            this.getLocalidades();
        }
    }

    /*******************************************************************************
     * @name getLocalidades
     * @description Busca dados para o grid de localidades
     * @author   Serviços | Silas Gomes
     * @param showMore indica se a função foi chamada via botão show more
     * @since       2024
     * @version v1
     *******************************************************************************/
    getLocalidades() {
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
                let localidade = new LocalidadesModel();
                let status: string = resource
                    .getModel('GI1MASTER')
                    .getValue('GI1_STATUS');

                localidade.pk = resource.pk;
                localidade.local =
                    resource.getModel('GI1MASTER').getValue('GI1_COD') +
                    ' - ' +
                    resource.getModel('GI1MASTER').getValue('GI1_DESCRI');
                localidade.municipio =
                    resource.getModel('GI1MASTER').getValue('GI1_CDMUNI') +
                    ' - ' +
                    resource.getModel('GI1MASTER').getValue('GI1_DSMUNI');
                localidade.status = status != '' ? status : '1';
                localidade.outrasAcoes = ['editar', 'visualizar'];
                this.listLocalidade = [...this.listLocalidade, localidade];
                this.isLoading = false;
            });

            this.setShowMore(this.fwModel.total);
        });
    }

    /*******************************************************************************
     * @name setShowMore
     * @description Incrementa o index de paginação da tela e
     * Seta se o botão de carregar mais continua habilitado ou não
     * @author   Serviços | Silas Gomes
     * @since       2024
     * @version v1
     *******************************************************************************/
    setShowMore(total: number) {
        this.isLoading = false;
        if (this.nRegIndex === 1) {
            this.nRegIndex = this.nPageSize + 1;
        } else {
            this.nRegIndex += this.nPageSize;
        }

        if (this.nRegIndex <= total) {
            this.isShowMoreDisabled = false;
        } else {
            this.nRegIndex = total;
            this.isShowMoreDisabled = true;
        }
    }

    /*******************************************************************************
     * @name actionShowMore
     * @description Ação do botão Carregar mais resultados
     * Se for clicado pela 4ª vez carrega o restante dos dados
     * @author   Serviços | Silas Gomes
     * @since       2024
     * @version v1
     *******************************************************************************/
    actionShowMore() {
        this.nNextPage++;
        // se for clicado pela 4a vez carrega o restante dos dados
        if (this.nNextPage === 4) {
            this.nPageSize = this.fwModel.total;
        }
        this.isShowMoreDisabled = true;
        this.getLocalidades();
    }

    /*******************************************************************************
     * @name editar
     * @description Redireciona para a página de edição
     * @author   Serviços | Silas Gomes
     * @since       2024
     * @version v1
     *******************************************************************************/
    editar(item: any) {
        this.router.navigate(['./detLocalidades', 'editar', item.pk], {
            relativeTo: this.route,
        });
    }

    /*******************************************************************************
     * @name visualizar
     * @description Redireciona para a página de visualização
     * @author   Serviços | Silas Gomes
     * @since       2024
     * @version v1
     *******************************************************************************/
    visualizar(item: any) {
        this.router.navigate(['./viewLocalidades', 'visualizar', item.pk], {
            relativeTo: this.route,
        });
    }

    /*******************************************************************************
     * @name incluir
     * @description Redireciona para o formulário de inclusão
     * @author   Serviços | Silas Gomes
     * @since       2024
     * @version v1
     *******************************************************************************/
    incluir() {
        this.router.navigate(['./detLocalidades', 'incluir'], {
            relativeTo: this.route,
        });
    }

    /*******************************************************************************
     * @name editar
     * @description Ordena colunas da tabela de crescente para decrescente
     * @author   Serviços | Silas Gomes
     * @since       2024
     * @version v1
     *******************************************************************************/
    sortTable(event: PoTableColumnSort) {
        const result = [...this.listLocalidade];

        result.sort((value, valueToCompare) =>
            this._utilsService.sort(value, valueToCompare, event)
        );
        this.listLocalidade = result;
    }
}
