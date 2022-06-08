import {Injectable} from "@angular/core";
import {SignalrConnectorService} from "./signalrConnector.service";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class QuestionsReceiver {
  constructor(private readonly httpClient: HttpClient) {}

  async getQuestions(id: string): Promise<string[]> {
    // хз как
    this.httpClient.get(`/api/interviews/${id}/questions`).toPromise().then(x => {return JSON.parse(x.toString()) as string[]});
    return [];
  }
}
