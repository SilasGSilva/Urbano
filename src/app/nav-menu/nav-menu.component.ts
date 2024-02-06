import { Component } from '@angular/core';
import { PoDialogService, PoMenuItem } from '@po-ui/ng-components';
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
    public appComponent: AppComponent,
    private poDialog: PoDialogService,
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
        { label: 'Ped�gio' },
        {
          label: 'Tarifas',
          action: this.navigate.bind(this, '/tarifas'),
        },
        { label: 'Linhas' },
        { label: 'Se��es' },
        { label: 'Validadores' },
        { label: 'Roleta' },
        { label: 'Frota' },
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
  /**
   * M�todo respons�vel pelo redirecionamento da rota conforme a a��o selecionada
   * @param newRoute string contendo a url que ser� redirecionada
   */
  navigate(newRoute: string) {
    this._router.navigate([newRoute]);
  }
}
