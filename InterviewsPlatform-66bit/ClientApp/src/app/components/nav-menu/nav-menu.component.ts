import {Component} from '@angular/core';
import {AuthService, IUserCredentials} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  public currentUser!: IUserCredentials | null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {

    this.authService.currentUser.subscribe(x => {
      this.currentUser = x
    });
  }

  logout() {
    this.authService.logOut();
    this.router.navigate(["/auth/login"]);
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
