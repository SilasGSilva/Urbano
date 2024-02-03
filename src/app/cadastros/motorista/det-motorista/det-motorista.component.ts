import { Component, OnInit, ViewChild } from '@angular/core';
import { PoBreadcrumb, PoCheckboxGroupOption, PoI18nPipe, PoI18nService, PoNotificationService, PoRadioGroupOption } from '@po-ui/ng-components';
import { ListStatus, ListTipoDocumento, ListTurno, MotoristaForm, MotoristaModel } from './det-motorista.struct';
import { FuncaoComboService, RecursoComboService } from 'src/app/services/combo-filter.service';
import { MatriculaComboService } from 'src/app/services/adaptors/wsurbano-adapter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { HttpParams } from '@angular/common/http';
import { ComboFilial } from '../motorista.struct';
import { ChangeUndefinedToEmpty, FindValueByName, MakeDate, isNullOrUndefined } from 'src/app/services/functions/util.function';
import { VldFormStruct } from 'src/app/services/gtpgenerics.struct';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-det-motorista',
  templateUrl: './det-motorista.component.html',
  providers: [RecursoComboService, FuncaoComboService, MatriculaComboService]
})
export class DetMotoristaComponent implements OnInit {
	motoristaForm!: FormGroup;

	isDisableTipoDoc: boolean = true;
	colunaTurno: number = 3;
	isValidCPF: boolean = false;
	isVisibleBtn : boolean = true;
	isLoadingBtn: boolean = false;
	isHideLoadingTela: boolean = true;

	acao: string = '';
	status: string = '1';
	filial: string = '';
	mascaraCPF : string = '';
	titulo: string = '';
	pkMotorista: string = '';
	filterParamMatricula: string = ''

	listTipoDocumento: Array<PoRadioGroupOption> = ListTipoDocumento;
	listStatus: Array<PoRadioGroupOption> = ListStatus;
	listTurno: Array<PoCheckboxGroupOption> = ListTurno;
	motorista!: MotoristaModel;

	public breadcrumb: PoBreadcrumb = {
		items: [
			{ label: 'Fretamento Urbano', link: '/' },
			{ label: 'Motoristas/Colaboradores', link: '/motorista' },
			{ label: '' }]
	 };

	@ViewChild('comboMatricula', { static: true }) comboMatricula!: ComboFilial;
	constructor(
		public recursoComboService: RecursoComboService,
		public poNotification: PoNotificationService,
		public matriculaComboService: MatriculaComboService,
		public funcaoComboService: FuncaoComboService,
		private route: ActivatedRoute,
		private fwModel: FwProtheusModel,
		private formBuilder: FormBuilder,
		private router: Router,
		private apiService: ApiService,
		){
			this.createForm();
		}

