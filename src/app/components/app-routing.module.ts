import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BaseComponent} from './base/base.component';
import {LogInComponent} from './login-panel/log-in/log-in.component';
import {SignUpComponent} from './login-panel/sign-up/sign-up.component';
import {TasksComponent} from './base/tasks/tasks.component';
import {AnnouncementsComponent} from './base/announcements/announcements.component';
import {ScheduleComponent} from './base/schedule/schedule.component';
import {TeachersComponent} from './base/teachers/teachers.component';
import {ProfileComponent} from './base/profile/profile.component';
import {StudentsComponent} from "./base/students/students.component";
import {NotFoundComponent} from "./base/not-found/not-found.component";

const routes: Routes = [
    {path: '', redirectTo: 'log-in', pathMatch: 'full'},
    {path: 'base', title: 'Главная', component: BaseComponent},
    {path: 'log-in', title: 'Авторизация', component: LogInComponent},
    {path: 'sign-up', title: 'Регистрация', component: SignUpComponent},
    {path: 'tasks', title: 'Задания', component: TasksComponent},
    {path: 'announcements', title: 'Объявления', component: AnnouncementsComponent},
    {path: 'schedule', title: 'Расписание', component: ScheduleComponent},
    {path: 'teachers', title: 'Преподаватели', component: TeachersComponent},
    {path: 'profile', title: 'Профиль', component: ProfileComponent},
    {path: 'students', title: 'Студенты', component: StudentsComponent},
    {
        path: '**', title: 'Страница не найдена', component: NotFoundComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
