import { Injectable } from '@angular/core';
import {  Resolve } from '@angular/router';
import { Common } from '../common';
import { APICallService } from '../services/apicallservice.service';

@Injectable()
export class DashboardResolver implements Resolve<any> {
    objDashboardDTO: DashboardDTOInfo = new DashboardDTOInfo();
    constructor(private apiService: APICallService) {

    }
    resolve() {
        if (Common.GetSession("IsAppAccessUser") != null && Common.GetSession("IsAppAccessUser") != "0") {
            this.objDashboardDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objDashboardDTO.UserTypeId = parseInt(Common.GetSession("UserTypeId"));
            this.objDashboardDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
            //return this.apiService.post("Dashboard", "GetDashboardInfo", this.objDashboardDTO);
            return this.apiService.post("Dashboard", "GetDashboardInfoLanding", this.objDashboardDTO);
        }
        else return null;

    }
}

export class DashboardDTOInfo {

    AgencyProfileId: number;
    UserTypeId: number;
    UserProfileId: number;

}
