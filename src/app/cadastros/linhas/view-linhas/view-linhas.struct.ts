import { PoDynamicViewField, PoTableColumn } from '@po-ui/ng-components';

/**
 * Coluna para visualização de linha
 */
export const ColunasDadosViewLinhas: Array<PoDynamicViewField> = [
    {
        property: 'prefixo',
        divider: 'Dados da linha',
        gridColumns: 2,
        order: 1,
        label: 'Prefixo linha'
    },
    {
        property: 'codLinha',
        label: 'Código da linha',
        gridColumns: 2,
        order: 1,
    },
    {
        property:'descLinha',
        label: 'Descrição',
        gridColumns: 5,
        order:1
    },
    {
        property:'origem',
        label: 'Origem',
        gridColumns: 4,
        order:1
    },
    {
        property:'destino',
        label: 'Destino',
        gridColumns: 4,
        order:1
    },
    {
        property:'orgao',
        label: 'Órgão Regulamentador',
        gridColumns: 4,
        order:1
    },
    {
        property:'tarifa',
        label: 'Tarifa',
        gridColumns: 4,
        order:1
    },
    {
        property:'pedagio',
        label: 'Pedágio',
        gridColumns: 4,
        order:1
    },
    {
        property:'tipoServico',
        label: 'Tipo de Serviço',
        gridColumns: 4,
        order:1
    },
    {
        property:'km',
        label: 'Km da linha',
        gridColumns: 4,
        order:1
    },
    {
        property:'categoria',
        label: 'Categoria',
        gridColumns: 4,
        order:1
    },
    {
        property:'statusLinha',
        label: 'Status da linha',
        gridColumns: 4,
        order:1
    },

]

export const secoesLinha: Array<PoTableColumn> = [
    {
        property:'ida',
        label: 'Ida', 
        sortable: false
    },
    {
        property: 'volta',
        label: 'Volta',
        sortable: false
    }
]

export class SecaoModel {
    push() {
        throw new Error('Method not implemented.');
    }
	pk?: string;
    ida: string = '';
    volta: string = '';
    index?: number;
}