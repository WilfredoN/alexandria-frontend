import {Component, Injectable, OnInit} from '@angular/core';
import {TeacherDTO} from "../../service/teacher-dto";
import {TeacherService} from "../../service/teacher-service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-teachers',
    templateUrl: './teachers.component.html',
    styleUrls: ['./teachers.component.css']
})
@Injectable({providedIn: 'root'})
export class TeachersComponent implements OnInit {
    user: any;
    userDTO: any;
    teachers: TeacherDTO[] = [];

    constructor(private teacherService: TeacherService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        if (this.user === null) {
            this.router.navigate(['/login']).then(r => console.log(r + 'Переход на страницу логина'));
        }
        console.log(this.user);
        this.getTeachersForGroup();
        console.log('Пользователь', this.user);
    }

    getTeachersForGroup() {
        this.teacherService
            .getTeachersForGroup(this.user.group_name)
            .subscribe({
                next: (teachers) => {
                    this.teachers = teachers;
                    console.log('Список преподавателей получен', teachers);
                },
                error: (error) => {
                    console.error('Ошибка при получении списка преподавателей', error);
                },
            });
    }
}
