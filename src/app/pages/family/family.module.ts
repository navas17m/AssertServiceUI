import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//import { DataTableModule } from "angular2-datatable";
//import { CustomFormsModule } from 'ng2-validation';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { CommonInfoModule } from '../common/common.module';
import { FamilyComponet } from './family.component';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
    imports: [
        RouterModule, DirectivesModule
       // ,DataTableModule
        , PipesModule, CommonInfoModule,
        CommonModule, FormsModule, ReactiveFormsModule, //CustomFormsModule,
        NgSelectModule],
    declarations: [FamilyComponet],
    exports: [FamilyComponet]
})
export class FamilyInfoModule { }
