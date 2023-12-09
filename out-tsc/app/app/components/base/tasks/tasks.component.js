import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
const ELEMENT_DATA = [
    { name: 'Циклы', type: 'Л/Р', teacher: 'Архипцева', date: '04.10.2023' },
];
export let TasksComponent = class TasksComponent {
    constructor() {
        this.displayedColumns = ['name', 'type', 'teacher', 'date'];
        this.dataSource = ELEMENT_DATA;
    }
};
TasksComponent = __decorate([
    Component({
        selector: 'app-tasks',
        templateUrl: './tasks.component.html',
        styleUrls: ['./tasks.component.css'],
        standalone: true,
        imports: [MatTableModule],
    })
], TasksComponent);
//# sourceMappingURL=tasks.component.js.map
