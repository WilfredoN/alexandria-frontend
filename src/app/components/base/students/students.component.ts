import { Component } from '@angular/core';
import { StudentService } from '../../service/student-service';
import { StudentDTO } from '../../service/student-dto';
import { AuthService } from '../../service/auth-service';
@Component({
	selector: 'app-students',
	templateUrl: './students.component.html',
	styleUrls: ['./students.component.css'],
})
export class StudentsComponent {
	user: any = JSON.parse(localStorage.getItem('user') as string);
	students: StudentDTO[] = [];
	constructor(
		private studentService: StudentService,
		private authService: AuthService,
	) {}
	ngOnInit(): void {
		this.fetchStudents();
	}
	fetchStudents() {
		this.studentService.getStudents().subscribe((data: any) => {
			this.students = data;
			console.log(this.students);
		});
	}
	selectedStudent: string = '';
	deleteStudent(login: string) {
		if (this.selectedStudent === login) {
			this.authService.delete(login, 'student').subscribe((data: any) => {
				console.log(data);
				this.fetchStudents();
			});
		} else {
			this.selectedStudent = login;
			setInterval(() => {
				this.selectedStudent = '';
			}, 3000);
			console.log(this.selectedStudent);
			return;
		}
	}
}
