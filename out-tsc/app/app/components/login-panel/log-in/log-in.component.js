import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
export let LogInComponent = class LogInComponent {
    constructor(fb, router, userService, _snackBar) {
        this.fb = fb;
        this.router = router;
        this.userService = userService;
        this._snackBar = _snackBar;
    }
    ngOnInit() {
        this._formValidate();
    }
    _formValidate() {
        this.loginForm = this.fb.group({
            login: ['', Validators.required],
            password: ['', Validators.required],
        });
    }
    login() {
        if (this.loginForm.valid && this.loginForm.dirty) {
            const login = this.loginForm.get('login').value;
            const password = this.loginForm.get('password').value;
            this.userService.logIn({ login, password }).subscribe((user) => {
            this.router.navigate(['/base']).then(r => console.log('navigate to base'));
            }, (error) => {
                // Ошибка авторизации
                console.error('Ошибка авторизации: ', error);
            });
        }
    }
};
LogInComponent = __decorate([
    Component({
        selector: 'app-log-in',
        templateUrl: './log-in.component.html',
        styleUrls: ['./log-in.component.css'],
    })
], LogInComponent);
//# sourceMappingURL=log-in.component.js.map
