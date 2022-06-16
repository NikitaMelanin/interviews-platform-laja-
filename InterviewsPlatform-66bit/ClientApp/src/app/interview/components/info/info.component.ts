import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-start-interview',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
  providers: []

})


export class InfoComponent implements OnInit, OnDestroy {
  description!: string;
  id!: string;

  constructor(private httpClient: HttpClient, private route: ActivatedRoute, private readonly router: Router) {
    this.id = this.route.snapshot.paramMap.get('passLink')!;
  }

  onSubmit() {
    this.router.navigate([this.id, 'process']);
  }

  ngOnInit(): void {
    this.httpClient.get<string>('https://localhost:44423/api/vacancies/candidate/' + this.id).subscribe((x: any) => {
      this.description = x.description;
    })
  }

  ngOnDestroy(): void {
  }
}
