import { Component} from '@angular/core'
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildHealthHospitalisationInfo } from './DTO/childhealthhospitalisationinfo'
import { PagesComponent } from '../pages.component'
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component
    ({
    selector: 'childhealthallergylist',
    templateUrl: './childhealthallergylist.component.template.html',
    })

export class ChildHealthAllergyListComponent {
    controllerName = "ChildHealthAllergy";
    lstChildHealthAllergy = [];
    ChildID: number;
    objChildHealthHospitalisationInfo: ChildHealthHospitalisationInfo = new ChildHealthHospitalisationInfo();
    returnVal;
    public searchText:string = "";
    columns =[
      {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
      {name:'Entry Date',prop:'EntryDate',sortable:true,width:'200'},
      {name:'Allergy Type',prop:'AllergyType',sortable:true,width:'200'},
      {name:'Edit',prop:'Edit',sortable:false,width:'60'},
      {name:'View',prop:'View',sortable:false,width:'60'},
      {name:'Delete',prop:'Delete',sortable:false,width:'60'}
     ];
     objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=382;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent)
    {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildAllergy();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/allergylist/19");
            this._router.navigate(['/pages/referral/childprofilelist/1/19']);
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

    private bindChildAllergy() {
        this.apiService.get(this.controllerName, "GetListByChildId", this.ChildID).then(data => this.lstChildHealthAllergy = data);
    }

    fnAddData() {
        this._router.navigate(['/pages/child/allergydata/0/19']);
    }

    editChildHealthHospitalisationInfo(ChildHealthAllergyId) {
        this._router.navigate(['/pages/child/allergydata', ChildHealthAllergyId,19]);
    }

    deleteChildHealthHospitalisationInfo(SequenceNo) {
        this.objChildHealthHospitalisationInfo.SequenceNo = SequenceNo;
        //this.objChildHealthHospitalisationInfo.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildHealthHospitalisationInfo).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildAllergy();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildHealthHospitalisationInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
      this.editChildHealthHospitalisationInfo($event.SequenceNo);
  }
  onDelete($event){
      this.deleteChildHealthHospitalisationInfo($event.SequenceNo);
  }
}
