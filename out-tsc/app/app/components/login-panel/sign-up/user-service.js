import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
export let UserService = class UserService {
    constructor(http) {
        this.http = http;
        this.currentUser = null;
        this.apiURL = 'http://localhost:8080/api/users';
    }
    createUser(user) {
        return this.http.post(`${this.apiURL}/create`, user, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    logIn(user) {
        return this.http
            .post(`${this.apiURL}/login`, user, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .pipe(tap((user) => (this.currentUser = user)));
    }
};
UserService = __decorate([
    Injectable({
        providedIn: 'root',
    })
], UserService);
//# sourceMappingURL=user-service.js.map
