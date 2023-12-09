import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Announcement} from "./announcement-dto";
import {ApiService} from "./api-service";

@Injectable({
    providedIn: 'root'
})
export class AnnouncementsService {

    constructor(private http: HttpClient) {
    }
    private apiURL = ApiService.API_URL + '/announcements';

    getAnnouncements(): Observable<Announcement[]> {
        return this.http.get<Announcement[]>(this.apiURL);
    }

    getAnnouncementById(id: number): Observable<Announcement> {
        return this.http.get<Announcement>(`${this.apiURL}/${id}`);
    }

    createAnnouncement(title: string, content: string, author_id: number): Observable<Announcement> {
        return this.http.post<Announcement>(`${this.apiURL}/create`, {
            title: title,
            content: content,
            author_id: author_id
        });
    }

    deleteAnnouncement(id: number): Observable<Announcement> {
        return this.http.delete<Announcement>(`${this.apiURL}/${id}`);
    }

    updateAnnouncement(id: number, title: string, content: string): Observable<Announcement> {
        return this.http.put<Announcement>(`${this.apiURL}/${id}`, {title, content});
    }
}
