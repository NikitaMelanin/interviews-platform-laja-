import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class QuestionsReceiver {
  constructor(private readonly httpClient: HttpClient) {
  }

  getQuestions(id: string) {
    return this.httpClient.get<string[]>(`/api/interviews/${id}/questions`);
  }
}
