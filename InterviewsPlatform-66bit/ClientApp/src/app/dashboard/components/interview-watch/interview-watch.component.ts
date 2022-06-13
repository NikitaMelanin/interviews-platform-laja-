import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-interview-watch',
  templateUrl: './interview-watch.component.html',
  styleUrls: ['./interview-watch.component.css']
})
export class InterviewWatchComponent {
  myForm!: FormGroup;
  id!: string;
  timeStops!: Array<{ title: string, offset: number }>;
  videoBlobLink!: any;

  get questions() {
    return this.myForm.controls["questions"] as FormArray;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly httpClient: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('interviewId');
    let videoLink = 'https://localhost:44423/api/interviews/' + id + '/video';

    this.httpClient.get(videoLink, {responseType: "blob"}).subscribe(
      blob => {
        this.videoBlobLink = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob))
      }
    )

    this.httpClient.get('https://localhost:44423/api/interviews/' + id).subscribe((x: any) => {
      this.timeStops = x.timeStops.sort((a: any, b: any) => a.offset - b.offset);
    });
  }

  ngOnDestroy(): void {
  }
}
