import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PoBreadcrumb,
  PoModalAction,
  PoModalComponent,
  PoNotificationService,
} from '@po-ui/ng-components';
import {
  PedagioForm,
  PedagioStruct,
  verifyDatePickerRange,
} from './det-pedagios.struct';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { HttpParams } from '@angular/common/http';
import { FindValueByName } from 'src/app/services/functions/util.function';

@Component({
  selector: 'app-det-pedagios',
  templateUrl: './det-pedagios.component.html',
  styleUrls: ['./det-pedagios.component.css'],
  providers: [PedagioStruct],
})
export class DetPedagiosComponent {
  @ViewChild('modalCancel', { static: false })
  modalCancel!: PoModalComponent;

  @ViewChild('modalConfirmation', { static: false })
  modalConfirmation!: PoModalComponent;

  pedagioForm!: FormGroup;

  public isShowLoading: boolean = false;
  public editView: boolean = false;
  public isVisibleBtn: boolean = false;

  public action: string = '';
  public pk: string = '';
  public description: string = '';
  public filial: string = '';
  public title: string = '';
  public subtitle: string = '';
  public vigenciaStartFilter: string = '';
  public vigenciaEndFilter: string = '';

  nHeightMonitor: number = window.innerHeight * 0.5;

  constructor(
    private _activedRoute: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _fwModel: FwProtheusModel,
    private _poNotification: PoNotificationService,
    private _structPedagio: PedagioStruct
  ) {
    this.action = this._activedRoute.snapshot.params['acao'];
    this.pk = this._activedRoute.snapshot.params['pk'];
  }

  public columnsTable: Array<any> = this._structPedagio.getColumnsTable();
  public itemsTable: Array<any> = [];

  public breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Fretamento Urbano', link: '/' },
      { label: 'Cadastrar Pedágios', link: '/pedagios' },
      { label: 'Incluir pedágio', link: '' },
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
      this._router.navigate(['pedagios']);
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
        this.title = 'Editar pedágio';
        this.subtitle = 'Edite as informações do pedágio:';
        this.getPedagio();
        this.getPedagioTable();

        break;
      case 'incluir':
        this.title = 'Incluir pedágio';
        this.subtitle = 'Preencha as informações do pedágio:';
        this.isVisibleBtn = true;
        this.breadcrumb.items[2].label = 'Incluir pedágio';
        break;
    }

    //Criando o formulario
    this.createForm();

    if (this.pk != undefined) {
      //Edição, faz a carga dos valores
      this.getPedagio();
    } else {
      //Inclusão, seta o status como ativo
      this.pedagioForm.patchValue({
        status: '1',
      });
    }
  }

  /*******************************************************************************
   * @name createForm
   * @description Função responsável por criar e inicializar o formulário para
   * criação ou edição dos pedágios
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  createForm(): any {
    const pedagio: PedagioForm = {} as PedagioForm;
    this.pedagioForm = this._formBuilder.group({
      codigo: [pedagio.codigo, Validators.compose([Validators.required])],
      descricao: [pedagio.descricao, Validators.compose([Validators.required])],
      valor: [pedagio.valor, Validators.compose([Validators.required])],
      vigencia: [
        pedagio.vigencia,
        Validators.compose([Validators.required]),
        verifyDatePickerRange,
      ],
    });
  }

  /*******************************************************************************
   * @name getPedagio
   * @description Funççao responsável por buscar os dados do pedágio quando for
   * editar um pedágio
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  getPedagio() {
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

        this.pedagioForm.patchValue({
          codigo: FindValueByName(data.models[0].fields, 'GI1_COD'),
          descricao: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
          valor: FindValueByName(data.models[0].fields, 'GI1_CDMUNI'),
          // vigencia: FindValueByName(data.models[0].fields, 'GI1_DESCRI'),
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
   * @name savePedagio
   * @description Função responsável por salvar o novo pedágio ou editar
   * um pedágio escolhido e navegar de volta pro browse
   * @param stay: boolean - indica se irá ficar na tela atual ou retornará ao
   * browser
   * @param generateHistory: boolean - indica se ao alterar, irá gerar histórico
   * sim ou não
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  savePedagio(stay: boolean, generateHistory?: boolean) {
    if (!this.editView) {
      //novo pedágio
      this.changeLoading();
      setTimeout(() => {
        this.changeLoading();
        if (!stay) {
          this.pedagioForm.patchValue({
            codigo: '',
            descricao: '',
            valor: '',
            vigencia: '',
          });
          this._router.navigate(['pedagios']);
        } else {
          this.pedagioForm.patchValue({
            codigo: '',
            descricao: '',
            valor: '',
            vigencia: '',
          });
        }
        this._poNotification.success('Pedágio criado com sucesso!');
      }, 1000);
    } else {
      //editar pedágio
      if (generateHistory) {
        this.changeLoading();
        setTimeout(() => {
          this.pedagioForm.patchValue({
            codigo: '',
            descricao: '',
            valor: '',
            vigencia: '',
          });
          this.changeLoading();
          this._router.navigate(['pedagios']);
          this._poNotification.success(
            'Pedágio alterado e histórico gerado com sucesso!'
          );
        }, 1000);
      } else {
        this.changeLoading();
        setTimeout(() => {
          this.pedagioForm.patchValue({
            codigo: '',
            descricao: '',
            valor: '',
            vigencia: '',
          });
          this.changeLoading();
          this._router.navigate(['pedagios']);
          this._poNotification.success('Pedágio alterado com sucesso!');
        }, 1000);
      }
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

  /*******************************************************************************
   * @name getPedagioTable
   * @description Função responsável por buscar os itens da tabela de histórico
   * de vigências
   * @author   Serviços | Levy Santos
   * @since    2024
   * @version  v1
   *******************************************************************************/
  getPedagioTable() {
    this.changeLoading();
    this.itemsTable = this._structPedagio.getItemsTable();
    this.changeLoading();
  }

  verifyDatePickerRange() {
    if (
      this.vigenciaStartFilter !== '' &&
      this.vigenciaStartFilter !== undefined &&
      this.vigenciaEndFilter !== '' &&
      this.vigenciaEndFilter !== undefined
    ) {
      console.log('ou');
      return true;
    } else {
      return false;
    }
  }
}
