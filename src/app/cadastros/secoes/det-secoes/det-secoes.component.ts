import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PoBreadcrumb,
  PoComboComponent,
  PoLookupColumn,
  PoLookupLiterals,
  PoModalAction,
  PoModalComponent,
  PoNotificationService,
  PoRadioComponent,
} from '@po-ui/ng-components';
import {
  poLookUpOrigem,
  poLookUpDestino,
  poLookUpAssociarLinhas,
} from 'src/app/services/adaptors/wsurbano-adapter.service';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { FindValueByName } from 'src/app/services/functions/util.function';
import { SecaoForm } from './det-secoes.struct';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-det-secoes',
  templateUrl: './det-secoes.component.html',
  styleUrls: ['./det-secoes.component.css'],
  providers: [poLookUpOrigem, poLookUpDestino, poLookUpAssociarLinhas],
})
export class DetSecoesComponent {
  @ViewChild('modalCancel', { static: false })
  modalCancel!: PoModalComponent;

  @ViewChild('origemFilterCombo', { static: true })
  origemFilterCombo!: PoComboComponent;

  @ViewChild('destinoFilterCombo', { static: true })
  destinoFilterCombo!: PoComboComponent;

  @ViewChild('sentidoRadioGroup', { static: true })
  sentidoRadioGroup!: PoRadioComponent;

  secaoForm!: FormGroup;

  public isShowLoading: boolean = false;
  public editView: boolean = false;
  public isVisibleBtn: boolean = false;

  public action: string = '';
  public pk: string = '';
  public description: string = '';
  public filial: string = '';
  public title: string = '';
  public subtitle: string = '';

  public filterParamOrigem: string = '';
  public filterParamDestino: string = '';
  public filterParamAssociarLinhas: string = '';

  nHeightMonitor: number = window.innerHeight * 0.5;

  constructor(
    private _activedRoute: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _fwModel: FwProtheusModel,
    private _poNotification: PoNotificationService,
    public poLookUpOrigem: poLookUpOrigem,
    public poLookUpDestino: poLookUpDestino,
    public poLookUpAssociarLinhas: poLookUpAssociarLinhas
  ) {
    this.action = this._activedRoute.snapshot.params['acao'];
    this.pk = this._activedRoute.snapshot.params['pk'];
  }

  public columnsPoLookUpOrigem: PoLookupColumn[] = [
    { property: 'local', label: 'Local' },
    { property: 'municipio', label: 'Município' },
    { property: 'bairro', label: 'Bairro' },
    { property: 'endereco', label: 'Endereço' },
  ];

  public columnsPoLookUpDestino: PoLookupColumn[] = [
    { property: 'local', label: 'Local' },
    { property: 'municipio', label: 'Município' },
    { property: 'bairro', label: 'Bairro' },
    { property: 'endereco', label: 'Endereço' },
  ];

  public columnsPoLookUpAssociarLinhas: PoLookupColumn[] = [
    { property: 'linhas', label: 'Linhas' },
    { property: 'codLinha', label: 'Código linha' },
  ];

  public literalsPoLookUpOrigem: PoLookupLiterals = {
    modalTitle: 'Localidades - Origem',
  };

  public literalsPoLookUpDestino: PoLookupLiterals = {
    modalTitle: 'Localidades - Destino',
  };

  public literalsPoLookUpAssociarLinhas: PoLookupLiterals = {
    modalTitle: 'Linhas',
    modalPrimaryActionLabel: 'Associar',
  };

