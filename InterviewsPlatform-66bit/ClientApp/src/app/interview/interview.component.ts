import {Component, OnDestroy, OnInit} from '@angular/core';
import {HubConnection, HubConnectionBuilder} from "@aspnet/signalr";
import {VideoRecorderService} from "./videoRecorder.service";
import {VideoSenderService} from "./videoSender.service";

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html'
})

export class InterviewComponent implements OnInit, OnDestroy {
  public video: MediaStream | undefined;
  public connection?: HubConnection;
  public recorder?: MediaRecorder;

  constructor(private readonly videoRecorderService: VideoRecorderService, 
            private readonly videoSenderService: VideoSenderService) {
  }

  ngOnDestroy(): void {
    if (this.recorder) {
      this.recorder.stop();
    }
  
    window.onbeforeunload = async () => {
      if (this.connection) {
        await this.connection.stop();
      }
    }
    if (this.video) {
      this.video.getVideoTracks().forEach(x => x.stop());
    }
  }
  ngOnInit(): void {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: true})
        .then((stream) => {
          this.video = stream;
          this.connection = new HubConnectionBuilder()
            .withUrl("https://localhost:7070/interviews/hub")
            .build();
          let fileId: string;
          this.recorder = new MediaRecorder(this.video);

          this.connection.on("setFileId", (id) => {
            fileId = id;
          })
          this.connection.start().then(() => {
            if (this.recorder)
              this.videoRecorderService.Record(this.recorder);
          }).catch(e => console.error(e.toString()));

          // @ts-ignore
          this.videoSenderService.SendOnAvailable(this.recorder, this.connection, fileId);
        })
    }
  }
}