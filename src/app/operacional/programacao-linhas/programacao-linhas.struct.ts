import { PoTableColumn, PoTableDetail } from '@po-ui/ng-components';

/**
 * Definição da coluna de programação das linhas
 */
export class progLinhasService {
	getColumns(): Array<PoTableColumn> {
		// const details: PoTableDetail = {
		// 	columns: [
		// 		{ property: 'versaoAnterior', label: 'Versões anteriores' },
		// 		{ property: 'status' },
		// 		{ property: 'periodo', label: 'Período' },
		// 	],
		// 	typeHeader: 'top',
		// };
		return [
			// { property: 'details', label: 'Details', type: 'detail', detail: details },

			{ property: 'codProg', label: 'codProg', sortable: false, visible: false },
			{
				property: 'programacao',
				label: 'Programação',
				type: 'label',
				labels: [
					{ value: 'programacao-gerada', label: 'Programação gerada', textColor: '#0F5236', color: '#DEF7ED' },
					{ value: 'sem-programacao', label: 'Sem programação', textColor: '#72211D', color: '#F6E6E5' },
				],
			},
			{
				property: 'status',
			},
			{
				property: 'periodo',
				label: 'Período',
			},
			{
				property: 'prefixoLinha',
				label: 'Prefixo linha',
			},
			{
				property: 'codLinha',
				label: 'Código linha',
			},
			{
				property: 'descLinha',
				label: 'Descrição linha',
			},
		];
	}

	getItems(): Array<any> {
		return [
			{
				codProg: '000002',
				programacao: 'programacao-gerada',
				status: 'Ativa',
				periodo: '01/01/2024 - 31/12/2024',
				prefixoLinha: '1 0123',
				codLinha: '12345',
				descLinha: '145 J - PQ. DOM PEDRO II',
				details: [{ versaoAnterior: '000001', status: 'Inativa', periodo: '01/01/2023 - 31/12/2023' }],
			},
			{
				codProg: '000003',
				programacao: 'sem-programacao',
				status: 'Inativa',
				periodo: '01/01/2024 - 31/12/2024',
				prefixoLinha: '1 0124',
				codLinha: '4245',
				descLinha: '106 A - TERM. GRAJAÚ',
			},
			{
				codProg: '000004',
				programacao: 'programacao-gerada',
				status: 'Ativa',
				periodo: '01/01/2024 - 31/12/2024',
				prefixoLinha: '1 0665',
				codLinha: '9428',
				descLinha: '224 E - EST. VL/NATAL',
			},
			{
				codProg: '000006',
				programacao: 'programacao-gerada',
				status: 'Ativa',
				periodo: '01/01/2024 - 31/12/2024',
				prefixoLinha: '1 1133',
				codLinha: '32094',
				descLinha: '1003 - CIRCULAR SANTANA',
				details: [{ versaoAnterior: '000005', status: 'Inativa', periodo: '01/01/2023 - 31/12/2023' }],
			},
			{
				codProg: '000007',
				programacao: 'programacao-gerada',
				status: 'Ativa',
				periodo: '01/01/2024 - 31/12/2024',
				prefixoLinha: '1 0987',
				codLinha: '16327',
				descLinha: '188 - GRAJAÚ',
			},
			{
				codProg: '000009',
				programacao: 'programacao-gerada',
				status: 'Inativa',
				periodo: '01/01/2024 - 31/12/2024',
				prefixoLinha: '1 1542',
				codLinha: '40290',
				descLinha: '344 A - TERM. JABAQUARA',
				details: [{ versaoAnterior: '000008', status: 'Inativa', periodo: '01/01/2023 - 31/12/2023' }],
			},
			{
				codProg: '000011',
				programacao: 'programacao-gerada',
				status: 'Ativa',
				periodo: '01/01/2024 - 31/12/2024',
				prefixoLinha: '1 1125',
				codLinha: '42990',
				descLinha: '107 - CIRCULAR B. FUNDA',
				details: [{ versaoAnterior: '000010', status: 'Inativa', periodo: '01/01/2023 - 31/12/2023' }],
			},
			{
				codProg: '000012',
				programacao: 'programacao-gerada',
				status: 'Ativa',
				periodo: '01/01/2024 - 31/12/2024',
				prefixoLinha: '1 0310',
				codLinha: '9983',
				descLinha: '902 A - TERM. VARGINHA',
			},
		];
	}
}

/**
 * Dados dos itens das programações da linha
 */
export class ProgLinhaModel {
	outrasAcoes: Array<string>;
	pk: string = '';
	codProg: string = '';
	programacao: string = '';
	status: string = '';
	periodo: string = '';
	prefixoLinha: string = '';
	codLinha: string = '';
	descLinha: string = '';
	details: Array<any>;
}
