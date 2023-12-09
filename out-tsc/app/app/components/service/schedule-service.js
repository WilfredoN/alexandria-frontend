import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let ScheduleService = class ScheduleService {
    constructor(http) {
        this.http = http;
        this.apiUrl = 'http://localhost:8080/api/schedule/groups';
    }
    getSchedules(group_name) {
        if (group_name === '') {
            return this.http.get(`${this.apiUrl}/KI-410`);
        }
        return this.http.get(`${this.apiUrl}/${group_name}`);
    }
    getLessonById(id) {
        const lessonUrl = `http://localhost:8080/api/subjects/${id}`;
        return this.http.get(lessonUrl);
    }
    getTeacherById(id) {
        const teacherUrl = `http://localhost:8080/api/teachers/${id}`;
        return this.http.get(teacherUrl);
    }
    createLesson(subject_name) {
        const lessonUrl = `http://localhost:8080/api/subjects`;
        return this.http.post(`${lessonUrl}/create`, { subject_name });
    }
    updateSchedule(id, schedule) {
        const updateUrl = `http://localhost:8080/api/schedule/${id}`;
        return this.http.put(updateUrl, schedule);
    }
};
ScheduleService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ScheduleService);
export { ScheduleService };
//# sourceMappingURL=schedule-service.js.map