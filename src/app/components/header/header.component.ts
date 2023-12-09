import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router) {}
  public isLoggedOut: boolean = false;
  logout() {
    this.isLoggedOut = true;
    this.router.navigate(['/log-in']).then(() =>
        localStorage.removeItem('user'));
        localStorage.removeItem('role');
  }
}
