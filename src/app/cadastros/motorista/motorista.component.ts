import { Component, OnInit, ViewChild } from '@angular/core';
import { PoBreadcrumb, PoComboComponent, PoNotificationService, PoPageAction, PoSelectOption, PoTableColumn } from '@po-ui/ng-components';
import { CollumnsMotoristas, ComboFilial, ListTurno, MotoristaModel } from './motorista.struct';
import { MotoristaComboService, RecursoComboService } from 'src/app/services/combo-filter.service';
import { HttpParams } from '@angular/common/http';
import { FwProtheusModel, Resource } from 'src/app/services/models/fw-protheus.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-motorista',
  templateUrl: './motorista.component.html',
  styleUrls: ['./motorista.component.css'],
  providers: [RecursoComboService, MotoristaComboService]
})
export class MotoristaComponent implements OnInit {

	//Declaração de variaveis
	pk : string = '';
	filters: string = ''

	isLoading: boolean = true
	resetFilters: boolean = false;
	isShowMoreDisabled: boolean = false;

	nNextPage: number = 1;
	nPageSize: number = 10;
	nRegIndex: number = 1;
	nHeightMonitor: number = window.innerHeight * (window.innerHeight > 850 ? 0.6 : 0.45);

	columns: Array<PoTableColumn> = CollumnsMotoristas;
	listTurno: Array<PoSelectOption> = ListTurno;
	listMotoristas: Array<MotoristaModel> = [];

	actions: Array<PoPageAction> = [
		{ label: 'Incluir', action: () => { this.incluir() } },
	];

	public breadcrumb: PoBreadcrumb = {
		items: [{ label: 'Fretamento Urbano', link: '/' }, { label: 'Motoristas/Colaboradores' }]
	 };

	@ViewChild('cmbTurno', { static: true }) cmbTurno!: PoComboComponent;
	@ViewChild('cmbRecurso', { static: true }) cmbRecurso!: PoComboComponent;
	@ViewChild('cmbMotorista', { static: true }) cmbMotorista!: ComboFilial;

	constructor(
		public poNotification: PoNotificationService,
		public recursoComboService: RecursoComboService,
		public motoristaComboService : MotoristaComboService,
		private route: ActivatedRoute,
		private router: Router,
		private fwModel: FwProtheusModel,
	  ) {
		this.setColProperties();
	  }

	ngOnInit() {
		this.getMotoristas();
	}

	/**
	 * Seta as demais propriedades das colunas
	 */
	setColProperties() {
		this.columns.forEach(col => {
			if (col.property === "outrasAcoes" && col.icons && col.icons.length >= 0) {
				col.icons[0].action = this.editar.bind(this);//editar
				col.icons[1].action = this.visualizar.bind(this);//visualizar
			}
		});
	}

	/**
	 * Ação do combo, ao selecionar o registro ele busca novamente
	 */
	setFilters() {
		this.listMotoristas = [];

		this.filters = '';
		this.isShowMoreDisabled = false;
		this.resetFilters = false;

		//filtros
        if (this.cmbRecurso.selectedOption != undefined){
			if (this.filters != ''){
				this.filters += ' AND '
			}
			this.filters += "GYG_RECCOD='" + this.cmbRecurso.selectedOption.value + "'";
		}
		if (this.cmbMotorista != undefined){
			if (this.cmbMotorista.selectedOption != undefined){
				if (this.filters != ''){
					this.filters += ' AND '
				}
				this.filters += "GYG_CODIGO ='" + this.cmbMotorista.selectedOption.value + "'";
				this.filters += " AND GYG_FILIAL ='" + this.cmbMotorista['visibleOptions'][0].filial + "'";
			}
		}
		if (this.cmbTurno.selectedOption != undefined){
			if (this.filters != ''){
				this.filters += ' AND '
			}
			this.filters += " GYG_TURNO LIKE '%" + this.cmbTurno.selectedOption.value + "%'";
		}

    if(this.filters === ''){
      this.nRegIndex = 1;
    }
        this.getMotoristas();

    }

