import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Schedule} from "./schedule-dto";
import {ApiService} from "./api-service";

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {

    constructor(private http: HttpClient) {}
    private apiURL = ApiService.API_URL;

    getSchedules(group_name: string): Observable<Schedule[]> {
        if (group_name === '') {
            return this.http.get<Schedule[]>(`${this.apiURL}/schedule/groups/KI-410`);
        }
        return this.http.get<Schedule[]>(`${this.apiURL}/schedule/groups/${group_name}`);
    }

    getLessonById(id: number): Observable<{ id: number, subject_name: string }> {
        return this.http.get<{ id: number, subject_name: string}>(this.apiURL + '/subjects/' + id);
    }

    getTeacherById(id: number): Observable<{ id: number, full_name: string }> {
        return this.http.get<{ id: number, full_name: string }>(this.apiURL + '/teachers/' + id);
    }
    createLesson(subject_name: string): Observable<{ id: number, subject_name: string }> {
        return this.http.post<{ id: number, subject_name: string }>(`${this.apiURL}/subjects/create`, {subject_name});
    }
    updateSchedule(id: number, schedule: Schedule): Observable<Schedule> {
        return this.http.put<Schedule>(`${this.apiURL}/schedule/${id}`, schedule);
    }
}
