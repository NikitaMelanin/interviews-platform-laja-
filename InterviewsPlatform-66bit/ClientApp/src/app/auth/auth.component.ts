import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  providers: []
})
export class AuthComponent implements OnInit, OnDestroy {
  myForm!: FormGroup;

  constructor(private httpClient: HttpClient, private readonly router: Router, private readonly authService: AuthService) {
  }

  onSubmit() {
    this.authService.logIn(this.myForm.value.login, this.myForm.value.password).subscribe(x => {
      this.router.navigate(['dashboard/vacancies']);
    });
  }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      login: new FormControl('', [Validators.required]),
    })
  }

  ngOnDestroy(): void {
  }
}
