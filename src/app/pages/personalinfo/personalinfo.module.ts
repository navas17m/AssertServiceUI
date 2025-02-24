import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { CustomFormsModule } from 'ng2-validation';
import { CommonInfoModule } from '../common/common.module';
import { APICallService } from '../services/apicallservice.service';
import { PersonalInfoComponet } from './personalinfo.component';

@NgModule({
    imports: [CommonModule, FormsModule, CommonInfoModule, ReactiveFormsModule//, CustomFormsModule
  ],
    declarations: [PersonalInfoComponet],

    exports: [PersonalInfoComponet],
    providers: [APICallService]
})
export class PersonalInfoModule { }
