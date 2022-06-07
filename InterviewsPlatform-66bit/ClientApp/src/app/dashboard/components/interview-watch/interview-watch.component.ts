import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-interview-watch',
  templateUrl: './interview-watch.component.html',
  styleUrls: ['./interview-watch.component.css']
})
export class InterviewWatchComponent {
  myForm!: FormGroup;
  id!: string;
  timeStops!: Array<{ title: string, offset: number }>;
  videoLink!: string;

  get questions() {
    return this.myForm.controls["questions"] as FormArray;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly httpClient: HttpClient,
    private readonly route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('interviewId');
    this.videoLink = 'https://localhost:44423/api/interviews/' + id + '/video';
    this.httpClient.get('https://localhost:44423/api/interviews/' + id).subscribe((x: any) => {
      this.timeStops = x.timeStops.sort((a: any, b: any) => a.offset - b.offset);
    });
  }

  ngOnDestroy(): void {
  }
}
