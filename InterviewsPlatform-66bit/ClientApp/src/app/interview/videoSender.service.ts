import {Injectable} from '@angular/core';
import {SignalrVideoUploaderService} from "./signalrVideoUploader.service";

@Injectable()
export class VideoSenderService {
  constructor(private readonly uploader: SignalrVideoUploaderService) {}

  public sendOnAvailable(recorder: MediaRecorder): void {
    recorder.ondataavailable = async (ev) => {
      this.uploader.sendBytes(VideoSenderService.arrayBufferToBase64(await ev.data.arrayBuffer()))
    }

    this.uploader.start().then(() => recorder.start(10));
  }

  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
