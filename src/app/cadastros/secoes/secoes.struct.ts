import { PoTableColumn } from '@po-ui/ng-components';

/**
 * Definição da coluna de seções
 */
export const ColumnsSecao: Array<PoTableColumn> = [
  { property: 'codTariff', label: 'cod', sortable: false, visible: false },
  { property: 'labelSecao', label: 'Seção' },
  {
    property: 'lines',
    label: 'Linhas',
  },
  {
    property: 'direction',
    label: 'Sentido',
  },
  {
    property: 'status',
    label: 'Status',
  },
  {
    property: 'otherActions',
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
export class SecoesModel {
  pk: string = '';
  codSecao: string = '';
  descSecao: string = '';
  labelSecao: string = '';
  linhas?: string = '';
  status?: string = '';
  direction?: string = '';
  otherActions?: Array<string>;
  index?: number;
}
