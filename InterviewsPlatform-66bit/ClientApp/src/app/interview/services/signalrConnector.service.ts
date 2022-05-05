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
      .withUrl("/signalr/interview/hub")
      .build();
  }

  start(interviewId: string): Promise<void> {
    if (!this._connected) {
      return this.connection.start().catch(console.error).then(async () => {
        this._connected = true
        await this.invoke("StartUploading", interviewId)
      });
    }

    return new Promise<void>(() => {});
  }

  async invoke(methodName: string, ...args: any[]): Promise<any> {
    return this.connection.invoke(methodName, ...args)
  }

  async ngOnDestroy(): Promise<void> {
    this._connected = false
    await this.connection.stop();
  }
}
