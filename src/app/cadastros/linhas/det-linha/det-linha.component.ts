import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoBreadcrumb, PoRadioGroupOption } from '@po-ui/ng-components';
import { ListStatus, linhaForm } from './det-linha.struct';
import { ActivatedRoute, Router } from '@angular/router';
import { PoLookupColumn, PoNotificationService } from '@po-ui/ng-components';
import { LocalidadeLookupService } from 'src/app/services/lookup-filter.service';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { VldFormStruct } from 'src/app/services/gtpgenerics.struct';
import { ApiService } from 'src/app/services/api.service';
import { isNullOrUndefined } from 'src/app/services/functions/util.function';

@Component({
  selector: 'app-det-linha',
  templateUrl: './det-linha.component.html',
  styleUrls: ['./det-linha.component.css'],
  providers:[LocalidadeLookupService]
})
export class DetLinhaComponent {
	constructor(
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _formBuilder: FormBuilder,
		public localidadeLookupService:LocalidadeLookupService,
		private fwModel: FwProtheusModel,
		private apiService: ApiService,
		public poNotification: PoNotificationService
	){}

	ngOnInit(){
		this.initializeForm();
		this.handleAction();
	}

	acao: string = '';
	pkLinha: string = '';
	titulo: string = '';
	isLoadingBtn: boolean = false;
	isHideLoadingTela: boolean = true;
	listStatus: PoRadioGroupOption[] = ListStatus;
	editItem:any = '';

	public readonly LookupColumns: Array<PoLookupColumn> = [
        { property: 'codigo', label: 'Prefixo' },
        { property: 'descricao', label: 'Município' },
		{ property: 'tipolocalidade', label: 'Tipo de localidade' }
    ];

	public breadcrumb: PoBreadcrumb = {
		items: [
			{ label: 'Fretamento Urbano', link: '/' },
			{ label: 'Cadastrar Linha', link: '/linhas' },
			{ label: 'Incluir Linha' }]
	};

	public linhaForm!: FormGroup

	handleAction():void {
		// Ação
		this.acao = this._activatedRoute.snapshot.params['acao'];
		// PK do modelo
		this.pkLinha = this._activatedRoute.snapshot.params['pk'];
		
		switch(this.acao){
			case 'editar':
				this.titulo = 'Editar linha'
				this.breadcrumb.items[2].label = 'Alterar Linha';
				break;

			case 'incluir':
				this.titulo = 'Incluir linha'
				this.breadcrumb.items[2].label = 'Editar Linha';

				break;
		}
	}

	saveLinha(isSaveNew:boolean = false):void {
		const isSubmitable: boolean = this.linhaForm.valid;

		if(isSubmitable){
			this.isLoadingBtn = true;

			this.fwModel.reset();
			/* 
				setar modelId
				setar endpoint
				adicionar modelo
	
				adicionar campos
	
				setar valor para os campos
				
			*/
	
			this.isLoadingBtn = false;
			if (this.acao == 'incluir'){
				 this.fwModel.post().subscribe({
					next: ()=>{
						this.poNotification.success('Linha incluída com sucesso');
						if (isSaveNew){
							this.fwModel.reset();
							this.linhaForm.reset();
							this.linhaForm.patchValue({
								status: '1'
							});
						} else {
							this.onClickCancel();
							this.fwModel.reset();
						}
					},
					error:(error)=>{
						this.poNotification.error(error.error.errorMessage);
						this.fwModel.reset();
					},
					complete:()=>{
						this.isLoadingBtn = false;
						this.isHideLoadingTela = true;
					},
				 });
			} else {
				this.fwModel.operation = 4;
				//this.fwModel.setEndPoint()

				this.fwModel.put().subscribe({
					next: ()=>{
						this.poNotification.success('Linha alterada com sucesso')
					}
				})
			}
		} else {
			this.vldDetNotify();
		}

	}

	vldDetNotify(): void {
        const listNotification: VldFormStruct[] = this.apiService.validateForm(this.linhaForm);

        listNotification.forEach((item) => {
            let campos: string = '';
            item.field.forEach((fields: string) => {
                if (isNullOrUndefined(campos)) {
                    campos = fields.toUpperCase();
                } else {
                    campos += `, ${fields.toUpperCase()}`;
                }
            });

            this.poNotification.error('Campos não preenchidos: ' + campos + '. Verifique!');
        });

    }
	
	onClickCancel(): void {
        this.fwModel.reset();
        this._router.navigate(['./linhas']);
    }

	initializeForm():void{
		const linha: linhaForm = {} as linhaForm;
		this.linhaForm = this._formBuilder.group({
			prefixo:[linha.prefixo, Validators.compose([Validators.required])],
			codlinha:[linha.codlinha],
			descricao:[linha.descricao, Validators.compose([Validators.required])],
			origem:[linha.origem, Validators.compose([Validators.required])],
			destino:[linha.destino, Validators.compose([Validators.required])],
			orgaoregulamentador:[linha.orgaoregulamentador, Validators.compose([Validators.required])],
			tarifa:[linha.tarifa, Validators.compose([Validators.required])],
			pedagio:[linha.pedagio],
			classificacaofiscal:[linha.classificacaofiscal],
			kmdalinha:[linha.kmdalinha, Validators.compose([Validators.required])],
			categoria:[linha.categoria],
			status:[linha.status, Validators.compose([Validators.required])]
		})
	}
}
