import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from './group.model';
import { ApiService } from '../../service/api-service';

@Injectable({
	providedIn: 'root',
})
export class GroupService {
	constructor(private http: HttpClient) {}
	private baseUrl = ApiService.API_URL + '/groups';

	getGroups(): Observable<Group[]> {
		return this.http.get<Group[]>(`${this.baseUrl}`);
	}
}
