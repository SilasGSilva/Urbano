import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb } from '@po-ui/ng-components';
import { TarifaForm } from './det-tarifas.struct';
import { PoLookUpTarifas } from 'src/app/services/adaptors/wsurbano-adapter.service';

@Component({
  selector: 'app-det-tarifas',
  templateUrl: './det-tarifas.component.html',
  styleUrls: ['./det-tarifas.component.css'],
  providers: [PoLookUpTarifas],
})
export class DetTarifasComponent {
  constructor(
    private _activedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    public poLookUpTarifas: PoLookUpTarifas
  ) {}
  tarifaForm!: FormGroup;

  public isShowLoading: boolean = false;
  public editView: boolean = false;
  public isVisibleBtn: boolean = false;
  public isLoadingBtn: boolean = false;

  public action: string = '';
  public id: string = '';
  public filial: string = '';
  public title: string = '';
  public orgaoConcessor: string = '';

  public filterParamCodigo: string = '';

  public breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Fretamento Urbano', link: '/' },
      { label: 'Cadastrar Tarifas', link: '/tarifas' },
      { label: 'Incluir tarifa', link: '' },
    ],
  };

  ngOnInit() {
    //Define se é inclusão ou alteração
    this.action = this._activedRoute.snapshot.params['acao'];
    this.id = this._activedRoute.snapshot.params['id'];

    switch (this.action) {
      case 'editar':
        this.filial = atob(this._activedRoute.snapshot.params['filial']);
        this.title = 'Alterar Motorista/Colaborador';
        this.isVisibleBtn = false;
        this.breadcrumb.items[2].label = 'Alterar Motorista/Colaborador';
        this.filterParamCodigo = `RA_FILIAL LIKE '%${this.filial}%'`;
        this.isLoadingBtn = true;
        this.isShowLoading = false;

        break;
      case 'incluir':
        // this.isShowLoading = true;
        this.isLoadingBtn = false;
        this.title = 'Incluir tarifa';
        this.isVisibleBtn = true;
        this.breadcrumb.items[2].label = 'Incluir tarifa';
        break;
    }

    //Criando o formulario
    this.createForm();

    if (this.id != undefined) {
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

  getTarifa() {}
}
