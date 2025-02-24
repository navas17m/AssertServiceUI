import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { DashboardComponent } from './dashboard.component';
import { TodoComponent } from './todo/todo.component';
import { ChatComponent } from './chat/chat.component';
import { FeedComponent } from './feed/feed.component';
import { DatamapComponent } from './datamap/datamap.component';
import { DynamicChartComponent } from './dynamic-chart/dynamic-chart.component';
import { NgChartsModule } from 'ng2-charts';
import 'chart.js/dist/Chart.js';
import {PipesCustomModule } from '../pipes/pipes.module';
import { DashboardResolver } from './dashbordresolver.service';
import { DashboardService} from '../services/dashboard.service';
import { APICallService } from '../services/apicallservice.service';
import { CommonInfoModule } from '../common/common.module';

export const routes:Routes = [
    {
        path: '', component: DashboardComponent, pathMatch: "full",
        resolve: {
            getDashboarDataRS: DashboardResolver
        }
    }
    //,
    //{
    //  path: 'dashboard', component: DashboardComponent,
    //  resolve: {
    //    test: DashboardResolver
    //  }
    //}
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgChartsModule,
        DirectivesModule, CommonInfoModule,
        PipesModule, PipesCustomModule,
        RouterModule.forChild(routes)
    ],
    providers: [DashboardResolver, APICallService,DashboardService],
    declarations: [
        DashboardComponent,
        TodoComponent,
        ChatComponent,
        FeedComponent,
        DatamapComponent,
        DynamicChartComponent
    ]
})

export class DashboardModule { }
