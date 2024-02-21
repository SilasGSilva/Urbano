import { FormControl, FormGroup } from '@angular/forms';
import { VldFormStruct } from '../gtpgenerics.struct';
import { isNullOrUndefined } from './util.function';

/*******************************************************************************
 * @name ValidaNotificacao
 * @description Responsável por apresentar a notificação de falha do formControl
 * @param   form - Formulario para ser validado
 * @author  Serviços | Breno Gomes
 * @since   2024
 * @version	v1
 *******************************************************************************/
export function ValidaNotificacao(form: FormGroup) {
	const listNotification: Array<VldFormStruct> = ValidateForm(form);
	let messagem: string = '';
	listNotification.forEach(item => {
		let campos: string = '';
		item.field.forEach((fields: string) => {
			if (isNullOrUndefined(campos)) {
				campos = fields;
			} else {
				campos += `, ${fields}`;
			}
		});

		messagem = 'Campos não preenchidos: ' + campos + '. Verifique!';
	});
	return messagem;
}

/*******************************************************************************
 * @name ValidateForm
 * @description Responsável por realizar validação de Formulário
 * @param   form - Formulario para ser validado
 * @author  Serviços | Breno Gomes
 * @since   2024
 * @version	v1
 *******************************************************************************/
export function ValidateForm(form: FormGroup): Array<VldFormStruct> {
	const formControls = form.controls;
	const listReturn: Array<VldFormStruct> = [];

	for (const campo in formControls) {
		if (formControls.hasOwnProperty(campo) && formControls[campo].status === 'INVALID') {
			const iMessage: number = IndexMessageErro(formControls[campo] as FormControl);
			let tpError: string = '';

			if (iMessage === 0) {
				tpError = this.getFormError(formControls[campo] as FormControl);
			}

			const index: number = listReturn.findIndex(x => x.iMessage === iMessage && x.tpErro === tpError);

			if (index > -1) {
				listReturn[index].field.push(campo.toString());
			} else {
				const infValidated: VldFormStruct = {} as VldFormStruct;
				infValidated.iMessage = iMessage;
				infValidated.tpErro = tpError;
				infValidated.field = [campo.toString()];
				listReturn.push(infValidated);
			}
		}
	}
	return listReturn;
}

/*******************************************************************************
 * @name IndexMessageErro
 * @description Responsável por obter o indice do tipo de menságem que iremos apresentar
 * na notificação
 * @param   formControl - Form Control do campo
 * @author  Serviços | Breno Gomes
 * @since   2024
 * @version	v1
 *******************************************************************************/
function IndexMessageErro(formControl: FormControl): number {
	let iMessage: number = 0;

	if (formControl.errors?.hasOwnProperty('required')) {
		iMessage = 1;
	} else if (formControl.errors?.hasOwnProperty('maxlength')) {
		iMessage = 2;
	}

	return iMessage;
}
