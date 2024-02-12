import { PoTableColumn } from '@po-ui/ng-components';

/**
 * Definição da coluna de pedágios
 */
export const ColumnsPedagio: Array<PoTableColumn> = [
  { property: 'codPedagio', label: 'cod', sortable: false, visible: false },
  { property: 'labelPedagio', label: 'Pedagio' },
  {
    property: 'valor',
    label: 'Valor',
  },
  {
    property: 'vigencia',
    label: 'Vigência',
  },
  {
    property: 'outrasAcoes',
    label: ' ',
    type: 'icon',
    sortable: false,
    icons: [
      {
        value: 'edit',
        icon: 'po-icon po-icon-edit',
        color: '#29b6c5',
        tooltip: 'Editar',
      },
      {
        value: 'view',
        icon: 'po-icon po-icon-eye',
        color: '#29b6c5',
        tooltip: 'Visualizar',
      },
    ],
  },
];

/**
 * Dados dos itens das tarifas
 */
export class PedagioModel {
  pk: string = '';
  codPedagio: string = '';
  descPedagio: string = '';
  labelPedagio: string = '';
  valor?: string = '';
  vigencia?: string = '';
  outrasAcoes?: Array<string>;
  index?: number;
}
