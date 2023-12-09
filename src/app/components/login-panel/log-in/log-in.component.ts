import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../service/auth-service";

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css'],
})
export class LogInComponent implements OnInit {
    myForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private _snackBar: MatSnackBar
    ) {
    }

    ngOnInit() {
        this._formValidate();
        console.log(this.myForm.controls);
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
            this._snackBar.open('Введите корректные данные', 'Закрыть', {duration: 3000});
            return;
        }
        const userDTO = {
            id: 0,
            login: this.myForm.value.login,
            password: this.myForm.value.password,
            group_name: '',
            role: this.myForm.value.role
        }

        this.authService.logIn(userDTO).subscribe({
            next: (response: any) => {
                console.log(response);
                this._snackBar.open('Вы успешно вошли в систему', 'Закрыть', {duration: 3000});
                userDTO.id = response.id;
                userDTO.group_name = response.group_name;
                userDTO.role = this.myForm.value.role;
                localStorage.setItem('user', JSON.stringify(userDTO));
                console.log(userDTO);
                this.router.navigate(['/base']).then(r => console.log(r + '\nnavigate to /base'));
            },
            error: () => {
                this._snackBar.open('Неверный логин или пароль', 'Закрыть', {duration: 3000});
            }
        });

    }
}
