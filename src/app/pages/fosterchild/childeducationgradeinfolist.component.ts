import { Component} from '@angular/core';
//import { ChildEducationGradeInfoService } from '../services/childeducationgradeinfo.service'
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildEducationGradeInfo } from './DTO/childeducationgradeinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'childeducationgradeinfolist',
    templateUrl: './childeducationgradeinfolist.component.template.html'
    //,providers: [ChildEducationGradeInfoService]
    })

export class ChildEducationGradeInfoListComponent {
    public searchText: string = "";
    controllerName = "ChildEducationGradeInfo";
    lstChildEducationGradeInfo = [];
    childEducationGradeInfoList = [];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'School Year',prop:'SchoolYear',sortable:true,width:'100'},
        {name:'Type of Exam',prop:'TypeOfExam',sortable:true,width:'100'},
        {name:'Grade Level',prop:'GradeLevel',sortable:true,width:'100'},
        {name:'Edit',prop:'Edit',sortable:false,width:'100'},
        {name:'View',prop:'View',sortable:false,width:'100'},
        {name:'Delete',prop:'Delete',sortable:false,width:'100'}
       ];
    ChildID: number;
    objChildEducationGradeInfo: ChildEducationGradeInfo = new ChildEducationGradeInfo();
    returnVal;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=107;
    constructor(private _router: Router, private modal: PagesComponent,
        private apiService: APICallService) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildEducationGradeInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childeducationgradeinfolist/18");
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

    private bindChildEducationGradeInfo() {
        //this.apiService.get(this.controllerName,"GetAllByChildId", this.ChildID).then(data => this.lstChildEducationGradeInfo = data);
        this.apiService.get(this.controllerName,"GetListByChildId", this.ChildID).then(data => this.childEducationGradeInfoList = data);
      //  this.CEGIService.getChildEducationGradeInfoList(this.ChildID).subscribe(data => this.lstChildEducationGradeInfo = data);
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childeducationgradeinfo/0/16']);
    }

    editChildEducationGradeInfo(ChildEducationGradeInfoId) {
        this._router.navigate(['/pages/child/childeducationgradeinfo', ChildEducationGradeInfoId,16]);
    }

    deleteChildEducationGradeInfo(SequenceNo) {
        this.objChildEducationGradeInfo.SequenceNo = SequenceNo;
        //this.objChildEducationGradeInfo.UniqueID = UniqueID;
      //  this.CEGIService.post(this.objChildEducationGradeInfo, "delete").then(data => this.Respone(data));
        this.apiService.delete(this.controllerName, this.objChildEducationGradeInfo).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildEducationGradeInfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildEducationGradeInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        this.editChildEducationGradeInfo($event.SequenceNo);
    }
    onDelete($event){
        this.deleteChildEducationGradeInfo($event.SequenceNo);
    }
}