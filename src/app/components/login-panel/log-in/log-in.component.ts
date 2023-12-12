import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../service/auth-service';

@Component({
	selector: 'app-log-in',
	templateUrl: './log-in.component.html',
	styleUrls: ['./log-in.component.css'],
})
export class LogInComponent implements OnInit {
	myForm: FormGroup;
	DTO: {
		id: number;
		login: string;
		password: string;
		role: string;
		is_admin: boolean;
	} = {
		id: 0,
		login: '',
		password: '',
		role: 'student',
		is_admin: false,
	};
	selectedOption: string;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private authService: AuthService,
		private _snackBar: MatSnackBar,
	) {}
	selectOption(value: string) {
		this.selectedOption = value;
		const roleControl = this.myForm.get('role');
		if (roleControl) {
			roleControl.setValue(value);
		}
	}
	ngOnInit() {
		this._formValidate();
	}

	_formValidate() {
		this.myForm = this.fb.group({
			login: ['', Validators.required],
			password: ['', Validators.required],
			role: ['', Validators.required],
		});
	}

	logIn(): void {
		if (this.myForm.invalid) {
			this._snackBar.open('Введите корректные данные', 'Закрыть', {
				duration: 3000,
			});
			return;
		}
		const userDTO = {
			login: this.myForm.value.login,
			password: this.myForm.value.password,
			role: this.myForm.value.role,
		};
		this.authService.logIn(userDTO).subscribe({
			next: (response: any) => {
				console.log(response);
				this._snackBar.open('Вы успешно вошли в систему', 'Закрыть', {
					duration: 3000,
				});
				this.DTO = response;
				this.DTO.role = this.myForm.value.role;
				localStorage.setItem('user', JSON.stringify(this.DTO));
				console.log(this.DTO);
				this.router
					.navigate(['/base'])
					.then(r => console.log(r + '\nnavigate to /base'));
			},
			error: err => {
				console.log(err);
				console.log(userDTO);
				this._snackBar.open('Неверный логин или пароль', 'Закрыть', {
					duration: 3000,
				});
			},
		});
	}
}
