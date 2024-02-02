import { Component } from '@angular/core';
import { PoDialogService, PoMenuItem, PoNotificationService, PoToolbarAction, PoToolbarProfile } from '@po-ui/ng-components';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
	constructor(
		private poDialog : PoDialogService,
		private router: Router,
		public appComponent: AppComponent,

	  ) {}

	public readonly logoTotvs: string = '/assets/icon-totvs.svg';
	public pageName: string = '';
	public readonly menus: Array<PoMenuItem> = [
    {
		label: 'Cadastros',
		shortLabel: 'Cadastros',
		icon: 'po-icon po-icon-clipboard',
		subItems: [
			{ label: 
				'Motorista/Colaboradores', action: this.navigate.bind(this, '/motorista'), },
			{ label: 
				'Localidades', action: this.navigate.bind(this, '/localidades'), },
		]
	}
  ];


	teste(cOpt : string = '1'){
		if(cOpt == '1') {
			this.poDialog.alert({
				title: 'Atenção',
				message: 'Teste ',
			});
		} else {
			this.poDialog.alert({
				title: 'Atenção',
				message: 'Teste 2 ',
			});
		}
	}

	/**
	 * Método responsavel pelo redirecionamento da rota conforme a ação selecionada
	 * @param newRoute string contendo a url que será redirecionada
	 */
	navigate(newRoute: string) {
		this.router.navigate([newRoute]);
	}
}
