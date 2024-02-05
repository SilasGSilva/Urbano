import { Component } from '@angular/core';
import { PoBreadcrumb, PoDynamicViewField, PoPageAction } from '@po-ui/ng-components';
import { ColunaDados } from './view-localidades.struct';
import { FwProtheusModel } from 'src/app/services/models/fw-protheus.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
	selector: 'app-view-localidades',
	templateUrl: './view-localidades.component.html',
	styleUrls: ['./view-localidades.component.css']
})

export class ViewLocalidadesComponent {

	viewLocalidade = {};
	titulo: string = '';
	pkLocalidade: string = '';
	isHideLoadingTela: boolean = true;
	colunaDados: Array<PoDynamicViewField> = ColunaDados;
	actions: Array<PoPageAction> = [
		{ label: 'Editar', action: () => { this.editar() } },
		{ label: 'Fechar', action: () => { this.close() } }
	];
	public breadcrumb: PoBreadcrumb = {
		items: [
			{ label: 'Fretamento Urbano', link: '/' },
			{ label: 'Localidades', link: '/localidades' },
			{ label: '' }]
	};
	constructor(
		private fwModel: FwProtheusModel,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.pkLocalidade = this.route.snapshot.params['id'];
	}

	ngOnInit() {
		this.getLocalidade()
	}

	/**
	 * Get Localidade
	 */
	async getLocalidade() {
		this.isHideLoadingTela = false;
		let params = new HttpParams();
		this.fwModel.reset();
		this.fwModel.setEndPoint('GTPA001/' + this.pkLocalidade)
		this.fwModel.setVirtualField(true)
		this.fwModel.get().subscribe({
			next: () => {
				let tpLoc = this.fwModel.getModel('GI1MASTER').getValue('GI1_TPLOC');
				let codLoc = this.fwModel.getModel('GI1MASTER').getValue('GI1_COD');
				let descLoc = this.fwModel.getModel('GI1MASTER').getValue('GI1_DESCRI');
				let status = this.fwModel.getModel('GI1MASTER').getValue('GI1_STATUS');
				let descTipo = '';

				if (tpLoc.includes('1')) {
					descTipo = descTipo != '' ? '/Garagem' : 'Garagem'
				};

				if (tpLoc.includes('2')) {
					descTipo += descTipo != '' ? '/Ponto de recolhe' : 'Ponto de recolhe'
				};

				this.titulo = codLoc + ' - ' + descLoc;
				this.breadcrumb.items[2].label = this.titulo;

				this.viewLocalidade = {
					codigo: codLoc,
					descricao: descLoc,
					cep: this.fwModel.getModel('GI1MASTER').getValue('GI1_CEP'),
					endereco: this.fwModel.getModel('GI1MASTER').getValue('GI1_ENDERE'),
					bairro: this.fwModel.getModel('GI1MASTER').getValue('GI1_BAIRRO'),
					estado: this.fwModel.getModel('GI1MASTER').getValue('GI1_UF'),
					codMunicipio: this.fwModel.getModel('GI1MASTER').getValue('GI1_CDMUNI'),
					municipio: this.fwModel.getModel('GI1MASTER').getValue('GI1_DSMUNI'),
					tipo: descTipo,
					status
				}
			},
			error(err) {
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
		this.router.navigateByUrl(`localidades/detLocalidades/editar/${this.pkLocalidade}`);
	}

	/**
	* realiza o retorno para a tela de localidade
	*/
	close() {
		this.fwModel.reset();
		this.router.navigate(['./localidades']);
	}
}
