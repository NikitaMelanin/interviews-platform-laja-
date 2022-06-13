import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {VideoRecorderService} from "../../services/videoRecorder.service";
import {VideoReceiverService} from "../../services/videoReceiver.service";
import {ScreenVideoReceiverService} from "../../services/screenVideoReceiver.service";
import {QuestionsReceiver} from "../../services/questions-receiver.service";
import {SignalrConnectorService} from "../../services/signalrConnector.service";
import {timer} from "rxjs";
import {VideoSenderService} from "../../services/videoSender.service";
import {SignalrVideoUploaderService} from "../../services/signalrVideoUploader.service";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
  providers: []
})


export class VideoComponent implements OnInit, OnDestroy {

  @Input() video: MediaStream | undefined;
  @Input() screenVideo: MediaStream | undefined;


  constructor() {
  }


  async ngOnInit(): Promise<void> {

  }

  ngOnDestroy(): void {

  }

}
