import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserCarerMappingDTO } from './DTO/usercarermappingdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
    selector: 'AssertRegisterList',
    templateUrl: './assertregisterlist.component.template.html',
})

export class AssertRegisterList {
    public searchText: string = "";
    public returnVal:any[];
    _Form: FormGroup;
    arrayCarerList = [];
    objUserCarerMappingDTO: UserCarerMappingDTO = new UserCarerMappingDTO();
    lstUserList = [];
    submitted = false;
    AssignedCarerList = [];
    lstAssertRegister=[];
    isLoading: boolean = false;
    controllerName = "AssertRegister";
    assignedCarers = [];
    carerIds;
  
       
    constructor(private apiService: APICallService, private _router: Router, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
         
       this.BindAssert();
    }
    fnGo()
    {
        this._router.navigate(['/pages/systemadmin/assertregister/0']);
    }
    fnDelete(id)
    {
        this.apiService.deleteAssert(this.controllerName, "DeleteAssertRegister",id).then(data => {this.Respone(data)});
        
    }
    fnEdit(id)
    {
        this._router.navigate(['/pages/systemadmin/assertregister/'+ id]);
    }
    BindAssert() {
        this.apiService.get(this.controllerName, "GetAssertRegisters",parseInt(Common.GetSession("UserId"))).then(data => {
             this.lstAssertRegister = data;           
         })
        //this.services.getAll().then(data => { this.lstUserList = data; })
    } 
     private Respone(data) {      
            if (data == false) {
                this.pComponent.alertDanger(data.ErrorMessage)
            }
            else if (data == true) {            
                this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
                this.BindAssert();
               
            }
        }

}
