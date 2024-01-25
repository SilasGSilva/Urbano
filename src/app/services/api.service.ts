import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
	private apiUrl = 'http://localhost:8023/rest/fwmodel/';

	constructor(private http: HttpClient) {}
	/**
	 * Metodo get http
	 * @param endpoint 
	 * @param params 
	 * @returns 
	 */
	get<T>(endpoint: string, params?: HttpParams): Observable<T> {
		const url = `${this.apiUrl}${endpoint}`;
		return this.http.get<T>(url, { params }).pipe(
		catchError(error => {
			return this.handleError(error);
		})
		);
	}
	/**
	 * Metodo post http
	 * @param endpoint 
	 * @param data 
	 * @returns 
	 */
	post<T>(endpoint: string, data: any): Observable<T> {
		const url = `${this.apiUrl}/${endpoint}`;
		return this.http.post<T>(url, data).pipe(
		catchError(error => {
			return this.handleError(error);
		})
		);
	}
	/**
	 * Metodo put HTTP
	 * @param endpoint 
	 * @param data 
	 * @returns 
	 */
	put<T>(endpoint: string, data: any): Observable<T> {
		const url = `${this.apiUrl}/${endpoint}`;
		return this.http.put<T>(url, data).pipe(
		catchError(error => {
			return this.handleError(error);
		})
		);
	}
	/**
	 * Método delete HTTP
	 * @param endpoint 
	 * @returns 
	 */
	delete<T>(endpoint: string): Observable<T> {
		const url = `${this.apiUrl}/${endpoint}`;
		return this.http.delete<T>(url).pipe(

		catchError(error => {
			return this.handleError(error);
		})
		);
	}

	private handleError(error: any): Observable<never> {
		console.error('An error occurred:', error);
		return throwError(() => new Error('Something went wrong. Please try again later.'));
	}
}