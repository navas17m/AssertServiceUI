import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerSocialWorkerMappingDTO } from './DTO/carersocialworkermappingdto';
import { UserAuditHistoryDetailDTO } from '../common';

@Component({
    selector: 'CarerSocialWorkerMapping',
    templateUrl: './carersocialworkermapping.component.template.html',
})

export class CarerSocialWorkerMappingComponent {
    public searchText: string = "";
    _Form: FormGroup;
    arrayCarerList = [];
    objCarerSocialWorkerMappingDTO: CarerSocialWorkerMappingDTO = new CarerSocialWorkerMappingDTO();
    lstUserList = [];
    submitted = false;
    AssignedCarerList=[];
    isLoading: boolean = false;
    controllerName = "CarerSocialWorkerMapping";
    assignedCarers=[];
    carerIds;
    columns =[
        {name:'Carer Code',prop:'CarerCode',sortable:false,width:'100'},
        {name:'Carer Name',prop:'name',sortable:false,width:'150'},
        {name:'Date of Birth',prop:'dateOfBirth',sortable:false,width:'80'},
        {name:'Expiry Date',prop:'expiryDate',sortable:false,width:'80'},
        {name:'Un-assign',prop:'Button',label:'Un-assign', class:'btn btn-danger', sortable:false,width:'60'},
       ];
       objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
       FormCnfgId=11;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder, private pComponent: PagesComponent) {
        this.objCarerSocialWorkerMappingDTO.ExpiryDate = null;
        this._Form = _formBuilder.group({
            CarerSocialWorkerMapping: ['0', Validators.required],
            ExpiryDate: [],
        });

        this.BindSocialWorker();

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
        this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    BindSocialWorker() {
        this.apiService.get(this.controllerName, "GetAll").then(data => { this.lstUserList = data; })
        //this.services.getAll().then(data => { this.lstUserList = data; })
    }

    SocialWorkerChange(SocialWorkerId) {
        this.arrayCarerList = [];
        this.objCarerSocialWorkerMappingDTO.CarerParentIds = "0";
        this.apiService.get(this.controllerName, "GetById", SocialWorkerId).then(data => {
            this.socialworkerchangeResponse(data.LstCarerBind);
            this.AssignedCarerList = data.LstCarerMapped;
            this.assignedCarers = this.AssignedCarerList.map(item => ({
                ...item,
                name:(item.SCFullName)? item.PCFullName + ' ' + item.SCFullName : item.PCFullName,
                dateOfBirth:item.DateOfBirth ? moment(item.DateOfBirth).format("DD/MM/YYYY") : '',
                expiryDate:item.ExpiryDate ? moment(item.ExpiryDate).format("DD/MM/YYYY") : ''
            }))

        })
        //this.services.getBySocialWorkerId(SocialWorkerId).then(data => {
        //    this.socialworkerchangeResponse(data.LstCarerBind);
        //    this.AssignedCarerList = data.LstCarerMapped;
        //})
    }

    socialworkerchangeResponse(data) {
        this.arrayCarerList=[];
        this.carerIds="";
        if (data != null) {
            data.forEach(item => {
                if (item.SCFullName != null && item.SCFullName != '')
                    this.arrayCarerList.push({ id: item.CarerParentId, name: item.PCFullName + item.SCFullName + ' (' + item.CarerCode + ')' });
                else
                    this.arrayCarerList.push({ id: item.CarerParentId, name: item.PCFullName + ' (' + item.CarerCode + ')' });

            });
        }
    }

    ClickUnassign(SocialWorkerId, CarerParentId) {
        this.objCarerSocialWorkerMappingDTO.SocialWorkerId = SocialWorkerId;
        this.objCarerSocialWorkerMappingDTO.CarerParentId = CarerParentId;
        this.apiService.post(this.controllerName, "Delete", this.objCarerSocialWorkerMappingDTO).then(data => this.Respone(data, "delete"));
        //this.services.post(this.objCarerSocialWorkerMappingDTO, "delete").then(data => this.Respone(data, "delete"));
    }
    IsShowError = false;
    Submit(form, carerlist) {
        //  console.log(carerlist);
        this.submitted = true;
        if (form.valid && carerlist.length == 0)
            this.IsShowError = true;

        if (form.valid && carerlist.length > 0) {
            this.isLoading = true;
            this.objCarerSocialWorkerMappingDTO.CarerParentIds = carerlist;
            let type = "save";
            this.objCarerSocialWorkerMappingDTO.ExpiryDate = this.pComponent.GetDateSaveFormat(this.objCarerSocialWorkerMappingDTO.ExpiryDate);
            this.apiService.post(this.controllerName, "Save", this.objCarerSocialWorkerMappingDTO).then(data => this.Respone(data, type));
            //this.services.post(this.objCarerSocialWorkerMappingDTO, type).then(data => this.Respone(data, type));
        }
    }

    private Respone(filedConfig, type) {
        this.submitted = false;
        this.isLoading = false;
        if (filedConfig.IsError == true) {
            this.pComponent.alertDanger(filedConfig.ErrorMessage)
        }
        else if (filedConfig.IsError == false) {
            this.objCarerSocialWorkerMappingDTO.ExpiryDate = null;
            if (type == "save")
            {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = 0;
                this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
            }                
            else if (type == "delete")
            {
                this.objUserAuditDetailDTO.ActionId =3;
                this.objUserAuditDetailDTO.RecordNo = this.objCarerSocialWorkerMappingDTO.CarerParentId;
                this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
            }

            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
            this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);

            Common.SetSession("CarerParentId", "0");
            Common.SetSession("CarerSSWId", "0");
            Common.SetSession("CarerSSWName", "0");
            Common.SetSession("SelectedApplicantProfile", "0");

            Common.SetSession("ACarerParentId", "0");
            Common.SetSession("ACarerSSWId", "0");
            Common.SetSession("ACarerSSWName", "0");
            Common.SetSession("SelectedCarerProfile", "0");

            this.SocialWorkerChange(this.objCarerSocialWorkerMappingDTO.SocialWorkerId);
        }
    }
    onButtonEvent(item){
        this.ClickUnassign(item.SocialWorkerId,item.CarerParentId)
    }
}
