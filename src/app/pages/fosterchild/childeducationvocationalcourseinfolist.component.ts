import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildEducationVocationalCourseInfo } from './DTO/childeducationvocationalcourseinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'childeducationvocationalcourseinfolist',
    templateUrl: './childeducationvocationalcourseinfolist.component.template.html',
    })

export class ChildEducationVocationalCourseInfoListComponent {
    public searchText: string = "";
    loading:boolean=false;
    childEducationVocationalCourseInfoList=[];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Course Type',prop:'VocationalCourseType',sortable:true,width:'200'},
        {name:'Duration',prop:'Duration',sortable:true,width:'200'},
        {name:'Qualification',prop:'ExpectedQualification',sortable:true,width:'200'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
    lstChildEducationVocationalCourseInfo = [];
    ChildID: number;
    objChildEducationVocationalCourseInfo: ChildEducationVocationalCourseInfo = new ChildEducationVocationalCourseInfo();
    returnVal; controllerName = "ChildEducationVocationalCourseInfo";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=109;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent)
    {        
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildEducationVocationalCourseInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childeducationvocationalcourseinfolist/18");
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

    private bindChildEducationVocationalCourseInfo() {
        this.loading=true;
        this.apiService.get(this.controllerName,"GetList",this.ChildID).then(data =>
            {
                this.childEducationVocationalCourseInfoList = data;
                this.loading = false;
            });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childeducationvocationalcourseinfo/0/16']);
    }

    editChildEducationVocationalCourseInfo(ChildEducationVocationalCourseInfoId) { 
        this._router.navigate(['/pages/child/childeducationvocationalcourseinfo', ChildEducationVocationalCourseInfoId,16 ]);
    }    

    deleteChildEducationVocationalCourseInfo(SequenceNo) {               
        this.objChildEducationVocationalCourseInfo.SequenceNo = SequenceNo;
        this.apiService.delete(this.controllerName, this.objChildEducationVocationalCourseInfo).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);           
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);           
            this.bindChildEducationVocationalCourseInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildEducationVocationalCourseInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        this.editChildEducationVocationalCourseInfo($event.SequenceNo);
    }
    onDelete($event){
        this.deleteChildEducationVocationalCourseInfo($event.SequenceNo);
    }
}