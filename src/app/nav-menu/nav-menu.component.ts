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
		private router: Router,
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
			],
		},
	];


	/**
	 * Método responsavel pelo redirecionamento da rota conforme a ação selecionada
	 * @param newRoute string contendo a url que será redirecionada
	 */
	navigate(newRoute: string) {
		this.router.navigate([newRoute]);
	}
}
