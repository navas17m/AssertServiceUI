
import { Component,ViewChild,ElementRef,Renderer2  } from '@angular/core';
import { Router } from '@angular/router';
import { ChildProfile } from '../child/DTO/childprofile';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableValuesDTO } from '../superadmin/DTO/configtablevalues';
import { UserProfile } from '../systemadmin/DTO/userprofile';
import { CarerAllegationInfo } from './DTO/carerallegationinfo';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({

    selector: 'carerallegationinfolist',
    templateUrl: './carerallegationinfolist.component.template.html',
    })

export class CarerAllegationInfoListComponent {
    public searchText: string = "";
    lstAllegationInfo = [];
    CarerParentId: number;
    objAllegationInfo: CarerAllegationInfo = new CarerAllegationInfo();
    returnVal;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    controllerName = "CarerAllegationInfo";
    objChildProfile: ChildProfile = new ChildProfile();
    objUserProfile: UserProfile = new UserProfile();
    lstCategory = []; categoryId; loading = false; allegationDate; showAllegationHappenedPerson = false;
    lstAllegationHappenedPerson = []; allegationHappenedPersonId; AgencyProfileId; userProfileId;
    @ViewChild('btnViewTaggedChildAllegation') btnViewTaggedChildAllegation: ElementRef;
    columns =[
      {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
      {name:'Date of Allegation',prop:'AllegationDate',sortable:true,width:'200',datetime:'Y'},
      {name:'Nature Of Allegation',prop:'NatureOfAllegation',sortable:true,width:'200',style:'display: block;width: 500px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;'},
      {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'200'},
      {name:'Edit',prop:'Edit',sortable:false,width:'60'},
      {name:'View',prop:'View',sortable:false,width:'60'},
      {name:'Delete',prop:'Delete',sortable:false,width:'60'}
     ];
    columns1 =[
      {name:'Child Name', prop:'ChildName', width:'250'},
      {name:'Date of Allegation',prop:'AllegationDate',width:'150',datetime:'Y'},
      {name:'Agency Socialworker',prop:'AgencySocialworkerInvolved',width:'200'},
      {name:'View', prop:'Button',label:'View', class:'btn btn-warning',width:'100'}
     ];
     objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=209;
    constructor(private apiService: APICallService, private _router: Router
        ,private renderer: Renderer2
        , private modal: PagesComponent) {

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.userProfileId = parseInt(Common.GetSession("UserProfileId"));
        if ((Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 32]);
        }
        else {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindAllegationinfo();
            this.bindTagCarerAllegationInfo();
        }
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnAdd() {
        this._router.navigate(['/pages/fostercarer/allegationdata', 0, 3]);
    }
    editAllegationinfo(allegationinfoId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/fostercarer/allegationdata', allegationinfoId, 3]);
    }
    fnLoadCategory() {
        this.lstAllegationHappenedPerson = [];
        // console.log(this.categoryId);
        switch (this.categoryId) {
            case "0":
                {
                    this.showAllegationHappenedPerson = false;
                    this.loading = true;
                    this.objAllegationInfo.AllegationDate = this.allegationDate;
                    this.objAllegationInfo.FieldValue = null;
                    this.apiService.post(this.controllerName, "GetFilterDropDown", this.objAllegationInfo).then(data => {
                        this.lstAllegationInfo = data;
                        this.loading = false;
                    });
                    break;
                }
            case "1":
                {
                    this.showAllegationHappenedPerson = false;
                    this.loading = true;
                    this.objAllegationInfo.AllegationDate = this.allegationDate;
                    this.objAllegationInfo.FieldValue = "739";
                    this.apiService.post(this.controllerName, "GetFilterTextBox", this.objAllegationInfo).then(data => {
                        this.lstAllegationInfo = data;
                        this.loading = false;
                    });
                    break;
                }
            case "2":
                {
                    this.showAllegationHappenedPerson = true;
                    this.loading = true;
                    this.objUserProfile.UserTypeCnfg.UserTypeId = 3;
                    this.objUserProfile.AgencyProfile.AgencyProfileId = this.AgencyProfileId;
                    this.apiService.post("UserProfile", "GetAllByUserTypeId", this.objUserProfile).then(data => {
                        data.forEach(item => {
                            let objCTV = new ConfigTableValuesDTO();
                            objCTV.CofigTableValuesId = item.UserProfileId;
                            objCTV.Value = item.PersonalInfo.FullName;
                            this.lstAllegationHappenedPerson.push(objCTV);
                            this.loading = false;
                        });
                    });
                    break;
                }
            case "3":
                {
                    this.showAllegationHappenedPerson = true;
                    this.loading = true;
                    this.objChildProfile.AgencyProfileId = this.AgencyProfileId;
                    this.objChildProfile.ChildStatusId = 19;
                    this.objChildProfile.CreatedUserId = this.userProfileId;
                    this.apiService.post("ChildProfile", "GetAllChildNameWithStatus", this.objChildProfile).then(data => {
                        this.lstAllegationHappenedPerson = data;
                        this.loading = false;
                    });
                    break;
                }
            case "4":
                {
                    this.showAllegationHappenedPerson = true;
                    this.loading = true;
                    this.apiService.get("CarerInfo", "ApprovedCarerParentNameAll", this.AgencyProfileId).then(data => {
                        data.forEach(item => {
                            let objCTV = new ConfigTableValuesDTO();
                            objCTV.CofigTableValuesId = item.CarerParentId;
                            objCTV.Value = item.PCFullName + ' (' + item.CarerCode + ')';
                            this.lstAllegationHappenedPerson.push(objCTV);
                            this.loading = false;
                        });
                    });
                    break;
                }
            case "5":
                {

                    break;
                }
            case "6":
                {
                    this.showAllegationHappenedPerson = false;
                    this.loading = true;
                    this.objAllegationInfo.AllegationDate = this.allegationDate;
                    this.objAllegationInfo.FieldValue = "740";
                    this.apiService.post(this.controllerName, "GetFilterTextBox", this.objAllegationInfo).then(data => {
                        this.lstAllegationInfo = data;
                        this.loading = false;
                    });
                    break;
                }

        }
    }
    fnLoadFilter() {
        this.loading = true;
        this.objAllegationInfo.AllegationDate = this.allegationDate;
        this.objAllegationInfo.FieldValue = this.allegationHappenedPersonId;
        this.apiService.post(this.controllerName, "GetFilterDropDown", this.objAllegationInfo).then(data => {
            this.lstAllegationInfo = data;
            this.loading = false;
        });
    }
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 209;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
        let lstSaveDraft = [];
        this.apiService.post("SaveAsDraftInfo","getall",this.objSaveDraftInfoDTO).then(data => {
            let jsonData = [];
            data.forEach(item => {
                jsonData = JSON.parse(item.JsonList);
                jsonData.forEach(T => {
                    lstSaveDraft.push(T);
                });

            });
            this.lstAllegationInfo = this.lstTemp.concat(lstSaveDraft);

            //this.lstChildDayLogJournal= this.lstChildDayLogJournal.sort(function (a, b) {
            //    return b.SequenceNo - a.SequenceNo;
            //});
        });
    }
    private bindAllegationinfo() {
        this.apiService.get(this.controllerName, "GetListByCarerParentId", this.CarerParentId).then(data => {
            //this.lstTemp = data;
            //this.fnLoadSaveDraft();
            this.lstAllegationInfo = data;
        });
        this.lstCategory = [];
        let objCTV = new ConfigTableValuesDTO();
        objCTV.CofigTableValuesId = 1;
        objCTV.Value = "Child Parents";
        this.lstCategory.push(objCTV);
        objCTV = new ConfigTableValuesDTO();
        objCTV.CofigTableValuesId = 2;
        objCTV.Value = "Child Social Worker";
        this.lstCategory.push(objCTV);
        objCTV = new ConfigTableValuesDTO();
        objCTV.CofigTableValuesId = 3;
        objCTV.Value = "Child/Young Person";
        this.lstCategory.push(objCTV);

        objCTV = new ConfigTableValuesDTO();
        objCTV.CofigTableValuesId = 4;
        objCTV.Value = "Foster Carer";
        this.lstCategory.push(objCTV);

        objCTV = new ConfigTableValuesDTO();
        objCTV.CofigTableValuesId = 5;
        objCTV.Value = "Other Professional";
        this.lstCategory.push(objCTV);

        objCTV = new ConfigTableValuesDTO();
        objCTV.CofigTableValuesId = 6;
        objCTV.Value = "Others";
        this.lstCategory.push(objCTV);
    }

