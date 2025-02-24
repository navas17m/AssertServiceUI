import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildEducationStudySupportInfo } from './DTO/childeducationstudysupportinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'childeducationstudysupportinfolist',
    templateUrl: './childeducationstudysupportinfolist.component.template.html',
    })

export class ChildEducationStudySupportInfoListComponent {
    public searchText: string = "";
    loading:boolean=false;
    childEducationStudySupportInfoList=[];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'From Date',prop:'StudySupportFromDate',sortable:true,width:'200',date:'Y'},
        {name:'To Date',prop:'StudySupportToDate',sortable:true,width:'200',date:'Y'},
        {name:'Study Type',prop:'StudyType',sortable:true,width:'200'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
    lstChildEducationStudySupportInfo = [];
    ChildID: number;
    objChildEducationStudySupportInfo: ChildEducationStudySupportInfo = new ChildEducationStudySupportInfo();
    returnVal; controllerName = "ChildEducationStudySupportInfo"; 
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=108;   
    constructor(private apiService: APICallService,private _router: Router, private modal: PagesComponent)
    {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildEducationStudySupportInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childeducationstudysupportinfolist/18");
            this._router.navigate(['/pages/referral/childprofilelist/1/18']);
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

    private bindChildEducationStudySupportInfo() {
        this.loading = true;
        this.apiService.get(this.controllerName,"GetList",this.ChildID).then(data =>
            {
                this.childEducationStudySupportInfoList = data;
                this.loading = false;
            });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childeducationstudysupportinfo/0/16']);
    }

    editChildEducationStudySupportInfo(ChildEducationStudySupportInfoId) { 
        this._router.navigate(['/pages/child/childeducationstudysupportinfo', ChildEducationStudySupportInfoId,16]);
    }    

    deleteChildEducationStudySupportInfo(SequenceNo) {            
        this.objChildEducationStudySupportInfo.SequenceNo = SequenceNo;
        this.apiService.delete(this.controllerName, this.objChildEducationStudySupportInfo).then(data => this.Respone(data));  
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);           
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);           
            this.bindChildEducationStudySupportInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildEducationStudySupportInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    
    onEdit($event){
        this.editChildEducationStudySupportInfo($event.SequenceNo);
    }
    onDelete($event){
        this.deleteChildEducationStudySupportInfo($event.SequenceNo);
    }
}