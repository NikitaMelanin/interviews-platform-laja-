import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {StartInterviewComponent} from "./components/start-interview/start-interview.component";
import {ProcessInterviewComponent} from "./components/process-interview/process-interview.component";
import {VideoComponent} from "./components/video/video.component";
import {EndInterviewComponent} from "./components/end-interview/end-interview.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {InfoComponent} from "./components/info/info.component";


@NgModule({
  declarations: [VideoComponent, EndInterviewComponent, StartInterviewComponent, ProcessInterviewComponent, InfoComponent],
  exports: [
    VideoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      // {path: ':id/introduction', component: ProcessInterviewComponent, pathMatch: 'full', canActivate: []},
      {path: 'ended', component: EndInterviewComponent, pathMatch: 'full', canActivate: []},
      {path: ':passLink/info', component: InfoComponent, pathMatch: 'full', canActivate: []},
      {path: ':passLink/start', component: StartInterviewComponent, pathMatch: 'full', canActivate: []},
      {path: ':id/process', component: ProcessInterviewComponent, pathMatch: 'full', canActivate: []},
    ]),
    ReactiveFormsModule,
    MatButtonModule
  ]
})
export class InterviewModule {
}
