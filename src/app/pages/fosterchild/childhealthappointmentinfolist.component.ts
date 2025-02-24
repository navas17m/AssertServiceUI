import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildHealthAppointmentInfo } from './DTO/childhealthappointmentinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
    selector: 'childhealthappointmentinfolist',
    templateUrl: './childhealthappointmentinfolist.component.template.html',
    })

export class ChildHealthAppointmentInfoListComponent {
    public searchText: string = "";
    lstChildHealthAppointmentInfo = [];
    public loading:boolean = false;
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date of Appointment / Visit',prop:'AppointmentDateAndTime',sortable:true,width:'200',datetime:'Y'},
        {name:'Doctor Name',prop:'Doctor',sortable:true,width:'400'},
        {name:'Health Appointment Type',prop:'HealthAppointmentType',sortable:true,width:'200'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
    
    ChildID: number;
    objChildHealthAppointmentInfo: ChildHealthAppointmentInfo = new ChildHealthAppointmentInfo();
    returnVal; controllerName = "ChildHealthAppointmentInfo"; 
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=111;   
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent)
    {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildHealthAppointmentInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childhealthappointmentinfolist/19");
            this._router.navigate(['/pages/referral/childprofilelist/1/19']);
        }
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    private bindChildHealthAppointmentInfo() {
        this.loading=true;
        this.apiService.get(this.controllerName,"GetListByChildId",this.ChildID).then(data => {
            this.lstChildHealthAppointmentInfo = data
            this.loading = false;
        });            
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childhealthappointmentinfo/0/19']);
    }

    editChildHealthAppointmentInfo(ChildHealthAppointmentInfoId) { 
        this._router.navigate(['/pages/child/childhealthappointmentinfo', ChildHealthAppointmentInfoId ,19]);
    }    

    deleteChildHealthAppointmentInfo(SequenceNo) {                 
        this.objChildHealthAppointmentInfo.SequenceNo = SequenceNo;
        //this.objChildHealthAppointmentInfo.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildHealthAppointmentInfo).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);           
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);           
            this.bindChildHealthAppointmentInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildHealthAppointmentInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        this.editChildHealthAppointmentInfo($event.SequenceNo);
    }
    onDelete($event){
        this.deleteChildHealthAppointmentInfo($event.SequenceNo);
    }
}