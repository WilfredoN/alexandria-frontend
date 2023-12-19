import { Component } from '@angular/core';
import { StudentService } from '../../service/student-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../service/auth-service';
@Component({
	selector: 'app-students',
	templateUrl: './students.component.html',
	styleUrls: ['./students.component.css'],
})
export class StudentsComponent {
	user: any = JSON.parse(localStorage.getItem('user') as string);
	groups: string[] = [];
	selectedGroup: string;
	students: {
		full_name: string;
		group_name: string;
		login: string;
		isEdited: boolean;
	}[] = [];
	studentsList: {
		full_name: string;
		group_name: string;
		login: string;
		isEdited: boolean;
	}[] = [];
	editorMode: boolean = false;
	newStudent = {
		full_name: '',
		group_name: '',
		login: '',
	};
	constructor(
		private studentService: StudentService,
		private authService: AuthService,
		private snackBar: MatSnackBar,
	) {}
	ngOnInit(): void {
		this.fetchStudents();
		this.fetchGroups();
	}
	fetchStudents() {
		this.studentService.getStudents().subscribe((data: any) => {
			this.students = data;
			this.studentsList = data;
		});
	}
	fetchStudentsByGroup(group: string) {
		this.students = this.studentsList.filter(
			student => student.group_name === group,
		);
	}
	fetchGroups() {
		this.authService.getGroups().subscribe((data: any) => {
			this.groups = data.map((group: any) => group.name);
		});
	}
	editMode() {
		this.editorMode = !this.editorMode;
		this.students.push({
			full_name: '',
			group_name: '',
			login: '',
			isEdited: true,
		});
	}
	submitNewStudent(student: any) {
		if (student.full_name.length < 5 || student.group_name.length < 3) {
			this.snackBar.open('Введено неккоректное имя или группа', 'Close', {
				duration: 3000,
			});
			return;
		}
		const fullName: string = student.full_name;
		const group: string = student.group_name;
		const latinizedFullName: string = this.latinizeFullName(
			fullName.toLowerCase(),
		);
		student.login = `${latinizedFullName
			.split(' ')
			.join('_')
			.toLowerCase()
			.slice(0, 4)}_${group.toLowerCase()}${group.slice(0, 2)}`;
		student.password = `${latinizedFullName
			.split(' ')
			.slice(0, 2)
			.join('_')
			.toLowerCase()}#${group.toLowerCase()}`;
		console.log(student);
		this.authService.registerStudent(student).subscribe({
			next: (data: any) => {
				console.log(data);
				student.isEdited = false;
			},
			error: (error: any) => {
				console.log(error);
				this.snackBar.open(error.error.message, 'Close', {
					duration: 3000,
				});
				return;
			},
		});
	}
	private latinizeFullName(fullName: string): string {
		const parts = fullName.split(' ');
		const latinizedParts = parts.map(part => this.latinize(part));
		return latinizedParts.join(' ');
	}

	private latinize(str: string): string {
		const map: { [key: string]: string } = {
			а: 'a',
			б: 'b',
			в: 'v',
			г: 'g',
			д: 'd',
			е: 'e',
			ё: 'e',
			ж: 'zh',
			з: 'z',
			и: 'i',
			й: 'y',
			к: 'k',
			л: 'l',
			м: 'm',
			н: 'n',
			о: 'o',
			п: 'p',
			р: 'r',
			с: 's',
			т: 't',
			у: 'u',
			ф: 'f',
			х: 'kh',
			ц: 'ts',
			ч: 'ch',
			ш: 'sh',
			щ: 'sch',
			ъ: '',
			ы: 'y',
			ь: 'y',
			э: 'e',
			ю: 'yu',
			я: 'ya',
		};

		return str.replace(/[а-яА-Я]/g, match => {
			const key = match.toLowerCase();
			return map[key] || match;
		});
	}
	selectedStudent: string = '';
	deleteStudent(student: any) {
		if (student.isEdited) {
			this.students.splice(
				this.students.findIndex(
					student => student.login === this.selectedStudent,
				),
				1,
			);
			return;
		}
		if (this.selectedStudent === student.login) {
			this.authService
				.delete(student.login, 'student')
				.subscribe((data: any) => {
					console.log(data);
					this.fetchStudents();
				});
		} else {
			this.selectedStudent = student.login;
			setInterval(() => {
				this.selectedStudent = '';
			}, 3000);
			console.log(this.selectedStudent);
			return;
		}
	}
}
