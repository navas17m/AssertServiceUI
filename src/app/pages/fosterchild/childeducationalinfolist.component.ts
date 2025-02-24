import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildEducationalInfo } from './DTO/childeducationalinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'childeducationalinfolist',
    templateUrl: './childeducationalinfolist.component.template.html',
    })

export class ChildEducationalInfoListComponent {
    public searchText: string = "";
    loading:boolean=false;
    childEducationalInfoList=[];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'School Name',prop:'School',sortable:true,width:'200'},
        {name:'Class Studying',prop:'ClassStudyingId',sortable:true,width:'300'},
        {name:'School Year',prop:'SchoolYear',sortable:true,width:'100'},
        {name:'Current School?',prop:'IsThisCurrentSchool',sortable:true,width:'100'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
    lstChildEducationalInfo = [];
    ChildID: number;
    objChildEducationalInfo: ChildEducationalInfo = new ChildEducationalInfo();
    returnVal; controllerName = "ChildEducationalInfo"; 
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=102;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent)
    {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildEducationalInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childeducationalinfolist/18");
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

    private bindChildEducationalInfo() {
        this.loading=true;
        this.apiService.get(this.controllerName,"GetList",this.ChildID).then(data => 
            {
                this.childEducationalInfoList = data;
                this.loading=false;
            });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childeducationalinfo/0/16']);
    }

    editChildEducationalInfo(ChildEducationalInfoId) { 
        this._router.navigate(['/pages/child/childeducationalinfo', ChildEducationalInfoId,16 ]);
    }

    deleteChildEducationalInfo(SequenceNo) {            
        this.objChildEducationalInfo.SequenceNo = SequenceNo;
        this.apiService.delete(this.controllerName, this.objChildEducationalInfo).then(data => this.Respone(data)); 
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);           
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);           
            this.bindChildEducationalInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildEducationalInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        this.editChildEducationalInfo($event.SequenceNo);
    }
    onDelete($event){
        this.deleteChildEducationalInfo($event.SequenceNo);
    }
}