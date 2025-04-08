/// <reference path="../pages.component.ts" />
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable,OnInit } from '@angular/core';
import { json } from 'd3';
//import 'rxjs/add/operator/toPromise';
import { Observable, Subject, throwError } from 'rxjs';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { Base } from './base.service';
import { promise } from 'protractor';


@Injectable()
export class APICallService implements OnInit {

    public static invokeEvent: Subject<any> = new Subject();

    constructor(public _http: HttpClient ) {

     }

     ngOnInit()
     {

     }
     uploadFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);    
        return this._http.post(Base.GetUrl() + "/api/FileUpload" , formData);
      }
      async uploadFileAsync(file: File): Promise<any> {
        const formData = new FormData();
        formData.append('file', file);    
        return await this._http.post(Base.GetUrl() + "/api/FileUpload" , formData).toPromise();
      }
    resetTimer() {
        APICallService.invokeEvent.next({ some: "from service" });
    }
    // return this._http.post(Base.GetUrl() + "/api/UserDetails", _login)
    get(controllerName: string, functionName: string, id?) {
       
        if (id == null) {
            return this._http.get(Base.GetUrl() + "/api/" + controllerName + "/" + functionName)
                .toPromise()
                .then()
                .catch(this.handleError);
        }
        else {
                return this._http.get(Base.GetUrl() + "/api/" + controllerName + "/" + functionName + "/" + id)
                .toPromise()
                .then(this.handleResponse)
                .catch(this.handleError);
        }


    }
    put(controllerName: string, functionName: string, parameter)
    {
        //var json = JsonSerializer.Serialize(requestBody);
        return this._http.put(Base.GetUrl() + "/api/" + controllerName + "/" + functionName, JSON.stringify(parameter), Base.GetHeader())
                    .toPromise()
                    .then(this.handleResponse)
                    .catch(this.handleError);
    }

    testPost() {       
        const headers = new HttpHeaders({
          'Content-Type': 'application/json'
        });
    
        const body = {
            IdentificationNumber: 'string',
            locationOfOrigin: 'string',
            coordinatesX: 0,
            coordinatesY: 0,
            googleMapsLink: 'string',
            dateOfPurchase: '2025-02-25T12:40:20.399Z',
            departmentName: 'string',
            dateOfLastInspection: '2025-02-25T12:40:20.399Z',
            accidentLog: true,
            strategyLastMaintenanceId: 0,
            assetStatusId: 0,
            utilizationRateId: 0,
            frequentProblems: 'string',
            historicalCostsOfMaintenance: 'string',
            guaranteeExpiryDate: '2025-02-25T12:40:20.399Z',
            priorityId: 0,
            maintenanceContractForAsset: 'string'
        };
    
        return this._http.post("https://localhost:7065/api/AssertRegister/TestPost", body, { headers });
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
    deleteAssert(controllerName: string,actionName :string ,parameter) {

        return this._http.delete(Base.GetUrl() + "/api/" + controllerName + "/"+ actionName +"/" + parameter, Base.GetHeader())
        .toPromise()
        .then(this.handleResponse)
        .catch(this.handleError);       
        
    }
    delete(controllerName: string,parameter) {       
        
        if (typeof parameter === 'number') {
                return this._http.delete(Base.GetUrl() + "/api/" + controllerName + "/DeleteAssertRegister/" + parameter, Base.GetHeader())
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
