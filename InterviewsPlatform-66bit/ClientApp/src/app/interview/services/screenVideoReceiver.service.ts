import {Injectable} from "@angular/core";

@Injectable()
export class ScreenVideoReceiverService {
  getVideo(): Promise<MediaStream> | null {
    if (navigator && navigator.mediaDevices) {
      return navigator.mediaDevices.getDisplayMedia({video: true});
    }

    return null;
  }
}
