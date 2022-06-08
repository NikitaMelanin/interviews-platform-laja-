import {Injectable} from "@angular/core";
import {SignalrConnectorService} from "./signalrConnector.service";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class QuestionsReceiver {
  constructor(private readonly httpClient: HttpClient) {}

  getQuestions(id: string): string[] {
    // хз как
    this.httpClient.get(`/api/interviews/${id}/questions`).subscribe((list) => {
      return Object.values(list)
    });

    return [];
  }
}
