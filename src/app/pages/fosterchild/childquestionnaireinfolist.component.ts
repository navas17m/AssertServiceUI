import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildQuestionnaireInfo } from './DTO/childquestionnaireinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'childquestionnaireinfolist',
    templateUrl: './childquestionnaireinfolist.component.template.html',
    })

export class ChildQuestionnaireInfoListComponent {
    public searchText: string = "";
    lstChildQuestionnaireInfo = [];
    childQuestionnaireInfoList = [];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'	Questionnaire Date',prop:'QuestionnaireDate',sortable:true,width:'200'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
        ];
    ChildID: number;
    objChildQuestionnaireInfo: ChildQuestionnaireInfo = new ChildQuestionnaireInfo();
    returnVal; controllerName = "ChildQuestionnaireInfo"; 
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=95;
    constructor(private apiService: APICallService,private _router: Router, private modal: PagesComponent) {
        
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildQuestionnaireInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childquestionnaireinfolist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/4']);
        }

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    private bindChildQuestionnaireInfo() {
        //this.apiService.get(this.controllerName,"GetAllByChildId",this.ChildID).then(data => this.lstChildQuestionnaireInfo = data);
        this.apiService.get(this.controllerName,"GetListByChildId",this.ChildID).then(data => this.childQuestionnaireInfoList = data);
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childquestionnaireinfo/0/4']);
    }

    editChildQuestionnaireInfo(ChildQuestionnaireInfoId) {
        this._router.navigate(['/pages/child/childquestionnaireinfo', ChildQuestionnaireInfoId,4]);
    }
    
    deleteChildQuestionnaireInfo(SequenceNo) {
        this.objChildQuestionnaireInfo.SequenceNo = SequenceNo;
        this.apiService.delete(this.controllerName, this.objChildQuestionnaireInfo).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildQuestionnaireInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildQuestionnaireInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        this.editChildQuestionnaireInfo($event.SequenceNo);
     }
    onDelete($event){
        this.deleteChildQuestionnaireInfo($event.SequenceNo);
    }
}