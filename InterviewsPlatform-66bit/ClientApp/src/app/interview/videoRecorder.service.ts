import { HubConnection } from "@aspnet/signalr";
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class VideoRecorderService {
    public Record(recorder: MediaRecorder): void {
      recorder.start(10)
    }
  }
