import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-create-component',
  templateUrl: './create-candidate.component.html',
  styleUrls: ['./create-candidate.component.css'],
  providers: []
})


export class CreateCandidateComponent implements OnInit, OnDestroy {
  myForm!: FormGroup;
  id!: string;

  constructor(private httpClient: HttpClient, private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('vacancyId')!;
  }

  onSubmit() {
    this.httpClient.post('https://localhost:44423/api/vacancies/' + this.id + '/interviews', {
      name: this.myForm.value.name,
      surname: this.myForm.value.surname,
      patronymic: this.myForm.value.patronymic,
      email: this.myForm.value.email,
      phone: this.myForm.value.phone,
    }).subscribe(x => {
      console.log('Starting interview');
    });
  }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      patronymic: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
    })
  }

  ngOnDestroy(): void {
  }

  public cancel(): void {
    this.myForm.reset();
  }

}
