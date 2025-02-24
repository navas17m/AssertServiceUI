/// <reference path="../pages.component.ts" />
import { HttpClient } from '@angular/common/http';
import { Injectable,OnInit } from '@angular/core';
import { json } from 'd3';
//import 'rxjs/add/operator/toPromise';
import { Observable, Subject, throwError } from 'rxjs';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { Base } from './base.service';


@Injectable()
export class APICallService implements OnInit {

    public static invokeEvent: Subject<any> = new Subject();

    constructor(public _http: HttpClient ) {

     }

     ngOnInit()
     {

     }

    resetTimer() {
        APICallService.invokeEvent.next({ some: "from service" });
    }

    get(controllerName: string, functionName: string, Id?) {

        this.resetTimer();
        if (Id == null) {
            return this._http.get(Base.GetUrl() + "/api/" + controllerName + "/" + functionName, Base.GetHeader())
                .toPromise()
                .then()
                .catch(this.handleError);
        }
        else {
                return this._http.get(Base.GetUrl() + "/api/" + controllerName + "/" + functionName + "/" + Id, Base.GetHeader())
                .toPromise()
                .then(this.handleResponse)
                .catch(this.handleError);
        }


    }
    post(controllerName: string, functionName: string, parameter?) {

        if(navigator.onLine)
        {
            this.resetTimer();
            if (parameter != null) {
                return this._http.post(Base.GetUrl() + "/api/" + controllerName + "/" + functionName, JSON.stringify(parameter), Base.GetHeader())
                    .toPromise()
                    .then(this.handleResponse)
                    .catch(this.handleError);
            }
            else {
                return this._http.post(Base.GetUrl() + "/api/" + controllerName + "/" + functionName, Base.GetHeader())
                    .toPromise()
                    .then(this.handleResponse)
                    .catch(this.handleError);
            }
        }
        else
        {
          let temp={
              Type:"Post",
              ControllerName:controllerName,
              FunctionName:functionName,
              Parameter:parameter
          }
         // console.log(temp);
          Common.SetSession("OfflineServerRequests",JSON.stringify(temp));
        }
    }
    save(controllerName: string, parameter, type) {
        if(navigator.onLine)
        {
            this.resetTimer();
            if (type == "save") {
                return this._http.post(Base.GetUrl() + "/api/" + controllerName + "/Save", JSON.stringify(parameter), Base.GetHeader())
                    .toPromise()
                    .then(this.handleResponse)
                    .catch(this.handleError);
            }
            else
            {
                return this._http.patch(Base.GetUrl() + "/api/" + controllerName + "/Save", JSON.stringify(parameter), Base.GetHeader())
                    .toPromise()
                    .then(this.handleResponse)
                    .catch(this.handleError);
            }
        }
        else
        {
          let temp={
              Type:"Save",
              ControllerName:controllerName,
              FunctionName:type,
              Parameter:parameter
          }
         // console.log(temp);
          Common.SetSession("OfflineServerRequests",JSON.stringify(temp));
        }
    }
    delete(controllerName: string, parameter) {

        this.resetTimer();
        if (typeof parameter === 'number') {
                return this._http.delete(Base.GetUrl() + "/api/" + controllerName + "/Save/" + parameter, Base.GetHeader())
                    .toPromise()
                    .then(this.handleResponse)
                    .catch(this.handleError);
        }
        else
        {
                return this._http.post(Base.GetUrl() + "/api/" + controllerName + "/Delete", JSON.stringify(parameter), Base.GetHeader())
                    .toPromise()
                    .then(this.handleResponse)
                    .catch(this.handleError);
        }
    }
    getUp(controllerName: string, functionName: string, Id?) {

        this.resetTimer();
        if (Id == null) {
                return this._http.get(Base.GetUrl() + "/api/" + controllerName + "/" + functionName, Base.GetHeader())
                    .toPromise()
                    .then(this.handleResponseUp)
                    .catch(this.handleError);
        }
        else {
                return this._http.get(Base.GetUrl() + "/api/" + controllerName + "/" + functionName + "/" + Id, Base.GetHeader())
                    .toPromise()
                    .then(this.handleResponseUp)
                    .catch(this.handleError);
        }

    }
    private handleResponseUp(data: any) {
        return data;
    }
    private handleResponse(data: any) {
        return data;
    }
    domain;

    private handleError(error: Response) {
        return throwError(error || 'Server error');
    }
}
