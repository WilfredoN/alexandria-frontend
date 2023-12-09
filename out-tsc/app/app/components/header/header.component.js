import { __decorate } from "tslib";
import { Component } from '@angular/core';
let HeaderComponent = class HeaderComponent {
    constructor(router) {
        this.router = router;
        this.isLoggedOut = false;
    }
    logout() {
        this.isLoggedOut = true;
        this.router.navigate(['/log-in']).then(() => localStorage.removeItem('user'));
        localStorage.removeItem('role');
    }
};
HeaderComponent = __decorate([
    Component({
        selector: 'app-header',
        templateUrl: './header.component.html',
        styleUrls: ['./header.component.css']
    })
], HeaderComponent);
export { HeaderComponent };
//# sourceMappingURL=header.component.js.map