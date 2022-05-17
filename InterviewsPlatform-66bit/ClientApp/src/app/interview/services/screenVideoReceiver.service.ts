import {Injectable} from "@angular/core";

@Injectable()
export class ScreenVideoReceiverService {
  getVideo(): Promise<MediaStream> | null {
    if (ScreenVideoReceiverService.hasDisplayMedia()) {
      return navigator.mediaDevices.getDisplayMedia({video: true});
    }

    return null;
  }

  private static hasDisplayMedia(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia());
  }
}
