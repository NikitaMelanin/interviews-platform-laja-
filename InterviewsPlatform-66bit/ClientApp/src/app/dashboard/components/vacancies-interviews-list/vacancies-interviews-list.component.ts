import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'vacancies-interviews-list',
  templateUrl: './vacancies-interviews-list.component.html',
  styleUrls: ['./vacancies-interviews-list.component.css']
})
export class VacanciesInterviewsListComponent implements OnInit {

  public interviewList: any[] = [];
  private _id!: string;

  constructor(private httpClient: HttpClient, private route: ActivatedRoute) {
    this._id = this.route.snapshot.paramMap.get('id')!;
    this.httpClient.get('https://localhost:44423/api/vacancies/' + this._id + '/interviews').subscribe((list) => {
      this.interviewList = Object.values(list);
    });
  }

  ngOnInit(): void {
  }

  onClickInterview(id: string) {
    console.log(id);
  }
}
