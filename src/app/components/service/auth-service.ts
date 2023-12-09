import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TeacherDTO} from "./teacher-dto";
import {loginDTO} from "./login-dto";
import {StudentDTO} from "./student-dto";
import {ApiService} from "./api-service";

export interface LessonDTO {
    id: number;
    lesson_name: string;
}

export interface GroupDTO {
    id: number;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    constructor(private http: HttpClient) {
    }
    private apiURL = ApiService.API_URL;

    httpOptions = {
        headers: new HttpHeaders({
            'accept': 'application/json',
            'content-type': 'application/json'
        })
    };

    register(user: any): Observable<Response> {
        return this.http.post<Response>(`${this.apiURL}/teachers/create`, {
            full_name: user.full_name,
            login: user.login,
            password: user.password
        }, this.httpOptions);
    }

    registerStudent(user: any): Observable<Response> {
        return this.http.post<Response>(`${this.apiURL}/students/create`, user, this.httpOptions);
    }

    getStudents(): Observable<StudentDTO[]> {
        return this.http.get<StudentDTO[]>(`${this.apiURL}/students`);
    }

    getTeachers(): Observable<TeacherDTO[]> {
        return this.http.get<TeacherDTO[]>(`${this.apiURL}/teachers`);
    }

    getLessons(): Observable<LessonDTO[]> {
        return this.http.get<LessonDTO[]>(`${this.apiURL}/subjects`);
    }

    getGroups(): Observable<GroupDTO[]> {
        return this.http.get<GroupDTO[]>(`${this.apiURL}/groups`);
    }

    createSchedule(lesson: any): Observable<any> {
        const schedule = {
            day_of_week: lesson.day_of_week,
            lesson_num: lesson.lesson_num,
            week_type: lesson.week_type,
            subject_id: lesson.subject_id,
            group_id: lesson.group_id,
            teacher_id: lesson.teacher_id
        }
        console.log(schedule);
        return this.http.post(`${this.apiURL}/schedule/create`, schedule, this.httpOptions);
    }

    updateSchedule(id: number, lesson: any) {
        return this.http.put(`${this.apiURL}/schedule/${id}`, lesson, this.httpOptions);
    }

    deleteSchedule(id: number) {
        return this.http.delete(`${this.apiURL}/schedule/${id}`, this.httpOptions);
    }

    logIn(user: loginDTO): Observable<loginDTO> {
        console.log(this.apiURL)
        const endpoint = user.role === 'teacher' ? '/teachers/login' : '/students/login';
        return this.http.post<loginDTO>(`${this.apiURL}${endpoint}`, user, this.httpOptions);
    }

    delete(login: string, role: string): Observable<any> {
        const endpoint = role === 'teacher' ? '/teachers' : '/students';
        return this.http.delete<StudentDTO | TeacherDTO>(`${this.apiURL}${endpoint}/${login}`, this.httpOptions);
    }

    getUser(user: any): Observable<any> {
        const endpoint = user.role === 'student' ? '/students' : '/teachers';
        const role = user.role === 'student' ? 'student' : 'teacher';
        localStorage.setItem('role', role);
        return this.http.get<StudentDTO | TeacherDTO>(`${this.apiURL}${endpoint}/${user.id}`);
    }

    update(user: loginDTO, newPassword: string) {
        const endpoint = user.role === 'teacher' ? '/teachers' : '/students';
        const url = `${this.apiURL}${endpoint}/${user.login}`;

        const headers = {
            'Content-Type': 'application/json',
        };

        return this.http.put<TeacherDTO | StudentDTO>(url, {"password": newPassword}, {headers});
    }


}
