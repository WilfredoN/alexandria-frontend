import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../service/auth-service';
import { Group } from '../../base/profile/group.model';
import { SubjectDTO } from '../../service/subject-dto';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;
	thirdFormGroup: FormGroup;
	groups: Group[] = [];
	subjects: SubjectDTO[] = [];

	constructor(
		private _formBuilder: FormBuilder,
		private router: Router,
		private _snackBar: MatSnackBar,
		private authService: AuthService,
	) {}

	ngOnInit() {
		this.firstFormGroup = this._formBuilder.group({
			full_name: ['', Validators.required],
			login: ['', Validators.required],
			pwd: ['', Validators.required],
		});

		this.secondFormGroup = this._formBuilder.group({
			groups: this._formBuilder.array(
				this.groups.map(() => this._formBuilder.control(false)),
				Validators.required,
			),
		});

		this.thirdFormGroup = this._formBuilder.group({
			subjects: this._formBuilder.array(
				this.subjects.map(() => this._formBuilder.control(false)),
				Validators.required,
			),
		});

		this.fetchGroupsAndSubjects();
	}

	private fetchGroupsAndSubjects(): void {
		this.authService.getGroups().subscribe({
			next: (response: any) => {
				this.groups = response;
				this.secondFormGroup.setControl(
					'groups',
					this._formBuilder.array(
						this.groups.map(() => this._formBuilder.control(false)),
					),
				);
			},
			error: err => console.error(err),
		});

		this.authService.getLessons().subscribe({
			next: (response: any) => {
				this.subjects = response;
				this.thirdFormGroup.setControl(
					'subjects',
					this._formBuilder.array(
						this.subjects.map(() =>
							this._formBuilder.control(false),
						),
					),
				);
			},
			error: err => console.error(err),
		});
	}
	_formSubmit(): void {
		if (this.firstFormGroup.controls.full_name.value.length < 5) {
			this._snackBar.open(
				'Full name should be more than 5 characters',
				'Close',
				{ duration: 3000 },
			);
			return;
		}
		if (this.firstFormGroup.controls.login.value.length < 3) {
			this._snackBar.open(
				'Login should be more than 3 characters',
				'Close',
				{ duration: 3000 },
			);
			return;
		}
		if (this.firstFormGroup.controls.pwd.value.length < 6) {
			this._snackBar.open(
				'Password should be more than 6 characters',
				'Close',
				{ duration: 3000 },
			);
			return;
		}
		if (this.secondFormGroup.value.groups.length === 0) {
			this._snackBar.open('Select at least one group', 'Close', {
				duration: 3000,
			});
			return;
		}
		if (this.thirdFormGroup.value.subjects.length === 0) {
			this._snackBar.open('Select at least one subject', 'Close', {
				duration: 3000,
			});
			return;
		}
		const userDTO = {
			id: 0,
			full_name: this.firstFormGroup.value.full_name,
			login: this.firstFormGroup.value.login,
			password: this.firstFormGroup.value.pwd,
			role: 'teacher',
			isAdmin: false,
		};
		this.authService.register(userDTO).subscribe({
			next: (response: any) => {
				console.log(response);
				this._snackBar.open('Registration successful!', 'Close', {
					duration: 3000,
				});
				userDTO.id = response.id;
				userDTO.role = 'teacher';
				localStorage.setItem('user', JSON.stringify(userDTO));
				this.router
					.navigate(['base'])
					.then(r => console.log(r + '\nnavigate to /login'));
			},
			error: err => {
				this._snackBar.open('Registration error', 'Close', {
					duration: 3000,
				});
				console.error(err);
			},
		});
	}
}