  public breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Fretamento Urbano', link: '/' },
      { label: 'Cadastrar Seções', link: '/secoes' },
      { label: 'Incluir seção', link: '' },
    ],
  };

  /*******************************************************************************
   * @name confirmCancel
   * @description Ação responsável por cancelar o processo atual quando perguntado
   * no modal e navega de volta para o browse
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  public confirmCancel: PoModalAction = {
    label: 'Sim',
    action: () => {
      this.modalCancel.close();
      this._router.navigate(['secoes']);
    },
  };

  /*******************************************************************************
   * @name exitCancel
   * @description Ação responsável por manter no processo atual quando perguntado
   * no modal e permanece na mesma tela
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  public exitCancel: PoModalAction = {
    label: 'Não',
    action: () => this.modalCancel.close(),
  };

  ngOnInit() {
    switch (this.action) {
      case 'editar':
        this.editView = true;
        this.filial = atob(this._activedRoute.snapshot.params['filial']);
        this.title = 'Editar seção';
        this.subtitle = 'Edite as informações da seção:';
        this.filterParamAssociarLinhas = `FILIAL LIKE '%${this.filial}%'`;
        this.getSecao();

        break;
      case 'incluir':
        this.title = 'Incluir seção';
        this.subtitle = 'Preencha as informações da seção:';
        this.isVisibleBtn = true;
        this.breadcrumb.items[2].label = 'Incluir seção';
        break;
    }

    //Criando o formulario
    this.createForm();

    if (this.pk != undefined) {
      //Edição, faz a carga dos valores
      this.getSecao();
    }
  }

  /*******************************************************************************
   * @name getSecao
   * @description Funççao responsável por buscar os dados da seção quando for
   * editar uma seção
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  getSecao() {
    this.changeLoading();
    let params = new HttpParams();
    this._fwModel.reset();
    this._fwModel.setEndPoint('GTPA001/' + this.pk);
    this._fwModel.setVirtualField(true);
    this._fwModel.get(params).subscribe({
      next: (data: any) => {
        this.breadcrumb.items[2].label = `${FindValueByName(
          data.models[0].fields,
          'GI1_COD'
        )} - ${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`;

        this.secaoForm.patchValue({
          codigo: FindValueByName(data.models[0].fields, 'GI1_COD'),
          descricao: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
          valor: FindValueByName(data.models[0].fields, 'GI1_CDMUNI'),
          // orgaoConcessor: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
          // vigencia: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
          // formasDePagamento: FindValueByName(
          // data.models[0].fields,
          // 'GI1_DESCRI'
          // ),
        });
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

  /*******************************************************************************
   * @name saveSecao
   * @description Função responsável por salvar a nova seção ou editar
   * uma seção escolhida e navegar de volta pro browse
   * @param stay: boolean - indica se irá ficar na tela atual ou retornará ao
   * browser
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  saveSecao(stay: boolean) {
    if (!this.editView) {
      //nova seção
      this.changeLoading();
      setTimeout(() => {
        console.log(this.secaoForm);

        this.changeLoading();
        if (!stay) {
          this.secaoForm.patchValue({
            // codigo: '',
            // descricao: '',
            // valor: '',
            // orgaoConcessor: '',
            // vigencia: '',
            // formasDePagamento: '',
          });
          this._router.navigate(['secoes']);
        } else {
          this.secaoForm.patchValue({
            // codigo: '',
            // descricao: '',
            // valor: '',
            // orgaoConcessor: '',
            // vigencia: '',
            // formasDePagamento: '',
          });
        }
        this._poNotification.success('Seção criada com sucesso!');
      }, 1000);
    } else {
      //editar seção

      this.changeLoading();
      setTimeout(() => {
        this.secaoForm.patchValue({
          codigo: '',
          descricao: '',
          valor: '',
          orgaoConcessor: '',
          vigencia: '',
          formasDePagamento: '',
        });
        this.changeLoading();
        this._router.navigate(['secoes']);
        this._poNotification.success('Seção alterada com sucesso!');
      }, 1000);
    }
  }

  /*******************************************************************************
   * @name createForm
   * @description Função responsável por criar e inicializar o formulário para
   * criação ou edição das seções
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  createForm(): any {
    const secao: SecaoForm = {} as SecaoForm;
    this.secaoForm = this._formBuilder.group({
      codigo: [secao.codigo, Validators.compose([Validators.required])],
      descricao: [secao.descricao, Validators.compose([Validators.required])],
      origem: [secao.origem, Validators.compose([Validators.required])],
      destino: [secao.destino, Validators.compose([Validators.required])],
      sentido: [secao.sentido, Validators.compose([Validators.required])],
      associarLinhas: [
        secao.associarLinhas,
        Validators.compose([Validators.required]),
      ],
      status: [secao.status, Validators.compose([Validators.required])],
    });
  }
}
