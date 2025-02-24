import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildEducationPEPInfo } from './DTO/childeducationpepinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'childeducationpepinfolist',
    templateUrl: './childeducationpepinfolist.component.template.html',
    })

export class ChildEducationPEPInfoListComponent {
    public searchText: string = "";
    loading:boolean=false;
    childEducationPEPInfoList=[];
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'PEP/EHCP',prop:'PEPorEHCPType',sortable:true,width:'300'},
        {name:'School Name',prop:'School',sortable:true,width:'300'},
        {name:'DATE',prop:'PEPDate',sortable:true,width:'100',date:'Y'},
        {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'100'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];
    lstChildEducationPEPInfo = [];
    ChildID: number;
    objChildEducationPEPInfo: ChildEducationPEPInfo = new ChildEducationPEPInfo();
    returnVal; controllerName = "ChildEducationPEPInfo";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=106;
    constructor(private apiService: APICallService,private _router: Router, private modal: PagesComponent)
    {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildEducationPEPInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childeducationpepinfolist/18");
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

    private bindChildEducationPEPInfo() {
      if(this.ChildID){
        this.loading = true;
        this.apiService.get(this.controllerName,"GetList",this.ChildID).then(data =>
        {
            this.childEducationPEPInfoList = data;
            this.loading=false;
        });
      }
    }
    fnAddData() {
        this._router.navigate(['/pages/child/childeducationpepinfo/0/16']);
    }

    editChildEducationPEPInfo(ChildEducationPEPInfoId, hasDraft) {
      if (hasDraft)
      {
          Common.SetSession("SaveAsDraft", "Y");
      }
      else
      {
          Common.SetSession("SaveAsDraft", "N");
      }
      this._router.navigate(['/pages/child/childeducationpepinfo', ChildEducationPEPInfoId,16 ]);
    }

    deleteChildEducationPEPInfo(SequenceNo, hasDraft) {
      this.objChildEducationPEPInfo.SequenceNo = SequenceNo;
        if (!hasDraft) {
            this.apiService.delete(this.controllerName, this.objChildEducationPEPInfo).then(data => this.Respone(data));
        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objSaveDraftInfoDTO.FormCnfgId = 106;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
            this.objSaveDraftInfoDTO.TypeId = this.ChildID;
            this.apiService.post("SaveAsDraftInfo", "Delete", this.objSaveDraftInfoDTO).then(data => {
                this.Respone(data);
            });
        }
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildEducationPEPInfo();
        }
        this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildEducationPEPInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    onEdit($event){
      if($event.SaveAsDraftStatus=='Submitted')
        this.editChildEducationPEPInfo($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
        this.editChildEducationPEPInfo($event.SequenceNo,true);
    }
    onDelete($event){
      if($event.SaveAsDraftStatus=='Submitted')
        this.deleteChildEducationPEPInfo($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
        this.deleteChildEducationPEPInfo($event.SequenceNo,true);
    }
}
