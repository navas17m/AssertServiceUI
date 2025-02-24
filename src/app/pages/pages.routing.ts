import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './blank/blank.component';
import { PagesComponent } from './pages.component';
import { CarerInterestInfoComponet } from './recruitment/carerinterestinfo.component';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children:[
            { path:'', redirectTo:'dashboard', pathMatch:'full' },
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), data: { breadcrumb: 'Dashboard' } },
           
            //Our routing code start
            { path: 'carerinterestinfo', component: CarerInterestInfoComponet, data: { breadcrumb: 'Carer Interest Info' } },
            { path: 'systemadmin', loadChildren: () => import('./systemadmin/systemadmin.module').then(m => m.SystemAdminModule), data: { breadcrumb: 'تسجيل الأصول' } },
            //{ path: 'referral', loadChildren: 'app/pages/child/child.module#ChildModule', data: { breadcrumb: 'Referral' } },
            //End
           
			//RecruitmentModule
            
            { path: 'fostercarer', loadChildren: () => import('./fostercarer/fostercarer.module').then(m => m.FosterCarerModule), data: { breadcrumb: 'Foster Carer' } },
           
            { path: 'referral', loadChildren: () => import('./child/referral.module').then(m => m.ReferralModule), data: { breadcrumb: 'Referral' } },
            { path: 'child', loadChildren: () => import('./fosterchild/child.module').then(m => m.ChildModule), data: { breadcrumb: 'Foster Child' } },
                     
            { path: 'ofsted', loadChildren: () => import( './ofsted/ofsted.module').then(m => m.OfstedModule), data: { breadcrumb: 'Ofsted' } },
            { path: 'staffarea', loadChildren: () => import( './staffarea/staffarea.module').then(m => m.StaffAreaModules), data: { breadcrumb: 'Staff Area' } }
        ]
    }
];
export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);
