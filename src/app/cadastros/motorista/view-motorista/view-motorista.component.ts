import { Component } from '@angular/core';
import { PoBreadcrumb, PoDynamicViewField, PoPageAction } from '@po-ui/ng-components';
import { ColunaDados } from './view-motorista.struct';
import { HttpParams } from '@angular/common/http';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FindValueByName, MakeDate, isNullOrUndefined } from 'src/app/services/functions/util.function';

@Component({
  selector: 'app-view-motorista',
  templateUrl: './view-motorista.component.html',
  styleUrls: ['./view-motorista.component.css']
})
export class ViewMotoristaComponent {
	viewMotorista = {};
	titulo: string = '';
	pkMotorista : string = '';
	filialMotorista: string = '';
	isHideLoadingTela: boolean = true;
	colunaDados: Array<PoDynamicViewField> = ColunaDados;
	actions: Array<PoPageAction> = [
		{ label: 'Editar', action: () => { this.editar() } },
		{ label: 'Fechar', action: () => { this.close() } }
	];
	public breadcrumb: PoBreadcrumb = {
		items: [
			{ label: 'Fretamento Urbano', link: '/' },
			{ label: 'Motoristas/Colaboradores', link: '/motorista' },
			{ label: '' }]
	 };
	constructor(
		private fwModel: FwProtheusModel,
		private route: ActivatedRoute,
		private router: Router,
		){
		this.pkMotorista = this.route.snapshot.params['id'];
		this.filialMotorista = this.route.snapshot.params['filial'];
	}

	ngOnInit() {
		this.getMotorista()
	}

	/**
	 * Get Motorista
	 */
	async getMotorista() {
		this.isHideLoadingTela = false;
		let params = new HttpParams();
        this.fwModel.reset();
        this.fwModel.setEndPoint('GTPA008/' + this.pkMotorista)
		this.fwModel.setVirtualField(true)
        this.fwModel.get(params).subscribe({
			next:(data: any) => {
				this.titulo = FindValueByName(data.models[0].fields,'GYG_CODIGO') + ' - '+ FindValueByName(data.models[0].fields,'GYG_NOME')
				this.breadcrumb.items[2].label = this.titulo;
				let documento: string = '';
				let tipoDoc = FindValueByName(data.models[0].fields,'GYG_TPDOC');
				let turno = FindValueByName(data.models[0].fields,'GYG_TURNO');
				let status = FindValueByName(data.models[0].fields,'GYG_STATUS');
				let descTurno = '';
				if (status == ''){
					status = '1';
				}
				if (tipoDoc != ''){
					if(tipoDoc == '1'){
						tipoDoc = 'RG'
						documento = FindValueByName(data.models[0].fields,'GYG_RG');
					}else{
						tipoDoc = 'CPF'
						documento = FindValueByName(data.models[0].fields,'GYG_CPF');
					}
				}
				if (turno.includes('1')){
					descTurno = descTurno != '' ? '/Manhã' : 'Manhã'
				}
				if (turno.includes('2')){
					descTurno += descTurno != '' ? '/Tarde' : 'Tarde'
				}
				if (turno.includes('3')){
					descTurno += descTurno != '' ? '/Noite' : 'Noite'
				}
				this.viewMotorista = { 
					nome: FindValueByName(data.models[0].fields,'GYG_NOME'),
					codigo: FindValueByName(data.models[0].fields,'GYG_CODIGO'),
					matricula: FindValueByName(data.models[0].fields,'GYG_FUNCIO'),
					dataNascimento: MakeDate(FindValueByName(data.models[0].fields,'GYG_DTNASC'), 'yyyy-mm-dd'),
					tipoDocumento: tipoDoc,
					numeroDocumento: documento,
					numeroCNH: '',
					dataVencimentoCNH : '',
					tipoRecurso: FindValueByName(data.models[0].fields,'GYG_RECCOD') + ' - ' + FindValueByName(data.models[0].fields,'GYG_DESREC'),
					funcao: FindValueByName(data.models[0].fields,'GYG_FUNCOD') + ' - '+ FindValueByName(data.models[0].fields,'GYG_FUNDES'),
					turno: descTurno,
					status
				 }
			},
			error(err) {
				this.poNotification(err.errorMessage);
				this.close();
			},
			complete: () => {
				this.isHideLoadingTela = true;
			},
		})
    }
	/**
	 * Redireciona para a página de edição
	 * @param row linha selecionada
	 */
	editar() {
		this.router.navigateByUrl(`motorista/detMotorista/editar/${this.filialMotorista}/${this.pkMotorista}`);
	}

	/**
	 * realiza o retorno para a tela de motorista
	 */
	close() {
		this.router.navigate(["/motorista" ], { relativeTo: this.route });
	}
}
