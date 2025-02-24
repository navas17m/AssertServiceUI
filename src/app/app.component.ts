import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'eCareApp',
  encapsulation: ViewEncapsulation.None,
  template:`<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss']
})

export class AppComponent { }

//This is to test dev branch.
