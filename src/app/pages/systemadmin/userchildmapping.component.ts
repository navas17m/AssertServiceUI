import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserChildMappingDTO } from './DTO/userchildmappingdto';
import { UserAuditHistoryDetailDTO } from '../common';

@Component({
    selector: 'UserChildMapping',
    templateUrl: './userchildmapping.component.template.html',
})

export class UserChildMappingComponent {
    public returnVal:any[];
    _Form: FormGroup;
    arrayChildList = [];
    objUserChildMappingDTO: UserChildMappingDTO = new UserChildMappingDTO();
    lstUserList = [];
    submitted = false;
    AssignedChildList=[];
    isLoading: boolean = false;
    controllerName = "UserChildMapping";
    childIds=[];
    assignedChildren =[];
    columns =[
        {name:'Child Code',prop:'ChildCode',sortable:false,width:'100'},
        {name:'Child Name',prop:'ChildFullName',sortable:false,width:'150'},
        {name:'Date of Birth',prop:'dateOfBirth',sortable:false,width:'80'},
        {name:'Expiry Date',prop:'expiryDate',sortable:false,width:'80'},
        {name:'Un-assign',prop:'Button',label:'Un-assign', class:'btn btn-danger', sortable:false,width:'60'},
       ];
       objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
       FormCnfgId=10;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
        this.objUserChildMappingDTO.ExpiryDate = null;
        this._Form = _formBuilder.group({
            UserChildMapping: ['0', Validators.required],
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
            this.userchageResponse(data.LstChildBind);
            this.AssignedChildList = data.LstChildMapped;
            this.assignedChildren = this.AssignedChildList.map(item => ({
                ...item,
                dateOfBirth:item.DateOfBirth? moment(item.DateOfBirth).format("DD/MM/YYYY") : '',
                expiryDate:item.ExpiryDate ? moment(item.ExpiryDate).format("DD/MM/YYYY") : ''
            }))
        })
        //this.services.getByUserId(userID).then(data => {
        //    this.userchageResponse(data.LstChildBind);
        //    this.AssignedChildList = data.LstChildMapped;
        //})
    }

    userchageResponse(data) {
        this.arrayChildList = [];
        this.childIds=[];
        if (data != null) {
            data.forEach(item => {
                this.arrayChildList.push({ id: item.ChildId, name: item.PersonalInfo.FullName + '(' + item.ChildCode + ')' + ' (' + item.ChildStatus + ')' });
            });
        }
    }

    ClickUnassign(UserProfileId, ChildId) {
        this.objUserChildMappingDTO.UserProfileId = UserProfileId;
        this.objUserChildMappingDTO.ChildId = ChildId;

        this.apiService.post(this.controllerName, "Delete", this.objUserChildMappingDTO).then(data => this.Respone(data, "delete"));
        //this.services.post(this.objUserChildMappingDTO, "delete").then(data => this.Respone(data, "delete"));
        this.UserChange(UserProfileId);
    }

    IsShowError = false;
    Submit(form, childlist) {
        this.submitted = true;

        if (form.valid && childlist.length == 0)
            this.IsShowError = true;

        if (form.valid && childlist.length > 0) {
            this.isLoading = true;
            var res= childlist.map(item => item.id);
            this.objUserChildMappingDTO.ChildIds = res;
            let type = "save";
            this.objUserChildMappingDTO.ExpiryDate = this.pComponent.GetDateSaveFormat(this.objUserChildMappingDTO.ExpiryDate);
            this.apiService.post(this.controllerName, "Save", this.objUserChildMappingDTO).then(data => this.Respone(data, type));
            //this.services.post(this.objUserChildMappingDTO, type).then(data => this.Respone(data, type));
        }
    }

    private Respone(filedConfig, type) {
        this.submitted = false;
        this.isLoading = false;
        if (filedConfig.IsError == true) {
            this.pComponent.alertDanger(filedConfig.ErrorMessage)
        }
        else if (filedConfig.IsError == false) {
            if (type == "save")
            {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = 0;
                this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
            }                
            else if (type == "delete")
            {
                this.objUserAuditDetailDTO.ActionId =3;
                this.objUserAuditDetailDTO.RecordNo = this.objUserChildMappingDTO.ChildId;
                this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
            }                
            this.objUserChildMappingDTO.ExpiryDate = null;
            this.UserChange(this.objUserChildMappingDTO.UserProfileId);
            this.arrayChildList = [];

            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
            this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onButtonEvent(item){
        this.ClickUnassign(item.UserProfileId,item.ChildId);
    }
}