	ngOnInit() {
		//Define se é inclusão ou alteração
		this.acao = this.route.snapshot.params['acao'];
		this.pkMotorista = this.route.snapshot.params['id'];

        switch (this.acao) {
            case 'editar':
				this.filial = atob(this.route.snapshot.params['filial']);
                this.titulo = 'Alterar Motorista/Colaborador';
				this.isVisibleBtn = false;
				this.breadcrumb.items[2].label = 'Alterar Motorista/Colaborador';
				this.filterParamMatricula = `RA_FILIAL LIKE '%${this.filial}%'`;
				this.isLoadingBtn = true;
				this.isHideLoadingTela = false;

                break;
            case 'incluir':
				this.isHideLoadingTela = true;
				this.isLoadingBtn = false;
                this.titulo = 'Incluir Motorista/Colaborador';
				this.isVisibleBtn = true;
				this.breadcrumb.items[2].label = 'Incluir Motorista/Colaborador';
                break;
		}

		//Criando o formulario
		this.createForm();

		if (this.pkMotorista != undefined) {//Edição, faz a carga dos valores
            this.getMotorista()
        } else {//Inclusão, seta o status como ativo
			this.motoristaForm.patchValue({
				status: '1'
			});
        }
	}
	/**
	 * createForm - Inicializa o formulário
	 */
	createForm(): any {
		const motorista: MotoristaForm = {} as MotoristaForm;
        this.motoristaForm = this.formBuilder.group({
			nome: [motorista.nome, Validators.compose([Validators.required])],
			turno: [motorista.turno, Validators.compose([Validators.required])],
			status: [motorista.status, Validators.compose([Validators.required])],
			codFuncao: [motorista.codFuncao, Validators.compose([Validators.required])],
			descFuncao: [motorista.descFuncao],
			codMatricula: [motorista.codMatricula, Validators.compose([Validators.required])],
			descMatricula: [motorista.descMatricula],
			codTipoRecurso: [motorista.codTipoRecurso, Validators.compose([Validators.required])],
			descTipoRecurso: [motorista.descTipoRecurso],
			tipoDocumento: [motorista.tipoDocumento],
			dataNascimento: [motorista.dataNascimento,  Validators.compose([Validators.required])],
			numeroDocumento: [motorista.numeroDocumento],
        });
    }
	/**
	 * Ação disparada ao selecionar o tipo de documento
	 * @param event - 1 - RG / 2 - CPF
	 */
	changeDocumento(event:any){
		this.isDisableTipoDoc = false;
		this.isValidCPF = false;
		this.mascaraCPF = ''
		if (event === '2'){
			this.isValidCPF = true;
			this.mascaraCPF = '999.999.999-99'

		}
	}

	/**
	 * Função responsável pela validação do cpf
	 * @param cpf
	 * @returns true ou false - Se é valido ou não
	 */
	validarCPF(cpf: string): boolean {
		if (this.isValidCPF && cpf != ''){
			// Remove caracteres não numéricos
			cpf = cpf.replace(/\D/g, '');

			// Verifica se o CPF tem 11 dígitos
			if (cpf.length !== 11) {
				this.poNotification.error("o CPF é inválido")
				return false;
			}

			// Verifica se todos os dígitos são iguais (caso contrário, o CPF é inválido)
			if (/^(\d)\1+$/.test(cpf)) {
				this.poNotification.error("o CPF é inválido")
				return false;
			}

			// Calcula o primeiro dígito verificador
			let soma = 0;
			for (let i = 0; i < 9; i++) {
				soma += parseInt(cpf.charAt(i)) * (10 - i);
			}
			const primeiroDigito = 11 - (soma % 11);

			// Calcula o segundo dígito verificador
			soma = 0;
			for (let i = 0; i < 10; i++) {
				soma += parseInt(cpf.charAt(i)) * (11 - i);
			}
			const segundoDigito = 11 - (soma % 11);

			// Verifica se os dígitos verificadores calculados são iguais aos dígitos reais
			if (primeiroDigito === parseInt(cpf.charAt(9)) && segundoDigito === parseInt(cpf.charAt(10))) {
				return true;
			}
			this.poNotification.error("o CPF é inválido")
			return false;
		}else{
			return false;
		}

	}
	/**
	 * Get Motorista
	 */
	async getMotorista() {
		let documento: string = '';
		let params = new HttpParams();
        this.motorista = new MotoristaModel();
        this.fwModel.reset();
        this.fwModel.setEndPoint('GTPA008/' + this.pkMotorista)
		this.fwModel.setVirtualField(true)
        this.fwModel.get(params).subscribe({
			next:(data: any) => {
				let tipoDoc = FindValueByName(data.models[0].fields,'GYG_TPDOC');
				let turno = FindValueByName(data.models[0].fields,'GYG_TURNO');
				let status = FindValueByName(data.models[0].fields,'GYG_STATUS');
				if (status == ''){
					status = '1';
				}
				if(tipoDoc == '1'){
					documento = FindValueByName(data.models[0].fields,'GYG_RG');
					this.changeDocumento('1');
				}else{
					documento = FindValueByName(data.models[0].fields,'GYG_CPF');
					if (documento != ''){
						tipoDoc = '2'//Se tiver vazio, seta como cpf
						this.changeDocumento('2');
					}
				}

				this.motoristaForm.patchValue({
					nome: FindValueByName(data.models[0].fields,'GYG_NOME'),
					codFuncao: FindValueByName(data.models[0].fields,'GYG_FUNCOD'),
					descFuncao: FindValueByName(data.models[0].fields,'GYG_FUNDES'),
					status: status,
					codMatricula: FindValueByName(data.models[0].fields,'GYG_FUNCIO'),
					descMatricula: FindValueByName(data.models[0].fields,'GYG_NOME'),
					codTipoRecurso:FindValueByName(data.models[0].fields,'GYG_RECCOD'),
					descTipoRecurso:FindValueByName(data.models[0].fields,'GYG_DESREC'),
					turno: turno.split(''),
					tipoDocumento: tipoDoc,
					numeroDocumento: documento,
					codigoMotorista: FindValueByName(data.models[0].fields,'GYG_CODIGO'),
					dataNascimento: MakeDate(FindValueByName(data.models[0].fields,'GYG_DTNASC'), 'yyyy-mm-dd'),
				});
			},
			error(err) {
				// this.poNotification(err.errorMessage)
			},
			complete: () => {
				this.isLoadingBtn = false;
				this.isHideLoadingTela = true;
			},
		})

    }

