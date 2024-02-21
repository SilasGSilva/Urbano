import { PoRadioGroupOption } from "@po-ui/ng-components";

export const ListStatus: Array<PoRadioGroupOption> = [
	{ value: '1', label: 'Ativo' },
	{ value: '2', label: 'Inativo' },
];

export interface linhaForm {
	prefixo: string;
	codlinha:string;
	descricao:string;
	origem:string;
	destino:string;
	orgaoregulamentador:string;
	tarifa:string;
	pedagio:string;
	classificacaofiscal:string;
	kmdalinha:string;
	categoria:string;
	status:string

}