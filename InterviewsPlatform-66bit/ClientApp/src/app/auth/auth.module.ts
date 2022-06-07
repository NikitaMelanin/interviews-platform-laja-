import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";

import {AuthComponent} from "./auth.component";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'login',
        component: AuthComponent,
      }
    ]),
    ReactiveFormsModule
  ]
})
export class AuthModule {
}
