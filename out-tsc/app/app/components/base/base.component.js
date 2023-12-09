import { __decorate } from "tslib";
import { Component } from '@angular/core';
let BaseComponent = class BaseComponent {
    constructor() {
        this.user = JSON.parse(localStorage.getItem('user'));
    }
};
BaseComponent = __decorate([
    Component({
        selector: 'app-base',
        templateUrl: './base.component.html',
        styleUrls: ['./base.component.css'],
    })
], BaseComponent);
export { BaseComponent };
//# sourceMappingURL=base.component.js.map