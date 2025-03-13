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
import { AssertRegister } from './DTO/assertregisterdto';

@Component({
    selector: 'AssertRegister',
    templateUrl: './assertregister.component.template.html',
})

export class AssertRegisterComponent {
    public returnVal:any[];
    _Form: FormGroup;
    arrayCarerList = [];
    objAssertRegisterDTO: AssertRegister = new AssertRegister();
    lstUserList = [];
    submitted = false;
    AssignedCarerList = [];
    isLoading: boolean = false;
    controllerName = "AssertRegister";
    assignedCarers = [];
    lstStrategyLastMaintenance=[];
    lstAssetstatus=[];
    lstUtilizationrate=[];lstPriority=[];
    carerIds; 
    objQeryVal; type="save";lstAssert=[];lstSubAssert=[]
    constructor(private apiService: APICallService, private activatedroute: ActivatedRoute, private _router: Router, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
        //this.objUserCarerMappingDTO.ExpiryDate = null;
        this.BindDropDown();      
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });   
        if (this.objQeryVal.id != 0 && this.objQeryVal.id != null) {
            this.type="update";
            this.apiService.get(this.controllerName, "GetAssertRegister",this.objQeryVal.id).then(data => {
                this.objAssertRegisterDTO=data;   
                console.log(this.objAssertRegisterDTO);  
                this.objAssertRegisterDTO.DateOfPurchase=  this.pComponent.GetDateEditFormat(this.objAssertRegisterDTO.DateOfPurchase);
                this.objAssertRegisterDTO.DateOfLastInspection= this.pComponent.GetDateEditFormat(this.objAssertRegisterDTO.DateOfLastInspection);
                this.objAssertRegisterDTO.GuaranteeExpiryDate=this.pComponent.GetDateEditFormat(this.objAssertRegisterDTO.GuaranteeExpiryDate);
            });
        }
        else
        {
            this.objAssertRegisterDTO.AccidentLog=true;
        }
        
        this._Form = _formBuilder.group({
            IdentificationNumber: ['', Validators.required],
            Assert:[0, Validators.required],
            SubAssert:[0, Validators.required],   
            Locationoforigin: [],
            CoordinateX:[],
            CoordinateY:[],
            GoogleMapslink:[],
            Dateofpurchase:[],
            Departmentname:[],
            Dateoflastinspection:[],
            StrategyLastMaintenance:['0'],
            Assetstatus:[],
            AccidentLog:[],
            Utilizationrate:[],
            Frequentproblems:[],
            Historicalcostsofmaintenance:[],
            GuaranteeExpiryDate:[],
            Priority:[],
            Maintenancecontractforasset:[],
            AccidentDescription:[],
            Evidence:[]
        });       
       
        //this.apiService.post(this.controllerName, "TestPost",body).then(data => {this.Respone(data, "save")});
    }
    fnLoadSubAssert(id)
    {
        this.apiService.get(this.controllerName, "GetSubAsserts",id).then(data => { this.lstSubAssert = data; })
    }
    fnBack(){
        this._router.navigate(['/pages/systemadmin/assertregisterlist/0']);
    }
    BindDropDown() {
        this.apiService.get(this.controllerName, "GetAsserts").then(data => { this.lstAssert = data; })
        this.apiService.get(this.controllerName, "GetLastMaintenanceStrategy").then(data => { this.lstStrategyLastMaintenance = data; })
        this.apiService.get(this.controllerName, "GetAssetStatus").then(data => { this.lstAssetstatus = data; })
        this.apiService.get(this.controllerName, "GetUtilizationRates").then(data => { this.lstUtilizationrate = data; })
        this.apiService.get(this.controllerName, "GetLastPriority").then(data => { this.lstPriority = data;
           
         })
    } 
       
    IsShowError = false;
    Submit(form) {
        this.submitted = true;
        // if (form.valid && carerlist.length == 0)
        //     this.IsShowError = true;
       
        if (form.valid ) {
           // console.log(this.objAssertRegisterDTO);
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
           
            this.objAssertRegisterDTO.DateOfPurchase=  this.pComponent.GetDateSaveFormat(this.objAssertRegisterDTO.DateOfPurchase);
            this.objAssertRegisterDTO.DateOfLastInspection= this.pComponent.GetDateSaveFormat(this.objAssertRegisterDTO.DateOfLastInspection);
            this.objAssertRegisterDTO.GuaranteeExpiryDate=this.pComponent.GetDateSaveFormat(this.objAssertRegisterDTO.GuaranteeExpiryDate);
           
            if(this.type=="save")
            {               
                //console.log(this.objAssertRegisterDTO);  
                this.objAssertRegisterDTO.UserId=parseInt(Common.GetSession("UserId"));
                this.objAssertRegisterDTO.MunicipalId=parseInt(Common.GetSession("MunicipalId"));  
                this.objAssertRegisterDTO.IsActive=true;           
                this.apiService.post(this.controllerName, "AddAssertRegister", this.objAssertRegisterDTO).then(data => {this.Respone("save")});
            }
            else
            {
                this.apiService.put(this.controllerName, "UpdateAssertRegister", this.objAssertRegisterDTO).then(data => {this.Respone("save")});
            }
            //this.services.post(this.objUserCarerMappingDTO, type).then(data => this.Respone(data, type));
        }
    }

    private Respone(type) {
        this.submitted = false;
        this.isLoading = false;
        this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
        this.fnBack();
        // if (filedConfig.IsError == true) {
        //     this.pComponent.alertDanger(filedConfig.ErrorMessage)
        // }
        // else if (filedConfig.IsError == false) {
        //     //this.objUserCarerMappingDTO.ExpiryDate = null;
        //     if (type == "save")
        //     {                
        //         this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
        //     }                
        //     else if (type == "delete")
        //     {
                
        //         //this.objUserAuditDetailDTO.RecordNo = this.objUserCarerMappingDTO.CarerParentId;
        //         this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
        //     }
        //         //this.UserChange(this.objUserCarerMappingDTO.UserProfileId);
                         
        // }
    }
   
}
