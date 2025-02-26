/// <reference path="../services/apicallservice.service.ts" />
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { environment } from '../../../environments/environment';
import { Common } from '../common';
import { LoginService } from '../services/login.service';
import { UserSecretQustionInfoDTO } from './usersecretqustioninfodto';
import { ContactValidator } from '../validator/contact.validator';
declare var window: any;
import { CookieService } from 'ngx-cookie-service';
import { UserAuditHistoryDTO } from '../common';
//Commit check
@Component({
    selector: 'eCarelogin',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './newlogin.component.template.html',
    styleUrls: ['./newlogin.component.scss'],

    providers: [LoginService,
      CookieService
    ],

})
export class LoginComponent {
    isLoadingValue = false;
    isLoadingValueForgotPWD = false;
    isLoadingValueSaveSecretQuestio = false;
    isLoadingValueSecurityQuestion = false;
    isLoadingValueChangePassword = false;
    controllerName = "UserProfile";
    errorMessageNewVisi = false;
    ForgotPasswordVisible = false;
    submitted = false;
    submittedChangePwd = false;
    public router: Router;
    public form: FormGroup;
    public formForgotPwd: FormGroup;
    public formChangePwd: FormGroup;
    public username: AbstractControl;
    public password: AbstractControl;
    objUserSecretQustionInfoDTO: UserSecretQustionInfoDTO = new UserSecretQustionInfoDTO();
    objUserAuditHistoryDTO: UserAuditHistoryDTO = new UserAuditHistoryDTO();
    errorMessage = false; showErrorMsg = false;
    objLogin: Login = new Login();
    objUser: UserDetails = new UserDetails();
    loginVisible = true; agencyVisible = false; lstAgencyProfile;
    errorMessageString; showCaptcha = false; attempts: number = 0;
    publicKey = environment.captchaPublicKey;
    lstSecretQuestions; secretQuestionVisible = false;
    securityQuestionVisible = false; securityQuestion; userSecretQustionId;
    dbUserSecretQustionId: string;
    securityAnswer;
    rememberQuestion = false;
    logoPath;
    IsPwdChangeNeeded = false;
    IsPwdChangeNeededVisible = false;
    objQeryVal;
    visibleSessionOutMsg = false;
    url: string;
    public searchText: string = "";
    filteredList=[];

    // variable
    show_button: Boolean = false;
    show_eye: Boolean = false;

    //Function
    showPassword() {
        this.show_button = !this.show_button;
        this.show_eye = !this.show_eye;
    }

    constructor(router: Router, private route: ActivatedRoute, fb: FormBuilder,
      private loService: LoginService, private _cookieService: CookieService) {
        this.route.params.subscribe(data => {
            this.objQeryVal = data;
            if (this.objQeryVal.id == 0) {
                this.visibleSessionOutMsg = true;
            }
        });

        let data = this.route.snapshot.data['getAgencyLogoRS'];
        this.Response(data);
        //console.log(data);

        this.router = router;
        if (Common.GetSession("Pwdchanged") != null) {
            this.errorMessageNewVisi = true;
            this.errorMessageString = "Password changed successfully.";
            this.errorMessage = false;
        }

        this.form = fb.group({
            //'username': ['', Validators.compose([Validators.required, emailValidator])],
            'username': ['', Validators.compose([Validators.required])],
            'password': ['', Validators.compose([Validators.required])],
            // 'MunicipalId': ['0',Validators.required]
            
        });

        this.formForgotPwd = fb.group({
            //'username': ['', Validators.compose([Validators.required, emailValidator])],
            'username': ['', Validators.compose([Validators.required])],
            'email': ['', Validators.compose([Validators.required, emailValidator])]
        });

        this.formChangePwd = fb.group({
            'Password': ['', [Validators.required,ContactValidator.validatePassowrd]],
            'ConfirmPassword': ['', Validators.required],
            
        });
        
        loService.getMunicipalList().then(data => { this.lstAgencyProfile = data       
           //console.log(this.lstAgencyProfile);
        });
        Common.IsUserLogin.next(false);
        Common.ClearSession();
        Common.SetSession("pagelength", window.history.length);
        Common.SetSession("AgencyLogo", this.logoPath);
        // this._cookieService.remove("autho");
        this.username = this.form.controls['username'];
        this.password = this.form.controls['password'];
        //  this.loService.GetAllSecretQuestions().then(data => { this.lstSecretQuestions = data; });

    }
    IsAgencyVisible: boolean =true;
    Response(data) {
        if (data != null && data.LogoString != null)
            this.logoPath = "data:image/jpeg;base64," + data.LogoString;
        else
        {

            this.logoPath = "../../../assets/img/app/logo-2.png";
        }

        if (data != null)
            this.objLogin.AgencyProfileId = data.AgencyProfileId;

        //   console.log(data);
        ///  console.log(this.objLogin);

    }

