import { 
  Component, 
  ViewChild 
} from '@angular/core';
import { 
  PoBreadcrumb, 
  PoComboComponent, 
  PoPageAction, 
  PoSelectOption, 
  PoTableAction, 
  PoTableColumn 
} from '@po-ui/ng-components';
import { 
  CollumnsLinhas, 
  LinhasModel, 
  ListStatus 
} from './linha.struct';
import { HttpParams } from '@angular/common/http';
import { 
  ActivatedRoute, 
  Router 
} from '@angular/router';
import { 
  comboFormService, 
  localidadeComboService 
} from 'src/app/services/adaptors/wsurbano-adapter.service';
import { 
  FwProtheusModel, 
  Resource 
} from 'src/app/services/models/fw-protheus.model';

@Component({
  selector: 'app-linhas',
  templateUrl: './linhas.component.html',
  styleUrls: ['./linhas.component.css']
})
export class LinhasComponent {
  @ViewChild('prefixoFilterCombo', {static: true})
  prefixoFilterCombo!: PoComboComponent

  @ViewChild('origemFilterCombo',{static:true})
  origemFilterCombo!: PoComboComponent

  @ViewChild('destinoFilterCombo',{static:true})
  destinoFilterCombo!: PoComboComponent
  
  @ViewChild('statusFilterCombo',{static:true})
  statusFilterCombo!: PoComboComponent
  
  constructor(
        private _router: Router, 
        private _activedRoute: ActivatedRoute,
        private _fwModel:FwProtheusModel,
        public localidadeComboService: localidadeComboService,
      ){}
  public nHeightMonitor: number = window.innerHeight * (window.innerHeight > 850 ? 0.6 : 0.45);
  public isShowMoreDisabled: boolean = false;
  public isLoading: boolean = false;
  
  // Filtros
  public filters: string = '';
  public filterPrefixo: string = '';
  public filterOrigem: string = '';
  public filtroDestino: string = '';
  public filtroStatus: string = '';
  public resetFilters: boolean = false;

  nNextPage: number = 1;
  nPageSize: number = 10;
  nRegIndex: number = 1;
  nTotal: number = 0;
  
