import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    user: any;
    title = 'alexandria-app';
    isShowHeader: boolean; // Флаг для показа/скрытия хедера
    constructor(private router: Router) {
    }

    ngOnInit() {
        this.router.events.subscribe(() => {
            this.isShowHeader = !(this.router.url === '/log-in' || this.router.url === '/sign-up' || this.router.url === '/not-found');
        });
    }
}
