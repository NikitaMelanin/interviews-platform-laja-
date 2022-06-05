import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-add-interview',
  templateUrl: './add-interview.component.html',
  styleUrls: ['./add-interview.component.css'],
  providers: []

})


export class AddInterviewComponent implements OnInit, OnDestroy {
  myForm!: FormGroup;
  id!: string;

  constructor(private httpClient: HttpClient, private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id')!;
  }

  onSubmit() {
    this.httpClient.patch('https://localhost:44423/api/vacancies/' + this.id + '/interviews', {
      name: this.myForm.value.name,
      surname: this.myForm.value.surname,
      email: this.myForm.value.email,
      phone: this.myForm.value.phone,
    }).subscribe(x => {
      console.log('ready')
    });
  }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
    })
  }

  ngOnDestroy(): void {
  }

}
