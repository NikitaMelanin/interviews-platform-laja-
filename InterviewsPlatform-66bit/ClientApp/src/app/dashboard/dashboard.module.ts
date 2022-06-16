import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VacanciesComponent} from "./components/vacancies/vacancies.component";
import {RouterModule} from "@angular/router";
import {VacancyComponent} from "./components/vacancy/edit/vacancy.component";
import {ReactiveFormsModule} from "@angular/forms";
import {CreateVacancyComponent} from "./components/create-vacancy/create-vacancy.component";
import {MainComponent} from "./components/interview/main/main.component";
import {MinuteSecondsPipe} from "../_pipes/secondsToMinutes.pipe";
import {CreateHrComponent} from "./components/create-hr/create-hr.component";
import {DashboardTemplateComponent} from "./components/dashboard-template/dashboard-template.component";
import {CandidatesComponent} from "./components/candidates/candidates.component";
import {InterviewsComponent} from "./components/vacancy/interviews/interviews.component";
import {CreateCandidateComponent} from "./components/create-candidate/create-candidate.component";
import {CreateInterviewComponent} from "./components/create-interview/create-interview.component";
import {SettingsComponent} from "./components/interview/settings/settings.component";

@NgModule({
  declarations: [
    DashboardTemplateComponent,
    CandidatesComponent,
    VacanciesComponent,
    CreateHrComponent,
    VacancyComponent,
    MainComponent,
    MinuteSecondsPipe,
    CreateCandidateComponent,
    CreateInterviewComponent,
    InterviewsComponent,
    SettingsComponent
  ],
  exports: [DashboardTemplateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: 'vacancies', component: VacanciesComponent, pathMatch: 'full'},
      {path: 'candidates', component: CandidatesComponent, pathMatch: 'full'},
      {path: 'hr/create', component: CreateHrComponent, pathMatch: 'full'},
      {path: 'candidate/:id/create', component: CreateCandidateComponent, pathMatch: 'full'},
      {path: 'vacancy/create', component: CreateVacancyComponent, pathMatch: 'full'},
      {path: 'vacancy/:id/interview/create', component: CreateInterviewComponent, pathMatch: 'full'},
      {path: 'vacancy/:id/interviews', component: InterviewsComponent, pathMatch: 'full'},
      {path: 'vacancy/:id/main', component: VacancyComponent, pathMatch: 'full'},
      {path: 'interview/:interviewId/settings', component: SettingsComponent, pathMatch: 'full'},
      {path: 'interview/:interviewId/main', component: MainComponent, pathMatch: 'full'},
    ]),
    ReactiveFormsModule
  ]
})
export class DashboardModule {
}
