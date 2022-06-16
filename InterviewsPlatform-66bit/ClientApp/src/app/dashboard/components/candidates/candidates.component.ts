import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ICandidate, IVacancy} from "../../../_types";
import {FormControl, FormGroup} from "@angular/forms";
import {mainRoutes} from "../routes";


@Component({
  selector: 'app-nav-menu',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css']
})
export class CandidatesComponent implements OnInit {
  candidates!: ICandidate[];
  isLoaded = false;
  findForm!: FormGroup;
  filter: string = '';

  sideRoutes = mainRoutes.filter(x => x.side);
  routes = mainRoutes.filter(x => !x.side);

  constructor(private readonly http: HttpClient) {
  }


  ngOnInit(): void {
    this.http.get<ICandidate[]>('https://localhost:44423/api/interviewees').subscribe((x) => {
      this.candidates = x;
      this.isLoaded = true;
    });
  }

  onSubmit() {
  }


}
