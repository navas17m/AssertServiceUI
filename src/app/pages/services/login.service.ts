import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError as observableThrowError } from 'rxjs';
import { Base } from './base.service';
@Injectable()

export class LoginService {


    constructor(public _http: HttpClient) { }

    
    UserAccountLock(_login) {
        return this._http.get(Base.GetUrl() + "/api/UserProfile/UserAccountLock/"+ _login, Base.GetHeader()) // URL to web api
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }
    GetAgencyLogo(dominname) {
        return this._http.get(Base.GetUrl() + "/api/AgencyProfile/GetAgencyLogo/" + dominname, Base.GetHeader())
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);

    }
    GetForgotPassword(obj) {
        return this._http.post(Base.GetUrl() + "/api/UserProfile/ForgotPassword", obj, Base.GetHeader())
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);

    }

    ChangePassword(obj) {
        return this._http.post(Base.GetUrl() + "/api/UserProfile/ChangePassword", obj, Base.GetHeader())
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);

    }

    LoginChangePassword(obj) {
        return this._http.post(Base.GetUrl() + "/api/UserProfile/LoginChangePassword", obj, Base.GetHeader())
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);

    }

    GetByUserProfileId(userId) {
        return this._http.get(Base.GetUrl() + "/api/UserProfile/GetByUserProfileId/" + userId, Base.GetHeader())
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);

    }
    GetUpdateLastlogoutTime(userId) {
        return this._http.get(Base.GetUrl() + "/api/UserProfile/UpdateLastlogoutTime/" + userId, Base.GetHeader())
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);

    }

    getMunicipalList() {       
        return this._http.get(Base.GetUrl() + "/api/Municipal/GetMunicipal")
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);

    }  
    GetAllSecretQuestions() {
        return this._http.get(Base.GetUrl() + "/api/UserProfile/GetAllSecretQuestions", Base.GetHeader())
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);

    }
    UpdateRememberSecretQuestion(Id) {
        return this._http.get(Base.GetUrl() + "/api/UserProfile/UpdateRememberSecretQuestion/" + Id, Base.GetHeader())
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);

    }
    GetRandomSecretQuestions(Id) {
        return this._http.get(Base.GetUrl() + "/api/UserProfile/GetRandomSecretQuestions/" + Id, Base.GetHeader())
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);

    }
    GetSecretQuestions(obj) {
        return this._http.post(Base.GetUrl() + "/api/UserProfile/GetSecretQuestions", obj, Base.GetHeader())
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);

    }
    CheckSecretQuestions(obj) {
        return this._http.post(Base.GetUrl() + "/api/UserProfile/CheckSecretQuestions", obj, Base.GetHeader())
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);

    }
    SaveUserSecretQustion(objSUQ) {

        // console.log(Base.GetUrl());
        return this._http.post(Base.GetUrl() + "/api/UserProfile/SaveUserSecretQustion", objSUQ, Base.GetHeader()) // URL to web api
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }
    getLoginValue(_login) {

        // console.log(Base.GetUrl());
        return this._http.post(Base.GetUrl() + "/api/UserDetails", _login) // URL to web api
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }

    updateLastlogoutTime(_userProfileId) {
        return this._http.post(Base.GetUrl() + "/api/UserProfile/UpdateLastLogoutTime/" + _userProfileId, Base.GetHeader())
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }
    SaveUserAuditHistory(obj){
      return this._http.post(Base.GetUrl()+"/api/UserProfile/SaveUserAuditHistory",obj,Base.GetHeader())
        .toPromise()
        .then(this.handleResponse)
        .catch(this.handleError);
    }

    private handleResponse(data: any) {
        // console.log(data.json());
        return data;
    }

    private handleError(error: Response) {
        // console.error(error);
        return observableThrowError(error || 'Server error');
    }
}
