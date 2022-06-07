import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {RouterModule} from "@angular/router";
import {VacancyComponent} from "./components/vacancy/vacancy.component";
import {VacancyEditComponent} from "./components/vacancy-edit/vacancy-edit.component";
import {ReactiveFormsModule} from "@angular/forms";
import {CreateVacancyComponent} from "./components/create-vacancy/create-vacancy.component";
import {InterviewWatchComponent} from "./components/interview-watch/interview-watch.component";
import {MinuteSecondsPipe} from "../_pipes/secondsToMinutes.pipe";
import {VacanciesInterviewsListComponent} from "./components/vacancies-interviews-list/vacancies-interviews-list.component";

@NgModule({
  declarations: [DashboardComponent, VacancyComponent, VacancyEditComponent, InterviewWatchComponent, MinuteSecondsPipe, VacanciesInterviewsListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: DashboardComponent, pathMatch: 'full'},
      {path: 'vacancy/create', component: CreateVacancyComponent, pathMatch: 'full'},
      {path: 'vacancy/:id/edit', component: VacancyEditComponent, pathMatch: 'full'},
      {path: 'vacancy/:id', component: VacancyComponent, pathMatch: 'full'},
      {path: 'interview/:interviewId', component: InterviewWatchComponent, pathMatch: 'full'},
      {path: 'vacancy/:id/interviews-list', component: VacanciesInterviewsListComponent, pathMatch: 'full'}
    ]),
    ReactiveFormsModule
  ]
})
export class DashboardModule {
}
