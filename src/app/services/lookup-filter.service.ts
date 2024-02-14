import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoLookupFilter, PoLookupFilteredItemsParams } from '@po-ui/ng-components';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';

export class LookupStruct {
	codigo: string;
	descricao: string;
  tipolocalidade:string;
}

@Injectable()
export class LocalidadeLookupService implements PoLookupFilter {
  constructor(
            private httpClient:HttpClient,
            private apiService: ApiService
            ){}

            getFilteredItems(filteredParams: PoLookupFilteredItemsParams): Observable<any> {
              const { filterParams, advancedFilters, ...restFilteredItemsParams } = filteredParams;
              let params = { ...restFilteredItemsParams, ...filterParams, ...advancedFilters };
              const endpoint = 'fwmodel/GTPA001';
              params.STARTINDEX = ((params.page * params.pageSize) - 9);
              params.FIELDVIRTUAL = true;
              params.FIELDEMPTY = true;
          
              if (params.filter != '') {
                params.filter = "GI1_COD LIKE '%" + params.filter + "%' OR GI1_DESCRI LIKE '%" + params.filter + "%'";
              }
          
              return this.apiService.get(endpoint, params).pipe(
                map((response: any) => {
                  let items: LookupStruct[] = [];
                  let hasNext = true;
                  response.resources.forEach(resource => {
                    
                    let itemReturn: LookupStruct = new LookupStruct();
          
                    // Mapeamento dos valores para descrições
                    const tipoLocalidadeMap = {
                      '1': 'PONTO DE RECOLHE',
                      '2': 'GARAGEM'
                    };
                    
                    // Assegura que o valor existe antes de acessá-lo
                    let field = resource.models[0].fields.find(field => field.id == 'GI1_TPLOC');
                    let codigoTipoLocalidade = field ? field.value : '';

                    // Convertendo o valor para a descrição correspondente
                    let descricaoTipoLocalidade = '';
                    if (codigoTipoLocalidade && codigoTipoLocalidade.includes('1') && codigoTipoLocalidade.includes('2')) {
                        descricaoTipoLocalidade = codigoTipoLocalidade.split('').map(codigo => tipoLocalidadeMap[codigo]).join(' - ');
                    } else if (codigoTipoLocalidade) {
                        descricaoTipoLocalidade = tipoLocalidadeMap[codigoTipoLocalidade] || '';
                    }
          
                    itemReturn.codigo = resource.models[0].fields.find(field => field.id == 'GI1_COD')?.value;
                    itemReturn.descricao = resource.models[0].fields.find(field => field.id == 'GI1_DSMUNI')?.value;
                    itemReturn.tipolocalidade = descricaoTipoLocalidade;
          
                    items.push(itemReturn);
          
                    if ((params.page * params.pageSize) >= response.total) {
                      hasNext = false;
                    }
                  });
          
                  return { items, hasNext };
                })
              );
            }


    getObjectByValue(value: any): Observable<any> {
      const endpoint = 'fwmodel/GTPA001'

      let filial = 'D MG 01 '
      //let protheusParams: string = ''
      let params = new HttpParams();
      // Exemplo para setar params
      // params = params.set('FIELDVIRTUAL', this.virtualField);
      let grupos: string = '';
  
      value.forEach(grupo => {
  
        if (grupos == '')
          grupos = "'" + grupo + "'";
        else
          grupos += ',' + "'" + grupo + "'"
  
      });
  
      //protheusParams = "?FILTER=";
      // return this.httpClient.get(`${url}/${protheusParams}`).pipe(
      return this.apiService.get(endpoint, params).pipe(
        map((response: any) => {
  
          const items: LookupStruct[] = [];
  
          response.resources.forEach(resource => {
  
            items.push({ 
                         codigo: resource.models[0].fields.find(field => field.id == 'GI1_COD').value, 
                         descricao: resource.models[0].fields.find(field => field.id == 'GI1_DSMUNI').value,
                         tipolocalidade: resource.models[0].fields.find(field => field.id == 'GI1_TPLOC').value
                        })
  
          })
  
          return items
  
        }))
  
    }


}
