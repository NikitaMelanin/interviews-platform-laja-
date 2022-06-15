import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";


@Component({

  selector: 'app-dashboard-template',
  templateUrl: './dashboard-template.component.html',
  styleUrls: ['./dashboard-template.component.css']
})
export class DashboardTemplateComponent implements OnInit {
  findForm!: FormGroup;
  filter: string = '';

  @Input() body!: TemplateRef<any>;

  constructor() {
  }


  ngOnInit(): void {
    this.findForm = new FormGroup({
      find: new FormControl('')
    });
  }

  onSubmit() {
    // const value = this.findForm.controls['find'].value.toLocaleLowerCase() || '';
    // if (value === '') {
    //   this.vacancies = this.allVacancies;
    //   return;
    // }
    // this.vacancies = this.vacancies.filter(x => {
    //   return x.name.toLocaleLowerCase().includes(value)
    // });
  }


}
