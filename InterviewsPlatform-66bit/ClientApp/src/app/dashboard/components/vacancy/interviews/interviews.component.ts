import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {IRoute, mainRoutes, vacancyRoutes} from "../../routes";
import {IInterview} from "../../../../_types";

@Component({
  selector: 'app-vacancy-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.css']
})
export class InterviewsComponent {
  sideRoutes: IRoute[] = [];
  routes: IRoute[] = [];
  id!: string;
  interviews!: IInterview[];

  constructor(private readonly fb: FormBuilder,
              private readonly httpClient: HttpClient,
              private readonly route: ActivatedRoute,
              private readonly router: Router) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (this.id === null) {
      this.router.navigate(['']);
      return;
    }
    this.id = id as string;
    this.sideRoutes = vacancyRoutes(this.id).filter(x => x.side);
    this.httpClient.get<IInterview[]>('https://localhost:44423/api/vacancies/' + id + '/interviews')
      .subscribe((x: IInterview[]) => {
      this.interviews = x;
    });
  }

  ngOnDestroy(): void {
  }
}
