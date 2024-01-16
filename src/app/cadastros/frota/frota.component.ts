import { Component, OnInit } from '@angular/core';
import { PoBreadcrumb, PoDialogService, PoPageAction, PoTableColumn } from '@po-ui/ng-components';
import { FrotaService } from './services/frota.service';

@Component({
    selector: 'app-frota',
    templateUrl: './frota.component.html',
    styleUrls: ['./frota.component.css']
})
export class FrotaComponent implements OnInit {
    columns: Array<PoTableColumn> = []
    items: Array<any> = []
    breadCrumb: PoBreadcrumb = { items: [] };

    public breadcrumb: PoBreadcrumb = {
	    items: [{ label: 'Fretamento Urbano', link: '/' }, { label: 'Frota' }]
	};

    public readonly actions: Array<PoPageAction> = [
        { label: 'Incluir', action: () => { this.back() } },
	];  

    constructor(
	    private poDialog : PoDialogService,
        private frotaServive : FrotaService,
	) {}

    ngOnInit(): void {
        this.columns = this.frotaServive.getColumns()
        this.items = this.frotaServive.getItems()
    }

    back() {
        this.poDialog.alert({
            title: 'Atenção',
            message: 'Incluir Função de inclusão ',
        });
    }
}
