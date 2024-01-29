import { Component, OnInit } from '@angular/core';
import { PoBreadcrumb, PoCheckboxGroupOption, PoComboOption, PoNotificationService, PoRadioGroupOption } from '@po-ui/ng-components';
import { ListStatus, ListTipoDocumento, ListTurno, MotoristaForm, MotoristaModel } from './det-motorista.struct';
import { FuncaoComboService, RecursoComboService } from 'src/app/services/combo-filter.service';
import { MatriculaComboService } from 'src/app/services/adaptors/wsurbano-adapter.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-det-motorista',
  templateUrl: './det-motorista.component.html',
  styleUrls: ['./det-motorista.component.css'],
  providers: [RecursoComboService, FuncaoComboService, MatriculaComboService]
})
export class DetMotoristaComponent implements OnInit {
	motoristaForm: FormGroup;

	isDisableTipoDoc: boolean = true;
	colunaTurno: number = 3;
	isValidCPF: boolean = false;
	isVisibleBtn : boolean = true; 
	
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
	
	constructor(
		public recursoComboService: RecursoComboService,
		public poNotification: PoNotificationService,
		public matriculaComboService: MatriculaComboService,
		public funcaoComboService: FuncaoComboService,
		private route: ActivatedRoute,
		private fwModel: FwProtheusModel,
		private formBuilder: FormBuilder,
		){
			this.createForm();
		}
	
	ngOnInit() {
		//Define se é inclusão ou alteração
		this.acao = this.route.snapshot.params['acao'];
        this.pkMotorista = this.route.snapshot.params['id'];
		this.filial = atob(this.route.snapshot.params['filial']);

        switch (this.acao) {
            case 'editar':
                this.titulo = 'Alterar Motorista/Colaborador';
				this.isVisibleBtn = false;
				this.breadcrumb.items[2].label = 'Alterar Motorista/Colaborador';
				this.filterParamMatricula = `RA_FILIAL LIKE '%${this.filial}%'`;
                break;
            case 'incluir':
                this.titulo = 'Incluir Motorista/Colaborador';
				this.isVisibleBtn = true;
				this.breadcrumb.items[2].label = 'Incluir Motorista/Colaborador';
                break;
		}

		//Criando o formulario
		this.createForm();
		if (this.pkMotorista != undefined) {
            this.setForm()
        } else {
			this.motoristaForm.patchValue({
				status: 1
			});
        }
	}

	createForm(): any {
		const motorista: MotoristaForm = {} as MotoristaForm;
        this.motoristaForm = this.formBuilder.group({
			nome: [motorista.nome],
			turno: [motorista.turno],
			status: [motorista.status],
			codFuncao: [motorista.codFuncao],
			descFuncao: [motorista.descFuncao],
			codMatricula: [motorista.codMatricula],
			descMatricula: [motorista.descMatricula],
			codTipoRecurso: [motorista.codTipoRecurso],
			descTipoRecurso: [motorista.descTipoRecurso],
			tipoDocumento: [motorista.tipoDocumento],
			dataNascimento: [motorista.dataNascimento],
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
	async setForm() {
		let documento: string = '';
		let params = new HttpParams();
        this.motorista = new MotoristaModel();

        this.fwModel.reset();
        this.fwModel.setEndPoint('GTPA008/' + this.pkMotorista)
		this.fwModel.setVirtualField(true)
        this.fwModel.get(params).subscribe((data: any) => {
			console.log(data)
			if(this.isValidCPF){//trocar pela informação vinda do protheus, criar caMPO
				documento = this.fwModel.getModel('GYGMASTER').getValue('GYG_CPF');
			}else{
				documento = this.fwModel.getModel('GYGMASTER').getValue('GYG_RG');

			}

			//this.motorista.disponivel = this.fwModel.getModel('GYGMASTER').getValue('AA1_ALOCA') == '1' ? '0' : '1';

			this.motoristaForm.patchValue({
				nome: this.fwModel.getModel('GYGMASTER').getValue('GYG_NOME'),
				codFuncao: this.fwModel.getModel('GYGMASTER').getValue('GYG_FUNCOD'),
				descFuncao: this.fwModel.getModel('GYGMASTER').getValue('GYG_FUNDES'),
				//turno: this.fwModel.getModel('GYGMASTER').getValue('GYG_TURNO1'),
				status: this.fwModel.getModel('GYGMASTER').getValue('GYG_STATUS'),
				codMatricula: this.fwModel.getModel('GYGMASTER').getValue('GYG_FUNCIO'),
				descMatricula: this.fwModel.getModel('GYGMASTER').getValue('GYG_NOME'),
				codTipoRecurso:this.fwModel.getModel('GYGMASTER').getValue('GYG_RECCOD'),
				descTipoRecurso:this.fwModel.getModel('GYGMASTER').getValue('GYG_DESREC'),
				numeroDocumento: documento,
				tipoDocumento: '1', //this.fwModel.getModel('GYGMASTER').getValue('GYG_RECCOD'),
				//dataNascimento:this.fwModel.getModel('GYGMASTER').getValue('GYG_RECCOD'), makedat
				codigoMotorista: this.fwModel.getModel('GYGMASTER').getValue('GYG_CODIGO'),
			});

        })
		console.log(this.motoristaForm)

    }
	
	
	
	
	
	
	/**
	 * incluirDocumento - Responsavel por abrir modal de inclusão de documento
	 */
	incluirDocumento(){
		//abrir modal de inclusao de documento
		this.poNotification.warning("Pagina em construção")
	}
}
