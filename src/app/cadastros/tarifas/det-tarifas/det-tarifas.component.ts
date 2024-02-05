import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PoBreadcrumb,
  PoLookupColumn,
  PoModalAction,
  PoModalComponent,
  PoNotification,
  PoNotificationService,
} from '@po-ui/ng-components';
import { TarifaForm } from './det-tarifas.struct';
import {
  poLookUpOrgaoConcessor,
  poLookUpFormasDePagamento,
} from 'src/app/services/adaptors/wsurbano-adapter.service';
import { HttpParams } from '@angular/common/http';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { FindValueByName } from 'src/app/services/functions/util.function';

@Component({
  selector: 'app-det-tarifas',
  templateUrl: './det-tarifas.component.html',
  styleUrls: ['./det-tarifas.component.css'],
  providers: [poLookUpOrgaoConcessor, poLookUpFormasDePagamento],
})
export class DetTarifasComponent {
  @ViewChild('modalCancel', { static: false })
  modalCancel!: PoModalComponent;

  tarifaForm!: FormGroup;

  public isShowLoading: boolean = false;
  public editView: boolean = false;
  public isVisibleBtn: boolean = false;

  public action: string = '';
  public pk: string = '';
  public description: string = '';
  public filial: string = '';
  public title: string = '';
  public subtitle: string = '';
  public orgaoConcessor: string = '';
  public formasDePagamento: string = '';
  public vigenciaStartFilter: string = '';
  public vigenciaEndFilter: string = '';
  public filterParamOrgaoConcessor: string = '';
  public filterParamFormasDePagamento: string = '';

  constructor(
    private _activedRoute: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    public poLookUpOrgaoConcessor: poLookUpOrgaoConcessor,
    public poLookUpFormasDePagamento: poLookUpFormasDePagamento,
    private _fwModel: FwProtheusModel,
    private _poNotification: PoNotificationService
  ) {
    this.action = this._activedRoute.snapshot.params['acao'];
    this.pk = this._activedRoute.snapshot.params['pk'];
  }

  public columns: PoLookupColumn[] = [
    { property: 'pk', label: 'Código' },
    { property: 'nickname', label: 'Município' },
    { property: 'name', label: 'Local' },
  ];

  public breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Fretamento Urbano', link: '/' },
      { label: 'Cadastrar Tarifas', link: '/tarifas' },
      { label: 'Incluir tarifa', link: '' },
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
      this._router.navigate(['tarifas']);
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
        this.filial = atob(this._activedRoute.snapshot.params['filial']);
        this.title = 'Editar tarifa';
        this.subtitle = 'Edite as informações da tarifa:';
        this.isVisibleBtn = false;
        this.filterParamOrgaoConcessor = `FILIAL LIKE '%${this.filial}%'`;
        this.filterParamFormasDePagamento = `FILIAL LIKE '%${this.filial}%'`;
        this.getTarifa();

        break;
      case 'incluir':
        this.title = 'Incluir tarifa';
        this.subtitle = 'Preencha as informações da tarifa:';
        this.isVisibleBtn = true;
        this.breadcrumb.items[2].label = 'Incluir tarifa';
        break;
    }

    //Criando o formulario
    this.createForm();

    if (this.pk != undefined) {
      //Edição, faz a carga dos valores
      this.getTarifa();
    } else {
      //Inclusão, seta o status como ativo
      this.tarifaForm.patchValue({
        status: '1',
      });
    }
  }

  createForm(): any {
    const tarifa: TarifaForm = {} as TarifaForm;
    this.tarifaForm = this._formBuilder.group({
      codigo: [tarifa.codigo, Validators.compose([Validators.required])],
      descricao: [tarifa.descricao, Validators.compose([Validators.required])],
      valor: [tarifa.valor, Validators.compose([Validators.required])],
      orgaoConcessor: [
        tarifa.orgaoConcessor,
        Validators.compose([Validators.required]),
      ],
      vigencia: [tarifa.vigencia, Validators.compose([Validators.required])],
      formasDePagamento: [
        tarifa.formasDePagamento,
        Validators.compose([Validators.required]),
      ],
    });
  }

  getTarifa() {
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

        this.tarifaForm.patchValue({
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
      complete: () => {},
    });
  }

  setRangeFilter(event: any) {
    this.vigenciaStartFilter = event.start;
    this.vigenciaEndFilter = event.end;
  }

  /*******************************************************************************
   * @name saveTarifa
   * @description Função responsável por salvar a nova tarifa ou editar
   * uma tarifa escolhida e navegar de volta pro browse
   * @param stay: boolean - indica se irá ficar na tela atual ou retornará ao
   * browser
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  saveTarifa(stay: boolean) {
    if (!this.editView) {
      //nova tarifa
      this.changeLoading();
      setTimeout(() => {
        this.modalCancel.close();
        this.changeLoading();
        if (!stay) {
          this.tarifaForm.patchValue({
            codigo: '',
            descricao: '',
            valor: '',
            orgaoConcessor: '',
            vigencia: '',
            formasDePagamento: '',
          });
          this._router.navigate(['tarifas']);
        } else {
          this.tarifaForm.patchValue({
            codigo: '',
            descricao: '',
            valor: '',
            orgaoConcessor: '',
            vigencia: '',
            formasDePagamento: '',
          });
        }
        this._poNotification.success('Tarifa criada com sucesso!');
      }, 1000);
    } else {
      //editar tarifa
      this.changeLoading();
      setTimeout(() => {
        this.tarifaForm.patchValue({
          codigo: '',
          descricao: '',
          valor: '',
          orgaoConcessor: '',
          vigencia: '',
          formasDePagamento: '',
        });
        this.modalCancel.close();
        this.changeLoading();
        this._router.navigate(['tarifas']);
        this._poNotification.success('Tarifa alterada com sucesso!');
      }, 1000);
    }
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
