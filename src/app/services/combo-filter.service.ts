import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { PoComboFilter, PoComboOption } from '@po-ui/ng-components';
import { ApiService } from './api.service';
import { ActivatedRoute } from '@angular/router';
import { ComboFilial } from '../cadastros/motorista/motorista.struct';

/**
 * Filtros utilizando o FWMODEL
 */
export class PoComboStruct implements PoComboOption {
    label: string = '';
    value: string = '';
}
export class PoComboMotoristaStruct implements PoComboOption {
    label: string = '';
    value: string = '';
    matricula?: string = '';
    filial: string = '';
}
/**
 * RecursoComboService
 * Utilizado no combo de tipo de recurso
 */
@Injectable()
export class RecursoComboService implements PoComboFilter {
    private endpoint: string = 'fwmodel/GTPA010';

    constructor(private apiService: ApiService) {}

    getFilteredData(params: any): Observable<PoComboOption[]> {
        let httpParams = new HttpParams();
        let filter: string = '';

        if (params.value != '') {
            filter =
                "UPPER(GYK_CODIGO) LIKE UPPER('%" +
                params.value +
                "%') OR UPPER(GYK_DESCRI) LIKE UPPER('%" +
                params.value +
                "%') ";
        }
        httpParams = httpParams.append('FILTER', filter);

        return this.apiService.get(this.endpoint, httpParams).pipe(
            map((response: any) => {
                const items: PoComboStruct[] = [];

                response.resources.forEach((resource: any) => {
                    let itemReturn: PoComboStruct = new PoComboStruct();

                    itemReturn.value = resource.models[0].fields.find(
                        (field: any) => field.id == 'GYK_CODIGO'
                    ).value;
                    itemReturn.label = resource.models[0].fields.find(
                        (field: any) => field.id == 'GYK_DESCRI'
                    ).value;

                    items.push(itemReturn);
                });
                return items;
            })
        );
    }

    getObjectByValue(value: string | number): Observable<PoComboOption> {
        let params = new HttpParams();
        let filter: string = `GYK_CODIGO='${value}'`;

        params = params.append('FILTER', filter);

        return this.apiService.get(this.endpoint, params).pipe(
            map((response: any) => {
                let itemReturn = new PoComboStruct();

                itemReturn.value = response.resources[0].models[0].fields.find(
                    (field: any) => field.id == 'GYK_CODIGO'
                ).value;
                itemReturn.label = response.resources[0].models[0].fields.find(
                    (field: any) => field.id == 'GYK_DESCRI'
                ).value;

                return itemReturn;
            })
        );
    }
}

/**
 * MotoristaComboService
 * Utilizado no combo de Motorista
 */
@Injectable()
export class MotoristaComboService implements ComboFilial {
    private endpoint: string = 'fwmodel/GTPA008';

    constructor(private apiService: ApiService) {}
    [x: string]: any;
    selectedOption: any;
    filial?: string;
    label?: string;
    value: string | number;

    getFilteredData(params: any): Observable<PoComboMotoristaStruct[]> {
        let httpParams = new HttpParams();
        let filter: string = '';
        filter = "GYG_CODIGO != ''";
        if (params.value != '') {
            filter +=
                " AND UPPER(GYG_CODIGO) LIKE UPPER('%" +
                params.value +
                "%') OR UPPER(GYG_FUNCIO) LIKE UPPER('%" +
                params.value +
                "%') OR UPPER(GYG_NOME) LIKE UPPER('%" +
                params.value +
                "%')";
        }
        httpParams = httpParams.append('FILTER', filter);
        httpParams = httpParams.append('FIELDVIRTUAL', true);

        return this.apiService.get(this.endpoint, httpParams).pipe(
            map((response: any) => {
                const items: PoComboMotoristaStruct[] = [];

                response.resources.forEach((resource: any) => {
                    let itemReturn: PoComboMotoristaStruct =
                        new PoComboMotoristaStruct();
                    let codMatricula = resource.models[0].fields.find(
                        (field: any) => field.id == 'GYG_FUNCIO'
                    );

                    itemReturn.value = resource.models[0].fields.find(
                        (field: any) => field.id == 'GYG_CODIGO'
                    ).value;
                    itemReturn.label = resource.models[0].fields.find(
                        (field: any) => field.id == 'GYG_NOME'
                    ).value;
                    itemReturn.matricula =
                        codMatricula != undefined ? codMatricula.value : '';
                    itemReturn.filial = resource.models[0].fields.find(
                        (field: any) => field.id == 'GYG_FILIAL'
                    ).value;

                    items.push(itemReturn);
                });
                return items;
            })
        );
    }

