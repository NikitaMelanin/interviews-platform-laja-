import {Injectable, OnDestroy} from '@angular/core';
import {ScreenVideoSenderService} from "./screen-video-sender.service";

@Injectable()
export class ScreenVideoRecorderService implements OnDestroy{
  private recorder!: MediaRecorder;
  constructor(private readonly senderService: ScreenVideoSenderService) {}

  public record(stream: MediaStream): void {
    this.recorder = new MediaRecorder(stream);
    this.senderService.sendOnAvailable(this.recorder);
  }

  ngOnDestroy(): void {
    this.recorder.stop()
  }
}
