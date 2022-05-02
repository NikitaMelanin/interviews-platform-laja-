import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {VideoRecorderService} from "./services/videoRecorder.service";
import {VideoSenderService} from "./services/videoSender.service";
import {VideoReceiverService} from "./services/videoReceiver.service";
import {SignalrVideoUploaderService} from "./services/signalrVideoUploader.service";
import {SignalrConnectorService} from "./services/signalrConnector.service";
import {SignalrQuestionsReceiver} from "./services/signalrQuestionsReceiver";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  providers: [
    VideoRecorderService,
    VideoSenderService,
    VideoReceiverService,
    SignalrVideoUploaderService,
    SignalrConnectorService,
    SignalrQuestionsReceiver
  ]
})

export class InterviewComponent implements OnInit, OnDestroy {
  video: MediaStream | undefined;

  private seconds!: number;
  private subscribe!: Subscription;
  private interviewId!: string;

  constructor(private readonly recorderService: VideoRecorderService,
              private readonly videoReceiverService: VideoReceiverService,
              private readonly questionsReceiverService: SignalrQuestionsReceiver,
              private readonly connectorService: SignalrConnectorService,
              private readonly route: ActivatedRoute,
              private readonly router: Router) {}

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
      if (document.hidden){
          console.log('hidden ', this.seconds);
      } else {
          console.log('visible ', this.seconds);
      }
  }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.interviewId = this.route.snapshot.paramMap.get("id")!;

    let video = this.videoReceiverService.getVideo();

    if (video) {
      video.then(async (stream) => {
        this.video = stream;
        await this.connectorService.start(this.interviewId)
        this.recorderService.record(stream);

        console.log(await this.questionsReceiverService.getQuestions())

        const source = timer(1000, 1000);
        this.subscribe = source.subscribe(x => this.seconds = x);
      })
    }
    else { /* написать пользователю, что видео нужно разрешить */ }
  }
}
