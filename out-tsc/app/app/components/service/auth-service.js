import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
let AuthService = class AuthService {
    constructor(http) {
        this.http = http;
        this.baseUrl = 'http://localhost:8080/api'; // Замените на ваш URL
        this.httpOptions = {
            headers: new HttpHeaders({
                'accept': 'application/json',
                'content-type': 'application/json'
            })
        };
    }
    register(user) {
        return this.http.post(`${this.baseUrl}/teachers/create`, {
            full_name: user.full_name,
            login: user.login,
            password: user.password
        }, this.httpOptions);
    }
    registerStudent(user) {
        return this.http.post(`${this.baseUrl}/students/create`, user, this.httpOptions);
    }
    getStudents() {
        return this.http.get(`${this.baseUrl}/students`);
    }
    getTeachers() {
        return this.http.get(`${this.baseUrl}/teachers`);
    }
    getLessons() {
        return this.http.get(`${this.baseUrl}/subjects`);
    }
    getGroups() {
        return this.http.get(`${this.baseUrl}/groups`);
    }
    createSchedule(lesson) {
        const schedule = {
            day_of_week: lesson.day_of_week,
            lesson_num: lesson.lesson_num,
            week_type: lesson.week_type,
            subject_id: lesson.subject_id,
            group_id: lesson.group_id,
            teacher_id: lesson.teacher_id
        };
        console.log(schedule);
        return this.http.post(`${this.baseUrl}/schedule/create`, schedule, this.httpOptions);
    }
    updateSchedule(id, lesson) {
        return this.http.put(`${this.baseUrl}/schedule/${id}`, lesson, this.httpOptions);
    }
    deleteSchedule(id) {
        return this.http.delete(`${this.baseUrl}/schedule/${id}`, this.httpOptions);
    }
    logIn(user) {
        const endpoint = user.role === 'teacher' ? '/teachers/login' : '/students/login';
        return this.http.post(`${this.baseUrl}${endpoint}`, user, this.httpOptions);
    }
    delete(login, role) {
        const endpoint = role === 'teacher' ? '/teachers' : '/students';
        return this.http.delete(`${this.baseUrl}${endpoint}/${login}`, this.httpOptions);
    }
    getUser(user) {
        const endpoint = user.role === 'student' ? '/students' : '/teachers';
        const role = user.role === 'student' ? 'student' : 'teacher';
        localStorage.setItem('role', role);
        return this.http.get(`${this.baseUrl}${endpoint}/${user.id}`);
    }
    update(user, newPassword) {
        const endpoint = user.role === 'teacher' ? '/teachers' : '/students';
        const url = `${this.baseUrl}${endpoint}/${user.login}`;
        const headers = {
            'Content-Type': 'application/json',
        };
        return this.http.put(url, { "password": newPassword }, { headers });
    }
};
AuthService = __decorate([
    Injectable({
        providedIn: 'root',
    })
], AuthService);
export { AuthService };
//# sourceMappingURL=auth-service.js.map