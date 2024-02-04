import { Component } from '@angular/core';
import { AuthService } from '../service/auth-service';
@Component({
	selector: 'app-base',
	templateUrl: './base.component.html',
	styleUrls: ['./base.component.css'],
})
export class BaseComponent {
	constructor(private authService: AuthService) {}
	user: any = JSON.parse(localStorage.getItem('user') as string);
	ngOnInit(): void {
		this.authService.getTeacherGroups(this.user.id).subscribe(data => {
			this.user.groups = data;
		});
		this.authService.getTeacherSubjects(this.user.id).subscribe(data => {
			this.user.subjects = data;
		});
		localStorage.setItem('user', JSON.stringify(this.user));
		console.log(this.user);
	}
}
