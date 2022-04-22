import {Injectable} from "@angular/core";

@Injectable()
export class VideoReceiverService{
  getVideo(): Promise<MediaStream> | null {
    if (VideoReceiverService.hasGetUserMedia()){
      return navigator.mediaDevices.getUserMedia({video: true});
    }

    return null;
  }

  private static hasGetUserMedia(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
}