    isValid = true;
    fnChangePassword(mainFormBuilder) {
        this.submittedChangePwd = true;
        this.isValid = true;

        if (this.objLogin.Password != this.objLogin.ConfirmPassword) {
            this.isValid = false;
        }
        if (mainFormBuilder.valid && this.isValid) {
            this.isLoadingValueChangePassword = true;
            this.isLoadingValue = true;
            this.loService.LoginChangePassword(this.objLogin).then(data => this.ResponChangePassword(data));
        }
    }
    private ResponChangePassword(data) {
        this.isLoadingValueChangePassword = false;
        this.isLoadingValue = false;
        if (data.IsError == false) {

           Common.SetSession("UserPwd", this.objLogin.Password);
           this._cookieService.delete("autho");
           this._cookieService.set("autho", window.btoa(Common.GetSession("LoginId") + ':' + this.objLogin.Password + ':' + Common.GetSession("AgencyProfileId")));

            Common.SetSession("IsAppAccessUser", "1");
            Common.IsUserLogin.next(true);
            this.objUserAuditHistoryDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objUserAuditHistoryDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
            this.loService.SaveUserAuditHistory(this.objUserAuditHistoryDTO).then(data =>
              {
              Common.SetSession("UserAuditHistoryId",data);
              this.router.navigate(['pages/dashboard']);
            });

        }
        else
        {
            alert(data.ErrorMessage);
        }
    }
    searchAgency(filterValue) {
      const lowerValue = filterValue.toLowerCase();
      this.filteredList = this.lstAgencyProfile.filter(item => item.AgencyName.toLowerCase().indexOf(lowerValue) !== -1 || !lowerValue);
    }
    fnForgotPasswordSubmit(values: Object) {

        // console.log(this.formForgotPwd);
        this.submitted = true;
        if (this.formForgotPwd.valid) {
            this.isLoadingValueForgotPWD = true;
            this.loService.GetForgotPassword(this.objLogin).then(data => this.ResponeForgotPwd(data));
        }

    }
    errorMessageNewVisiForgot = false;
    errorMessageStringForgot;
    private ResponeForgotPwd(data) {
        this.isLoadingValueForgotPWD = false;
        //this.errorMessage = true;
        if (data.IsError == false) {
            this.submitted = false;
            this.fnCancel();
            this.errorMessageNewVisi = true;
            this.errorMessageString = "Your Login credentials sent to register email id ";
        }
        else if (data.IsError == true) {
            this.errorMessageNewVisiForgot = true;
            this.errorMessageStringForgot = data.ErrorMessage;
        }

    }


