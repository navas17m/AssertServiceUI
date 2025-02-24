import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'CarerCheckList',
    templateUrl: './carerchecklist.component.template.html',
})

export class CarerCheckListComponet {

    controllerName = "CarerStatusChange";
    CarerParentId;
    objQeryVal;

    InterestedCheckList = [];
    Stage1CheckList = [];
    Stage2CheckList = [];
    stageChangeInfo;
    FormCnfgId;
    //Doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private activatedroute: ActivatedRoute, private _router: Router,
        private apiService: APICallService) {


        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 29]);
        }
        else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 27]);
        }
        else if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 190;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.BindCheckListDetail();
            this.TypeId = this.CarerParentId;
            this.tblPrimaryKey = this.CarerParentId;
            this.CheckFormAccess(this.FormCnfgId);
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 189;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            this.BindCheckListDetail();
            this.TypeId = this.CarerParentId;
            this.tblPrimaryKey = this.CarerParentId;
            this.CheckFormAccess(this.FormCnfgId);
        }

        //Doc
        this.formId = 36;
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    BindCheckListDetail() {
        if (this.CarerParentId != 0 && this.CarerParentId != null) {
            this.apiService.get(this.controllerName, "GetAllCheckListByCarerParentId", this.CarerParentId).then(data => {
                this.InterestedCheckList = data.filter(x => x.Format == 'Interested');
                this.Stage1CheckList = data.filter(x => x.Format == 'Stage1');
                this.Stage2CheckList = data.filter(x => x.Format == 'Stage2');
                this.stageChangeInfo = data[0].StatgeDates;
              //  console.log("##########");
              //  console.log(data);
              //  console.log(this.InterestedCheckList);

            });
        }
    }


    fnEdit() {
        this._router.navigate(['/pages/fostercarer/carerchecklistdata', this.CarerParentId, this.objQeryVal.mid]);
    }

    insFormRoleAccessMapping = [];
    UserProfileId;
    insVisibleEditBtn = false;
    CheckFormAccess(FormId) {

        this.insFormRoleAccessMapping = JSON.parse(Common.GetSession("FormRoleAccessMapping"));

        this.UserProfileId = Common.GetSession("UserProfileId");
        if (this.UserProfileId == 1) {
            this.insVisibleEditBtn = true;
        }
        else if (FormId != null && this.insFormRoleAccessMapping != null) {
            let check = this.insFormRoleAccessMapping.filter(data => data.FormCnfgId == FormId && data.AccessCnfgId == 3);
            if (check.length > 0) {
                this.insVisibleEditBtn = true;
            }
            else {
                this.insVisibleEditBtn = false;
            }
        }
    }
}
