import {Injectable} from "@angular/core";
import {SignalrConnectorService} from "./signalrConnector.service";

@Injectable()
export class SignalrVideoUploaderService {
  constructor(private readonly connectorService: SignalrConnectorService) {}

  sendBytes(bytes: string): void {
    if (this.connectorService.connected) {
      this.connectorService.invoke("AddBytes", bytes).catch(console.error);
    }
  }
}
