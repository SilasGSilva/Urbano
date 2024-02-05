import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, tap, throwError } from "rxjs";
import { FwmodelProtheusService } from "../fwmodel-protheus.service";

@Injectable({
    providedIn: 'root'
})
export class FwProtheusModel {
    private modelId: string = '';
    public total: number = 0;
    public count: number = 0;
    operation: number = 0;
    startindex: number = 0;
    models: Model[] = [];
    resources!: Resource[];
    private virtualField: boolean = false;
    private endpoint = '';

    constructor(
        private fwModelService: FwmodelProtheusService) { }
    
    public setEndPoint(value: string): void {
        this.endpoint = value;
    }

    public setModelId(value: string): void {
        this.modelId = value;
    }

    public setVirtualField(value: boolean): void {
        this.virtualField = value;
    } 
     
    public AddModel(id: string, modeltype: string): void {
        const newModel = new Model();
        newModel.id = id;
        newModel.modeltype = modeltype;
        if (this.models == undefined)
            this.models = [];
        
        this.models.push(newModel);
    }

    public get(params?: HttpParams) {

        if (params == undefined)
            params = new HttpParams();
        params = params.set('FIELDVIRTUAL', this.virtualField);
       
        return this.fwModelService.get(this.endpoint, params).pipe(
            map((data: FwProtheusModel) => {
                this.count = data.count;
                this.startindex = data.startindex;
                this.total = data.total;

                if (data.resources && Array.isArray(data.resources)) {

                    this.resources = []; 
                    data.resources.forEach((item : any) => {
                        const resource = new Resource();

                        const modelList: Model[] = [];

                        resource.id = item.id;
                        resource.pk = item.pk;
                        resource.operation = item.operation;

                        item.models.forEach((item : any) => {

                            const model = new Model();

                            model.id = item.id;
                            model.modeltype = item.modeltype;
                            model.operation = item.operation;
                            model.fields = item.fields;
                                
                            modelList.push(model);
                            
                        })

                        if (this.resources == undefined)
                            this.resources = [];

                         resource.models = modelList;

                        this.resources.push(resource);

                    });

                }

                if (data.models && Array.isArray(data.models)) {
                    const modelList: Model[] = [];

                    data.models.forEach((model : any) => {
                        const modelField = new Model();

                        modelField.id = model.id;
                        modelField.modeltype = model.modeltype;
                        modelField.operation = model.operation;
                        modelField.fields = model.fields;

                        if (model.models && Array.isArray(model.models)) {

                            model.models.forEach((subModel : any) => {

                                const modelGrid = new Model();

                                modelGrid.id = subModel.id;
                                modelGrid.modeltype = subModel.modeltype;

                                if (subModel.items != undefined) {
                                    subModel.items.forEach((item : any) => {

                                        const newItem = new Item();

                                        newItem.fields = item.fields;

                                        if (item.models != undefined) {

                                            item.models.forEach((model: Model) => {

                                                const modelGrid = new Model();

                                                modelGrid.id = model.id;
                                                modelGrid.modeltype= model.modeltype;

                                                model.items.forEach(item => {

                                                    let newItem = new Item();

                                                    newItem.fields = item.fields;

                                                    modelGrid.items.push(newItem);

                                                })
  
                                                newItem.models.push(modelGrid)

                                            })

                                        }

                                        modelGrid.items.push(newItem);

                                    })
                                }

                                modelField.models.push(modelGrid);
                            
                            })

                        }
                        
                        modelList.push(modelField);

                    });

                    this.models = modelList;
                }

                return data;
            })
        );
    }

    public post() {
        
        let body = {
            id: this.modelId,
            operation: this.operation,
            models: this.models,
            endpoint : this.endpoint
        };

        return this.fwModelService.post(body).pipe
            (tap(data => console.log('All: ', JSON.stringify(data))),
                catchError(this.handleError)
            );
    }

    public put() {

        let body = {
            id: this.modelId,
            operation: this.operation = 4,
            models: this.models,
            endpoint: this.endpoint
        };

        return this.fwModelService.put(body).pipe
            (tap(),
                catchError(this.handleError)
            );
    }

    private handleError(err: HttpErrorResponse): Observable<never> {
      
        return throwError(() => err);
    }

    public reset() {

        this.models.length = 0;  
        
        this.resources = [];

    }

