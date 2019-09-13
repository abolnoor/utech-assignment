import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() appTitle;
  currentUser;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.currentUser = this.authService;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


}
