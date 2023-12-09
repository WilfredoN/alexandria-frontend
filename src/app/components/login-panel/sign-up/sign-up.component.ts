import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../service/auth-service';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
    myForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private _snackBar: MatSnackBar,
        private authService: AuthService,
    ) {
    }

    ngOnInit() {
        this._formValidate();
        console.log(this.myForm.controls);
    }

    _formValidate() {
        this.myForm = this.fb.group({
            full_name: ['', Validators.required],
            login: ['', Validators.required],
            pwd: ['', [Validators.required, Validators.minLength(6)],
            ],
        });
    }

    _formSubmit(): void {
        if (this.myForm.controls.full_name.value.length < 5) {
            this._snackBar.open('Full name should be more than 5 characters', 'Close', {duration: 3000});
            return;
        }
        if (this.myForm.controls.login.value.length < 3) {
            this._snackBar.open('Login should be more than 3 characters', 'Close', {duration: 3000});
            return;
        }
        if (this.myForm.controls.pwd.value.length < 6) {
            this._snackBar.open('Password should be more than 6 characters', 'Close', {duration: 3000});
            return;
        }
        const userDTO = {
            id: 0,
            full_name: this.myForm.value.full_name,
            login: this.myForm.value.login,
            password: this.myForm.value.pwd,
            role: 'teacher',
            isAdmin: false
        };
        this.authService.register(userDTO).subscribe({
            next: (response: any) => {
                console.log(response);
                this._snackBar.open('Registration successful!', 'Close', {duration: 3000});
                userDTO.id = response.id;
                userDTO.role = 'teacher';
                localStorage.setItem('user', JSON.stringify(userDTO));
                this.router.navigate(['base']).then(r => console.log(r + '\nnavigate to /login'));
            },
            error: (err) => {
                this._snackBar.open('Registration error', 'Close', {duration: 3000});
                console.error(err);
            }
        });
    }
}