    public getModel(modelId: string): Model {
        let model: Model | undefined;
        model = this.models.find(model => model.id === modelId) || new Model();
        if (this.resources != undefined) {
            for (const resource of this.resources) {
                const model = resource.models.find(model => model.id === modelId);
                if (model) {
                    return model;
                }
            }
            return model; // Modelo não encontrado
        } else {

            if (this.models.find(model => model.id === modelId) == undefined)
                this.AddModel(modelId, 'FIELDS');

            const model = this.models.find(model => model.id === modelId)|| new Model();

           
            return model;
            
        }
    }
}

export class Resource {
    id: string = '';
    operation: number = 0;
    pk: string = '';
    total: number = 0;
    models: Model[] = [];

    // Método para buscar um modelo dentro de um recurso pelo ID
    getModel(modelId: string): Model {
        let model: Model | undefined;
        model = this.models.find(model => model.id === modelId) || new Model();
        
        return model
       
    }

}

export class Model {
    id: string = '';
    operation: number = 0;
    modeltype: string = '';
    fields: Field[] = [];
    models: Model[] = [];
    items: Item[] = [];
    linePos: number = 0;

    getModel(modelId: string): Model {

        let modelSup = this;

        if (modelSup.modeltype == 'FIELDS' && this.models.find(model => model.id === modelId) == undefined)
            this.AddModel(modelId, 'GRID') ;

        if (modelSup.modeltype == 'GRID' && modelSup.items[this.linePos].models.find(model => model.id === modelId) == undefined)
            this.AddModel(modelId, 'GRID') ;

        let model: Model | undefined;

        if (modelSup.modeltype == 'FIELDS'){
            model = this.models.find(model => model.id === modelId) || new Model();
        } else
            model = this.items[this.linePos].models.find(model => model.id === modelId) || new Model();
        
            return model;
    }

    public AddModel(id: string, modeltype: string): void {
        const newModel = new Model();
        const modelSup = this;
        newModel.id = id;
        newModel.modeltype = modeltype;

        if (this.models == undefined)
            this.models = [];

        if (modelSup.modeltype == 'FIELDS') {

            this.models.push(newModel);

        }
        
        if (modelSup.modeltype == 'GRID') {

            this.items[this.linePos].models.push(newModel)
        }
        
    }

    public AddItem(): void {
        const newItem = new Item();
        
        newItem.id = this.items.length+1;
        this.items.push(newItem);

        this.linePos = this.items.length-1;

    }

    public delete(): void {

        this.items[this.linePos].deleted = 1;

    }


    public addField(id: string): void {
        const newField = new Field();
        newField.id = id;
        newField.value = '';
        newField.order = this.fields.length + 1;
        
        if (this.modeltype == 'GRID') {

                this.items[this.linePos].fields.push(newField)

        }else {

            this.fields.push(newField);

        }
            
     
    }

    getValue(fieldId: string ): string {
        const field = this.fields.find(field => field.id === fieldId);
        return field?.value != undefined ? field?.value : ''; // Retorna o valor do campo ou vazio se não encontrado
    }

    public setValue(fieldId: string, value: string): void {

        if (this.modeltype == 'FIELDS') {

            if (this.fields.find((field) => field.id === fieldId) == undefined)
                this.addField(fieldId);

            const field = this.fields.find((field) => field.id === fieldId);
            if (field != undefined){
                field.value = value;
            }
        }else {

            if (this.items[this.linePos].fields.find((field) => field.id === fieldId) == undefined)
                this.addField(fieldId);

            const field = this.items[this.linePos].fields.find((field) => field.id === fieldId);
            
            if (field != undefined){
                field.value = value;
            }

        }

    }

}

export class Item {
    fields: Field[] = [];
    models: Model[] = [];
    deleted: number = 0;
    id: number = 0;

    public addField(id: string): void {
        const newField = new Field();
        newField.id = id;
        newField.value = '';
        newField.order = this.fields.length + 1;
        this.fields.push(newField);
    }

    getModel(modelId: string): Model | undefined {
        return this.models.find(model => model.id === modelId);
    }

    getValue(fieldId: string): string | undefined {
        const field = this.fields.find(field => field.id === fieldId);
        return field?.value; // Retorna o valor do campo ou undefined se não encontrado
    }

    public setValue(fieldId: string, value: string): void {

        if (this.fields.find((field) => field.id === fieldId) == undefined)
            this.addField(fieldId);

        const field = this.fields.find((field) => field.id === fieldId);
        if (field != undefined){
            field.value = value;
        }
    }


}

export class Field {
    id: string = '';
    order: number = 0;
    value?: string;
}