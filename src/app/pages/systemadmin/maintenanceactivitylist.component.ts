import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { Router } from '@angular/router';

@Component({
    selector: 'maintenanceactivitylist',
    templateUrl: './maintenanceactivitylist.component.template.html',
})

export class MaintenanceActivityList {
    public searchText: string = ""; 
    lstMaintenanceActivity=[];    
    controllerName = "MaintenanceActivity";  
       
    constructor(private apiService: APICallService, private _router: Router, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
         
       this.BindMaintenanceActivity();
    }
    fnGo()
    {
        this._router.navigate(['/pages/systemadmin/maintenanceactivity/0']);
    }
    fnDelete(id)
    {
        this.apiService.deleteAssert(this.controllerName, "DeleteMaintenanceActivity",id).then(data => {this.Respone(data)});
        
    }
    fnEdit(id)
    {
        this._router.navigate(['/pages/systemadmin/maintenanceactivity/'+ id]);
    }
    BindMaintenanceActivity() {
        this.apiService.get(this.controllerName, "GetMaintenanceActivitys", parseInt(Common.GetSession("MunicipalId"))).then(data => { 
            this.lstMaintenanceActivity = data;           
         })
    } 
     private Respone(data) {      
            if (data == false) {
                this.pComponent.alertDanger(data.ErrorMessage)
            }
            else if (data == true) {            
                this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
                this.BindMaintenanceActivity();
               
            }
        }

}
