import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {VideoRecorderService} from "./videoRecorder.service";
import {VideoSenderService} from "./videoSender.service";
import {VideoReceiverService} from "./videoReceiver.service";
import {SignalrVideoUploaderService} from "./signalrVideoUploader.service";

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  providers: [VideoRecorderService, VideoSenderService, VideoReceiverService, SignalrVideoUploaderService]
})

export class InterviewComponent implements OnInit, OnDestroy {
  video: MediaStream | undefined;

  private seconds!: number;
  private subscribe!: Subscription;

  constructor(private readonly recorderService: VideoRecorderService,
              private readonly receiverService: VideoReceiverService) {}

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

  checkHiddenDocument(){
      if (document.hidden){
          console.log('hidden ', this.seconds);
      } else {
          console.log('visible ', this.seconds);
      }
  }

  ngOnInit(): void {
    let video = this.receiverService.getVideo();
    if (video){
      video.then((stream) => {
        this.video = stream;
        this.recorderService.record(stream);

        const source = timer(1000, 1000);
        this.subscribe = source.subscribe(x => this.seconds = x);
      })
    }
    else { /* написать пользователю, что видео нужно разрешить */ }
  }
}
