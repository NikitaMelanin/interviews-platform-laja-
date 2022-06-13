import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {NavMenuComponent} from './components/nav-menu/nav-menu.component';
import {HomeComponent} from './home/home.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {CreateVacancyComponent} from "./dashboard/components/create-vacancy/create-vacancy.component";
import {JwtInterceptor} from './_interceptors/jwt.interceptor';
import {AuthGuard} from "./_guards/auth.guard";
import {InterviewModule} from "./interview/interview.module";

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CreateVacancyComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent, pathMatch: 'full'},
      {path: 'auth', loadChildren: () => import('./auth/auth.module').then(x => x.AuthModule)},
      {
        path: 'interview',
        loadChildren: () => import('./interview/interview.module').then(x => x.InterviewModule),
        canActivate: []
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(x => x.DashboardModule),
        canActivate: [AuthGuard]
      },

    ]),
    NoopAnimationsModule,
    ReactiveFormsModule,
    InterviewModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