	/**
	 * @name getMotoristas
	 * @description Busca dados para o grid de motoristas
	 */
    getMotoristas() {

        let params = new HttpParams();
		this.isLoading = true;
		
		//Se tiver filtros, não aplica a paginação
        if (this.filters != '') {
            params = params.append('FILTER', this.filters);
        } else {
			if (this.nPageSize.toString() != '')
				params = params.append('COUNT',this.nPageSize.toString());
			if (this.nRegIndex.toString() != '')
				params = params.append('STARTINDEX', this.nRegIndex.toString() );
		}
        this.fwModel.setEndPoint('GTPA008/');

		this.fwModel.setVirtualField(true)
		this.fwModel.get(params).subscribe(() => {

			this.fwModel.resources.forEach((resource: Resource) => {

				let motorista = new MotoristaModel;
				let status : string = resource.getModel('GYGMASTER').getValue('GYG_STATUS');
				let turno: string = resource.getModel('GYGMASTER').getValue('GYG_TURNO');
				let descTurno : string = ''

				if (turno.includes('1')){
					descTurno = descTurno != '' ? '/Manhã' : 'Manhã'
				}
				if (turno.includes('2')){
					descTurno += descTurno != '' ? '/Tarde' : 'Tarde'
				}
				if (turno.includes('3')){
					descTurno += descTurno != '' ? '/Noite' : 'Noite'
				}

				motorista.id = resource.getModel('GYGMASTER').getValue('GYG_CODIGO');
				motorista.filial = resource.getModel('GYGMASTER').getValue('GYG_FILIAL');
				motorista.pk = resource.pk;
				motorista.matricula = resource.getModel('GYGMASTER').getValue('GYG_FUNCIO');
				motorista.descMotorista = resource.getModel('GYGMASTER').getValue('GYG_NOME');
				motorista.codRecurso = resource.getModel('GYGMASTER').getValue('GYG_RECCOD');
				motorista.descRecurso = motorista.codRecurso + ' - ' + resource.getModel('GYGMASTER').getValue('GYG_DESREC');
				motorista.turno = descTurno
				motorista.status = status != '' ? status : '1'
				motorista.outrasAcoes = ['editar', 'visualizar'];
				this.listMotoristas = [...this.listMotoristas, motorista];
				this.isLoading = false;

            })

			this.setShowMore(this.fwModel.total);
        })

    }
	/**
	 * Incrementa o index de paginação da tela e
	 * Seta se o botão de carregar mais continua habilitado ou não
	 * @param total Total de andamentos
	 */
	setShowMore(total: number) {
		this.isLoading = false;
		if (this.nRegIndex === 1) {
			this.nRegIndex = this.nPageSize + 1;
		} else {
			this.nRegIndex += this.nPageSize;
		}

		if (this.nRegIndex <= total) {
			this.isShowMoreDisabled = false;
		} else {
			this.isShowMoreDisabled = true;
		}
	}

	/**
	 * Ação do botão Carregar mais resultados
	 * Se for clicado pela 4a vez carrega o restante dos dados, independente da quantidade
	 */
	actionShowMore() {
		this.nNextPage++;
		// se for clicado pela 4a vez carrega o restante dos dados
		if (this.nNextPage === 4 ) {
			this.nPageSize = this.fwModel.total;
		}

		this.isShowMoreDisabled = true;
		this.getMotoristas();
	}

	/**
	 * Redireciona para a página de edição
	 * @param row linha selecionada
	 */
	editar(item : any) {
		this.router.navigate(["./detMotorista", "editar", btoa(item.filial), item.pk ], { relativeTo: this.route });
	}
	/**
	 * Redireciona para a página de visualização
	 * @param row linha selecionada
	 */
	visualizar(item : any) {
		this.router.navigate(["./viewMotorista", "visualizar", btoa(item.filial), item.pk ], { relativeTo: this.route });
	}
	/**
	 * Redireciona para a página de inclusao
	 * @param row linha selecionada
	 */
	incluir() {
		this.router.navigate(["./detMotorista", "incluir"], { relativeTo: this.route });
	}

}
