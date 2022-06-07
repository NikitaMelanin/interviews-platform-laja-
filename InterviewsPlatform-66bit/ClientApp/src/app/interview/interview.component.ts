import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {VideoRecorderService} from "./services/videoRecorder.service";
import {VideoSenderService} from "./services/videoSender.service";
import {VideoReceiverService} from "./services/videoReceiver.service";
import {SignalrVideoUploaderService} from "./services/signalrVideoUploader.service";
import {SignalrConnectorService} from "./services/signalrConnector.service";
import {QuestionsReceiver} from "./services/questions-receiver.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {ScreenVideoReceiverService} from "./services/screenVideoReceiver.service";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.css'],
  providers: [
    VideoRecorderService,
    VideoSenderService,
    VideoReceiverService,
    ScreenVideoReceiverService,
    SignalrVideoUploaderService,
    SignalrConnectorService,
    QuestionsReceiver,
    MatButtonModule,
    MatCardModule
  ]

})


export class InterviewComponent implements OnInit, OnDestroy {
  video: MediaStream | undefined;
  screenVideo: MediaStream | undefined;
  currentQuestion: string | undefined;
  buttonName: string;

  private seconds!: number;
  private subscribe!: Subscription;
  private interviewId!: string;
  private questionsIterator!: IterableIterator<[number, string]>;

  constructor(
    private readonly videoRecorderService: VideoRecorderService,
    private readonly screenVideoRecorderService: VideoRecorderService,
    private readonly videoReceiverService: VideoReceiverService,
    private readonly screenReceiverService: ScreenVideoReceiverService,
    private readonly questionsReceiverService: QuestionsReceiver,
    private readonly connectorService: SignalrConnectorService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly httpClient: HttpClient
  ) {
    this.buttonName = "Далее";
  }

  ngOnDestroy(): void {
    if (this.video) {
      this.video.getVideoTracks().forEach(x => x.stop());
    }
    this.subscribe.unsubscribe();
  }

  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    this.checkHiddenDocument();
  }

  checkHiddenDocument() {
    if (document.hidden) {
      this.makeTimestop('Ушел со вкладки', this.seconds);
      console.log('hidden ', this.seconds);
    } else {
      this.makeTimestop('Вернулся со вкладки', this.seconds);
      console.log('visible ', this.seconds);
    }
  }

  async makeTimestop(title: string, offset: number) {
    this.httpClient.patch('https://localhost:44423/api/interviews/' + this.interviewId + '/time-stops', {
      timeStops: [{title, offset}]
    }).subscribe(x => {
    });
  }

  async ngOnInit(): Promise<void> {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.interviewId = this.route.snapshot.paramMap.get("id")!;

    let video = await this.videoReceiverService.getVideo();
    let screenVideo = await this.screenReceiverService.getVideo();

    if (video && screenVideo) {
      await this.connectorService.start(this.interviewId)

      this.RecordVideo(video);
      this.RecordScreen(screenVideo);
      // вот здесь в interviewId точно pass-link?
      this.questionsIterator = (await this.questionsReceiverService.getQuestions(this.interviewId)).entries();
      const source = timer(1000, 1000);
      this.subscribe = source.subscribe(x => {
        this.seconds = x;
      });
    }
  }

  RecordVideo(video: MediaStream): void {
    this.video = video;

    this.videoRecorderService.record(video);
  }

  RecordScreen(screenVideo: MediaStream): void {
    this.screenVideo = screenVideo

    this.screenVideoRecorderService.record(screenVideo);
  }

  nextQuestion() {
    if (this.buttonName === "Далее") {
      let question = this.questionsIterator.next();
      if (question.done) {
        this.buttonName = "Завершить";
        this.currentQuestion = "";
      } else {
        this.currentQuestion = question.value[1];
      }
    } else {
      this.router.navigate(["/"]);
    }
  }
}
