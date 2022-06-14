import {Component, Input, OnDestroy, OnInit} from '@angular/core';

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
