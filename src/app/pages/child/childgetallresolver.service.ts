
import { Injectable } from '@angular/core';
import { ChildProfile } from './DTO/childprofile';
import {  Resolve } from '@angular/router';
import { Common} from '../common';
import { APICallService } from '../services/apicallservice.service';
 
@Injectable()
export class ChildGetAllResolver implements Resolve<any> {   
    objChildProfile: ChildProfile = new ChildProfile();    
    constructor(private apiService: APICallService) {     
    }
    resolve() {
        this.objChildProfile.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        return this.apiService.post("ChildProfile","GetAllForSiblingNParent",this.objChildProfile);      
    } 
}
