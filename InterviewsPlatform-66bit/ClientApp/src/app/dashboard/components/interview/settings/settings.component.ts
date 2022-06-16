import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {interviewRoutes, IRoute} from "../../routes";
import {IInterview} from "../../../../_types";
import {startInterview} from "../../../../_extraRoutes";

@Component({
  selector: 'app-main',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  myForm!: FormGroup;
  id!: string;
  sideRoutes: IRoute[] = [];
  interview!: IInterview;
  candidate!: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly httpClient: HttpClient,
    private readonly route: ActivatedRoute,
  ) {
  }

  startInterview() {
    return startInterview(this.interview?.passLink || 'null').generated;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('interviewId');
    this.id = id!;
    this.httpClient.get<IInterview>('https://localhost:44423/api/interviews/' + id, {})
      .subscribe(x => this.interview = x);
    this.httpClient.get<any>('https://localhost:44423/api/interviews/' + id + '/interviewee', {})
      .subscribe(x => this.candidate = x);
    this.sideRoutes = interviewRoutes(id!);
  }

  generateLink() {
    this.httpClient.post<string>('https://localhost:44423/api/interviews/' + this.id + '/generate-link', {})
      .subscribe(x => this.interview.passLink = x);
  }

  ngOnDestroy(): void {
  }
}
