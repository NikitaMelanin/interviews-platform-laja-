import { HubConnection } from "@aspnet/signalr";
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class VideoSenderService {
  public SendOnAvailable(recorder: MediaRecorder, connection: HubConnection, fileId: string): void {
    recorder.ondataavailable = async (ev) => {
      if (connection) {
        await connection.invoke("AddBytes", fileId, this.ArrayBufferToBase64(await ev.data.arrayBuffer()))
      }
    }
  }

  private ArrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
