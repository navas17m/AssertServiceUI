import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildHealthImmunisationInfo } from './DTO/childhealthimmunisationinfo'
import { childImmunisationHistoryDTO } from './DTO/childimmunisationhistorydto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
        selector: 'childhealthimmunisationinfolist',
        templateUrl: './childhealthimmunisationinfolist.component.template.html',
    })

export class ChildHealthImmunisationInfoListComponent {
    public searchText: string = "";
    lstChildHealthImmunisationInfo = [];
    ChildHealthImmunisationInfoList = [];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date of Immunisation',prop:'ImmunisationDate',sortable:true,width:'300',date:'Y'},
        {name:'Immunisation Type',prop:'ImmunisationType',sortable:true,width:'300'},
        {name:'Edit',prop:'Edit',sortable:false,width:'100'},
        {name:'View',prop:'View',sortable:false,width:'100'},
        {name:'Delete',prop:'Delete',sortable:false,width:'100'}
       ];
    ResponseChildImmunisationHistoryControl;
    objChildHealthImmunisationInfo: ChildHealthImmunisationInfo = new ChildHealthImmunisationInfo();
    objchildImmunisationHistoryDTO: childImmunisationHistoryDTO = new childImmunisationHistoryDTO();
    returnVal;
    ChildID: number;
    submitted = false;
    dynamicformcontrol;
    _Form: FormGroup; controllerName = "ChildHealthImmunisationInfo"; 
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=115;
    constructor(private apiService: APICallService,private _formBuilder: FormBuilder, private _router: Router, private modal: PagesComponent) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildHealthImmunisationInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childhealthimmunisationinfolist/19");
            this._router.navigate(['/pages/referral/childprofilelist/1/19']);
        }
        this._Form = _formBuilder.group({});

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    private bindChildHealthImmunisationInfo() {
        if (this.ChildID != null) {
            this.objChildHealthImmunisationInfo.ChildId = this.ChildID;
            this.objChildHealthImmunisationInfo.ControlLoadFormat = ["List"];
            this.apiService.get(this.controllerName,"GetListByChildId",this.ChildID).then(data => {
                this.ChildHealthImmunisationInfoList = data;
            });
            this.apiService.post(this.controllerName,"GetDynamicControlsvalueAndList",this.objChildHealthImmunisationInfo).then(data => {
                this.lstChildHealthImmunisationInfo = data.lstChildHealthImmunisationInfo,
                    this.ResponseChildImmunisationHistoryControl = data.lstAgencyFieldMapping
            });
        }
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childhealthimmunisationinfo/0/19']);
    }

    submitImmunisationHistory(value, form) {
        if (form.valid) {
            this.objchildImmunisationHistoryDTO.DynamicValue = value;
            this.objchildImmunisationHistoryDTO.ChildId = this.ChildID;
            this.apiService.post(this.controllerName,"ListSave",this.objchildImmunisationHistoryDTO).then(data => this.ResponeCourseStatus(data));
        }
    }

    editChildHealthImmunisationInfo(ChildHealthImmunisationInfoId) {
        this._router.navigate(['/pages/child/childhealthimmunisationinfo', ChildHealthImmunisationInfoId, 19]);
    }

    deleteChildHealthImmunisationInfo(SequenceNo) {
        this.objChildHealthImmunisationInfo.SequenceNo = SequenceNo;
        //this.objChildHealthImmunisationInfo.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildHealthImmunisationInfo).then(data => this.Respone(data));
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
            this.bindChildHealthImmunisationInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildHealthImmunisationInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

    onEdit($event){
        this.editChildHealthImmunisationInfo($event.SequenceNo);
    }
    onDelete($event){
        this.deleteChildHealthImmunisationInfo($event.SequenceNo);
    }
}