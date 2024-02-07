import { PoDynamicViewField } from "@po-ui/ng-components";

/**
 * Coluna para visualização de localidade
 */
export const ColunaDados: Array<PoDynamicViewField> = [

    { property: 'codigo', divider: "Informações de localidade", gridColumns: 5, order: 1, label: 'Código' },
    { property: 'descricao', label: 'Descrição da localidade', gridColumns: 5, order: 1 },

    { property: 'cep', label: 'CEP', gridColumns: 5, order: 2 },
    { property: 'endereco', label: 'Endereço', gridColumns: 3, order: 2 },

    { property: 'bairro', label: 'Bairro', gridColumns: 5, order: 3 },
    { property: 'codMunicipio', label: 'Código do município', gridColumns: 4, order: 3 },
    { property: 'municipio', label: 'Município', gridColumns: 3, order: 3 },

    { property: 'estado', label: 'UF', gridColumns: 5, order: 4 },
    { property: 'tipo', label: 'Tipo da localidade', gridColumns: 4, order: 4 },
    {
        property: 'status', gridColumns: 2, order: 4,
        label: 'Status', tag: true,
        options: [
            { value: '1', label: 'Ativo' },
            { value: '2', label: 'Inativo' },
        ],
    },
];