    deleteAllegationinfo(SequenceNo, hasDraft) {


            this.objAllegationInfo.SequenceNo = SequenceNo;
            //this.objAllegationInfo.UniqueID = UniqueID;
            if (!hasDraft)
            {
                this.apiService.delete(this.controllerName, this.objAllegationInfo).then(data => this.Respone(data));
            }else {
                this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
                this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
                this.objSaveDraftInfoDTO.FormCnfgId = 209;
                this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
                this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
                this.apiService.post("SaveAsDraftInfo","Delete",this.objSaveDraftInfoDTO).then(data => {
                    this.Respone(data);
                });
            }

    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindAllegationinfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objAllegationInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }


    private bindTagCarerAllegationInfo() {
        this.apiService.get("ChildAllegationInfo", "GetTagAllegationByCarerParentId", this.CarerParentId).then(data => {
            this.lstTagCarerAllegationInfo = data;
        });
        this.apiService.get("ChildAllegationInfo", "GetTagAllegationListByCarerParentId", this.CarerParentId).then(data => {
          this.tagChildAllegationInfo = data;
      });
    }
    tagChildAllegationInfo=[];
    lstTagCarerAllegationInfo=[];
    hisTaggedCarerAllegation=[];
    hisCarerName;
    IsShowTaggedAllegation=false;
    fnShowTaggedAllegation()
    {
        this.IsShowTaggedAllegation=!this.IsShowTaggedAllegation;

    }
    fnViewChildAllegationtHistory(SequenceNo) {
        this.hisTaggedCarerAllegation = [];
        let data = this.lstTagCarerAllegationInfo.filter(x => x.FieldName != 'IsActive' &&
            x.FieldName != 'CreatedDate'
            && x.FieldName != 'CreatedUserId'
            && x.FieldName != 'UpdatedDate'
            && x.FieldName != 'UpdatedUserId'
            && x.FieldName != 'SiblingParentSno'
            && x.FieldName != 'CarerChildSNo'
            && x.FieldName != 'SaveAsDraftStatus'
            && x.FieldName != 'SocialWorkerId'
            && x.FieldName != 'CarerParentId'
            && x.FieldName != 'CarerParentIds'
            && x.FieldName != 'ChildIds'
            && x.FieldName != 'AllegationAgainstPersonNameDropdown'
            && x.FieldName != 'AllegationAgainstPersonName'
            && x.FieldName != 'AddtoSiblingsRecord'
            && x.FieldName != 'SelectSiblings'
            && x.SequenceNo == SequenceNo);
        if (data.length > 0) {
            this.hisTaggedCarerAllegation = data;
        }

        let carerName = this.lstTagCarerAllegationInfo.filter(x => x.SequenceNo == SequenceNo && x.FieldName == 'CreatedUserId');
        if (carerName.length > 0) {
            this.hisCarerName = carerName[0].FieldValue;
        }

        let event = new MouseEvent('click', { bubbles: true, cancelable: false });
        this.btnViewTaggedChildAllegation.nativeElement.dispatchEvent(event);
    }
    onEdit($event){
      if($event.SaveAsDraftStatus=='Submitted')
          this.editAllegationinfo($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.editAllegationinfo($event.SequenceNo,true);
  }
  onDelete($event){
      if($event.SaveAsDraftStatus=='Submitted')
          this.deleteAllegationinfo($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.deleteAllegationinfo($event.SequenceNo,true);
  }
  onButtonEvent($event){
    this.fnViewChildAllegationtHistory($event.SequenceNo);
}
}
