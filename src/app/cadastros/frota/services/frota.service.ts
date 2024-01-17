import { Injectable } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";

@Injectable({
    providedIn:'root'
})
export class FrotaService {
    constructor() { }
    getColumns(): Array<PoTableColumn> {
        return [
            {
                property: 'Prefixo',
                type: 'label',
                labels: [
                    { value: '43031', label: '43031'},
                    { value: '12345', label: '12345'},
                    { value: '67890', label: '67890'},
                    { value: '09876', label: '09876'},
                    { value: '54321', label: '54321'},
                    { value: '01020', label: '01020'},
                    { value: '03040', label: '03040'},
                    { value: '05060', label: '05060'}
                ]
            },

            {
                property: 'Placa',
                type: 'label',
                labels: [
                    {value: 'ABC1234', label: 'ABC1234'},
                    {value: 'DEF5678', label: 'DEF5678'},
                    {value: 'GHI2143', label: 'GHI2143'},
                    {value: 'THI7622', label: 'THI7622'},
                    {value: 'QWE0099', label: 'QWE0099'},
                    {value: 'LLK8612', label: 'LLK8612'},
                    {value: 'LMM2209', label: 'LMM2209'},
                    {value: 'JIU2024', label: 'JIU2024'}
                ]
            },

            {
                property: 'Tipo',
                type: 'label',
                labels: [
                    {value: 'MICRO', label: 'MICRO'},
                    {value: 'MICRO', label: 'MICRO'},
                    {value: 'MINI', label: 'MINI'},
                    {value: 'MINI', label: 'MINI'},
                    {value: 'MINI', label: 'MINI'},
                    {value: 'BÁSICO', label: 'BÁSICO'},
                    {value: 'ARTICULADO', label: 'ARTICULADO'},
                    {value: 'ARTICULADO', label: 'ARTICULADO'},
                ]
            },

            {
                property: 'Status',
                type: 'label',
                labels: [
                    {value: 'Ativo', color: 'color-11', label: 'Ativo'},
                    {value: 'Inativo', color: 'color-07',label: 'Inativo'},
                ]
            }
        ];
    }

    getItems() {
        return [
            {
                Prefixo: '43031',
                Placa: 'ABC1234',
                Tipo: 'MICRO',
                Status: 'Ativo',
            },

            {
                Prefixo: '12345',
                Placa: 'DEF5678',
                Tipo: 'ARTICULADO',
                Status: 'Inativo',
            },

            {
                Prefixo: '03040',
                Placa: 'LMM2209',
                Tipo: 'MICRO',
                Status: 'Inativo', 
            },
        ];
    }
}