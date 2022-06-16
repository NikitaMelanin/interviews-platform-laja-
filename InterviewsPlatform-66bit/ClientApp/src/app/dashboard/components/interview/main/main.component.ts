import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {interviewRoutes, IRoute} from "../../routes";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  myForm!: FormGroup;
  id!: string;
  timeStops!: Array<{ title: string, offset: number }>;
  videoBlobLink!: any;
  screenVideoBlobLink!: any;
  sideRoutes: IRoute[] = [];

  setCurrentTime(seconds: number) {
    const video = document.getElementsByTagName('video')[0];
    const screen = document.getElementsByTagName('video')[1];
    try {
      video!.currentTime = seconds;
      screen!.currentTime = seconds;
    } catch (e) {
      console.log(e);
    }
  }

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
    this.sideRoutes = interviewRoutes(id!);
    let videoLink = 'https://localhost:44423/api/interviews/' + id + '/video';
    let screenVideoLink = 'https://localhost:44423/api/interviews/' + id + '/screen-video';

    this.httpClient.get(videoLink, {responseType: "blob"}).subscribe(
      blob => {
        this.videoBlobLink = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob))
      }
    )
    this.httpClient.get(screenVideoLink, {responseType: "blob"}).subscribe(
      blob => {
        this.screenVideoBlobLink = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob))
      }
    )

    this.httpClient.get('https://localhost:44423/api/interviews/' + id).subscribe((x: any) => {
      this.timeStops = x.timeStops.sort((a: any, b: any) => a.offset - b.offset);
    });
  }

  ngOnDestroy(): void {
  }
}
