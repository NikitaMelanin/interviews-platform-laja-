import {Injectable} from '@angular/core';
import {SignalrScreenVideoUploaderService} from "./signalrScreenVideoUploader.service";

@Injectable()
export class ScreenVideoSenderService {
  constructor(private readonly uploaderService: SignalrScreenVideoUploaderService) {}

  public sendOnAvailable(recorder: MediaRecorder): void {
    recorder.ondataavailable = async (ev) => {
      this.uploaderService.sendBytes(ScreenVideoSenderService.arrayBufferToBase64(await ev.data.arrayBuffer()))
    }

    recorder.start(10);
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
