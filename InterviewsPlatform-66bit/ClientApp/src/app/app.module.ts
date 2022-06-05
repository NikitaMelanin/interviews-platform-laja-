import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {NavMenuComponent} from './nav-menu/nav-menu.component';
import {HomeComponent} from './home/home.component';
import {InterviewComponent} from './interview/interview.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {CreateVacancyComponent} from "./dashboard/components/create-vacancy/create-vacancy.component";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {StartInterviewComponent} from "./start-interview/start-interview.component";
import {DashboardComponent} from "./dashboard/components/dashboard/dashboard.component";

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    InterviewComponent,
    CreateVacancyComponent,
    StartInterviewComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent, pathMatch: 'full'},
      {path: 'vacancy/:id', component: StartInterviewComponent, pathMatch: 'full'},
      {path: 'interview/:id', component: InterviewComponent, pathMatch: 'full'},
      {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(x => x.DashboardModule)},
    ]),
    NoopAnimationsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
