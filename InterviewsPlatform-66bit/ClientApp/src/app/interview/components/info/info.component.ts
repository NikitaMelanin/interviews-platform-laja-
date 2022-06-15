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
    this.router.navigate(['interview', this.id, 'start']);
  }

  ngOnInit(): void {
    this.httpClient.get<string>('https://localhost:44423/api/vacancies/' + this.id + '/description').subscribe((x: string) => {
      this.description = x;
    })
  }

  ngOnDestroy(): void {
  }
}
