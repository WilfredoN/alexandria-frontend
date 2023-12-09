import { __decorate, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
let ConfirmDialogComponent = class ConfirmDialogComponent {
    constructor(data) {
        this.data = data;
    }
};
ConfirmDialogComponent = __decorate([
    Component({
        selector: 'confirm-dialog',
        templateUrl: './confirm-dialog.component.html',
    }),
    __param(0, Inject(MAT_DIALOG_DATA))
], ConfirmDialogComponent);
export { ConfirmDialogComponent };
//# sourceMappingURL=confirm-dialog.component.js.map