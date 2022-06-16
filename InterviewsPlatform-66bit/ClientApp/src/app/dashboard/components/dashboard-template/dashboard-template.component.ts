import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {IRoute} from "../routes";


@Component({

  selector: 'app-dashboard-template',
  templateUrl: './dashboard-template.component.html',
  styleUrls: ['./dashboard-template.component.css']
})
export class DashboardTemplateComponent implements OnInit {

  @Input() body!: TemplateRef<any>;
  @Input() sideRoutes!: IRoute[];
  @Input() additionalRoutes!: IRoute[];

  constructor() {
  }


  ngOnInit(): void {
  }
}
