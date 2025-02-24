
import { Component ,ViewChild,ElementRef,Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ChildProfile } from '../child/DTO/childprofile';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableValuesDTO } from '../superadmin/DTO/configtablevalues';
import { UserProfile } from '../systemadmin/DTO/userprofile';
import { CarerComplaintInfoDTO } from './DTO/carercomplaintinfodto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({

        selector: 'carercomplaintinfolist',
        templateUrl: './carercomplaintinfolist.component.template.html',
    })

export class CarerComplaintInfoListComponent {
    public searchText: string = "";
    lstComplaintInfo = [];
    CarerParentId: number;
    objComplaintInfo: CarerComplaintInfoDTO = new CarerComplaintInfoDTO();
    returnVal;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    controllerName = "CarerComplaintsInfo";
    objChildProfile: ChildProfile = new ChildProfile();
    objUserProfile: UserProfile = new UserProfile();
    lstCategory = []; categoryId; loading = false; ComplaintsDate; showComplaintsHappenedPerson = false;
    lstComplaintsHappenedPerson = []; ComplaintsHappenedPersonId; AgencyProfileId; userProfileId;
    @ViewChild('btnViewTaggedChildComplaints') btnViewTaggedChildComplaints: ElementRef;
    columns =[
      {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
      {name:'Date of Complaint',prop:'ComplaintDate',sortable:true,width:'200',datetime:'Y'},
      {name:'Nature Of Complaint',prop:'NatureOfComplaint',sortable:true,width:'200',style:'display: block;width: 500px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;'},
      {name:'Status',prop:'SaveAsDraftStatus',sortable:true,width:'200'},
      {name:'Edit',prop:'Edit',sortable:false,width:'60'},
      {name:'View',prop:'View',sortable:false,width:'60'},
      {name:'Delete',prop:'Delete',sortable:false,width:'60'}
     ];
     columns1 =[
      {name:'Child Name', prop:'ChildName', width:'250'},
      {name:'Date of Complaint',prop:'ComplaintDate',width:'150',datetime:'Y'},
      {name:'Agency Socialworker',prop:'AgencySocialworkerInvolved',width:'200'},
      {name:'View', prop:'Button', label:'view',class:'btn btn-warning',width:'100'}
     ];
     objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=210;
    constructor(private apiService: APICallService, private _router: Router,private renderer: Renderer2
        , private modal: PagesComponent) {

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.userProfileId = parseInt(Common.GetSession("UserProfileId"));
        if ((Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 33]);
        }
        else {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindComplaintsinfo();
            this.bindTagCarerComplaintsInfo();
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
        this._router.navigate(['/pages/fostercarer/complaintsdata', 0, 3]);
    }
    edit(ComplaintsinfoId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/fostercarer/complaintsdata', ComplaintsinfoId, 3]);
    }
    fnLoadCategory() {
        this.lstComplaintsHappenedPerson = [];
        // console.log(this.categoryId);
        switch (this.categoryId) {
            case "0":
                {
                    this.showComplaintsHappenedPerson = false;
                    this.loading = true;
                    this.objComplaintInfo.AllegationDate = this.ComplaintsDate;
                    this.objComplaintInfo.FieldValue = null;
                    this.apiService.post(this.controllerName, "GetFilterDropDown", this.objComplaintInfo).then(data => {
                        this.lstComplaintInfo = data;
                        this.loading = false;
                    });
                    break;
                }
            case "1":
                {
                    this.showComplaintsHappenedPerson = false;
                    this.loading = true;
                    this.objComplaintInfo.AllegationDate = this.ComplaintsDate;
                    this.objComplaintInfo.FieldValue = "739";
                    this.apiService.post(this.controllerName, "GetFilterTextBox", this.objComplaintInfo).then(data => {
                        this.lstComplaintInfo = data;
                        this.loading = false;
                    });
                    break;
                }
            case "2":
                {
                    this.showComplaintsHappenedPerson = true;
                    this.loading = true;
                    this.objUserProfile.UserTypeCnfg.UserTypeId = 3;
                    this.objUserProfile.AgencyProfile.AgencyProfileId = this.AgencyProfileId;
                    this.apiService.post("UserProfile", "GetAllByUserTypeId", this.objUserProfile).then(data => {
                        data.forEach(item => {
                            let objCTV = new ConfigTableValuesDTO();
                            objCTV.CofigTableValuesId = item.UserProfileId;
                            objCTV.Value = item.PersonalInfo.FullName;
                            this.lstComplaintsHappenedPerson.push(objCTV);
                            this.loading = false;
                        });
                    });
                    break;
                }
            case "3":
                {
                    this.showComplaintsHappenedPerson = true;
                    this.loading = true;
                    this.objChildProfile.AgencyProfileId = this.AgencyProfileId;
                    this.objChildProfile.ChildStatusId = 19;
                    this.objChildProfile.CreatedUserId = this.userProfileId;
                    this.apiService.post("ChildProfile", "GetAllChildNameWithStatus", this.objChildProfile).then(data => {
                        this.lstComplaintsHappenedPerson = data;
                        this.loading = false;
                    });
                    break;
                }
            case "4":
                {
                    this.showComplaintsHappenedPerson = true;
                    this.loading = true;
                    this.apiService.get("CarerInfo", "ApprovedCarerParentNameAll", this.AgencyProfileId).then(data => {
                        data.forEach(item => {
                            let objCTV = new ConfigTableValuesDTO();
                            objCTV.CofigTableValuesId = item.CarerParentId;
                            objCTV.Value = item.PCFullName + ' (' + item.CarerCode + ')';
                            this.lstComplaintsHappenedPerson.push(objCTV);
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
                    this.showComplaintsHappenedPerson = false;
                    this.loading = true;
                    this.objComplaintInfo.AllegationDate = this.ComplaintsDate;
                    this.objComplaintInfo.FieldValue = "740";
                    this.apiService.post(this.controllerName, "GetFilterTextBox", this.objComplaintInfo).then(data => {
                        this.lstComplaintInfo = data;
                        this.loading = false;
                    });
                    break;
                }

        }
    }
    fnLoadFilter() {
        this.loading = true;
        this.objComplaintInfo.AllegationDate = this.ComplaintsDate;
        this.objComplaintInfo.FieldValue = this.ComplaintsHappenedPersonId;
        this.apiService.post(this.controllerName, "GetFilterDropDown", this.objComplaintInfo).then(data => {
            this.lstComplaintInfo = data;
            this.loading = false;
        });
    }
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 210;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
        let lstSaveDraft = [];
        this.apiService.post("SaveAsDraftInfo", "getall", this.objSaveDraftInfoDTO).then(data => {
            let jsonData = [];
            data.forEach(item => {
                jsonData = JSON.parse(item.JsonList);
                jsonData.forEach(T => {
                    lstSaveDraft.push(T);
                });

            });
            this.lstComplaintInfo = this.lstTemp.concat(lstSaveDraft);

            //this.lstChildDayLogJournal= this.lstChildDayLogJournal.sort(function (a, b) {
            //    return b.SequenceNo - a.SequenceNo;
            //});
        });
    }
    private bindComplaintsinfo() {
        this.apiService.get(this.controllerName, "GetListByCarerParentId", this.CarerParentId).then(data => {
            //this.lstTemp = data;
            //this.fnLoadSaveDraft();
            this.lstComplaintInfo = data;
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

    delete(SequenceNo, hasDraft) {
       this.objComplaintInfo.SequenceNo = SequenceNo;
        //this.objComplaintInfo.UniqueID = UniqueID;
        if (!hasDraft) {
            this.apiService.delete(this.controllerName, this.objComplaintInfo).then(data => this.Respone(data));
        } else {
          this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 210;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
            this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
            this.apiService.post("SaveAsDraftInfo", "Delete", this.objSaveDraftInfoDTO).then(data => {
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
            this.bindComplaintsinfo();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objComplaintInfo.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

    private bindTagCarerComplaintsInfo() {
        this.apiService.get("ChildComplaintsInfo", "GetTagComplaintsByCarerParentId", this.CarerParentId).then(data => {
            this.lstTagCarerComplaintsInfo = data;
        });
        this.apiService.get("ChildComplaintsInfo", "GetTagComplaintListByCarerParentId", this.CarerParentId).then(data => {
          this.tagChildComplaintInfo = data;
        });
    }
    tagChildComplaintInfo=[];
    lstTagCarerComplaintsInfo=[];
    hisTaggedCarerComplaints=[];
    hisCarerName;
    IsShowTaggedComplaints=false;
    fnShowTaggedComplaints()
    {
        this.IsShowTaggedComplaints=!this.IsShowTaggedComplaints;

    }
    fnViewChildComplaintstHistory(SequenceNo) {
        this.hisTaggedCarerComplaints = [];
        let data = this.lstTagCarerComplaintsInfo.filter(x => x.FieldName != 'IsActive' &&
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
            && x.FieldName != 'ComplaintAgainstPersonNameDropdown'
            && x.FieldName != 'ComplaintAgainstPersonName'
            && x.FieldName != 'AddtoSiblingsRecord'
            && x.FieldName != 'SelectSiblings'
            && x.SequenceNo == SequenceNo);
        if (data.length > 0) {
            this.hisTaggedCarerComplaints = data;
        }

        let carerName = this.lstTagCarerComplaintsInfo.filter(x => x.SequenceNo == SequenceNo && x.FieldName == 'CreatedUserId');
        if (carerName.length > 0) {
            this.hisCarerName = carerName[0].FieldValue;
        }

        let event = new MouseEvent('click', { bubbles: true });
        this.btnViewTaggedChildComplaints.nativeElement.dispatchEvent(event);
    }
    onEdit($event){
      if($event.SaveAsDraftStatus=='Submitted')
          this.edit($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.edit($event.SequenceNo,true);
    }
    onDelete($event){
      if($event.SaveAsDraftStatus=='Submitted')
          this.delete($event.SequenceNo,false);
      else if($event.SaveAsDraftStatus=='Saved as Draft')
          this.delete($event.SequenceNo,true);
    }
    onButtonEvent($event){
      this.fnViewChildComplaintstHistory($event.SequenceNo);
    }
}
