export interface Schedule {
    id: number;
    day_of_week: string;
    lesson_num: number;
    week_type: number;
    subject_id: number;
    lessonName?: string;
    group_id: number;
    teacher_id: number;
    teacherName?: string;
}
