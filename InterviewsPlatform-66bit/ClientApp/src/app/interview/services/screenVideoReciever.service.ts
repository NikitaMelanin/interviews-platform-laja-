import {Injectable} from "@angular/core";

@Injectable()
export class ScreenVideoRecieverService {
  getVideo(): Promise<MediaStream> | null {
    if (ScreenVideoRecieverService.hasDisplayMedia()) {
      return navigator.mediaDevices.getDisplayMedia({video: true});
    }

    return null;
  }

  private static hasDisplayMedia(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia());
  }
}
