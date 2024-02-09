import { Injectable } from '@angular/core';
import { PoDynamicViewField } from '@po-ui/ng-components';

export interface RoletaForm {
    codigo: string;
    descricao: string;
}
@Injectable()
export class RoletaStruct {
    /**
     * Coluna para visualização dasRoletas
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
