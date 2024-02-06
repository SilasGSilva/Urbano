import { PoTableColumn } from '@po-ui/ng-components';

/*******************************************************************************
 * @name PaymentMethodColumns
 * @description Definição das colunas para tabela de formas de pagamento
 * do tipo PoTable
 * @author   Serviços | Levy Santos
 * @since    2024
 * @version  v1
 *******************************************************************************/
export const PaymentMethodColumns: Array<PoTableColumn> = [
  { property: 'codPayment', label: 'Código', sortable: false, visible: false },
  {
    property: 'labelPayment',
    label: 'Forma de pagamento',
    sortable: true,
  },
  {
    property: 'otherActions',
    label: ' ',
    type: 'icon',
    sortable: false,
    icons: [
      {
        value: 'editar',
        icon: 'po-icon po-icon-edit',
        color: '#29b6c5',
        tooltip: 'Editar',
      },
    ],
  },
];

/*******************************************************************************
 * @name PaymentMethodModel
 * @description Modelo responsável pelos dados dos tipos de pagamentos como seus
 * atributos e métodos
 * @author   Serviços | Levy Santos
 * @since    2024
 * @version  v1
 *******************************************************************************/
export class PaymentMethodModel {
  id: string = '';
  codPayment: string = '';
  descPayment: string = '';
  labelPayment: string = '';
  otherActions?: Array<string>;
  index?: number;
}

export interface FormaPagForm {
  codigo: string;
  descricao: string;
}
