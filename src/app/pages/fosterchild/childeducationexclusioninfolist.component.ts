import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildEducationExclusionInfo } from './DTO/childeducationexclusioninfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'childeducationexclusioninfolist',
    templateUrl: './childeducationexclusioninfolist.component.template.html',
    })

export class ChildEducationExclusionInfoListComponent {
    public searchText: string = "";
    loading:boolean=false;
    childEducationExclusionInfoList=[];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Exclusion Date',prop:'ExclusionDate',sortable:true,width:'300',date:'Y'},
        {name:'Edit',prop:'Edit',sortable:false,width:'100'},
        {name:'View',prop:'View',sortable:false,width:'100'},
        {name:'Delete',prop:'Delete',sortable:false,width:'100'}
       ];
    lstChildEducationExclusionInfo = [];
    ChildID: number;
    objChildEducationExclusionInfo: ChildEducationExclusionInfo = new ChildEducationExclusionInfo();
    returnVal; controllerName = "ChildEducationExclusionInfo";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=104;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent)
    {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildEducationExclusionInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childeducationexclusioninfolist/18");
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

    private bindChildEducationExclusionInfo() {
        this.loading = true;
        this.apiService.get(this.controllerName,"GetList",this.ChildID).then(data =>
            {
                 this.childEducationExclusionInfoList = data;
                 this.loading=false;
            });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childeducationexclusioninfo/0/16']);
    }

    editChildEducationExclusionInfo(ChildEducationExclusionInfoId) { 
        this._router.navigate(['/pages/child/childeducationexclusioninfo', ChildEducationExclusionInfoId ,16]);
    }

    deleteChildEducationExclusionInfo(SequenceNo) {     
        this.objChildEducationExclusionInfo.SequenceNo = SequenceNo;
        this.apiService.delete(this.controllerName, this.objChildEducationExclusionInfo).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);           
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);           
            this.bindChildEducationExclusionInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildEducationExclusionInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    
    onEdit($event){
        this.editChildEducationExclusionInfo($event.SequenceNo);
    }
    onDelete($event){
        this.deleteChildEducationExclusionInfo($event.SequenceNo);
    }
}