/**
 * Definição das colunas para a tabela de Linhas
 */

import { PoSelectOption, PoTableColumn } from "@po-ui/ng-components";

export const CollumnsLinhas: Array<PoTableColumn> = [
    {property:'prefixolinha', label: 'Prefixo Linha', sortable: true},
    {property:'codigolinha', label: 'Código Linha', sortable: true},
    {property:'tarifa', label: 'Tarifa', sortable: true},
    {property:'origem', label: 'Origem', sortable: true},
    {property:'destino', label: 'Destino', sortable: true},
    {
        property:'status', type: 'label', label: 'Status',
        width: '8%',
        labels: [
            {
                value: '1', textColor:"#0F5236",color: '#DEF7ED', label: 'Ativo'
            },
            {
                value: '2', textColor:"#72211D",color: '#F6E6E5', label: 'Inativo'
            }
        ]
    }
]

/**
 * Definição da listagem de status
 */
export const ListStatus: Array<PoSelectOption> = [
	{ value: '1', label: 'Ativo' }, 
	{ value: '2', label: 'Inativo' }, 
]

export class LinhasModel {
    push() {
        throw new Error('Method not implemented.');
    }
	pk?: string;
	prefixolinha: string = '';
	codigolinha: string = '';
    tarifa: string = '';
    origem: string = '';
    destino: string = '';
    status: string = '';
	outrasAcoes?: Array<string>;
	index?: number;
}