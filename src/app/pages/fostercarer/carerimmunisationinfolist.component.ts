import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerImmunisationHistoryDTO } from './DTO/carerimmunisationhistorydto';
import { CarerImmunisationInfo } from './DTO/carerimmunisationinfo';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
        selector: 'carerimmunisationinfolist',
        templateUrl: './carerimmunisationinfolist.component.template.html',
    })

export class CarerImmunisationInfoListComponent {
    public searchText: string = "";
    lstCarerImmunisationInfo = [];
    ResponseCarerImmunisationHistoryControl;
    objCarerImmunisationInfo: CarerImmunisationInfo = new CarerImmunisationInfo();
    objCarerImmunisationHistoryDTO: CarerImmunisationHistoryDTO = new CarerImmunisationHistoryDTO();
    returnVal;
    CarerParentId: number;
    submitted = false;
    dynamicformcontrol;
    _Form: FormGroup; controllerName = "CarerImmunisationInfo";
    lstCarerImmunisation = [];
    columns =[
      {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
      {name:'Carer Name',prop:'CarerName',sortable:true,width:'150'},
      {name:'Date of Immunisation',prop:'ImmunisationDate',sortable:true,width:'150',date:'Y'},
      {name:'Immunisation Type',prop:'ImmunisationType',sortable:true,width:'150'},
      {name:'Edit',prop:'Edit',sortable:false,width:'60'},
      {name:'View',prop:'View',sortable:false,width:'60'},
      {name:'Delete',prop:'Delete',sortable:false,width:'60'}
     ];
     loading:boolean=false;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=217;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder, private _router: Router, private modal: PagesComponent) {


        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 35]);
        }
        else {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindCarerImmunisationInfo();
            this.objUserAuditDetailDTO.ActionId = 5;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            this.objUserAuditDetailDTO.RecordNo = 0;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            this.loading=true;
        }
        this._Form = _formBuilder.group({});

    }

    private bindCarerImmunisationInfo() {
        if (this.CarerParentId != null) {
            this.objCarerImmunisationInfo.CarerParentId = this.CarerParentId;
            this.objCarerImmunisationInfo.ControlLoadFormat = ["List"];
            this.apiService.post(this.controllerName, "GetDynamicControlsvalueAndList", this.objCarerImmunisationInfo).then(data => {
                this.lstCarerImmunisationInfo = data.lstCarerImmunisationInfo;
                    this.ResponseCarerImmunisationHistoryControl = data.lstAgencyFieldMapping;
                    this.loading=false;
            });
            this.apiService.get(this.controllerName, "GetListByCarerParentId", this.CarerParentId).then(data => {
              this.lstCarerImmunisation = data;
              this.loading=false;
          });
        }
    }

    fnAddData() {
        this._router.navigate(['/pages/fostercarer/carerimmunisationinfodata/0/3']);
    }

    submitImmunisationHistory(value, form) {
        if (form.valid) {
            this.submitted = false;
            this.objCarerImmunisationHistoryDTO.DynamicValue = value;
            this.objCarerImmunisationHistoryDTO.CarerParentId = this.CarerParentId;
            this.apiService.post(this.controllerName, "ListSave", this.objCarerImmunisationHistoryDTO).then(data => this.ResponeCourseStatus(data));
        }
        else
            this.submitted = true;
    }

    editCarerImmunisationInfo(CarerImmunisationInfoId) {
        this._router.navigate(['/pages/fostercarer/carerimmunisationinfodata', CarerImmunisationInfoId, 3]);
    }

    deleteCarerImmunisationInfo(SequenceNo) {
        this.objCarerImmunisationInfo.SequenceNo = SequenceNo;
        //this.objCarerImmunisationInfo.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objCarerImmunisationInfo).then(data => this.Respone(data));
    }

    private ResponeCourseStatus(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
        }
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindCarerImmunisationInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objCarerImmunisationInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit(item){
      this.editCarerImmunisationInfo(item.SequenceNo);
    }
    onDelete(item){
      this.deleteCarerImmunisationInfo(item.SequenceNo);
    }
}
