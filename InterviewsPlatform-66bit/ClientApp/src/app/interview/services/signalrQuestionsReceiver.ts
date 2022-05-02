import {Injectable} from "@angular/core";
import {SignalrConnectorService} from "./signalrConnector.service";

@Injectable()
export class SignalrQuestionsReceiver {
  constructor(private readonly connector: SignalrConnectorService) {}

  async getQuestions(): Promise<string[]> {
    if (this.connector.connected) {
      return this.connector.invoke("GetQuestions")
    }

    return [];
  }
}
