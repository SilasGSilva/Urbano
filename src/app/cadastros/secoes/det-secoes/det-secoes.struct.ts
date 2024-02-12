import { Injectable } from '@angular/core';
import { PoDynamicViewField, PoTableColumn } from '@po-ui/ng-components';

export interface SecaoForm {
	codigo: string;
	descricao: string;
	origem: string;
	destino: string;
	sentido: string;
	associarLinhas: string;
	status: string;
}
