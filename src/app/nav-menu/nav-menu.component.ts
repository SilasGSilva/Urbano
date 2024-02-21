import { Component } from '@angular/core';
import { PoMenuItem } from '@po-ui/ng-components';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-nav-menu',
	templateUrl: './nav-menu.component.html',
	styleUrls: ['./nav-menu.component.css'],
})
export class NavMenuComponent {
	constructor(
		private _router: Router,
		public appComponent: AppComponent
	) {}

	public readonly logoTotvs: string = '/assets/icon-totvs.svg';
	public pageName: string = '';
	public readonly menus: Array<PoMenuItem> = [
		{
			label: 'Cadastros',
			shortLabel: 'Cadastros',
			icon: 'po-icon po-icon-clipboard',
			subItems: [
				{
					label: 'Motorista/Colaboradores',
					action: this.navigate.bind(this, '/motorista'),
				},
				{
					label: 'Localidades',
					action: this.navigate.bind(this, '/localidades'),
				},
				{
					label: 'Formas de pagamento',
					action: this.navigate.bind(this, '/formas-de-pagamento'),
				},
				{ label: 'Pedágio', action: this.navigate.bind(this, '/pedagios') },
				{
					label: 'Tarifas',
					action: this.navigate.bind(this, '/tarifas'),
				},
				{
					label: 'Linhas',
					action: this.navigate.bind(this, '/linhas'),
				},
				{ label: 'Seções', action: this.navigate.bind(this, '/secoes') },
				{
					label: 'Validadores',
					action: this.navigate.bind(this, '/validadores'),
				},
				{
					label: 'Roleta',
					action: this.navigate.bind(this, '/roletas'),
				},
				{ label: 'Frota', action: this.navigate.bind(this, '/frota') },
			],
		},
		{
			label: 'Operacional',
			shortLabel: 'Operacional',
			icon: 'po-icon po-icon-steering-wheel',
			subItems: [],
		},
		{
			label: 'Financeiro',
			shortLabel: 'Financeiro',
			icon: 'po-icon po-icon-finance',
			subItems: [],
		},
	];

	/*******************************************************************************
	 * @name navigate
	 * @description funÃ§Ã£o chamada para navegar pra tela escolhida no menu
	 * @param newRoute: string - nome da rota qual serÃ¡ navigada
	 * @author   ServiÃ§os | Breno Curtolo
	 * @since    2024
	 * @version  v1
	 *******************************************************************************/
	navigate(newRoute: string) {
		this._router.navigate([newRoute]);
	}
}
