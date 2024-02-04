import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { switchMap } from "rxjs";
import { DialogChangePasswordComponent } from "./dialog-change-password";
import { ConfirmDialogComponent } from './confirm-dialog.component';
let ProfileComponent = class ProfileComponent {
    constructor(router, groupService, dialog, authService, snackBar, scheduleService) {
        this.router = router;
        this.groupService = groupService;
        this.dialog = dialog;
        this.authService = authService;
        this.snackBar = snackBar;
        this.scheduleService = scheduleService;
        this.groups = [];
        this.student = {
            full_name: '',
            login: '',
            group_name: '',
            password: ''
        };
        this.lesson = {
            id: 0,
            subject_name: ''
        };
        this.isChecked = false;
    }
    ngOnInit() {
        this.initializeUser();
        this.getUserData();
    }
    initializeUser() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            this.user = JSON.parse(storedUser);
            this.isStudent = this.user.role === 'student';
        }
        else {
            console.error('Пользователь не найден');
            alert('Пользователь не найден');
            this.router.navigate(['/log-in']).then(() => console.log('Переход на страницу входа'));
        }
        if (!this.isStudent) {
            this.fetchGroups();
        }
    }
    fetchGroups() {
        this.groupService.getGroups().subscribe({
            next: (response) => {
                this.groups = response;
                console.log('Список групп:', this.groups);
            },
            error: (error) => {
                console.error('Ошибка при получении списка групп', error);
            }
        });
    }
    getUserData() {
        if (this.user) {
            this.authService.getUser(this.user).subscribe((userDTO) => {
                this.userDTO = userDTO;
                this.userDTO.role = localStorage.getItem('role');
                // Обновляем данные пользователя в localStorage
                localStorage.setItem('user', JSON.stringify(userDTO));
                localStorage.setItem('role', this.userDTO.role);
                this.user = JSON.parse(localStorage.getItem('user') ?? '');
            });
        }
        console.log(this.user);
    }
    openChangePasswordDialog() {
        const dialogRef = this.dialog.open(DialogChangePasswordComponent, {
            data: { user: this.user, oldPassword: '', newPassword: '', newPassword_confirm: '' },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.handlePasswordUpdate(result.user.newPassword);
            }
        });
    }
    handlePasswordUpdate(newPassword) {
        if (this.user) {
            this.user.password = newPassword;
            localStorage.setItem('user', JSON.stringify(this.user));
        }
    }
    adminAccount() {
        if (!this.isChecked) {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                width: '250px',
                data: { message: 'Вы точно хотите перейти на админа?' }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.switchToAdmin();
                }
                else {
                    this.resetCheckbox();
                }
            });
        }
    }
    switchToAdmin() {
    }
    resetCheckbox() {
        this.isChecked = false;
    }
    deleteAccount() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '250px',
            data: { message: 'Вы точно хотите удалить свой аккаунт?' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.confirmDeleteAccount();
            }
        });
    }
    confirmDeleteAccount() {
        if (this.user) {
            this.authService.delete(this.user.login, this.user.role).subscribe({
                next: (response) => {
                    console.log(response);
                    localStorage.removeItem('user');
                    console.log(localStorage.getItem('user') === null ? 'Account deleted' : 'Account not deleted');
                    this.router.navigate(['/log-in']).then(() => console.log('Переход на страницу входа'));
                },
                error: (error) => {
                    console.error('Ошибка при удалении аккаунта', error);
                }
            });
        }
    }
    createStudent() {
        if (!this.student.full_name || !this.student.group_name) {
            console.error('Не заполнены обязательные поля');
            this.snackBar.open('Не заполнены обязательные поля', 'Закрыть', {
                duration: 3000,
            });
            return;
        }
        const fullName = this.student.full_name;
        const group = this.student.group_name;
        const latinizedFullName = this.latinizeFullName(fullName.toLowerCase());
        this.student.login = `${latinizedFullName.split(' ').join('_').toLowerCase().slice(0, 4)}_${group.toLowerCase()}${group.slice(0, 2)}`;
        this.student.password = `${latinizedFullName.split(' ').slice(0, 2).join('_').toLowerCase()}#${group.toLowerCase()}`;
        console.log(this.student);
        this.authService.registerStudent(this.student).pipe(switchMap(() => this.authService.getStudents())).subscribe({
            next: (students) => {
                console.log('Ученик создан');
                this.studentList = students;
                console.log('Список студентов:', this.studentList);
            },
            error: (error) => {
                console.error('Ошибка при создании ученика', error);
            }
        });
    }
    latinizeFullName(fullName) {
        const parts = fullName.split(' ');
        const latinizedParts = parts.map(part => this.latinize(part));
        return latinizedParts.join(' ');
    }
    latinize(str) {
        const map = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
            'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
            'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
            'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': 'y', 'э': 'e', 'ю': 'yu',
            'я': 'ya',
        };
        return str.replace(/[а-яА-Я]/g, (match) => {
            const key = match.toLowerCase();
            return map[key] || match;
        });
    }
    saveGroups() {
        this.groupService.assignGroupsToTeacher(this.userDTO.id, this.groups.filter(group => group.selected).map(group => group.id)).subscribe({
            next: (response) => {
                console.log(response);
            },
            error: (error) => {
                console.error('Ошибка при сохранении групп', error);
                console.log('Список групп:', this.groups.filter(group => group.selected).map(group => group.id));
            }
        });
    }
    createLesson() {
        this.scheduleService.createLesson(this.lesson.subject_name).subscribe({
            next: (response) => {
                this.snackBar.open('Предмет создан', 'Закрыть', {
                    duration: 2000,
                });
                console.log(response);
            },
            error: (error) => {
                console.error('Ошибка при создании предмета', error);
            }
        });
    }
};
ProfileComponent = __decorate([
    Component({
        selector: 'app-profile',
        templateUrl: './profile.component.html',
        styleUrls: ['./profile.component.css'],
    })
], ProfileComponent);
export { ProfileComponent };
//# sourceMappingURL=profile.component.js.map