    fnCancel() {
        this.errorMessage = false;
        this.errorMessageString = "";
        this.loginVisible = !this.loginVisible;
        this.ForgotPasswordVisible = !this.ForgotPasswordVisible;

    }
    public onSubmit(values: Object): void {
        this.submitted = true;
        this.errorMessageNewVisi = false;
        //console.log(this.objUser);
        if (this.form.valid) {           
            this.loService.getLoginValue(this.objUser).then(data => {   
                //console.log(data);           
                if(data.UserDetailsId>0)
                {
                    Common.SetSession("userDetailsId", data.UserDetailsId);
                    Common.SetSession("municipalId", "1");
                    Common.SetSession("UserName", data.UserName);
                    this.router.navigate(['pages/dashboard']);
                }
                else
                {
                    alert("Please enter valid user name and password.");
                    //this.errorMessageString = "Please enter valid user name and password.";
                }
             });           
           
        }
    }
    captchaSuccess;
    // handleCorrectCaptcha(response) {
    //     this.captchaSuccess = response;
    // }
    resolved(response) {
      this.captchaSuccess = response;
    }
    private Respone(data) {
        // console.log("login");
        // console.log(data);
        Common.SetSession("First", "1");
        this.submitted = false;
        this.isLoadingValue = false;
        if (data.IsError == false) {

            Common.SetSession("Token", data.Token);
            this._cookieService.delete("Token");
            this._cookieService.set("Token", data.Token);

            // if (data.UserProfileId == 1)
            //     this.loService.getAgencyList().then(data => { this.lstAgencyProfile = data;this.filteredList=data; });

            this.loService.GetAllSecretQuestions().then(data => { this.lstSecretQuestions = data; });

            this.objLogin.Password = null;
            this.objLogin.UserProfileId = data.UserProfileId;
            this.IsPwdChangeNeeded = data.IsPwdChangeNeeded;
            //FormRoleAccessMapping
            if (data.lstFormRoleAccessMapping.length > 0 && data.lstFormRoleAccessMapping != null) {
                // console.log(data.lstFormRoleAccessMapping);
                Common.SetSession("FormRoleAccessMapping", JSON.stringify(data.lstFormRoleAccessMapping));

            }

            if (data.UserProfileId != 1) {
                Common.SetSession("UserProfileId", data.UserProfileId);
                Common.SetSession("AgencyProfileId", data.AgencyProfileId);
                Common.SetSession("DomainName", data.AgencyProfile.DomainName);
                Common.SetSession("LoginId", data.LoginId);
                Common.SetSession("UserName", data.PersonalInfo.FullName);
                Common.SetSession("UserImageId", data.PersonalInfo.ImageId);
                Common.SetSession("URNNumber", data.AgencyProfile.URNNumber);
                Common.SetSession("UserTypeId", data.UserTypeId);
                Common.SetSession("RoleProfileId", data.RoleProfileId);
                Common.SetSession("CanSeeAllCarer", data.CanSeeAllCarer==true?"1":"0");
                Common.SetSession("IsCopyThisDocumenttoCommon", data.IsCopyThisDocumenttoCommon);
                Common.SetSession("PasswordExpiryDateCount", data.PasswordExpiryDateCount);

                //  console.log("data.IsCopyThisDocumenttoCommon");
                //  console.log(data.IsCopyThisDocumenttoCommon);
                //  Common.IsUserLogin.next(true);
                if (!data.IsSecretQuestionReset) {
                  if (this._cookieService.get(data.UserProfileId) == "") {
                        this.loService.GetRandomSecretQuestions(data.UserProfileId).then(data => {
                            if (data != null) {
                                this.securityQuestion = data.SecretQustion;
                                this.dbUserSecretQustionId = data.UserSecretQustionId;
                                this.loginVisible = false;
                                this.securityQuestionVisible = true;
                            }
                            else {
                                this.loginVisible = false;
                                this.secretQuestionVisible = true;
                            }
                        });
                    }
                    else {
                        Common.SetSession("IsAppAccessUser", "1");
                        Common.IsUserLogin.next(true);
                        this.objUserAuditHistoryDTO.AgencyProfileId = data.AgencyProfileId;
                        this.objUserAuditHistoryDTO.UserProfileId = data.UserProfileId;
                        this.loService.SaveUserAuditHistory(this.objUserAuditHistoryDTO).then(data =>
                          { Common.SetSession("UserAuditHistoryId",data);
                            this.router.navigate(['pages/dashboard']);
                          });

                    }
                }
                else {

                    this.loginVisible = false;
                    this.secretQuestionVisible = true;
                }
            }
            else {
                //   Common.IsUserLogin.next(true);
                this.loginVisible = false; this.agencyVisible = true;
                Common.SetSession("UserProfileId", data.UserProfileId);
                Common.SetSession("UserImageId", data.PersonalInfo.ImageId);
                Common.SetSession("UserName", data.PersonalInfo.FullName);
                Common.SetSession("URNNumber", data.AgencyProfile.URNNumber);
                Common.SetSession("LoginId", data.LoginId);
                Common.SetSession("DomainName", data.AgencyProfile.DomainName);
                Common.SetSession("IsCopyThisDocumenttoCommon", "false");
                Common.SetSession("PasswordExpiryDateCount", data.PasswordExpiryDateCount);
            }

        }
        else if (data.IsError == true) {
            if (data.ErrorMessage != null)
                this.errorMessageString = data.ErrorMessage;
            else
                this.errorMessageString = "Please enter valid user name and password.";
            this.attempts++;
            this.errorMessage = true;
            if (this.attempts == 3)
                this.showCaptcha = true;
            else if (this.attempts == 4) {
                this.errorMessage = true;
                this.errorMessageString = "You are left with 1 more attempts";
            }
            else if (this.attempts == 5) {
                this.loService.UserAccountLock(this.objLogin.LoginId).then(data => {
                    if (data) {
                        this.showCaptcha = false;
                        this.errorMessage = true;
                        this.errorMessageString = "Your account has been locked due to too many failed login attempts, contact the support team.";
                    }
                });
            }
        }

    }

