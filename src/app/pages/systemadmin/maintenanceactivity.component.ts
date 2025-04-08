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
import { Router,ActivatedRoute } from '@angular/router';
import { MaintenanceActivityDTO } from './DTO/maintenanceactivitydto';

@Component({
    selector: 'maintenanceactivity',
    templateUrl: './maintenanceactivity.component.template.html',
})

export class MaintenanceActivityComponent {
    public returnVal:any[];
    _Form: FormGroup;
    arrayCarerList = [];
    objMaintenanceActivityDTO: MaintenanceActivityDTO = new MaintenanceActivityDTO();
    lstUserList = [];
    submitted = false;
    AssignedCarerList = [];
    isLoading: boolean = false;
    controllerName = "MaintenanceActivity";    
    lstPriorityOfWorks=[];
    lstPeriodicMaintenances=[];
    lstWorkOrderStatuses=[];lstTypeofScheduledMaintenances=[];
    carerIds; 
    objQeryVal; type="save";
    constructor(private apiService: APICallService, private activatedroute: ActivatedRoute, private _router: Router, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
        //this.objUserCarerMappingDTO.ExpiryDate = null;
        this.BindDropDown();      
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });   
        if (this.objQeryVal.id != 0 && this.objQeryVal.id != null) {
            this.type="update";
            this.apiService.get(this.controllerName, "GetMaintenanceActivity",this.objQeryVal.id).then(data => {
                this.objMaintenanceActivityDTO=data;   
                //console.log(this.objMaintenanceActivityDTO);  
                this.objMaintenanceActivityDTO.Dateoflastmaintenance=  this.pComponent.GetDateEditFormat(this.objMaintenanceActivityDTO.Dateoflastmaintenance);
                this.objMaintenanceActivityDTO.Nextmaintenancedate= this.pComponent.GetDateEditFormat(this.objMaintenanceActivityDTO.Nextmaintenancedate);
                // this.objMaintenanceActivityDTO.GuaranteeExpiryDate=this.pComponent.GetDateEditFormat(this.objMaintenanceActivityDTO.GuaranteeExpiryDate);
            });
        }
        else
        { 
            this.objMaintenanceActivityDTO.Maintenancemanagementstyle=false;
            this.objMaintenanceActivityDTO.Approvals=false;
        }
        
        this._Form = _formBuilder.group({
            Maintenancemanagementstyle: [],
            Workordernumber: ['', Validators.required],
            TypeofscheduledmaintenanceId:[],
            Dateoflastmaintenance:[],
            Nextmaintenancedate:[],
            PeriodicmaintenanceId:[],  
            Workorderissuedate:[],  
            Maintenancestartdate:[],  
            Maintenancecompletiondate:[],   
            PriorityofworkId:[],
            Description:[],
            Resources:[],
            Estimatinglaborcosts:[],
            Approvals:[],
            WorkorderstatusId:[],
            Postmaintenance:[],            
            Actualtimetakenformaintenance:[],
            MaintenanceCost:[],
            HRCost:[],
            HRMaterialCost:[],
            OtherCost:[],
            PercentageCompleted:[]
        });       
       
        //this.apiService.post(this.controllerName, "TestPost",body).then(data => {this.Respone(data, "save")});
    }
    fnBack(){
        this._router.navigate(['/pages/systemadmin/maintenanceactivitylist/0']);
    }
    BindDropDown() {
        this.apiService.get(this.controllerName, "GetPriorityOfWorks").then(data => { this.lstPriorityOfWorks = data; })
        this.apiService.get(this.controllerName, "GetPeriodicMaintenances").then(data => { this.lstPeriodicMaintenances = data; })
        this.apiService.get(this.controllerName, "GetWorkOrderStatuses").then(data => { this.lstWorkOrderStatuses = data; })
        this.apiService.get(this.controllerName, "GetTypeofScheduledMaintenances").then(data => { this.lstTypeofScheduledMaintenances = data;
           
         })
    } 
       
    IsShowError = false;
    Submit(form) {
        this.submitted = true;
        // if (form.valid && carerlist.length == 0)
        //     this.IsShowError = true;
       
        if (form.valid ) {
           // console.log(this.objMaintenanceActivityDTO);
            this.isLoading = true;
            //var res= carerlist.map(item => item.id);
            //this.objUserCarerMappingDTO.CarerParentIds = res;
           
            // const body = {        
            //     AccidentLog: true,
            //     AssetStatusId: '1',
            //     CoordinatesX: 2,
            //     CoordinatesY: 2,
            //     DateOfLastInspection: '2025-02-25',
            //     DateOfPurchase: '2025-02-25',
            //     DepartmentName: 'ad',
            //     FrequentProblems: 'ad',
            //     GoogleMapsLink: 'ad',
            //     GuaranteeExpiryDate: '2025-02-25',
            //     HistoricalCostsOfMaintenance: 'asd',
            //     IdentificationNumber: 'fsdf',
            //     LocationOfOrigin: 'sfsdf',
            //     MaintenanceContractForAsset: 'adsa',
            //     PriorityId: '1',
            //     StrategyLastMaintenanceId: '1',
            //     UtilizationRatesId: '1'
            // };
            //this.objUserCarerMappingDTO.ExpiryDate = this.pComponent.GetDateSaveFormat(this.objUserCarerMappingDTO.ExpiryDate);
           
            this.objMaintenanceActivityDTO.Dateoflastmaintenance=  this.pComponent.GetDateSaveFormat(this.objMaintenanceActivityDTO.Dateoflastmaintenance);
            this.objMaintenanceActivityDTO.Nextmaintenancedate= this.pComponent.GetDateSaveFormat(this.objMaintenanceActivityDTO.Nextmaintenancedate);
            // this.objMaintenanceActivityDTO.GuaranteeExpiryDate=this.pComponent.GetDateSaveFormat(this.objMaintenanceActivityDTO.GuaranteeExpiryDate);
           
            if(this.type=="save")
            {               
                //console.log(this.objMaintenanceActivityDTO);  
                this.objMaintenanceActivityDTO.UserId=parseInt(Common.GetSession("UserId"));
                this.objMaintenanceActivityDTO.MunicipalId=parseInt(Common.GetSession("MunicipalId"));  
                this.objMaintenanceActivityDTO.SubMunicipalId=parseInt(Common.GetSession("SubMunicipalId"));
                this.objMaintenanceActivityDTO.IsActive=true;           
                this.apiService.post(this.controllerName, "AddMaintenanceActivity", this.objMaintenanceActivityDTO).then(data => {this.Respone("save")});
            }
            else
            {
                this.apiService.put(this.controllerName, "UpdateMaintenanceActivity", this.objMaintenanceActivityDTO).then(data => {this.Respone("save")});
            }
            //this.services.post(this.objUserCarerMappingDTO, type).then(data => this.Respone(data, type));
        }
    }

    private Respone(type) {
        this.submitted = false;
        this.isLoading = false;
        this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
        this.fnBack();        
    }
   
}
