import {Injectable} from "@angular/core";
import {SignalrConnectorService} from "./signalrConnector.service";

@Injectable()
export class SignalrScreenVideoUploaderService {
  constructor(private readonly connectorService: SignalrConnectorService) {
  }

  sendBytes(bytes: string): void {
    if (this.connectorService.connected) {
      this.connectorService.invoke("AddScreenVideoBytes", bytes)
        .catch(console.error);
    }
  }
}
