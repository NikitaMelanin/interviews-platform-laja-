import {Injectable, OnDestroy} from "@angular/core";
import {HubConnection, HubConnectionBuilder} from "@aspnet/signalr";

@Injectable({ providedIn: "root" })
export class SignalrConnectorService implements OnDestroy {
  get connected(): boolean {
    return this._connected;
  }

  private readonly connection: HubConnection;
  private _connected: boolean;

  constructor() {
    this._connected = false;
    this.connection = new HubConnectionBuilder()
      .withUrl("/signalr/interviews/hub")
      .build();
  }

  start(interviewId: string): Promise<void> {
    if (!this._connected) {
      return this.connection.start().catch(console.error).then(async () => {
        this._connected = true
        await this.invoke("AttachStreamsToInterview", interviewId)
      });
    }

    return new Promise<void>(() => {});
  }

  on(methodName: string, func: (...args: any[]) => void): void{
    this.connection.on(methodName, func);
  }

  async invoke(methodName: string, ...args: any[]): Promise<any> {
    return this.connection.invoke(methodName, ...args)
  }

  async ngOnDestroy(): Promise<void> {
    this._connected = false
    await this.connection.stop();
  }
}
