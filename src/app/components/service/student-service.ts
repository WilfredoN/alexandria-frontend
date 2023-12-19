import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentDTO } from './student-dto';
import { ApiService } from './api-service';

@Injectable({ providedIn: 'root' })
export class StudentService {
	getStudentsByGroup(group: string) {
		return this.http.get<StudentDTO[]>(
			this.apiURL + '/students/group/' + group,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
	}
	constructor(private http: HttpClient) {}

	user: StudentDTO;
	apiURL = ApiService.API_URL;

	getStudents(): Observable<StudentDTO[]> {
		return this.http.get<StudentDTO[]>(this.apiURL + '/students', {
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
}