	/**
	 * incluirDocumento - Responsavel por abrir modal de inclusão de documento
	 */
	incluirDocumento(){
		//abrir modal de inclusao de documento
		this.poNotification.warning("Pagina em construção")
	}

	/**
	 * Ação do combo de matricula, ao clicar, será carregado o nome e o CPF
	 */
	setFilters(newValue: any) {
		//filtros
        if (this.comboMatricula != undefined && newValue != undefined){
			this.comboMatricula['visibleOptions'].forEach( (item: any) => {
				if(item.selected){
					let cpf: string = item.cpf;
					let nome: string = item.label;

					if (isNullOrUndefined(this.motoristaForm.value.nome) && nome !== ''){
						this.motoristaForm.patchValue({
							nome: nome
						})
					}
					//Se não houver conteudo já carregado ao editar
					if (isNullOrUndefined(this.motoristaForm.value.numeroDocumento) && cpf != ''){
						this.motoristaForm.patchValue({
							tipoDocumento: '2',
							numeroDocumento: cpf
						})
						this.changeDocumento('2');
					}
				}
			})
		} else {
			this.motoristaForm.patchValue({
				nome: '',
				tipoDocumento: '',
				numeroDocumento: ''
			})
		}

    }
	/**
	 * Salva os dados do motorista
	 * @param isSaveNew define se salva e cria um novo ou apenas volta a rota
	 */
	saveMotorista(isSaveNew: boolean = false) {
		let tipoDocumento = this.motoristaForm.value.tipoDocumento;
		let isSubmitable: boolean = true//this.motoristaForm.valid;
		if (isSubmitable){
			this.isLoadingBtn = true;
			this.isHideLoadingTela = false;
			this.fwModel.reset();
			this.fwModel.setModelId('GTPA008');
			this.fwModel.setEndPoint('GTPA008/');
			this.fwModel.AddModel('GYGMASTER', 'FIELDS');

			this.fwModel.getModel('GYGMASTER').addField('GYG_FUNCIO'); // COD MATRICULA
			this.fwModel.getModel('GYGMASTER').addField('GYG_NOME'  );   // NOME
			this.fwModel.getModel('GYGMASTER').addField('GYG_DTNASC'); // DATA NASCIMENTO
			this.fwModel.getModel('GYGMASTER').addField('GYG_TPDOC' );   // TIPO DE DOCUMENTO
			if (tipoDocumento == '1'){
				this.fwModel.getModel('GYGMASTER').addField('GYG_RG'    );  // NUMERO DOCUMENTO
			} else {
				this.fwModel.getModel('GYGMASTER').addField('GYG_CPF'   );  // NUMERO DOCUMENTO
			}
			this.fwModel.getModel('GYGMASTER').addField('GYG_RECCOD');  // TIPO DE RECURSO
			this.fwModel.getModel('GYGMASTER').addField('GYG_FUNCOD');  // FUNÇÃO
			this.fwModel.getModel('GYGMASTER').addField('GYG_TURNO' );  // TURNO
			this.fwModel.getModel('GYGMASTER').addField('GYG_STATUS');  // STATUS

			this.fwModel.getModel('GYGMASTER').setValue('GYG_FUNCIO', ChangeUndefinedToEmpty(this.motoristaForm.value.codMatricula));
			this.fwModel.getModel('GYGMASTER').setValue('GYG_NOME'  , ChangeUndefinedToEmpty(this.motoristaForm.value.nome));
			this.fwModel.getModel('GYGMASTER').setValue('GYG_DTNASC', ChangeUndefinedToEmpty(this.motoristaForm.value.dataNascimento.replace(/-/g, '')));
			this.fwModel.getModel('GYGMASTER').setValue('GYG_TPDOC' , ChangeUndefinedToEmpty(tipoDocumento));
      if(tipoDocumento !== null){
        if (tipoDocumento == '1'){
          this.fwModel.getModel('GYGMASTER').setValue('GYG_RG'    , this.motoristaForm.value.numeroDocumento);
        } else {
          this.fwModel.getModel('GYGMASTER').setValue('GYG_CPF'   , this.motoristaForm.value.numeroDocumento.replace(/[.-]/g, ''));
        }
      }
			this.fwModel.getModel('GYGMASTER').setValue('GYG_RECCOD', ChangeUndefinedToEmpty(this.motoristaForm.value.codTipoRecurso));
			this.fwModel.getModel('GYGMASTER').setValue('GYG_FUNCOD', this.motoristaForm.value.codFuncao);
			this.fwModel.getModel('GYGMASTER').setValue('GYG_TURNO' , ChangeUndefinedToEmpty(this.motoristaForm.value.turno.join('')));
			this.fwModel.getModel('GYGMASTER').setValue('GYG_STATUS', ChangeUndefinedToEmpty(this.motoristaForm.value.status));

			if (this.acao == 'incluir') {

				this.fwModel.operation = 3;
				this.fwModel.post().subscribe({
					next: () => {
						this.poNotification.success('Motorista cadastrado com sucesso')
						if(isSaveNew){
							this.fwModel.reset();
							this.motoristaForm.reset();
							this.motoristaForm.patchValue({
								status: '1',
								nome: ''
							})
						} else {
							this.close()
						}
					},
					error: (error) => {
						this.poNotification.error(error.error.errorMessage);
						this.fwModel.reset();
					},
					complete: () => {
						this.isLoadingBtn = false;
						this.isHideLoadingTela = true;
					}
				});

			} else {

				this.fwModel.operation = 4;
				this.fwModel.setEndPoint('GTPA008/' + this.pkMotorista)

				this.fwModel.put().subscribe({
					next:() => {
						this.poNotification.success('Motorista atualizado com sucesso')
						this.close();
					},
					error:(error) => {
						this.poNotification.error(error.error.errorMessage);
						this.fwModel.reset();
					}
				});
			}
		}else {
			this.vldDetNotify();
		}
    }

	close() {
        this.router.navigate(['./motorista'])
    }

	/**
	 * Responsável por apresentar a notificação de falha do formControl
	 */
	vldDetNotify() {
		const listNotification: Array<VldFormStruct> = this.apiService.validateForm(this.motoristaForm);

		listNotification.forEach(item => {
			let campos: string = '';
			item.field.forEach((fields: string) => {
				if (isNullOrUndefined(campos)) {
					campos = fields;
				} else {
					campos += `, ${fields}`;
				}
			});

			this.poNotification.error(
				'Campos não preenchidos: '+ campos +'. Verifique!'
			);
		});

	}

}


