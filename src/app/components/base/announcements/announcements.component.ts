import { Component, OnInit } from '@angular/core';
import { AnnouncementsService } from '../../service/announcements-service';
import { Announcement } from '../../service/announcement-dto';
import { TeacherService } from '../../service/teacher-service';

@Component({
	selector: 'announcements',
	templateUrl: './announcements.component.html',
	styleUrls: ['./announcements.component.css'],
})
export class AnnouncementsComponent implements OnInit {
	announcements: Announcement[] = [];
	news: Announcement = {
		id: 0,
		title: '',
		content: '',
		author_id: 0,
		author_name: '',
		created_at: new Date(),
		updated_at: new Date(),
		isEditing: false,
		original: {},
	};
	user: any;

	constructor(
		private announcementsService: AnnouncementsService,
		private teacherService: TeacherService,
	) {}

	ngOnInit() {
		this.user = JSON.parse(localStorage.getItem('user') || '{}');
		this.fetchAnnouncements();
	}
	fetchAnnouncements() {
		this.announcementsService.getAnnouncements().subscribe({
			next: announcements => {
				this.announcements = announcements.sort(
					(a, b) =>
						new Date(a.created_at).getTime() -
						new Date(b.created_at).getTime(),
				);
				this.announcements.forEach(announcement => {
					this.teacherService
						.getTeacherById(announcement.author_id)
						.subscribe({
							next: teacher => {
								announcement.author_name = teacher.full_name;
								console.log(announcement);
							},
							error: err => {
								console.log(err);
							},
						});
				});
			},
			error: err => {
				console.log(err);
			},
		});
	}
	createAnnouncement() {
		if (this.news.title === '' || this.news.content === '') {
			alert('Заполните все поля!');
			return;
		} else {
			this.announcementsService
				.createAnnouncement(
					this.news.title,
					this.news.content,
					this.user.id,
				)
				.subscribe({
					next: announcement => {
						console.log('Announcement created:', announcement);
						announcement.author_name = this.user.full_name;
						this.announcements.push(announcement);
						this.news.title = '';
						this.news.content = '';
					},
					error: err => {
						console.log('Error creating announcement:', err);
					},
				});
		}
	}

	deleteAnnouncement(id: number) {
		this.announcementsService.deleteAnnouncement(id).subscribe({
			next: announcement => {
				console.log('Announcement deleted:', announcement);
				this.announcements = this.announcements.filter(
					announcement => announcement.id !== id,
				);
			},
			error: err => {
				console.log('Error deleting announcement:', err);
			},
		});
	}

	editAnnouncement(id: number) {
		this.announcements.forEach(announcement => {
			if (announcement.id === id) {
				announcement.original = { ...announcement };
				announcement.isEditing = !announcement.isEditing;
			}
		});
	}
	cancelEdit(id: number) {
		this.announcements.forEach(announcement => {
			if (announcement.id === id) {
				Object.assign(announcement, announcement.original);
				delete announcement.original;
				announcement.isEditing = false;
			}
		});
	}
	submitChanges(id: number) {
		this.announcements.forEach(announcement => {
			if (announcement.id === id) {
				this.announcementsService
					.updateAnnouncement(
						announcement.id,
						announcement.title,
						announcement.content,
					)
					.subscribe({
						next: response => {
							delete announcement.original;
							announcement.isEditing = false;
							this.fetchAnnouncements();
						},
						error: err => {
							console.log('Error updating announcement:', err);
						},
					});
			}
		});
	}
	trimSeconds(date: Date | string): string {
		if (typeof date === 'string') {
			date = new Date(date);
		}
		let year = date.getFullYear();
		let month = ('0' + (date.getMonth() + 1)).slice(-2);
		let day = ('0' + date.getDate()).slice(-2);
		let hours = ('0' + date.getHours()).slice(-2);
		let minutes = ('0' + date.getMinutes()).slice(-2);
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}
}
