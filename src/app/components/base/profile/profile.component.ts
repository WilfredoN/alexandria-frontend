import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {GroupService} from './group-service';
import {Group} from './group.model';
import {MatDialog} from "@angular/material/dialog";
import {AuthService, LessonDTO} from "../../service/auth-service";
import {loginDTO} from "../../service/login-dto";
import {switchMap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DialogChangePasswordComponent} from "./dialog-change-password";
import {ScheduleService} from "../../service/schedule-service";
import { ConfirmDialogComponent } from './confirm-dialog.component';

interface Student {
    full_name: string;
    login: string;
    group_name: string;
    password: string;
}

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
    isStudent: boolean;
    user: loginDTO;
    groups: Group[] = [];
    userDTO: any;
    student: Student = {
        full_name: '',
        login: '',
        group_name: '',
        password: ''
    };
    lesson: LessonDTO = {
        id: 0,
        lesson_name: ''
    }
    studentList: any;

    isChecked = false;

    constructor(
        private router: Router,
        private groupService: GroupService,
        public dialog: MatDialog,
        public authService: AuthService,
        private snackBar: MatSnackBar,
        private scheduleService: ScheduleService
    ) {
    }

    ngOnInit(): void {
        this.initializeUser();
        this.getUserData();
    }

    private initializeUser(): void {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            this.user = JSON.parse(storedUser);
            this.isStudent = this.user.role === 'student';
        } else {
            console.error('Пользователь не найден');
            alert('Пользователь не найден');
            this.router.navigate(['/log-in']).then(() =>
                console.log('Переход на страницу входа')
            );
        }

        if (!this.isStudent) {
            this.fetchGroups();
        }
    }

    private fetchGroups(): void {
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

    public getUserData(): void {
        if (this.user) {
            this.authService.getUser(this.user).subscribe((userDTO: any) => {
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


    openChangePasswordDialog(): void {
        const dialogRef = this.dialog.open(DialogChangePasswordComponent, {
            data: {user: this.user, oldPassword: '', newPassword: '', newPassword_confirm: ''},
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.handlePasswordUpdate(result.user.newPassword);
            }
        });
    }

    private handlePasswordUpdate(newPassword: string): void {
        if (this.user) {
            this.user.password = newPassword;
            localStorage.setItem('user', JSON.stringify(this.user));
        }
    }

    adminAccount(): void {
        if(!this.isChecked){
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                width: '250px',
                data: { message: 'Вы точно хотите перейти на админа?' }
            });
        
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.switchToAdmin();
                } else {
                    this.resetCheckbox();
                }
            });
        }
    }
     
    private switchToAdmin(): void {
        
    }
    
    private resetCheckbox(): void {
        this.isChecked = false;
    }

    deleteAccount(): void {
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

      private confirmDeleteAccount(): void {
        if (this.user) {
            this.authService.delete(this.user.login, this.user.role).subscribe({
                next: (response) => {
                    console.log(response);
                    localStorage.removeItem('user');
                    console.log(localStorage.getItem('user') === null ? 'Account deleted' : 'Account not deleted');
                    this.router.navigate(['/log-in']).then(() =>
                        console.log('Переход на страницу входа')
                    );
                },
                error: (error) => {
                    console.error('Ошибка при удалении аккаунта', error);
                }
            });
        }
    }

    createStudent(): void {
        if (!this.student.full_name || !this.student.group_name) {
            console.error('Не заполнены обязательные поля');
            this.snackBar.open('Не заполнены обязательные поля', 'Закрыть', {
                duration: 3000,
            });
            return;
        }

        const fullName: string = this.student.full_name;
        const group: string = this.student.group_name;
        const latinizedFullName: string = this.latinizeFullName(fullName.toLowerCase());
        this.student.login = `${latinizedFullName.split(' ').join('_').toLowerCase().slice(0, 4)}_${group.toLowerCase()}${group.slice(0, 2)}`;
        this.student.password = `${latinizedFullName.split(' ').slice(0, 2).join('_').toLowerCase()}#${group.toLowerCase()}`;
        console.log(this.student);

        this.authService.registerStudent(this.student).pipe(
            switchMap(() => this.authService.getStudents())
        ).subscribe({
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

    private latinizeFullName(fullName: string): string {
        const parts = fullName.split(' ');
        const latinizedParts = parts.map(part => this.latinize(part));
        return latinizedParts.join(' ');
    }

    private latinize(str: string): string {
        const map: { [key: string]: string } = {
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
        this.scheduleService.createLesson(this.lesson.lesson_name).subscribe({
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
}
