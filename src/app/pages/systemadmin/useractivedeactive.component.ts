import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
//import { UserProfileService} from '../services/userprofile.service';
import { UserProfile } from './DTO/userprofile';
@Component({
    selector: 'UserActiveDeactive',
    templateUrl: './useractivedeactive.component.template.html'
   
})

export class UserActiveDeactiveComponent {
    @ViewChild('btnConfimationModel') lockModal: ElementRef;
    objUserProfile: UserProfile = new UserProfile();
    submitted = false;
    _Form: FormGroup;
    objQeryVal;
    isLoading: boolean = false;
    insUserProfile;
    actionType = "Deactivate";
    controllerName = "UserProfile";
    insCarerNames="";
    constructor(private apiService: APICallService,private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute, private _router: Router,
        private moduel: PagesComponent, private renderer: Renderer2) {
        this.activatedroute.params.subscribe(data => {
            this.objQeryVal = data;
        });
       
        this.BindUserDetails(this.objQeryVal.uid);

        if(this.actionType = "Deactivate")
        {
            this.apiService.get("CarerSocialWorkerMapping","GetAllBySocialWorkerId",this.objQeryVal.uid).then(data=>{
               data.forEach(element => {
                   this.insCarerNames+=element.PCFullName+element.SCFullName+" ("+element.CarerCode+"), ";
               });
            })
        }
    }

    BindUserDetails(UserProfileId) {
        // this.service.getbyid(userprofileid).then(data => {
            // this.objuserprofile = data;
            // if (data.activeflag == false)
                // this.actiontype = "activate"
        // });
		
		this.apiService.get(this.controllerName, "GetById", UserProfileId).then(data => {
            this.objUserProfile = data;
            if (data.ActiveFlag == false)
                this.actionType = "Activate";
        });
    }

  
    clicksubmit() {

        if(this.insCarerNames && this.actionType == "Deactivate")
        {
            let event = new MouseEvent('click', { bubbles: true });
            this.lockModal.nativeElement.dispatchEvent(event);

        }
        else{
            this.submitted = true;
            this.isLoading = true;
            //this.service.SetUserActiveDeactive(this.objUserProfile).then(data => this.Respone(data));
            this.apiService.post(this.controllerName, "SetUserActiveDeactive", this.objUserProfile).then(data => {
                this.Respone(data)
            });
        }
		
    }


    clickConfirmationSubmit(val) {

       
            this.submitted = true;
            this.isLoading = true;
            if(val==1)
              this.objUserProfile.IsReset=true;
            else
            this.objUserProfile.IsReset=false;
            //this.service.SetUserActiveDeactive(this.objUserProfile).then(data => this.Respone(data));
            this.apiService.post(this.controllerName, "SetUserActiveDeactive", this.objUserProfile).then(data => {
                this.Respone(data)
            });
        
		
    }


    private Respone(data) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.moduel.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.moduel.alertSuccess(Common.GetUpdateSuccessfullMsg);
            this._router.navigate(['/pages/systemadmin/userprofilelist/10']);
        }
    }
}

