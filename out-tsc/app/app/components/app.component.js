import { __decorate } from "tslib";
import { Component } from '@angular/core';
let AppComponent = class AppComponent {
    constructor(router) {
        this.router = router;
        this.title = 'alexandria-app';
    }
    ngOnInit() {
        this.router.events.subscribe(() => {
            this.isShowHeader = !(this.router.url === '/log-in' || this.router.url === '/sign-up' || this.router.url === '/not-found');
        });
    }
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css'],
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map