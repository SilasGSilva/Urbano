import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PoBreadcrumb,
  PoCheckboxGroupOption,
  PoComboComponent,
  PoNotificationService,
  PoRadioGroupOption,
} from '@po-ui/ng-components';
import {
  ListStatus,
  LocalidadeForm,
  LocalidadeModel,
  listTipoLocalidade,
} from './det-localidades.struct';
import { comboFormService } from 'src/app/services/adaptors/wsurbano-adapter.service';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import {
  ChangeUndefinedToEmpty,
  FindValueByName,
  isNullOrUndefined,
} from 'src/app/services/functions/util.function';
import { VldFormStruct } from 'src/app/services/gtpgenerics.struct';
import { ApiService } from 'src/app/services/api.service';
import { CorreiosService } from './service/service-cep';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-det-localidades',
  templateUrl: './det-localidades.component.html',
})
export class DetLocalidadesComponent implements OnInit {
  localidadesForm!: FormGroup;
  localidades!: LocalidadeModel;

  acao: string = '';
  status: string = '1';
  titulo: string = '';
  pkLocalidades: string = '';
  estado: string = '';

  listStatus: PoRadioGroupOption[] = ListStatus;
  listTipo: PoCheckboxGroupOption[] = listTipoLocalidade;

  isUf: boolean = true;
  teste: boolean = true;
  isVisibleBtn: boolean = true;
  isLoadingBtn: boolean = false;
  isHideLoadingTela: boolean = true;
  isDisableMunicipio: boolean = true;

