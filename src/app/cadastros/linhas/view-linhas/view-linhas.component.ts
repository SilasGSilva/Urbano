import { Component, OnInit } from '@angular/core';
import {
  PoBreadcrumb,
  PoDynamicViewField,
  PoNotificationService,
  PoPage,
  PoPageAction,
  PoTableColumn,
} from '@po-ui/ng-components';
import { ColunasDadosViewLinhas, SecaoModel, secoesLinha } from './view-linhas.struct';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-linhas',
  templateUrl: './view-linhas.component.html',
  styleUrls: ['./view-linhas.component.css']
})
export class ViewLinhasComponent implements OnInit{
  viewLinhas = {};
  titulo: string = '';
  isHideLoadingTela: boolean = true;
  colunaDados: Array<PoDynamicViewField> = ColunasDadosViewLinhas;
  pkLinha:string = ''
  actions: Array<PoPageAction> = [
    {
      label: 'Editar',
      action: () =>{
        this.editar();
      }
    },{
      label: 'Fechar',
      action: ()=>{
        this.close()
      }
    }
  ]
  public breadcrumb: PoBreadcrumb = {
    items: [
        { label: 'Fretamento Urbano', link: '/' },
        { label: 'Linhas', link: '/linhas' },
        { label: '' },
    ],
  };
  public itemsColumns: Array<PoTableColumn> = secoesLinha;
  public listLinhas: Array<SecaoModel> = []
  constructor(
    public poNotification: PoNotificationService,
    private fwModel: FwProtheusModel,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }
  ngOnInit() {
    this.getLinha();
  }
  async getLinha(){
    // Dados exemplo para os dados da view, que virão do cadastro de linhas
    let headerData = {
      prefixo: '1 0123',
      codLinha: '12345',
      descLinha: '145 - PQ. DOM PEDRO II',
      origem: '00001 - METRÔ SANTANA',
      destino: '00002 - PQ. DOM PEDRO II',
      orgao: 'SPTRANS',
      tarifa: '00001 - TABELA 1 - URBANO',
      pedagio: '-',
      tipoServico: '00001 - ISENTO PIS COFINS URBANO',
      km: '10',
      categoria: '00003 - URBANO',
      statusLinha: 'Stiva'
    }
    
    let secao1 = new SecaoModel();
    let secao2 = new SecaoModel();

    this.isHideLoadingTela = false;
    this.fwModel.reset();
    this.fwModel.setEndPoint('GTPA001/' + this.pkLinha);
    this.fwModel.setVirtualField(true);

    this.fwModel.get().subscribe({
      next:()=>{

        this.viewLinhas = headerData
       
        // Obter dados das seções da linha, se houver. 
        /**
         * foreach......
         */
        secao1.ida = '00004 - TERMINAL GRAJAÚ X METRÔ SANTANA'
        secao1.volta = '00005 - PQ. DOM PETRO II X TERMINAL GRAJAÚ'
        this.listLinhas = [...this.listLinhas, secao1]
        secao2.ida = '00005 - PQ. DOM PETRO II X TERMINAL GRAJAÚ'
        secao2.volta = '00004 - TERMINAL GRAJAÚ X METRÔ SANTANA'
        this.listLinhas = [...this.listLinhas, secao2]
      },error:error =>{

      }, complete:()=>{
        this.isHideLoadingTela = true
      }
    })
  }

  /*******************************************************************************
 * @name editar
 * @description Redireciona para a página de edição
 * @author   Serviços | Diego Bezerra
 * @since       2024
 * @version v1
 *******************************************************************************/
  editar() {
    this.router.navigateByUrl(
        `linhas/det-linha/editar/${this.pkLinha}`
    );
  }

  /*******************************************************************************
 * @name close
 * @description Redireciona para a página incial de linhas
 * @author   Serviços | Diego Bezerra
 * @since       2024
 * @version v1
 *******************************************************************************/
  close() {
    this.fwModel.reset();
    this.router.navigate(['./linhas']);
  }
}


