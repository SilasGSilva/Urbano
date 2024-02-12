import { Component, ViewChild } from '@angular/core';
import { 
	FormBuilder, 
	FormGroup, 
	Validators 
} from '@angular/forms';
import { 
	PoBreadcrumb, 
	PoComboComponent, 
	PoRadioGroupOption 
} from '@po-ui/ng-components';
import { 
	ListStatus, 
	linhaForm 
} from './det-linha.struct';
import { 
	ActivatedRoute, 
	Router 
} from '@angular/router';
import { 
	PoLookupColumn, 
	PoNotificationService 
} from '@po-ui/ng-components';
import { 
	localidadeComboService 
  } from 'src/app/services/adaptors/wsurbano-adapter.service';
import { LocalidadeLookupService } from 'src/app/services/lookup-filter.service';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { VldFormStruct } from 'src/app/services/gtpgenerics.struct';
import { ApiService } from 'src/app/services/api.service';
import { isNullOrUndefined } from 'src/app/services/functions/util.function';
import { HttpParams } from '@angular/common/http';
import { FindValueByName } from 'src/app/services/functions/util.function';

@Component({
  selector: 'app-det-linha',
  templateUrl: './det-linha.component.html',
  styleUrls: ['./det-linha.component.css'],
  providers:[LocalidadeLookupService]
})
export class DetLinhaComponent {
	@ViewChild('origemFilterCombo',{static:true})
	origemFilterCombo!: PoComboComponent

	@ViewChild('origemFilterCombo',{static:true})
	destinoFilterCombo!: PoComboComponent

	@ViewChild('origemFilterCombo',{static:true})
	orgaoregulamentadorFilterCombo!: PoComboComponent

	@ViewChild('origemFilterCombo',{static:true})
	tarifaFilterCombo!: PoComboComponent

	@ViewChild('origemFilterCombo',{static:true})
	pedagioFilterCombo!: PoComboComponent

	@ViewChild('origemFilterCombo',{static:true})
	classificacaofiscalFilterCombo!: PoComboComponent
	
	listForm!:FormGroup;
	public isShowLoading: boolean = false;
    public editView: boolean = false;
    public isVisibleBtn: boolean = false;
	public filial: string = '';

    public action: string = '';
    public pk: string = '';
	public title: string = '';
	public isLoadingBtn: boolean = false;
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
	public filterParams: string = ""

	constructor(
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _formBuilder: FormBuilder,
		public localidadeLookupService:LocalidadeLookupService,
		private fwModel: FwProtheusModel,
		private apiService: ApiService,
		public poNotification: PoNotificationService,
		private _fwModel:FwProtheusModel,
		private _poNotification: PoNotificationService,
		public localidadeComboService: localidadeComboService,

	){
		// Ação
		this.action = this._activatedRoute.snapshot.params['acao'];
		// PK do modelo
		this.pk = this._activatedRoute.snapshot.params['pk'];
	}
	
	ngOnInit(){
		
		switch(this.action){
			case 'editar':
				this.editView = true;
				// this.filial = atob(
				// 	this._activatedRoute.snapshot.params['filial']
				// );
				this.title = 'Editar linha'
				this.breadcrumb.items[2].label = 'Editar linha';
				this.getLinha();
				break;
			case 'incluir':
				this.title = 'Incluir linha';
				this.isVisibleBtn = true;
				this.breadcrumb.items[2].label = 'Incluir linha';
				break;
		}

		this.createForm();

		if (this.pk != undefined) {
            //Edição, faz a carga dos valores
            this.getLinha();
        } else {
            //Inclusão, seta o status como ativo
            this.linhaForm.patchValue({
                status: '1',
            });
        }
	}

