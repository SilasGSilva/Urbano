import {
	Component,
	OnInit,
} from '@angular/core';
import {
	PoBreadcrumb,
	PoDynamicViewField,
	PoNotificationService,
	PoPageAction,
	PoTableColumn,
} from '@po-ui/ng-components';
import {
	ColunasDadosViewLinhas,
	SecaoModel,
	secoesLinha
} from './view-linhas.struct';
import {
	FwProtheusModel
} from 'src/app/services/models/fw-protheus.model';
import {
	ActivatedRoute,
	Router
} from '@angular/router';
import {
	ApiService
} from 'src/app/services/api.service';
import {
	HttpClient,
	HttpParams
} from '@angular/common/http';

@Component({
	selector: 'app-view-linhas',
	templateUrl: './view-linhas.component.html',
	styleUrls: ['./view-linhas.component.css']
})
export class ViewLinhasComponent implements OnInit {
	viewLinhas = {};
	titulo: string = '';
	pkLinha: string = ''
	isHideLoadingTela: boolean = true;
	colunaDados: Array<PoDynamicViewField> = ColunasDadosViewLinhas;
	filters: string = ''
	actions: Array<PoPageAction> = [
		{
			label: 'Editar',
			action: () => {
				this.editar();
			}
		}, {
			label: 'Fechar',
			action: () => {
				this.close()
			}
		}
	]
	public breadcrumb: PoBreadcrumb = {
		items: [
			{ label: 'Fretamento Urbano', link: '/' },
			{ label: 'Linhas', link: '/linhas' },
			{ label: '' },
		],
	};
	public itemsColumns: Array<PoTableColumn> = secoesLinha;
	public listLinhas: Array<SecaoModel> = []
	constructor(
		public poNotification: PoNotificationService,
		private fwModel: FwProtheusModel,
		private route: ActivatedRoute,
		private router: Router,
		private http: HttpClient
	) {
		this.pkLinha = this.route.snapshot.params['id'];
	}
	ngOnInit() {
		this.getLinha();
	}
	async getLinha() {
		let params = new HttpParams();
		let apiService = new ApiService(this.http)
		let endpoint: string = ''

		this.isHideLoadingTela = false;

		this.fwModel.reset();
		this.fwModel.setEndPoint('GTPU003/' + this.pkLinha);
		this.fwModel.setVirtualField(true);
		this.fwModel.get().subscribe({
			next: () => {
				const codigo = this.fwModel.getModel('H6VMASTER').getValue('H6V_CODIGO')
				this.viewLinhas = {
					prefixo: this.fwModel.getModel('H6VMASTER').getValue('H6V_PREFIX'),
					codLinha: this.fwModel.getModel('H6VMASTER').getValue('H6V_CODLIN'),
					descLinha: this.fwModel.getModel('H6VMASTER').getValue('H6V_DESCRI'),
					origem: this.fwModel.getModel('H6VMASTER').getValue('H6V_ORIDES'),
					destino: this.fwModel.getModel('H6VMASTER').getValue('H6V_DESTDE'),
					orgao: this.fwModel.getModel('H6VMASTER').getValue('H6V_ORGDES'),
					tarifa: this.fwModel.getModel('H6VMASTER').getValue('H6V_TARIDE'),
					pedagio: this.fwModel.getModel('H6VMASTER').getValue('H6V_PEDAGI'),
					tipoServico: this.fwModel.getModel('H6VMASTER').getValue('H6V_CLSFIS'),
					km: this.fwModel.getModel('H6VMASTER').getValue('H6V_KMLINH') + 'KM',
					categoria: this.fwModel.getModel('H6VMASTER').getValue('H6V_CATEGO'),
					statusLinha: this.fwModel.getModel('H6VMASTER').getValue('H6V_STATUS'),
				};

				this.filters = "AND H6X_CODLIN ='" + codigo + "'"
				params = params.append('FILTER', this.filters)
				endpoint = 'FRETAMENTOURBANO/secoes'

				apiService.get(endpoint, params).subscribe((data: any) => {
					if (data.Secoes) {
						data.Secoes.forEach((secaoData: any) => {
							let secao = new SecaoModel();

							if (secaoData.Secao.Sentido != '2') {
								secao.ida = secaoData.Secao.Items[0].CodLinha + ' - ' + secaoData.Secao.Items[0].DescLinha
							} else {
								secao.volta = secaoData.Secao.Items[0].CodLinha + ' - ' + secaoData.Secao.Items[0].DescLinha
							}

							this.listLinhas.push(secao);
						})
					}
				});
			},
			error: error => {
				this.poNotification.error(error.error.errorMessage);
				this.fwModel.reset();
			},
			complete: () => {
				this.isHideLoadingTela = true;
			},
		});

	}

	/*******************************************************************************
   * @name editar
   * @description Redireciona para a página de edição
   * @author   Serviços | Diego Bezerra
   * @since       2024
   * @version v1
   *******************************************************************************/
	editar() {
		this.router.navigateByUrl(
			`linhas/det-linha/editar/${this.pkLinha}`
		);
	}

	/*******************************************************************************
   * @name close
   * @description Redireciona para a página incial de linhas
   * @author   Serviços | Diego Bezerra
   * @since       2024
   * @version v1
   *******************************************************************************/
	close() {
		this.fwModel.reset();
		this.router.navigate(['./linhas']);
	}
}


