import { Component, OnInit } from '@angular/core';
import { PoBreadcrumb, PoBreadcrumbItem, PoDialogService, PoPageAction, PoTableColumn } from '@po-ui/ng-components';
import { CollumnsMotoristas, Motoristas } from './motorista.struct';

@Component({
  selector: 'app-motorista',
  templateUrl: './motorista.component.html',
  styleUrls: ['./motorista.component.css']
})
export class MotoristaComponent implements OnInit {
	
	public breadcrumb: PoBreadcrumb = {
		items: [{ label: 'Fretamento Urbano', link: '/' }, { label: 'Motoristas/Colaboradores' }]
	};

	public readonly actions: Array<PoPageAction> = [
		{ label: 'Incluir', action: () => { this.teste() } },
	];
	
	columns: Array<PoTableColumn> = CollumnsMotoristas;
	listMotoristas: Array<Motoristas> = [];
 
	hideLoadingGrig: boolean = true;
	isDisableShowMore: boolean = true;
 
	breadCrumb: PoBreadcrumb = { items: [] };
	constructor(
		private poDialog : PoDialogService,

	  ) {}

	ngOnInit(): void {
	}
	teste(){
	
			this.poDialog.alert({
				title: 'Atenção',
				message: 'Teste ',
			});
		
	}
}