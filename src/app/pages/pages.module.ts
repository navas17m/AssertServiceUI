/// <reference path="common/common.module.ts" />
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppState } from '../app.state';
import { BackTopComponent } from '../theme/components/back-top/back-top.component';
import { BreadcrumbComponent } from '../theme/components/breadcrumb/breadcrumb.component';
import { MenuComponent } from '../theme/components/menu/menu.component';
import { MessagesComponent } from '../theme/components/messages/messages.component';
import { NavbarComponent } from '../theme/components/navbar/navbar.component';
import { DirectivesModule } from '../theme/directives/directives.module';
import { PipesModule } from '../theme/pipes/pipes.module';
import { BlankComponent } from './blank/blank.component';
import { CommonInfoModule } from './common/common.module';
import { PagesComponent } from './pages.component';
import { routing } from './pages.routing';
import { PipesCustomModule } from './pipes/pipes.module';
import { CarerInterestInfoComponet } from './recruitment/carerinterestinfo.component';
import { RedirectComponent } from "./redirect.component";
import { SearchComponent } from './search/search.component';
import { APICallService } from './services/apicallservice.service';
import { NgScrollbarModule } from 'ngx-scrollbar';
@NgModule({
    imports: [CommonInfoModule,
        CommonModule, PipesCustomModule,
        DirectivesModule,
        PipesModule,
        routing,
        HttpClientModule, FormsModule, ReactiveFormsModule,NgScrollbarModule
    ],

    declarations: [
        PagesComponent,
        BlankComponent,
        MenuComponent,
        NavbarComponent,
        MessagesComponent,
        BreadcrumbComponent,
        BackTopComponent,
        SearchComponent,
        CarerInterestInfoComponet,
         RedirectComponent
    ]
    ,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [AppState, APICallService ]
})
export class PagesModule { }
