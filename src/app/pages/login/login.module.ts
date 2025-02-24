import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import { RecaptchaModule } from "ng-recaptcha";
import { DirectivesModule } from '../../theme/directives/directives.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { PipesCustomModule } from '../pipes/pipes.module';
import { APICallService } from '../services/apicallservice.service';
import { LoginService } from '../services/login.service';
import { LoginResolver } from './loginresolver.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CookieService } from 'ngx-cookie-service';
import { LoginComponent } from './newlogin.component';
export const routes = [
    {
        path: '', component: LoginComponent,
        resolve: {
            getAgencyLogoRS: LoginResolver
        }
    }
];

@NgModule({
    imports: [PipesModule, PipesCustomModule, RecaptchaModule, LaddaModule,
        CommonModule, HttpClientModule, DirectivesModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild(routes), NgxDatatableModule
    ],
    providers: [APICallService, LoginService, LoginResolver, CookieService
    ],
    declarations: [LoginComponent],
})

export class LoginModule { }
