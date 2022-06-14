import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './vacancy-edit.component.html',
  styleUrls: ['./vacancy-edit.component.css']
})
export class VacancyEditComponent {
  myForm!: FormGroup;
  id!: string;

  isLoading = true;
  passingLink = '';

  get questions() {
    return this.myForm.controls["questions"] as FormArray;
  }

  constructor(private readonly fb: FormBuilder,
              private readonly httpClient: HttpClient,
              private readonly route: ActivatedRoute,
              private readonly router: Router) {
  }

  onSubmit() {
    this.isLoading = true;
    this.httpClient.patch('https://localhost:44423/api/vacancies/' + this.id, {
      name: this.myForm.value.title,
      description: this.myForm.value.description,
      questions: this.myForm.value.questions?.map((x: { title: string }) => x.title) || [],
    }).subscribe(x => {
      this.isLoading = false;
      console.log('Updated')
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (this.id === null) {
      this.router.navigate(['']);
      return;
    }
    this.id = id as string;
    this.myForm = this.fb.group({
      title: '',
      description: '',
      questions: this.fb.array([])
    });
    this.httpClient
      .get("https://localhost:44423/api/vacancies/" + this.id, {})
      .subscribe((x: any) => {
        this.passingLink = x.passLink;
        this.myForm.controls['title'].setValue(x.name);
        this.myForm.controls['description'].setValue(x.description);
        x.questions.forEach((x: string) => {
          this.addQuestion(x);
        })
        this.isLoading = false;
      });

  }

  deleteVacancy() {
    // this.httpClient
    //   .delete("https://localhost:44423/api/vacancies/" + this.id, {})
    //   .subscribe((x: any) => {
        this.router.navigate(['vacancies']);
      // });
  }

  addQuestion(question = '') {
    const questionForm = this.fb.group({
      title: [question, Validators.required],
    });
    this.questions.push(questionForm);
  }

  deleteQuestion(questionIndex: number) {
    this.questions.removeAt(questionIndex);
  }

  updateLink() {
    this.httpClient
      .post("https://localhost:44423/api/vacancies/" + this.id + "/generateLink", {})
      .subscribe((x: any) => {
        this.passingLink = x;
      });
  }

  ngOnDestroy(): void {
  }
}
