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
    ) { }

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
                {
                    label: 'Pedágio',
                    action: this.navigate.bind(this, '/pedagios'),
                },
                {
                    label: 'Tarifas',
                    action: this.navigate.bind(this, '/tarifas'),
                },
                { label: 'Linhas' },
                { label: 'Sessões' },
                {
                    label: 'Validadores',
                    action: this.navigate.bind(this, '/validadores'),
                },
                {
                    label: 'Roleta',
                    action: this.navigate.bind(this, '/roletas'),
                },
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

    /*******************************************************************************
     * @name navigate
     * @description função chamada para navegar pra tela escolhida no menu
     * @param newRoute: string - nome da rota qual será navigada
     * @author   Serviços | Breno Curtolo
     * @since    2024
     * @version  v1
     *******************************************************************************/
    navigate(newRoute: string) {
        this._router.navigate([newRoute]);
    }
}
