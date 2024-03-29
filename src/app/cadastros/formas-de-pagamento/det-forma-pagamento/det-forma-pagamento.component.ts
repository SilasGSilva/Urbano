import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoModalAction, PoModalComponent, PoNotificationService } from '@po-ui/ng-components';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { FormaPagForm } from '../formas-de-pagamento-struct';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeUndefinedToEmpty, FindValueByName } from 'src/app/services/functions/util.function';
import { ValidaNotificacao } from 'src/app/services/functions/validateForm';

@Component({
	selector: 'app-det-forma-pagamento',
	templateUrl: './det-forma-pagamento.component.html',
	styleUrls: ['./det-forma-pagamento.component.css'],
})
export class DetFormaPagamentoComponent implements OnInit {
	formaPagForm!: FormGroup<any>;

	acao: string = '';
	title: string = 'Nova forma de pagamento';
	titulo: string = '';
	codPayment: string = '';
	descPayment: string = '';
	pkFormaPagamento: string = '';

	editView: boolean = false;
	isLoadingBtn: boolean = false;
	isShowLoading: boolean = true;
	isVisibleBtn: boolean = true;

	public breadcrumb: PoBreadcrumb = {
		items: [
			{ label: 'Fretamento Urbano', link: '/' },
			{ label: 'Formas de pagamento', link: '/formas-de-pagamento' },
			{ label: '' },
		],
	};

	@ViewChild('modalCancel', { static: false })
	modalCancel!: PoModalComponent;
	constructor(
		public poNotification: PoNotificationService,
		private _router: Router,
		private fwModel: FwProtheusModel,
		private route: ActivatedRoute,
		private formBuilder: FormBuilder
	) {
		this.createForm();
	}

	ngOnInit() {
		this.acao = this.route.snapshot.params['acao'];
		this.pkFormaPagamento = this.route.snapshot.params['id'];

		switch (this.acao) {
			case 'editar':
				this.titulo = 'Editar forma de pagamento';
				this.isVisibleBtn = false;
				this.isLoadingBtn = true;
				this.isShowLoading = false;
				this.editView = true;
				break;
			case 'incluir':
				this.isShowLoading = true;
				this.isLoadingBtn = false;
				this.titulo = 'Incluir forma de pagamento';
				this.isVisibleBtn = true;
				this.breadcrumb.items[2].label = this.titulo;
				break;
		}
		//Criando o formulario
		this.createForm();

		if (this.pkFormaPagamento !== undefined) {
			this.getFormaPagamento();
		}
	}

	/*******************************************************************************
	 * @name createForm
	 * @description Inicializa o formulário
	 * @author	    Serviços | Breno Gomes
	 * @since		2024
	 * @version     v1
	 *******************************************************************************/
	createForm(): any {
		const formaPagamento: FormaPagForm = {} as FormaPagForm;
		this.formaPagForm = this.formBuilder.group({
			codigo: [formaPagamento.codigo, Validators.compose([Validators.required])],
			descricao: [formaPagamento.descricao, Validators.compose([Validators.required])],
		});
	}

	/*******************************************************************************
	 * @name confirmCancel
	 * @description Ação responsável por cancelar o processo atual quando perguntado
	 * no modal e navega de volta para o browse
	 * @author	 Serviços | Levy Santos
	 * @since		2024
	 * @version	v1
	 *******************************************************************************/
	public confirmCancel: PoModalAction = {
		label: 'Sim',
		action: () => {
			this.modalCancel.close();
			this._router.navigate(['formas-de-pagamento']);
		},
	};

	/*******************************************************************************
	 * @name exitCancel
	 * @description Ação responsável por manter no processo atual quando perguntado
	 * no modal e permanece na mesma tela
	 * @author	 Serviços | Levy Santos
	 * @since		2024
	 * @version	v1
	 *******************************************************************************/
	public exitCancel: PoModalAction = {
		label: 'Não',
		action: () => this.modalCancel.close(),
	};

