import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TeacherDTO} from "./teacher-dto";
import {ApiService} from "./api-service";

@Injectable({providedIn: 'root'})
export class TeacherService {
    constructor(private http: HttpClient) {
    }

    user: TeacherDTO;
    apiURL: string = ApiService.API_URL;

    getTeacherById(id: number): Observable<TeacherDTO> {
        return this.http.get<TeacherDTO>(this.apiURL + '/teachers/' + id);
    }

    getTeachersForGroup(groupName: string): Observable<TeacherDTO[]> {
        return this.http.get<TeacherDTO[]>(this.apiURL + '/teachers/groups/' + groupName, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

