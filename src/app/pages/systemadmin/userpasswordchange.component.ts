import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//import { CookieService } from 'angular2-cookie/core';
import { BaseDTO } from '../basedto';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserProfile } from './DTO/userprofile';
import { CookieService } from 'ngx-cookie-service';
@Component({
    selector: 'UsrChangePassword',
    templateUrl: './userpasswordchange.component.template.html',
    //providers: [CookieService]
})

export class UserChangePasswordComponent {
    objUserProfile: UserProfile = new UserProfile();
    objChangePasswordDTO: ChangePasswordDTO = new ChangePasswordDTO();
    submitted = false;
    _Form: FormGroup;
    isLoading: boolean = false;
    objQeryVal;

    constructor(private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute, private _router: Router,
        private moduel: PagesComponent,
        private apiService: APICallService,
        private _cookieService: CookieService) {

        this.activatedroute.params.subscribe(data => {
            this.objQeryVal = data;
        });

        this.BindUserDetails(this.objQeryVal.uid);

        this._Form = _formBuilder.group({
            NewPassword: ['', Validators.required],
            ConfirmPassword: ['', Validators.required],
        });
    }

    BindUserDetails(UserProfileId) {
        this.apiService.get("UserProfile", "GetById", UserProfileId).then(data => {
            this.objUserProfile = data;
        });
    }


    isValid = true;
    clicksubmit(mainFormBuilder) {
        this.submitted = true;
        this.isValid = true;
        if (!mainFormBuilder.valid) {
            this.moduel.GetErrorFocus(mainFormBuilder);
        }
        this.objChangePasswordDTO.UserProfileId = this.objUserProfile.UserProfileId;
        if (this.objChangePasswordDTO.NewPassword != this.objChangePasswordDTO.Password) {
            this.isValid = false;
        }
        if (mainFormBuilder.valid && this.isValid) {
            this.isLoading = true;
            let type = "save";
            this.apiService.post("UserProfile", "LoginChangePassword", this.objChangePasswordDTO).then(data => this.Respone(data, type));
        }
    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.moduel.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            if (parseInt(Common.GetSession("UserProfileId")) == this.objUserProfile.UserProfileId) {
                Common.SetSession("UserPwd", this.objChangePasswordDTO.Password);
                //this._cookieService.remove("autho");
                //this._cookieService.put("autho", window.btoa(Common.GetSession("LoginId") + ':' + this.objChangePasswordDTO.Password + ':' + Common.GetSession("AgencyProfileId")));
                this._cookieService.delete("autho");
                this._cookieService.set("autho", window.btoa(Common.GetSession("LoginId") + ':' + this.objChangePasswordDTO.Password + ':' + Common.GetSession("AgencyProfileId")));
            }
            this.moduel.alertSuccess(Common.GetUpdateSuccessfullMsg);
            this._router.navigate(['/pages/systemadmin/userprofilelist/10']);
        }
    }
}

export class ChangePasswordDTO extends BaseDTO {
    LoginId: number;
    UserProfileId: number;
    CurrentPassword: string;
    NewPassword: string;
    Password: string;
}
