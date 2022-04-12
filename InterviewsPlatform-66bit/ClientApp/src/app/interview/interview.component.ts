import { Component } from '@angular/core';
import { HubConnectionBuilder} from "@aspnet/signalr";

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html'
})

export class InterviewComponent {
  public video: MediaStream | undefined;

  constructor() {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          this.video = stream;
          let recorder: MediaRecorder;
          recorder = new MediaRecorder(this.video);

          let connection = new HubConnectionBuilder()
            .withUrl("https://localhost:7070/interviews/hub")
            .build();

          let fileId: string;
          connection.on("setFileId", (id) => {
            fileId = id;
          })

          recorder.ondataavailable = async (ev) => {
            await connection.invoke("AddBytes", fileId, InterviewComponent.ArrayBufferToBase64(await ev.data.arrayBuffer()))
          }

          window.onbeforeunload = async () => {
            await connection.stop()
          }

          connection.start().then(() => {
            recorder.start(10)
          });
        })
    }
  }

  private static ArrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa( binary );
  }
}
