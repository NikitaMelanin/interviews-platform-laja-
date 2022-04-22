import {Injectable, OnDestroy} from "@angular/core";
import {HubConnection, HubConnectionBuilder} from "@aspnet/signalr";

@Injectable()
export class SignalrVideoUploaderService implements OnDestroy {
  private connection: HubConnection;
  private fileId: string | undefined;
  private connected: boolean;
  constructor() {
    this.connected = false;
    this.connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7070/interviews/hub")
      .build();

    this.connection.on("setFileId", (id) => {
      this.fileId = id;
    })
  }

  start(): Promise<void>{
    return this.connection.start().catch(console.error).then(() => { this.connected = true });
  }

  sendBytes(bytes: string): void{
    if (this.connected) {
      this.connection.invoke("AddBytes", this.fileId, bytes).catch(console.error);
    }
  }

  async ngOnDestroy(): Promise<void> {
    await this.connection.stop().then(() => this.connected = false);
  }
}
