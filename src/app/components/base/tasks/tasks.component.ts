import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

export interface PeriodicElement {
	name: string;
	type: string;
	teacher: string;
	date: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
	{ name: 'Циклы', type: 'Л/Р', teacher: 'Архипцева', date: '04.10.2023' },
];

@Component({
	selector: 'app-tasks',
	templateUrl: './tasks.component.html',
	styleUrls: ['./tasks.component.css'],
	standalone: true,
	imports: [MatTableModule],
})
export class TasksComponent {
	displayedColumns: string[] = ['name', 'type', 'teacher', 'date'];
	dataSource = ELEMENT_DATA;
}
