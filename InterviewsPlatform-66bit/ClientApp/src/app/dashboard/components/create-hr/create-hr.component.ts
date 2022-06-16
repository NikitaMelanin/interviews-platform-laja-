import {Component, OnInit} from '@angular/core';

import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-hr',
  templateUrl: './create-hr.component.html',
  styleUrls: ['./create-hr.component.css'],
  providers: []

})


export class CreateHrComponent implements OnInit {
  myForm!: FormGroup;

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private readonly router: Router) {
  }

  onSubmit() {
    this.httpClient.post('https://localhost:44423/api/account/register-hr', {
      name: this.myForm.value.name,
      login: this.myForm.value.login,
      surname: this.myForm.value.surname,
      password: this.myForm.value.password,
    }).subscribe(x => {
        this.router.navigate(["/dashboard/vacancies"]);
    });
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      password: new FormControl('', [Validators.required]),
      login: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
    });
  }

  ngOnDestroy(): void {
  }
}
