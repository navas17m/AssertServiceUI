import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseDTO } from '../basedto';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { ContactValidator } from '../validator/contact.validator';
@Component({
    selector: 'ChangePassword',
    templateUrl: './changepassword.component.template.html',
})

export class ChangePasswordComponent {
    objChangePasswordDTO: ChangePasswordDTO = new ChangePasswordDTO();
    submitted = false;
    _Form: FormGroup;
    isLoading: boolean = false;

    constructor(private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute, private _router: Router,
        private moduel: PagesComponent,
        private apiService: APICallService) {

        this._Form = _formBuilder.group({
            Password: ['', Validators.required],
            // NewPassword: ['', [Validators.required,Validators.minLength(6),Validators.maxLength(20)]],
            NewPassword: ['', [Validators.required,ContactValidator.validatePassowrd]],
            ConfirmPassword: ['', Validators.required],
        });
    }
    isValid = true;
    clicksubmit(mainFormBuilder) {
        this.submitted = true;
        this.isValid = true;
        if (!mainFormBuilder.valid) {
            this.moduel.GetErrorFocus(mainFormBuilder);
        }

        if (this.objChangePasswordDTO.NewPassword != this.objChangePasswordDTO.ConfirmPassword) {
            this.isValid = false;
        }
        if (mainFormBuilder.valid && this.isValid) {
            this.isLoading = true;
            let type = "save";
            this.apiService.post("UserProfile", "ChangePassword", this.objChangePasswordDTO).then(data => this.Respone(data, type));          
        }
    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.moduel.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            Common.SetSession("Pwdchanged", "Pwdchanged");
            this._router.navigate(['/login']);
        }
    }



}

export class ChangePasswordDTO extends BaseDTO {
    LoginId: number;
    UserProfileId: number;
    CurrentPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
    Password: string;
}
