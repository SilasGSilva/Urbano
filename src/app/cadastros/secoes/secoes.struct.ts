import { PoTableColumn } from '@po-ui/ng-components';

/**
 * Definição da coluna de seções
 */
export const ColumnsSecao: Array<PoTableColumn> = [
  { property: 'codTariff', label: 'cod', sortable: false, visible: false },
  { property: 'labelSecao', label: 'Seção' },
  {
    property: 'linhas',
    label: 'Linhas',
  },
  {
    property: 'sentido',
    label: 'Sentido',
  },
  {
    property: 'status',
    label: 'Status',
    type: 'label',
    labels: [
      { value: 1, label: 'Ativa', textColor: '#0F5236', color: '#DEF7ED' },
      { value: 2, label: 'Inativa', textColor: '#72211D', color: '#F6E6E5' },
    ],
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
  linhas: Array<any> = [];
  status: number = 2;
  sentido: string = '';
  otherActions: Array<string>;
  index?: number;
}
