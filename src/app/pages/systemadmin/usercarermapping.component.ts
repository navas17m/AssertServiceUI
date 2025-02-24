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

@Component({
    selector: 'UserCarerMapping',
    templateUrl: './usercarermapping.component.template.html',
})

export class UserCarerMappingComponent {
    public returnVal:any[];
    _Form: FormGroup;
    arrayCarerList = [];
    objUserCarerMappingDTO: UserCarerMappingDTO = new UserCarerMappingDTO();
    lstUserList = [];
    submitted = false;
    AssignedCarerList = [];
    isLoading: boolean = false;
    controllerName = "UserCarerMapping";
    assignedCarers = [];
    carerIds;
    columns =[
        {name:'Carer Code',prop:'CarerCode',sortable:false,width:'100'},
        {name:'Carer Name',prop:'name',sortable:false,width:'150'},
        {name:'Date of Birth',prop:'dateOfBirth',sortable:false,width:'80'},
        {name:'Expiry Date',prop:'expiryDate',sortable:false,width:'80'},
        {name:'Un-assign',prop:'Button',label:'Un-assign', class:'btn btn-danger', sortable:false,width:'60'},
       ];
       objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
       FormCnfgId=9;   
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
        this.objUserCarerMappingDTO.ExpiryDate = null;
        this._Form = _formBuilder.group({
            UserCarerMapping: ['0', Validators.required],
            ExpiryDate: [],
        });

        this.BindUser();

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
        this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    BindUser() {
        this.apiService.get(this.controllerName, "GetAll").then(data => { this.lstUserList = data; })
        //this.services.getAll().then(data => { this.lstUserList = data; })
    }

    UserChange(userID) {
        this.apiService.get(this.controllerName, "GetById", userID).then(data => {
            this.userchageResponse(data.LstCarerBind);
            this.AssignedCarerList = data.LstCarerMapped;
            this.assignedCarers = this.AssignedCarerList.map(item => ({
                ...item,
                name:item.SCFullName == null? item.PCFullName : item.PCFullName + ' ' + item.SCFullName,
                dateOfBirth: item.DateOfBirth == null ? '': moment(item.DateOfBirth).format("DD/MM/YYYY"),
                expiryDate: item.ExpiryDate == null ? '' : moment(item.ExpiryDate).format("DD/MM/YYYY"),
            }));
        })
        //this.services.getByUserId(userID).then(data => {
        //    this.userchageResponse(data.LstCarerBind);
        //    this.AssignedCarerList = data.LstCarerMapped;
        //})
    }

    userchageResponse(data)
    {
        this.arrayCarerList = [];
        this.carerIds = [];
        if (data != null) {
            data.forEach(item => {
                if (item.SCFullName != null && item.SCFullName != '')
                    this.arrayCarerList.push({ id: item.CarerParentId, name: item.PCFullName + item.SCFullName + '(' + item.CarerCode + ')' });
                else
                    this.arrayCarerList.push({ id: item.CarerParentId, name: item.PCFullName + ' (' + item.CarerCode + ')' });
            });
        }
    }

    ClickUnassign(UserProfileId, CarerParentId) {
        this.objUserCarerMappingDTO.UserProfileId = UserProfileId;
        this.objUserCarerMappingDTO.CarerParentId = CarerParentId;
        this.apiService.post(this.controllerName, "Delete", this.objUserCarerMappingDTO).then(data => this.Respone(data, "delete"));
        //this.services.post(this.objUserCarerMappingDTO, "delete").then(data => this.Respone(data, "delete"));
        this.UserChange(UserProfileId);
    }

    IsShowError = false;
    Submit(form, carerlist) {
        this.submitted = true;
        if (form.valid && carerlist.length == 0)
            this.IsShowError = true;

        if (form.valid && carerlist.length > 0) {
            this.isLoading = true;
            var res= carerlist.map(item => item.id);
            this.objUserCarerMappingDTO.CarerParentIds = res;
            let type = "save";
            this.objUserCarerMappingDTO.ExpiryDate = this.pComponent.GetDateSaveFormat(this.objUserCarerMappingDTO.ExpiryDate);
            this.apiService.post(this.controllerName, "Save", this.objUserCarerMappingDTO).then(data => this.Respone(data, type));
            //this.services.post(this.objUserCarerMappingDTO, type).then(data => this.Respone(data, type));
        }
    }

    private Respone(filedConfig, type) {
        this.submitted = false;
        this.isLoading = false;
        if (filedConfig.IsError == true) {
            this.pComponent.alertDanger(filedConfig.ErrorMessage)
        }
        else if (filedConfig.IsError == false) {
            this.objUserCarerMappingDTO.ExpiryDate = null;
            if (type == "save")
            {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = 0;
                this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
            }                
            else if (type == "delete")
            {
                this.objUserAuditDetailDTO.ActionId =3;
                this.objUserAuditDetailDTO.RecordNo = this.objUserCarerMappingDTO.CarerParentId;
                this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
            }
                this.UserChange(this.objUserCarerMappingDTO.UserProfileId);
                this.arrayCarerList = [];

            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
            this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onButtonEvent(item){
        this.ClickUnassign(item.UserProfileId,item.CarerParentId);
    }
}
