import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//export const routes = [];
import { PipesCustomModule } from '../pipes/pipes.module';
import { APICallService } from '../services/apicallservice.service'; //RecruitmentModule, RouterModule.forChild(routes)
import { ApplicantHeaderComponet } from './applicantheader.component';
import { CarerHeaderComponet } from './carerheader.component';
import { ChildProfileHeaderComponet } from './childprofileheader.component';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PipesCustomModule],
    providers: [APICallService],
    declarations: [ChildProfileHeaderComponet, ApplicantHeaderComponet, CarerHeaderComponet],
    exports: [ChildProfileHeaderComponet, ApplicantHeaderComponet, CarerHeaderComponet]

})

export class HeaderModule { }