	/*******************************************************************************
	 * @name saveAction
	 * @description Função responsável por salvar a nova forma de pagamentoou editar
	 * uma forma de pagamento escolhida e navegar de volta pro browse
	 * @author	 Serviços | Levy Santos
	 * @since		2024
	 * @version	v1
	 *******************************************************************************/
	saveAction(isSaveNew: boolean = false) {
		let isSubmitable: boolean = this.formaPagForm.valid;
		if (isSubmitable) {
			this.isLoadingBtn = true;
			this.isShowLoading = false;
			this.fwModel.reset();
			this.fwModel.setModelId('GTPU001');
			this.fwModel.setEndPoint('GTPU001/');
			this.fwModel.AddModel('H6RMASTER', 'FIELDS');

			this.fwModel.getModel('H6RMASTER').addField('H6R_CODIGO'); // COD MATRICULA
			this.fwModel.getModel('H6RMASTER').addField('H6R_DESCRI'); // NOME

			this.fwModel
				.getModel('H6RMASTER')
				.setValue('H6R_CODIGO', ChangeUndefinedToEmpty(this.formaPagForm.value.codigo));
			this.fwModel
				.getModel('H6RMASTER')
				.setValue('H6R_DESCRI', ChangeUndefinedToEmpty(this.formaPagForm.value.descricao));

			if (this.acao == 'incluir') {
				this.fwModel.operation = 3;
				this.fwModel.post().subscribe({
					next: () => {
						this.poNotification.success('Forma de pagamento cadastrada com sucesso');
						if (isSaveNew) {
							this.fwModel.reset();
							this.formaPagForm.reset();
							this.formaPagForm.patchValue({
								codigo: '',
								descricao: '',
							});
						} else {
							this.close();
						}
					},
					error: error => {
						this.poNotification.error(error.error.errorMessage);
						this.fwModel.reset();
						this.isLoadingBtn = false;
						this.isShowLoading = true;
					},
					complete: () => {
						this.isLoadingBtn = false;
						this.isShowLoading = true;
					},
				});
			} else if (this.acao == 'editar') {
				this.fwModel.operation = 4;
				this.fwModel.setEndPoint('GTPU001/' + this.pkFormaPagamento);

				this.fwModel.put().subscribe({
					next: () => {
						this.poNotification.success('Forma de pagamento atualizado com sucesso');
						this.close();
					},
					error: error => {
						this.poNotification.error(error.error.errorMessage);
						this.fwModel.reset();
						this.isLoadingBtn = false;
						this.isShowLoading = true;
					},
					complete: () => {
						this.isLoadingBtn = false;
						this.isShowLoading = true;
					},
				});
			}
		} else {
			this.poNotification.error(ValidaNotificacao(this.formaPagForm));
		}
	}

	/*******************************************************************************
	 * @name close
	 * @description Função responsável por redirecionar para a tela de forma de pagamento
	 * @author	    Serviços | Breno Gomes
	 * @since		2024
	 * @version     v1
	 *******************************************************************************/
	close() {
		this._router.navigate(['formas-de-pagamento']);
	}

	/*******************************************************************************
	 * @name getFormaPagamento
	 * @description Busca informações para setar o formulario
	 * @author	    Serviços | Breno Gomes
	 * @since		2024
	 * @version     v1
	 *******************************************************************************/
	getFormaPagamento() {
		let params = new HttpParams();
		this.isShowLoading = false;

		this.fwModel.setEndPoint('GTPU001/' + this.pkFormaPagamento);

		this.fwModel.setVirtualField(true);
		this.fwModel.get(params).subscribe({
			next: (data: any) => {
				let codigo: string = FindValueByName(data.models[0].fields, 'H6R_CODIGO');
				let descricao: string = FindValueByName(data.models[0].fields, 'H6R_DESCRI');

				this.breadcrumb.items[2].label = codigo + ' - ' + descricao;
				this.formaPagForm.patchValue({
					codigo: codigo,
					descricao: descricao,
				});
			},
			error: erro => {
				this.poNotification.error(erro.errorMessage);
				this.isLoadingBtn = false;
				this.isShowLoading = true;
			},
			complete: () => {
				this.isLoadingBtn = false;
				this.isShowLoading = true;
			},
		});
	}
}
