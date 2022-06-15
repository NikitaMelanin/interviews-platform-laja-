import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VacanciesComponent} from "./components/vacancies/vacancies.component";
import {RouterModule} from "@angular/router";
import {VacancyComponent} from "./components/vacancy/vacancy.component";
import {VacancyEditComponent} from "./components/vacancy-edit/vacancy-edit.component";
import {ReactiveFormsModule} from "@angular/forms";
import {CreateVacancyComponent} from "./components/create-vacancy/create-vacancy.component";
import {InterviewWatchComponent} from "./components/interview-watch/interview-watch.component";
import {MinuteSecondsPipe} from "../_pipes/secondsToMinutes.pipe";
import {
  VacanciesInterviewsListComponent
} from "./components/vacancies-interviews-list/vacancies-interviews-list.component";
import {CreateHrComponent} from "./components/create-hr/create-hr.component";
import {DashboardTemplateComponent} from "./components/dashboard-template/dashboard-template.component";
import {CandidatesComponent} from "./components/candidates/candidates.component";

@NgModule({
  declarations: [
    DashboardTemplateComponent,
    CandidatesComponent,
    VacanciesComponent,
    CreateHrComponent,
    VacancyComponent,
    VacancyEditComponent,
    InterviewWatchComponent,
    MinuteSecondsPipe,
    VacanciesInterviewsListComponent,
  ],
  exports: [DashboardTemplateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: 'vacancies', component: VacanciesComponent, pathMatch: 'full'},
      {path: 'candidates', component: CandidatesComponent, pathMatch: 'full'},
      {path: 'hr/create', component: CreateHrComponent, pathMatch: 'full'},
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
