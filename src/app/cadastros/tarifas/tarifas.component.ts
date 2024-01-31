import { Component } from '@angular/core';
import { PoBreadcrumb, PoPageAction } from '@po-ui/ng-components';

@Component({
  selector: 'app-tarifas',
  templateUrl: './tarifas.component.html',
  styleUrls: ['./tarifas.component.css'],
})
export class TarifasComponent {
  constructor() {}

  actions: Array<PoPageAction> = [
    {
      label: 'Incluir',
      action: () => {
        this.addTariff();
      },
    },
  ];

  public breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Fretamento Urbano', link: '/' }, { label: 'Tarifas' }],
  };

  addTariff() {}
}