    fnSaveSecretQuestion() {
        this.showErrorMsg = false;
        let count: number = 0;
        this.lstSecretQuestions.forEach(item => {
            item.UserProfileId = Common.GetSession("UserProfileId");
            item.CreatedUserId = Common.GetSession("UserProfileId");
            if (item.SecretQustionAnswer != null && item.SecretQustionAnswer != "")
                count++;
        });
        if (count > 3) {
            this.isLoadingValueSaveSecretQuestio = true;
            this._cookieService.delete(Common.GetSession("UserProfileId"));
            this.loService.SaveUserSecretQustion(this.lstSecretQuestions).then(data => { });

            if (!this.IsPwdChangeNeeded) {
                Common.SetSession("IsAppAccessUser", "1");
                Common.IsUserLogin.next(true);
                this.objUserAuditHistoryDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
                this.objUserAuditHistoryDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
                this.loService.SaveUserAuditHistory(this.objUserAuditHistoryDTO).then(data =>
                  {
                  Common.SetSession("UserAuditHistoryId",data);
                  this.router.navigate(['pages/dashboard']);
                });
            } else {
                this.isLoadingValueSaveSecretQuestio = false;
                this.secretQuestionVisible = false;
                this.IsPwdChangeNeededVisible = true;
            }
        }
        else
        { this.showErrorMsg = true; }
    }
    fnSaveSecurityQuestion() {
        this.objUserSecretQustionInfoDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
        this.objUserSecretQustionInfoDTO.UserSecretQustionId = parseInt(this.dbUserSecretQustionId);
        this.objUserSecretQustionInfoDTO.SecretQustionAnswer = this.securityAnswer;
        this.loService.CheckSecretQuestions(this.objUserSecretQustionInfoDTO).then(data => {
            if (data == true) {
                this.isLoadingValueSecurityQuestion = true;
                this.isLoadingValue = true;
                if (this.rememberQuestion) {
                    //let opts: CookieOptionsArgs = {expires: new Date('2030-07-19')};
                    //let opts: CookieOptionsArgs = {expires: "Mon, 30 Jun 2290 00:00:00 GMT" };
                    //this._cookieService.put(Common.GetSession("UserProfileId"), this.dbUserSecretQustionId, { expires: "Mon, 30 Jun 2290 00:00:00 GMT" });
                      this._cookieService.set(Common.GetSession("UserProfileId"), this.dbUserSecretQustionId); //options not accepted in ang11.
                    //this.loService.UpdateRememberSecretQuestion(Common.GetSession("UserProfileId")).then();
                }
                if (!this.IsPwdChangeNeeded) {
                    Common.SetSession("IsAppAccessUser", "1");
                    Common.IsUserLogin.next(true);
                    this.objUserAuditHistoryDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
                    this.objUserAuditHistoryDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
                    this.loService.SaveUserAuditHistory(this.objUserAuditHistoryDTO).then(data =>
                      {
                      Common.SetSession("UserAuditHistoryId",data);
                      this.router.navigate(['pages/dashboard']);
                    });

                } else {
                    this.securityQuestionVisible = false;
                    this.IsPwdChangeNeededVisible = true;
                }
            }
            else
            { this.showErrorMsg = true; }
        });
    }
    agencyProfileId;
    fnSelect(AgencyId, LogoString) {
        this.agencyProfileId = AgencyId;

        if (LogoString != null) {
            this.logoPath = "data:image/jpeg;base64," + LogoString;
            Common.SetSession("AgencyLogo", this.logoPath);
        }
        this.IsSelected=AgencyId;
        // if (this.lstAgencyProfile != null) {
        //     for (let insAP of this.lstAgencyProfile) {
        //         if (insAP.AgencyProfileId == AgencyId) {
        //             insAP.IsSelected = true;
        //         }
        //         else
        //             insAP.IsSelected = false;
        //     }
        // }
    }
    fnGo() {
        //console.log(this.agencyProfileId);
        if (this.agencyProfileId != null) {

            Common.SetSession("AgencyProfileId", this.agencyProfileId);
            Common.IsUserLogin.next(true);
            if (!this.IsPwdChangeNeeded) {
                Common.SetSession("IsAppAccessUser", "1");
                Common.IsUserLogin.next(true);
                this.objUserAuditHistoryDTO.AgencyProfileId = this.agencyProfileId;
                this.objUserAuditHistoryDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
                this.loService.SaveUserAuditHistory(this.objUserAuditHistoryDTO).then(data =>
                  {
                  Common.SetSession("UserAuditHistoryId",data);
                  this.router.navigate(['pages/dashboard']);
                });

            } else {
                this.agencyVisible = false;
                this.IsPwdChangeNeededVisible = true;
            }
        }
        else {
            this.showErrorMsg = true;
        }
    }
    IsSelected:number;
    getRowNewClass =(row)=>{
      //console.log('getRowNewClass');
      return {
        'rowSelected':row.AgencyProfileId==this.IsSelected
      }
    }
}

export function emailValidator(control: FormControl): { [key: string]: any } {
    var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,5}$/;
    if (control.value && !emailRegexp.test(control.value)) {
        return { invalidEmail: true };
    }
}

export class Login {
    UserProfileId: number;
    LoginId: string;
    Password: string;
    EmailId: string;
    ConfirmPassword: string;
    static rtnVal;
    AgencyProfileId: number;

}

export class UserDetails {
    UserDetailsId: number;
    UserName: string;
    Password: string;    
    MunicipalId: number;      
}





