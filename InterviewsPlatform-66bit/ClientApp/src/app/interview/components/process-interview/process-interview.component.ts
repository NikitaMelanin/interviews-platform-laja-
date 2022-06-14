import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {VideoRecorderService} from "../../services/videoRecorder.service";
import {VideoSenderService} from "../../services/videoSender.service";
import {VideoReceiverService} from "../../services/videoReceiver.service";
import {SignalrVideoUploaderService} from "../../services/signalrVideoUploader.service";
import {SignalrConnectorService} from "../../services/signalrConnector.service";
import {QuestionsReceiver} from "../../services/questions-receiver.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {ScreenVideoReceiverService} from "../../services/screenVideoReceiver.service";
import {HttpClient} from "@angular/common/http";
import {ScreenVideoRecorderService} from "../../services/screen-video-recorder.service";
import {ScreenVideoSenderService} from "../../services/screen-video-sender.service";
import {SignalrScreenVideoUploaderService} from "../../services/signalrScreenVideoUploader.service";


@Component({
  selector: 'app-process-interview',
  templateUrl: './process-interview.component.html',
  styleUrls: ['./process-interview.component.css'],
  providers: [
    VideoRecorderService,
    VideoSenderService,
    VideoReceiverService,
    ScreenVideoRecorderService,
    ScreenVideoSenderService,
    ScreenVideoReceiverService,
    SignalrScreenVideoUploaderService,
    SignalrVideoUploaderService,
    SignalrConnectorService,
    QuestionsReceiver,
    MatButtonModule,
    MatCardModule
  ]
})


export class ProcessInterviewComponent implements OnInit, OnDestroy {
  private videoToRecord!: MediaStream;
  video!: MediaStream;
  screenVideo!: MediaStream;
  currentQuestion!: string | undefined;
  buttonName: string;

  questions: string[] = [];
  currentQuestionIndex = 0;

  isAllWork = false;
  isCameraWork = true;
  isScreenWork = true;

  seconds!: number;
  subscribe!: Subscription;
  interviewId!: string;

  constructor(
    private readonly videoRecorderService: VideoRecorderService,
    private readonly screenVideoRecorderService: ScreenVideoRecorderService,
    private readonly videoReceiverService: VideoReceiverService,
    private readonly screenReceiverService: ScreenVideoReceiverService,
    private readonly questionsReceiverService: QuestionsReceiver,
    private readonly connectorService: SignalrConnectorService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly httpClient: HttpClient
  ) {
    this.buttonName = "Next";
  }


  async ngOnInit(): Promise<void> {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.interviewId = this.route.snapshot.paramMap.get("id")!;
    try {
      this.videoToRecord = await this.videoReceiverService.getVideo()!;
      this.video = new MediaStream(this.videoToRecord.getVideoTracks());
    } catch (e) {
      this.isCameraWork = false;
    }
    try {
      this.screenVideo = await this.screenReceiverService.getVideo()!;
    } catch (e) {
      this.isScreenWork = false;
    }
  }

  async start() {
    this.isAllWork = true;
    await this.connectorService.start(this.interviewId)
    this.RecordVideo(this.videoToRecord);
    this.RecordScreen(this.screenVideo);
    this.questionsReceiverService.getQuestions(this.interviewId).subscribe(x => {
      this.questions = x;
    });
    const source = timer(1000, 1000);
    this.subscribe = source.subscribe(x => {
      this.seconds = x;
    });
  }

  stopRecord() {
    if (this.videoToRecord) {
      this.videoToRecord.getVideoTracks().forEach(x => x.stop());
    }
    this.subscribe.unsubscribe();
  }

  ngOnDestroy(): void {
    this.stopRecord();
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

  RecordVideo(video: MediaStream): void {
    this.videoToRecord = video;
    this.videoRecorderService.record(video);
  }

  RecordScreen(screenVideo: MediaStream): void {
    this.screenVideo = screenVideo
    this.screenVideoRecorderService.record(screenVideo);
  }

  nextQuestion() {
    if (this.buttonName == "Done") {
      this.stopRecord();
      this.router.navigate(["interview", "ended"]);
      return;
    }
    if (this.currentQuestionIndex + 1 === this.questions.length - 1) {
      this.buttonName = "Done";
    }
    this.currentQuestionIndex += 1;
  }
}
