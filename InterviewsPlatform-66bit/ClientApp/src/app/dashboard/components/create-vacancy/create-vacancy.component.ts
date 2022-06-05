import {Component, OnDestroy, OnInit} from '@angular/core';

import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-vacancy',
  templateUrl: './create-vacancy.component.html',
  styleUrls: ['./create-vacancy.component.css'],
  providers: []

})


export class CreateVacancyComponent implements OnInit, OnDestroy {
  myForm!: FormGroup;

  get questions() {
    return this.myForm.controls["questions"] as FormArray;
  }

  constructor(private fb: FormBuilder, private httpClient: HttpClient, private readonly router: Router) {
  }

  onSubmit() {
    this.httpClient.post('https://localhost:44423/api/vacancies', {
      name: this.myForm.value.title,
      description: this.myForm.value.description,
      questions: this.myForm.value.questions?.map((x: { title: string }) => x.title) || [],
    }).subscribe(x => {
      this.router.navigate(['dashboard'])
    });
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      title: ['', []],
      description: ['', []],
      questions: this.fb.array([])
    });
  }

  addQuestion() {
    const questionForm = this.fb.group({
      title: ['', Validators.required],
    });
    this.questions.push(questionForm);
  }

  deleteQuestion(questionIndex: number) {
    this.questions.removeAt(questionIndex);
  }

  ngOnDestroy(): void {
  }

}