    getObjectByValue(value: string | number): Observable<PoComboOption> {
        let params = new HttpParams();
        let filter: string = `GYG_CODIGO='${value}'`;

        params = params.append('FILTER', filter);

        return this.apiService.get(this.endpoint, params).pipe(
            map((response: any) => {
                let itemReturn = new PoComboMotoristaStruct();

                itemReturn.value = response.models[0].fields.find(
                    (field: any) => field.id == 'GYG_CODIGO'
                ).value;
                itemReturn.label = response.models[0].fields.find(
                    (field: any) => field.id == 'GYG_NOME'
                ).value;
                itemReturn.matricula = response.models[0].fields.find(
                    (field: any) => field.id == 'GYG_FUNCIO'
                ).value;

                return itemReturn;
            })
        );
    }
}
/**
 * FuncaoComboService
 * Utilizado no combo de funcao
 */
@Injectable()
export class FuncaoComboService implements PoComboFilter {
    private endpoint: string = 'fwmodel/GPEA030';

    constructor(
        private apiService: ApiService,
        private route: ActivatedRoute
    ) {}

    getFilteredData(params: any): Observable<PoComboOption[]> {
        let httpParams = new HttpParams();

        let filter: string = '';
        let filial = this.route.snapshot.params['filial'];
        if (filial != undefined) {
            filter = ` RJ_FILIAL='${atob(filial)}'`;
        }
        if (params.value != '') {
            if (filter != '') filter += 'AND ';

            filter +=
                "(UPPER(RJ_FUNCAO) LIKE UPPER('%" +
                params.value +
                "%') OR UPPER(RJ_DESC) LIKE UPPER('%" +
                params.value +
                "%'))";
        }

        httpParams = httpParams.append('FILTER', filter);
        httpParams = httpParams.append('FIELDEMPTY', true);
        httpParams = httpParams.append('FIELDVIRTUAL', true);

        return this.apiService.get(this.endpoint, httpParams).pipe(
            map((response: any) => {
                const items: PoComboStruct[] = [];

                response.resources.forEach((resource: any) => {
                    let itemReturn: PoComboStruct = new PoComboStruct();

                    itemReturn.value = resource.models[0].fields.find(
                        (field: any) => field.id == 'RJ_FUNCAO'
                    ).value;
                    itemReturn.label = resource.models[0].fields.find(
                        (field: any) => field.id == 'RJ_DESC'
                    ).value;

                    items.push(itemReturn);
                });

                return items;
            })
        );
    }

    getObjectByValue(value: string | number): Observable<PoComboOption> {
        let params = new HttpParams();
        let filial = this.route.snapshot.params['filial'];
        let filter: string = `RJ_FUNCAO='${value}'`;
        if (filial != undefined) {
            filter += ` AND RJ_FILIAL='${atob(filial)}'`;
        }
        params = params.append('FILTER', filter);

        return this.apiService.get(this.endpoint, params).pipe(
            map((response: any) => {
                let itemReturn = new PoComboStruct();

                itemReturn.value = response.resources[0].models[0].fields.find(
                    (field: any) => field.id == 'RJ_FUNCAO'
                ).value;
                itemReturn.label = response.resources[0].models[0].fields.find(
                    (field: any) => field.id == 'RJ_DESC'
                ).value;

                return itemReturn;
            })
        );
    }
}
