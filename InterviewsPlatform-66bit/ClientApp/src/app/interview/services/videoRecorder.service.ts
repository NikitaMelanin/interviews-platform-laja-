import {Injectable, OnDestroy} from '@angular/core';
import {VideoSenderService} from "./videoSender.service";

@Injectable()
export class VideoRecorderService implements OnDestroy{
  private recorder!: MediaRecorder;
  constructor(private readonly senderService: VideoSenderService) {}

  public record(stream: MediaStream): void {
    this.recorder = new MediaRecorder(stream);
    this.senderService.sendOnAvailable(this.recorder);
  }

  ngOnDestroy(): void {
    this.recorder.stop()
  }
}
