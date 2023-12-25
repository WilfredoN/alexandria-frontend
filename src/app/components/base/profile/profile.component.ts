import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from './group-service';
import { Group } from './group.model';
import { MatDialog } from '@angular/material/dialog';
import { AuthService, SubjectDTO } from '../../service/auth-service';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogChangePasswordComponent } from './dialog-change-password';
import { ScheduleService } from '../../service/schedule-service';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { TeacherService } from '../../service/teacher-service';
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
	user: any;
	groups: Group[] = [];
	student: Student = {
		full_name: '',
		login: '',
		group_name: '',
		password: '',
	};
	lesson: SubjectDTO = {
		id: 0,
		subject_name: '',
	};
	studentList: any;

	isChecked = false;

	constructor(
		private router: Router,
		private groupService: GroupService,
		public dialog: MatDialog,
		public authService: AuthService,
		private snackBar: MatSnackBar,
		private scheduleService: ScheduleService,
		private teacherService: TeacherService,
	) {}

	ngOnInit(): void {
		this.initializeUser();
	}

	private initializeUser(): void {
		this.user = JSON.parse(localStorage.getItem('user') as string);
		console.log(this.user);
		this.isStudent = this.user.role === 'student';
		if (!this.isStudent) {
			this.fetchGroups();
			this.teacherService.getTeacherById(this.user.id).subscribe({
				next: response => {
					this.user = response;
					this.user.role = 'teacher';
				},
				error: error => {
					console.error('Ошибка при получении преподавателя', error);
				},
			});
		} else {
			this.authService.getUser(this.user).subscribe({
				next: response => {
					this.user = response;
				},
				error: error => {
					console.error('Ошибка при получении пользователя', error);
				},
			});
		}
		console.log(this.user);
	}

	private fetchGroups(): void {
		this.groupService.getGroups().subscribe({
			next: response => {
				this.groups = response;
				console.log('Список групп:', this.groups);
			},
			error: error => {
				console.error('Ошибка при получении списка групп', error);
			},
		});
	}
	openChangePasswordDialog(): void {
		const dialogRef = this.dialog.open(DialogChangePasswordComponent, {
			data: {
				user: this.user,
				oldPassword: '',
				newPassword: '',
				newPassword_confirm: '',
			},
		});

		dialogRef.afterClosed().subscribe(result => {
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
		if (!this.isChecked) {
			const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: '250px',
				data: { message: 'Вы точно хотите изменить роль?' },
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
		this.authService.switchToAdmin(this.user).subscribe({
			next: response => {
				console.log(response);
				this.isChecked = !this.isChecked;
				this.initializeUser();
			},
			error: error => {
				console.error('Ошибка при переходе на админа', error);
			},
		});
	}

	private resetCheckbox(): void {
		this.isChecked = false;
	}

	deleteAccount(): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '250px',
			data: { message: 'Вы точно хотите удалить свой аккаунт?' },
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
				next: response => {
					console.log(response);
					localStorage.removeItem('user');
					console.log(
						localStorage.getItem('user') === null
							? 'Account deleted'
							: 'Account not deleted',
					);
					this.router
						.navigate(['/log-in'])
						.then(() => console.log('Переход на страницу входа'));
				},
				error: error => {
					console.error('Ошибка при удалении аккаунта', error);
				},
			});
		}
	}

	createLesson() {
		this.scheduleService.createLesson(this.lesson.subject_name).subscribe({
			next: response => {
				this.snackBar.open('Предмет создан', 'Закрыть', {
					duration: 2000,
				});
				console.log(response);
			},
			error: error => {
				console.error('Ошибка при создании предмета', error);
			},
		});
	}
}