  // Breadcrumb
  public breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Fretamento Urbano', link: '/' }, {label:'Linhas'}]
  }

  // Botão incluir
  public actions: Array<PoPageAction> = [
		{ label: 'Incluir', action: () => { this.incluir() } },
	];


  // Ações para as linhas da tabela
  public tableActions: Array<PoTableAction> = [{
    action: this.editLinha.bind(this),
    icon: "po-icon po-icon-edit",
    label: 'editar'
    },
    {
        action: this.deleteLinha.bind(this),
        icon: "po-icon po-icon-eye",
        label: 'Visualizar',
    }
  ];


  public deleteLinha(linha:any){

  }
  // Lista de status
  public listStatus: Array<PoSelectOption> = ListStatus;

  // Estrutura das colunas da grid
  public itemsColumns: Array<PoTableColumn> = CollumnsLinhas;

  // Modelo de dados da grid linhas
  public listLinhas: Array<LinhasModel> = [];

  ngOnInit(){
    this.isLoading = false;
    this.isShowMoreDisabled = true;
    this.getLinhas();
  }

  // Abre tela que permite realizar a inclusão de uma linha
  public incluir() {
    this._router.navigate(["./det-linha", "incluir"], { relativeTo: this._activedRoute });
  };

	public editar(item: any) {
    this._router.navigate(["./det-linha", "editar",item], { relativeTo: this._activedRoute });

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
    this.getLinhas();
  }

  /*******************************************************************************
   * @name getLinhas
   * @description função responsável por buscar as linhas
   * @author   Serviços | Diego Bezerra
   * @since    2024
   * @version  v1
   *******************************************************************************/
  public getLinhas(){
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
            let linhas = new LinhasModel();
            linhas.pk = resource.pk;

            linhas.prefixolinha = resource
                .getModel('GI1MASTER')
                .getValue('GI1_COD');
            linhas.origem =
                resource.getModel('GI1MASTER').getValue('GI1_COD') +
                ' - ' +
                resource.getModel('GI1MASTER').getValue('GI1_DESCRI');

            linhas.destino =                 
            resource.getModel('GI1MASTER').getValue('GI1_COD') +
            ' - ' +
            resource.getModel('GI1MASTER').getValue('GI1_DESCRI');

            linhas.outrasAcoes = ['editar', 'visualizar'];

            this.listLinhas = [...this.listLinhas, linhas];
            this.isLoading = false;

        });

        this.nTotal = this._fwModel.total;
        this.setShowMore(this._fwModel.total);

    });    
  }
  

    /*******************************************************************************
   * @name editLinha
   * @description Função responsável por acessar a tela de edição, ao utilizar o botão 
   *  Editar
   * @author   Serviços | Diego Bezerra
   * @since    2024
   * @version  v1
   *******************************************************************************/
    editLinha(item: any) {
      this._router.navigate(["./det-linha", "editar",item], { relativeTo: this._activedRoute });

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

  public genarateLinhas(data:Array<any>):Array<LinhasModel>{
    let returnData:Array<LinhasModel> = [];

    data.forEach(linha=>{
      let data = new LinhasModel;
      data.pk = linha.pk;
      data.prefixolinha = linha.prefixolinha;
      data.codigolinha = linha.codigolinha;
      data.tarifa = linha.tarifa;
      data.origem = linha.origem;
      data.destino = linha.destino;
      data.status = linha.status;
      data.outrasAcoes = linha.outrasAcoes;
      returnData.push(data);
    })

    return returnData;
  }

  // Gerar dados fake
  public generateMock(source:string){
    let returnData = []
    if (source == 'linhas'){
      returnData = [
        {
          "pk":"0123",
          "prefixolinha": "1 0123",
          "codigolinha": "12345",
          "tarifa": "00001-TABELA1-URBANO - R$ 4,40",
          "origem": "00001-METRÔ SANTANA",
          "destino": "00002-PQ. DOM PEDRO II",
          "status": "1",
          "outrasAcoes":['editar','visualizar']
        },        
        {
          "pk":"0124",
          "prefixolinha": "1 0123",
          "codigolinha": "4245",
          "tarifa": "00001-TABELA1-URBANO - R$ 4,40",
          "origem": "00001-METRÔ SANTANA",
          "destino": "00003-TERMINAL GRAJAÚ",
          "status": "1",
          "outrasAcoes":['editar','visualizar']
        },
        {
          "pk":"0125",
          "prefixolinha": "1 0665",
          "codigolinha": "9428",
          "tarifa": "00001-TABELA1-URBANO - R$ 4,40",
          "origem": "00005-METRÔ BARRA FUNDA",
          "destino": "00006-EST.MENDES/VL.NATAL",
          "status": "1",
          "outrasAcoes":['editar','visualizar']
        },
        {
          "pk":"0126",
          "prefixolinha": "1 1133",
          "codigolinha": "32094",
          "tarifa": "00001-TABELA1-URBANO - R$ 4,40",
          "origem": "00003-TERMINAL GRAJAÚ",
          "destino": "00001-METRÔ SANTANA",
          "status": "2",
          "outrasAcoes":['editar','visualizar']
        }
      ]
    }
    return returnData
  }

    /*******************************************************************************
   * @name setFilters
   * @description função chamada ao alterar o valor dos campos po-combo para
   *  filtrar o conteúdo baseado no filtro escolhido
   * @author   Serviços | Diego Bezerra
   * @since    2024
   * @version  v1
   *******************************************************************************/
    setFilters() {
      this.listLinhas = [];

      this.filters = '';
      this.isShowMoreDisabled = false;
      this.resetFilters = false;

      //filtros
      if (
          this.prefixoFilterCombo !== undefined &&
          this.prefixoFilterCombo.selectedOption !== undefined
      ) {
          if (this.filters != '') {
              this.filters += ' AND ';
          }
          this.filters +=
              " GI1_COD = '" +
              this.prefixoFilterCombo.selectedOption.value +
              "' ";
      }
      if (
          this.origemFilterCombo !== undefined &&
          this.origemFilterCombo.selectedOption !== undefined
      ) {
          if (this.filters != ''){
            this.filters += ' AND ';
          }
          this.filters += 
            " GI1_COD = '" + 
              this.origemFilterCombo.selectedOption.value +
              "' ";
      }
      if (
        this.destinoFilterCombo !== undefined &&
        this.destinoFilterCombo.selectedOption !== undefined
      ){
        if (this.filters != ''){
          this.filters += ' AND ';
        }
        this.filters += 
          " GI1_COD = '" + 
            this.origemFilterCombo.selectedOption.value +
            "' ";
    }
      if(
        this.statusFilterCombo.selectedOption !== undefined
      ) {
        if(this.filters != ''){
          this.filters += ' AND ';
        }
        this.filters += 
          "GI1_STATUS = '" + this.statusFilterCombo.selectedOption + "' "
      }


      this.getLinhas();
  }
  /*******************************************************************************
   * @name clearFilter
   * @description função chamada ao alterar o valor dos campos po-combo
   * @param filer: string - nome do filtro clicado para saber qual limpar
   * @author   Serviços | Diego Bezerra
   * @since    2024
   * @version  v1
   *******************************************************************************/
  clearFilter(filter: string = '') {
    switch (filter) {
        case 'prefixo': {
            break;
        }
        case 'origem': {
            break;
        }
        case 'destino': {
            break;
        }
        case 'status': {
          break;
        }
    }
}
}
