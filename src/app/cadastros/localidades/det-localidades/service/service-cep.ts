import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PoNotificationService } from '@po-ui/ng-components';

@Injectable({
	providedIn: 'root'
})
export class CorreiosService {
	private apiUrl = 'https://viacep.com.br/ws/';

	constructor(
		private http: HttpClient,
		private poNotification: PoNotificationService,
	) { }

	validarCEP(cep: string): Observable<any> {
		const url = `${this.apiUrl}${cep}/json`;

		return this.http.get(url).pipe(
			catchError(this.handleError)
		);
	};

	private handleError(error: HttpErrorResponse): Observable<never> {
		if (error.error instanceof ErrorEvent) {
			this.poNotification.error("'Erro: " + error.error.message + "");
		} else {

			this.poNotification.error(`Código de status: ${error.status}, Erro: ${error.error}`);
		}

		return throwError(() => {
			return new Error('Ocorreu um erro. Por favor, tente novamente mais tarde.');
		});
	};
}
