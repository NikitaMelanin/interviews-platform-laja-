import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IVacancy} from "../../../_types";
import {FormControl, FormGroup} from "@angular/forms";
import {mainRoutes} from "../routes";


@Component({
  selector: 'app-nav-menu',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css']
})
export class CandidatesComponent implements OnInit {
  allVacancies!: IVacancy[];
  vacancies!: IVacancy[];
  isLoaded = false;
  findForm!: FormGroup;
  filter: string = '';

  sideRoutes = mainRoutes.filter(x => x.side);
  routes = mainRoutes.filter(x => !x.side);

  constructor(private readonly http: HttpClient) {
  }


  ngOnInit(): void {
    this.findForm = new FormGroup({
      find: new FormControl('')
    });

    this.http.get<IVacancy[]>('https://localhost:44423/api/vacancies').subscribe((x) => {
      this.allVacancies = x;
      this.vacancies = x;
      this.isLoaded = true;
    });
  }

  onSubmit() {
    const value = this.findForm.controls['find'].value.toLocaleLowerCase() || '';
    if (value === '') {
      this.vacancies = this.allVacancies;
      return;
    }
    this.vacancies = this.vacancies.filter(x => {
      return x.name.toLocaleLowerCase().includes(value)
    });
  }


}
