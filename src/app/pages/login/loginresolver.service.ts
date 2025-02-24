import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable()
export class LoginResolver implements Resolve<any> {
    url: string;
    constructor(private loServices: LoginService, @Inject(DOCUMENT) private document: any) {

    }
    domain;
    resolve() {
        //This code for nurture, new life
        //this.domain = this.document.location.hostname;

        //This code for local, demo and test
        this.domain = "fostering.starlight.inc";
        this.domain = this.domain.split('.')[0];
        //console.log(this.domain);
        return this.loServices.GetAgencyLogo(this.domain);
        // return this.apiService.get("AgencyProfile", "GetAgencyLogo", this.domain);
    }
}

