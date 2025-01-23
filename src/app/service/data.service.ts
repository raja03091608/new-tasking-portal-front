import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class DataService {
	// url = environment.BaseUrl;
	url = environment.API_URL;
	user: string | null;
	a: any;
	token: any;
	httpOptions: { headers: any; };

	constructor(private http: HttpClient) {

		this.user = localStorage.getItem('currentUser') || '{}';
		this.a = JSON.parse(this.user);
		// // console.logthis.a);
		this.token = this.a.token;
		// // console.logthis.token);
		this.httpOptions = {
			headers: new HttpHeaders({
				Authorization: `${this.token}`
			})
		}
	}

	postRequest(url: string, data: any) {
		return this.http.post(this.url + url, data, this.httpOptions);
	}

	postRequest1(url: string, data: any, data1:any) {
		return this.http.post(this.url + url, data,data1);
	}

	getRequest(url: string) {
		return this.http.get(this.url + url);
	}
	getRequestBy(url:any,data:any){

		this.httpOptions = {
			headers: new HttpHeaders({
				Authorization: `${this.token}`,
				email:data
			})
		}
		return this.http.get(this.url + url,data);
	}

	putRequest(url: string, data: any) {
		return this.http.put(this.url + url, data, this.httpOptions);
	}

	putRequest1(url: string) {
		return this.http.put(this.url + url, this.httpOptions);
	}

	deleteRequest(url: string) {
		return this.http.delete(this.url + url , this.httpOptions);
	}

}