  public breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Fretamento Urbano', link: '/' },
      { label: 'Localidades', link: '/localidades' },
      { label: '' },
    ],
  };

  @ViewChild('comboUf', { static: true }) comboUf!: PoComboComponent;

  constructor(
    public poNotification: PoNotificationService,
    public comboFormService: comboFormService,
    private validCEP: CorreiosService,
    private router: Router,
    private route: ActivatedRoute,
    private fwModel: FwProtheusModel,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.handleAction();
    this.loadLocalidades();
  }

  initializeForm(): void {
    const localidade: LocalidadeForm = {} as LocalidadeForm;

    this.localidadesForm = this.formBuilder.group({
      descricao: [
        localidade.descricao,
        Validators.compose([Validators.required]),
      ],
      cep: [localidade.cep],
      endereco: [localidade.endereco],
      bairro: [localidade.bairro],
      estado: [localidade.estado, Validators.compose([Validators.required])],
      municipio: [localidade.municipio],
      tipoLocalidade: [localidade.tipoLocalidade],
      status: [localidade.status, Validators.compose([Validators.required])],
    });
  }

  handleAction(): void {
    this.acao = this.route.snapshot.params['acao'];
    this.pkLocalidades = this.route.snapshot.params['id'];

    switch (this.acao) {
      case 'editar':
        this.titulo = 'Alterar Localidade';
        this.isVisibleBtn = false;
        this.breadcrumb.items[2].label = 'Alterar Localidade';
        this.isLoadingBtn = true;
        this.isHideLoadingTela = false;
        break;

      case 'incluir':
        this.isLoadingBtn = false;
        this.isHideLoadingTela = true;
        this.titulo = 'Inclusão de Localidade';
        this.isVisibleBtn = true;
        this.breadcrumb.items[2].label = 'Inclusão Localidade';
        break;
    }
  }

  loadLocalidades(): void {
    if (this.pkLocalidades != undefined) {
      this.fwModel.reset();
      this.fwModel.setEndPoint('GTPA001/' + this.pkLocalidades);
      this.fwModel.setVirtualField(true);
      this.fwModel.get().subscribe({
        next: () => {
          const tpLoc = this.fwModel
            .getModel('GI1MASTER')
            .getValue('GI1_TPLOC');

          this.localidadesForm.patchValue({
            codigo: this.fwModel.getModel('GI1MASTER').getValue('GI1_COD'),
            descricao: this.fwModel
              .getModel('GI1MASTER')
              .getValue('GI1_DESCRI'),
            cep: this.fwModel.getModel('GI1MASTER').getValue('GI1_CEP'),
            endereco: this.fwModel.getModel('GI1MASTER').getValue('GI1_ENDERE'),
            bairro: this.fwModel.getModel('GI1MASTER').getValue('GI1_BAIRRO'),
            estado: this.fwModel.getModel('GI1MASTER').getValue('GI1_UF'),
            tipoLocalidade: tpLoc.split(''),
            status: this.fwModel.getModel('GI1MASTER').getValue('GI1_STATUS'),
          });

          this.comboFormService.setFilterUf(
            "AND UPPER(CC2_EST) LIKE UPPER('%" +
              this.fwModel.getModel('GI1MASTER').getValue('GI1_UF') +
              "%'))"
          );

          this.localidadesForm.patchValue({
            municipio: this.fwModel
              .getModel('GI1MASTER')
              .getValue('GI1_CDMUNI'),
          });
        },
        error: error => {
          this.poNotification.error(error.error.errorMessage);
          this.fwModel.reset();
        },
        complete: () => {
          this.isLoadingBtn = false;
          this.isHideLoadingTela = true;
        },
      });
    } else {
      this.localidadesForm.patchValue({
        status: '1',
      });
    }
  }

  saveLocalidade(isSaveNew: boolean = false): void {
    const isSubmitable: boolean = this.localidadesForm.valid;

    if (isSubmitable) {
      this.isLoadingBtn = true;

      this.fwModel.reset();
      this.fwModel.setModelId('GTPA001');
      this.fwModel.setEndPoint('GTPA001/');
      this.fwModel.AddModel('GI1MASTER', 'FIELDS');

      // Adiciona campos
      this.fwModel.getModel('GI1MASTER').addField('GI1_DESCRI');
      this.fwModel.getModel('GI1MASTER').addField('GI1_CEP');
      this.fwModel.getModel('GI1MASTER').addField('GI1_ENDERE');
      this.fwModel.getModel('GI1MASTER').addField('GI1_BAIRRO');
      this.fwModel.getModel('GI1MASTER').addField('GI1_UF');
      this.fwModel.getModel('GI1MASTER').addField('GI1_CDMUNI');
      this.fwModel.getModel('GI1MASTER').addField('GI1_TPLOC');
      this.fwModel.getModel('GI1MASTER').addField('GI1_STATUS');

      // Seta valor para os campos
      this.fwModel
        .getModel('GI1MASTER')
        .setValue(
          'GI1_DESCRI',
          ChangeUndefinedToEmpty(
            this.localidadesForm.value.descricao.toUpperCase()
          )
        );
      this.fwModel
        .getModel('GI1MASTER')
        .setValue(
          'GI1_CEP',
          ChangeUndefinedToEmpty(this.localidadesForm.value.cep.toUpperCase())
        );
      this.fwModel
        .getModel('GI1MASTER')
        .setValue(
          'GI1_ENDERE',
          ChangeUndefinedToEmpty(
            this.localidadesForm.value.endereco.toUpperCase()
          )
        );
      this.fwModel
        .getModel('GI1MASTER')
        .setValue(
          'GI1_BAIRRO',
          ChangeUndefinedToEmpty(
            this.localidadesForm.value.bairro.toUpperCase()
          )
        );
      this.fwModel
        .getModel('GI1MASTER')
        .setValue(
          'GI1_UF',
          ChangeUndefinedToEmpty(
            this.localidadesForm.value.estado.toUpperCase()
          )
        );
      this.fwModel
        .getModel('GI1MASTER')
        .setValue(
          'GI1_CDMUNI',
          ChangeUndefinedToEmpty(
            this.localidadesForm.value.municipio.toUpperCase()
          )
        );

      if (this.localidadesForm.value.tipoLocalidade) {
        this.fwModel
          .getModel('GI1MASTER')
          .setValue(
            'GI1_TPLOC',
            ChangeUndefinedToEmpty(
              this.localidadesForm.value.tipoLocalidade.join('')
            )
          );
      } else {
        this.fwModel.getModel('GI1MASTER').setValue('GI1_TPLOC', '');
      }

      this.fwModel
        .getModel('GI1MASTER')
        .setValue(
          'GI1_STATUS',
          ChangeUndefinedToEmpty(this.localidadesForm.value.status)
        );

      if (this.acao == 'incluir') {
        this.fwModel.operation = 3;
        this.fwModel.post().subscribe({
          next: () => {
            this.poNotification.success('Localidade cadastrada com sucesso!');
            if (isSaveNew) {
              this.fwModel.reset();
              this.localidadesForm.reset();
              this.localidadesForm.patchValue({
                status: '1',
              });
            } else {
              this.onClickCancel();
              this.fwModel.reset();
            }
          },
          error: error => {
            this.poNotification.error(error.error.errorMessage);
            this.fwModel.reset();
          },
          complete: () => {
            this.isLoadingBtn = false;
            this.isHideLoadingTela = true;
          },
        });
      } else {
        this.fwModel.operation = 4;
        this.fwModel.setEndPoint('GTPA001/' + this.pkLocalidades);

        this.fwModel.put().subscribe({
          next: () => {
            this.poNotification.success('Localidade alterada com sucesso!');
            this.onClickCancel();
          },
          error: error => {
            this.poNotification.error(error.error.errorMessage);
            this.fwModel.reset();
          },
        });
      }
    } else {
      this.vldDetNotify();
    }
  }

  changeValidCEP(cep: string): void {
    this.validCEP.validarCEP(cep).subscribe(data => {
      const resultado = data;

      this.localidadesForm.patchValue({
        endereco: resultado.logradouro,
        bairro: resultado.bairro,
        estado: resultado.uf,
      });

      this.setFilters(resultado.estado);
    });
  }

  setFilters(event: any): void {
    if (ChangeUndefinedToEmpty(event) !== '' && event) {
      this.isDisableMunicipio = false;
      event = " AND (UPPER(CC2_EST) LIKE UPPER('" + event + "')) ";
      this.estado = event;
    } else {
      this.estado = '';
      this.isDisableMunicipio = true;
      this.localidadesForm.patchValue({
        estado: '',
        municipio: '',
      });
    }
  }

  onClickCancel(): void {
    this.fwModel.reset();
    this.router.navigate(['./localidades']);
  }

  vldDetNotify(): void {
    const listNotification: VldFormStruct[] = this.apiService.validateForm(
      this.localidadesForm
    );

    listNotification.forEach(item => {
      let campos: string = '';
      item.field.forEach((fields: string) => {
        if (isNullOrUndefined(campos)) {
          campos = fields.toUpperCase();
        } else {
          campos += `, ${fields.toUpperCase()}`;
        }
      });

      this.poNotification.error(
        'Campos não preenchidos: ' + campos + '. Verifique!'
      );
    });
  }
}
