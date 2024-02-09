import { Component } from '@angular/core';
import { PoBreadcrumb, PoPageAction, PoSelectOption, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { CollumnsLinhas, LinhasModel, ListStatus } from './linha.struct';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { comboFormService, localidadeComboService } from 'src/app/services/adaptors/wsurbano-adapter.service';

@Component({
  selector: 'app-linhas',
  templateUrl: './linhas.component.html',
  styleUrls: ['./linhas.component.css']
})
export class LinhasComponent {

  constructor(
        private _router: Router, 
        private _activedRoute: ActivatedRoute,
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
    action: this.editar.bind(this),
    icon: "po-icon po-icon-edit",
    label: 'editar'
    },
    {
        action: this.deleteLinha.bind(this),
        icon: "po-icon po-icon-eye",
        label: 'Visualizar',
    }
  ];

  public editLinha(linha:any){

  }

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
  // Ação para o botão show more
  public actionShowMore() {
    
  }

  // Obter dados das linhasl
  public getLinhas(showMore?:boolean){

    let params = new HttpParams();
    //this.isLoading = true;

    let linhas: Array<LinhasModel> = []
    let dadosMock = this.generateMock('linhas')

    linhas = this.genarateLinhas(dadosMock);

    this.listLinhas = [...this.listLinhas, ...linhas]
    
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
}
