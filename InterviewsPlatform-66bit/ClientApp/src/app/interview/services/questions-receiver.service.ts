import {Injectable} from "@angular/core";
import {SignalrConnectorService} from "./signalrConnector.service";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class QuestionsReceiver {
  constructor(private readonly httpClient: HttpClient) {}

  async getQuestions(id: string): string[] {
    // хз как
    this.httpClient.get(`/interviews/${id}`).toPromise().then(x => {return x as string[]});
    return [];
  }
}