	createForm():any{
		const linha: linhaForm = {} as linhaForm;
		this.linhaForm = this._formBuilder.group({
			
			prefixo:[
				linha.prefixo, 
				Validators.compose([Validators.required])
			],
			codlinha:[
				linha.codlinha
			],
			descricao:[
				linha.descricao, 
				Validators.compose([Validators.required])
			],
			origem:[
				linha.origem, 
				Validators.compose([Validators.required])
			],
			destino:[
				linha.destino, 
				Validators.compose([Validators.required])
			],
			orgaoregulamentador:[
				linha.orgaoregulamentador, 
				Validators.compose([Validators.required])
			],
			tarifa:[
				linha.tarifa, 
				Validators.compose([Validators.required])
			],
			pedagio:[
				linha.pedagio
			],
			classificacaofiscal:[
				linha.classificacaofiscal
			],
			kmdalinha:[
				linha.kmdalinha, 
				Validators.compose([Validators.required])
			],
			categoria:[
				linha.categoria
			],
			status:[
				linha.status, 
				Validators.compose([Validators.required])
			]
 
	
		})
	}

	getLinha() {
		this.changeLoading();
        let params = new HttpParams();
        this._fwModel.reset();
		debugger
        this._fwModel.setEndPoint('GTPA001/' + this.pk);
        this._fwModel.setVirtualField(true);
        this._fwModel.get(params).subscribe({
            next: (data: any) => {
				
                this.breadcrumb.items[2].label = `${FindValueByName(
                    data.models[0].fields,
                    'GI1_COD'
                )} - ${FindValueByName(data.models[0].fields, 'GI1_DESCRI')}`;

                this.linhaForm.patchValue({
                    prefixo: FindValueByName(data.models[0].fields, 'GI1_COD'),
                    codlinha: FindValueByName(
                        data.models[0].fields,
                        'GI1_DESCRI'
                    ),
					descricao:  FindValueByName(data.models[0].fields, 'GI1_DESCRI') 
								+ '-'
								+  FindValueByName(data.models[0].fields, 'GI1_COD'),    
										
					/**
					 * 			
					origem:.......
					destino: .......
					orgaoregulamentador: ......
					tarifa: .......
					pedagio: .......
					classificacaofiscal: ........
					kmdalinha: ........
					categoria: ........
					status: ........
							
					*/
    
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

	changeLoading() {
        if (this.isShowLoading) {
            this.isShowLoading = false;
        } else {
            this.isShowLoading = true;
        }
    }

	onClickCancel(): void {
        this.fwModel.reset();
        this._router.navigate(['./linhas']);
    }

	saveLinha(stay: boolean) {
        if (!this.editView) {
            //nova tarifa
            this.changeLoading();
            setTimeout(() => {
                this.changeLoading();
                if (!stay) {
                    this.linhaForm.patchValue({
                        prefixo: '',
                        codlinha: '',
                        descricao: '',
                        origem: '',
                        destino: '',
                        orgaoregulamentador: '',
						tarifa: '',
						pedagio: '',
						classificacaofiscal: '',
						kmdalinha: '',
						categoria: '',
						status: ''
                    });
                    this._router.navigate(['linhas']);
                } else {
                    this.linhaForm.patchValue({
                        prefixo: '',
                        codlinha: '',
                        descricao: '',
                        origem: '',
                        destino: '',
                        orgaoregulamentador: '',
						tarifa: '',
						pedagio: '',
						classificacaofiscal: '',
						kmdalinha: '',
						categoria: '',
						status: ''
                    });
                }
                this._poNotification.success('Linha criada com sucesso!');
            }, 1000);
        } else {
			this.changeLoading();
			setTimeout(() => {
				this.linhaForm.patchValue({
					prefixo: '',
					codlinha: '',
					descricao: '',
					origem: '',
					destino: '',
					orgaoregulamentador: '',
					tarifa: '',
					pedagio: '',
					classificacaofiscal: '',
					kmdalinha: '',
					categoria: '',
					status: ''
				});
				this.changeLoading();
				this._router.navigate(['linhas']);
				this._poNotification.success(
					'Linha alterada com sucesso!'
				);
			}, 1000);
      
        }
    }
	setFilters(){

		return ''
	}
}
