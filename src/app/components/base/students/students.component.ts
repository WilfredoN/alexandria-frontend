import {Component} from '@angular/core';
import {StudentService} from "../../service/student-service";
import {StudentDTO} from "../../service/student-dto";

@Component({
    selector: 'app-students',
    templateUrl: './students.component.html',
    styleUrls: ['./students.component.css']
})
export class StudentsComponent {
    user: any = JSON.parse(localStorage.getItem('user') as string);
    students: StudentDTO[] = [];
    constructor(private studentService: StudentService) {

    }
    ngOnInit(): void {
        this.studentService.getStudents().subscribe((data: any) => {
            this.students = data;
            console.log(this.students);
        });
    }
}
