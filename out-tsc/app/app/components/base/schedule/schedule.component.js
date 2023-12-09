import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { forkJoin } from "rxjs";
import { DialogChangeLesson } from "./dialog-change";
let ScheduleComponent = class ScheduleComponent {
    constructor(scheduleService, authService, dialog) {
        this.scheduleService = scheduleService;
        this.authService = authService;
        this.dialog = dialog;
        this.schedules = [];
        this.chosenGroup = '';
        this.lessonNames = [];
        this.teacherNames = [];
        this.groups = [];
        this.daysOfWeek = [
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница'
        ];
        this.lessonNumbers = [1, 2, 3, 4];
        this.lesson = {
            subject_id: 0,
            teacher_id: 0,
            lesson_number: 0,
            day_of_week: '',
            group_id: 0,
            week_type: 1
        };
        this.lessonNameInput = '';
        this.popUpVisibility = {
            day: '',
            num: 0
        };
        this.selectedSchedule = null;
        this.isConfirmReady = false;
        this.movingSchedule = null;
        this.currentDay = this.getCurrentDay();
        this.lesson.week_type = this.calculateWeekType();
    }
    ngOnInit() {
        this.getCreatorData();
        const storedUser = localStorage.getItem('user');
        this.user = JSON.parse(storedUser);
        this.isStudent = this.user.role === 'student';
        if (this.isStudent) {
            this.chosenGroup = this.user.group_name;
            this.lesson.week_type = this.calculateWeekType();
        }
        this.fetchSchedules();
    }
    fetchSchedules() {
        this.scheduleService.getSchedules(this.chosenGroup).subscribe(schedules => {
            this.schedules = schedules;
            console.log(this.schedules);
            const lessonRequests = schedules.map(schedule => this.scheduleService.getLessonById(schedule.subject_id));
            const teacherRequests = schedules.map(schedule => this.scheduleService.getTeacherById(schedule.teacher_id));
            forkJoin(lessonRequests).subscribe(lessonNames => {
                lessonNames.forEach((lesson, index) => {
                    this.schedules[index].lessonName = lesson?.subject_name || '';
                    console.log(this.schedules[index].lessonName);
                });
            });
            forkJoin(teacherRequests).subscribe(teacherNames => {
                teacherNames.forEach((teacher, index) => {
                    this.schedules[index].teacherName = teacher?.full_name || '';
                    console.log(this.schedules[index].teacherName);
                });
            });
        });
    }
    getSchedulesForDayAndLesson(day, lessonNumber) {
        return this.schedules.filter(schedule => schedule.day_of_week === day && schedule.lesson_num === lessonNumber && schedule.week_type === this.lesson.week_type);
    }
    isCurrentDay(day) {
        return day === this.currentDay;
    }
    getCurrentDay() {
        const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const currentDate = new Date();
        const currentDayIndex = currentDate.getDay();
        return daysOfWeek[currentDayIndex];
    }
    createSchedule() {
        if (this.lesson.subject_id === null ||
            this.lesson.teacher_id === null ||
            this.lesson.group_id === null ||
            this.lesson.lesson_number === null ||
            this.lesson.day_of_week === '') {
            alert('Заполните все поля!');
            return;
        }
        // Проверка наличия предмета в позиции
        const existingSchedule = this.schedules.find(schedule => schedule.subject_id &&
            schedule.teacher_id &&
            schedule.group_id &&
            schedule.lesson_num === this.lesson.lesson_number &&
            schedule.day_of_week === this.lesson.day_of_week &&
            schedule.week_type === this.lesson.week_type);
        console.log(existingSchedule);
        if (existingSchedule) {
            const dialogRef = this.dialog.open(DialogChangeLesson, {
                width: '300px',
                data: { message: 'Предмет уже добавлен в эту позицию. Хотите заменить его?' }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === 'confirm') {
                    // Заменить предмет
                    this.authService.updateSchedule(existingSchedule.id, this.lesson).subscribe((response) => {
                        console.log(response);
                        alert('Предмет успешно заменен в расписании!');
                    });
                }
                else {
                    // Отменить операцию
                    alert('Операция отменена');
                }
            });
        }
        else {
            console.log(this.lesson);
            this.authService.createSchedule(this.lesson).subscribe((response) => {
                console.log(response);
                alert('Расписание успешно создано!');
            });
        }
    }
    getCreatorData() {
        this.authService.getTeachers().subscribe((teachers) => {
            this.teacherNames = teachers.map((teacher) => {
                return { id: teacher.id, full_name: teacher.full_name };
            });
            console.log('Teachers ', this.teacherNames);
        });
        this.authService.getLessons().subscribe((lessons) => {
            this.lessonNames = lessons.map((lesson) => {
                return { id: lesson.id, subject_name: lesson.subject_name };
            });
            console.log('Lessons ', this.lessonNames);
        });
        this.authService.getGroups().subscribe({
            next: (groups) => {
                this.groups = groups.map((group) => {
                    return { id: group.id, name: group.name };
                });
                console.log('Groups ', this.groups);
                this.chosenGroup = this.groups[0]?.name ?? '';
            },
            error: (err) => {
                console.log(err);
            }
        });
    }
    calculateWeekType() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const startDate = new Date(currentYear, 8, 1);
        const diff = currentDate.getTime() - startDate.getTime();
        const weeksPassed = Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
        console.log("Прошло недель: ", weeksPassed);
        return weeksPassed % 2 === 0 ? 2 : 1;
    }
    chooseWeekType() {
        if (this.lesson.week_type == 1) {
            this.lesson.week_type = 2;
        }
        else {
            this.lesson.week_type = 1;
        }
    }
    deleteStageSet(id) {
        if (this.selectedSchedule === id) {
            this.authService.deleteSchedule(id).subscribe({
                next: (response) => {
                    console.log(response);
                    // alert('Предмет успешно удален из расписания!');
                    this.fetchSchedules();
                    this.togglePopUp(0, '');
                },
                error: (err) => {
                    console.log(err);
                }
            });
        }
        else {
            this.selectedSchedule = id;
            return;
        }
    }
    togglePopUp(num, day) {
        if (this.popUpVisibility.num === num && this.popUpVisibility?.day === day) {
            this.popUpVisibility = {
                day: '',
                num: 0
            };
        }
        else {
            this.popUpVisibility = {
                day: day,
                num: num
            };
        }
    }
    toggleAddition() {
        this.isConfirmReady = !this.isConfirmReady;
    }
    createLesson() {
        if (this.lessonNameInput === '') {
            alert('Введите название предмета!');
            return;
        }
        const existingLesson = this.lessonNames.find(lesson => lesson.subject_name === this.lessonNameInput);
        if (!existingLesson) {
            alert('Такого предмета не существует!');
            return;
        }
        const schedule = {
            subject_id: existingLesson?.id,
            teacher_id: this.user.id,
            lesson_num: this.popUpVisibility.num,
            day_of_week: this.popUpVisibility.day,
            group_id: 1,
            week_type: this.lesson.week_type
        };
        this.authService.createSchedule(schedule).subscribe({
            next: (response) => {
                console.log(response);
                // alert('Предмет успешно добавлен в расписание!');
                this.toggleAddition();
                this.fetchSchedules();
                this.lessonNameInput = '';
            },
            error: (err) => {
                console.log(err);
            }
        });
    }
    setMovingSchedule(schedule) {
        this.movingSchedule = schedule;
    }
    insertSchedule(lesson_num, day) {
        if (this.movingSchedule) {
            const newSchedule = {
                subject_id: this.movingSchedule.subject_id,
                teacher_id: this.movingSchedule.teacher_id,
                lesson_num: lesson_num,
                day_of_week: day,
                group_id: 1,
                week_type: this.lesson.week_type
            };
            console.log(newSchedule);
            this.authService.updateSchedule(this.movingSchedule.id, newSchedule).subscribe({
                next: (response) => {
                    console.log(response);
                    this.movingSchedule = null;
                    this.fetchSchedules(); // Обновите данные о расписании после вставки
                    this.togglePopUp(0, ''); // Скрыть pop-up после вставки
                },
                error: (error) => {
                    console.error(error);
                }
            });
        }
    }
};
ScheduleComponent = __decorate([
    Component({
        selector: 'app-schedule',
        templateUrl: './schedule.component.html',
        styleUrls: ['./schedule.component.css']
    })
], ScheduleComponent);
export { ScheduleComponent };
//# sourceMappingURL=schedule.component.js.map