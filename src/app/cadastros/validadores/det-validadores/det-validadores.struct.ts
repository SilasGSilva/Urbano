import { Injectable } from '@angular/core';
import { PoDynamicViewField } from '@po-ui/ng-components';

export interface ValidadorForm {
    codigo: string;
    descricao: string;
}
@Injectable()
export class ValidadorStruct {
    /**
     * Coluna para visualização dos validadores
     */
    ColumnsDynamicView: Array<PoDynamicViewField> = [
        {
            property: 'codigo',
            gridColumns: 4,
            order: 1,
            label: 'Código',
        },
        { property: 'descricao', label: 'Descrição', gridColumns: 8, order: 1 },
    ];
}
