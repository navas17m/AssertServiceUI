
import { Component,ViewChild,ElementRef,Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ChildProfile } from '../child/DTO/childprofile';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableValuesDTO } from '../superadmin/DTO/configtablevalues';
import { UserProfile } from '../systemadmin/DTO/userprofile';
import { CarerSchedule6Info } from './DTO/carerschedule6info';

@Component
    ({
    selector: 'carerschedule6list',
    templateUrl: './carerschedule6list.component.template.html',
    })

export class CarerSchedule6ListComponent {
    @ViewChild('btnViewTaggedChildAllegation') btnViewTaggedChildAllegation: ElementRef;
    lstCarerSchedule6 = [];
    CarerParentId: number;
    objSchedule6Info: CarerSchedule6Info = new CarerSchedule6Info();
    returnVal;
    searchText;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    controllerName = "CarerSchedule6";
    objChildProfile: ChildProfile = new ChildProfile();
    objUserProfile: UserProfile = new UserProfile();
    lstCategory = []; categoryId; loading = false; EventDate; showSchedule6HappenedPerson = false;
    lstSchedule6HappenedPerson = []; Schedule6HappenedPersonId; AgencyProfileId; userProfileId;
    @ViewChild('btnViewTaggedChildSchedule6') btnViewTaggedChildSchedule6: ElementRef;
    constructor(private apiService: APICallService, private _router: Router
        ,private renderer: Renderer2
        , private modal: PagesComponent) {

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.userProfileId = parseInt(Common.GetSession("UserProfileId"));
        if ((Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 49]);
        }
        else {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindSchedule6info();
            this.bindTagCarerSchedule6();
        }
    }
    fnAdd() {
        this._router.navigate(['/pages/fostercarer/Schedule6data', 0, 3]);
    }
    editSchedule6info(Schedule6infoId, hasDraft) {
        if (hasDraft)
            Common.SetSession("SaveAsDraft", "Y");
        else
            Common.SetSession("SaveAsDraft", "N");
        this._router.navigate(['/pages/fostercarer/Schedule6data', Schedule6infoId, 3]);
    }
    fnLoadCategory() {
        this.lstSchedule6HappenedPerson = [];
        // console.log(this.categoryId);
        switch (this.categoryId) {
            case "0":
                {
                    this.showSchedule6HappenedPerson = false;
                    this.loading = true;
                    this.objSchedule6Info.EventDate = this.EventDate;
                    this.objSchedule6Info.FieldValue = null;
                    this.apiService.post(this.controllerName, "GetFilterDropDown", this.objSchedule6Info).then(data => {
                        this.lstCarerSchedule6 = data;
                        this.loading = false;
                    });
                    break;
                }
            case "1":
                {
                    this.showSchedule6HappenedPerson = false;
                    this.loading = true;
                    this.objSchedule6Info.EventDate = this.EventDate;
                    this.objSchedule6Info.FieldValue = "739";
                    this.apiService.post(this.controllerName, "GetFilterTextBox", this.objSchedule6Info).then(data => {
                        this.lstCarerSchedule6 = data;
                        this.loading = false;
                    });
                    break;
                }
            case "2":
                {
                    this.showSchedule6HappenedPerson = true;
                    this.loading = true;
                    this.objUserProfile.UserTypeCnfg.UserTypeId = 3;
                    this.objUserProfile.AgencyProfile.AgencyProfileId = this.AgencyProfileId;
                    this.apiService.post("UserProfile", "GetAllByUserTypeId", this.objUserProfile).then(data => {
                        data.forEach(item => {
                            let objCTV = new ConfigTableValuesDTO();
                            objCTV.CofigTableValuesId = item.UserProfileId;
                            objCTV.Value = item.PersonalInfo.FullName;
                            this.lstSchedule6HappenedPerson.push(objCTV);
                            this.loading = false;
                        });
                    });
                    break;
                }
            case "3":
                {
                    this.showSchedule6HappenedPerson = true;
                    this.loading = true;
                    this.objChildProfile.AgencyProfileId = this.AgencyProfileId;
                    this.objChildProfile.ChildStatusId = 19;
                    this.objChildProfile.CreatedUserId = this.userProfileId;
                    this.apiService.post("ChildProfile", "GetAllChildNameWithStatus", this.objChildProfile).then(data => {
                        this.lstSchedule6HappenedPerson = data;
                        this.loading = false;
                    });
                    break;
                }
            case "4":
                {
                    this.showSchedule6HappenedPerson = true;
                    this.loading = true;
                    this.apiService.get("CarerInfo", "ApprovedCarerParentNameAll", this.AgencyProfileId).then(data => {
                        data.forEach(item => {
                            let objCTV = new ConfigTableValuesDTO();
                            objCTV.CofigTableValuesId = item.CarerParentId;
                            objCTV.Value = item.PCFullName + ' (' + item.CarerCode + ')';
                            this.lstSchedule6HappenedPerson.push(objCTV);
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
                    this.showSchedule6HappenedPerson = false;
                    this.loading = true;
                    this.objSchedule6Info.EventDate = this.EventDate;
                    this.objSchedule6Info.FieldValue = "740";
                    this.apiService.post(this.controllerName, "GetFilterTextBox", this.objSchedule6Info).then(data => {
                        this.lstCarerSchedule6 = data;
                        this.loading = false;
                    });
                    break;
                }

        }
    }
    fnLoadFilter() {
        this.loading = true;
        this.objSchedule6Info.EventDate = this.EventDate;
        this.objSchedule6Info.FieldValue = this.Schedule6HappenedPersonId;
        this.apiService.post(this.controllerName, "GetFilterDropDown", this.objSchedule6Info).then(data => {
            this.lstCarerSchedule6 = data;
            this.loading = false;
        });
    }
    lstTemp = [];
    fnLoadSaveDraft() {
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 361;
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
            this.lstCarerSchedule6 = this.lstTemp.concat(lstSaveDraft);

            //this.lstChildDayLogJournal= this.lstChildDayLogJournal.sort(function (a, b) {
            //    return b.SequenceNo - a.SequenceNo;
            //});
        });
    }
    private bindSchedule6info() {
        this.apiService.get(this.controllerName, "GetAllByCarerParentId", this.CarerParentId).then(data => {
            this.lstTemp = data;
            this.fnLoadSaveDraft();
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

    deleteSchedule6info(SequenceNo, UniqueID, hasDraft) {


            this.objSchedule6Info.SequenceNo = SequenceNo;
            this.objSchedule6Info.UniqueID = UniqueID;
            if (!hasDraft)
            {
                this.apiService.delete(this.controllerName, this.objSchedule6Info).then(data => this.Respone(data));
            }else {
                this.objSaveDraftInfoDTO.SequenceNo = SequenceNo;
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
            this.bindSchedule6info();
        }
    }


    private bindTagCarerSchedule6() {
        this.apiService.get("ChildSchedule6", "GetTagSchedule6ByCarerParentId", this.CarerParentId).then(data => {
            this.lstTagCarerAllegationInfo = data;
        });

    }

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
            && x.FieldName != 'EventAgainstPersonNameDropdown'
            && x.FieldName != 'EventAgainstPersonName'
            && x.FieldName != 'AddtoSiblingsRecord'
            && x.FieldName != 'SelectSiblings'
            && x.SequenceNo == SequenceNo);
        if (data.length > 0) {
           // this.hisTaggedCarerAllegation = data;
            let isMissingPlacement=data.filter(x=>x.FieldName=="EventTypeId");
            if(isMissingPlacement.length>0 && isMissingPlacement[0].FieldValue=="Missing Child Placement")
            {
                this.hisTaggedCarerAllegation = data.filter(x=>
                x.FieldName !='PersonCompletingReport'
                && x.FieldName != 'WasPoliceCalledtoHome'
                && x.FieldName != 'DetailsofEvent'
                && x.FieldName != 'BackgroundofCase'
                && x.FieldName != 'OutcomeofCase'
                && x.FieldName != 'InvestigationUndertaken'
                && x.FieldName != 'AgencyActionTaken'
                && x.FieldName != 'HospitalAdmission'
                && x.FieldName != 'Section47Offences'
                && x.FieldName != 'SupportOfferedDuringInvestigation'
                && x.FieldName != 'IndependentSupportOfferedInfo'
                && x.FieldName != 'RegisteredManagerInformed'
                && x.FieldName != 'RegisteredManagerInformedDate'
                && x.FieldName != 'RegisteredManagerRecommendation'
                && x.FieldName != 'TeamManagerRecommendation'
                && x.FieldName != 'PersonCompletingReport')

            }
            else
            {
                this.hisTaggedCarerAllegation = data.filter(x=>
                    x.FieldName !='ChildMissingReason'
                && x.FieldName != 'ChildMissingDate'
                && x.FieldName != 'ChildReturnDate'
                && x.FieldName != 'MissingDetails'
                && x.FieldName != 'OutcomeOfMissing'
                && x.FieldName != 'WasReturnInterviewConducted'
                && x.FieldName != 'ActionTakenByCarer'
                && x.FieldName != 'ActionTakenPreventReoccurrence');
            }

        }

        let carerName = this.lstTagCarerAllegationInfo.filter(x => x.SequenceNo == SequenceNo && x.FieldName == 'CreatedUserId');
        if (carerName.length > 0) {
            this.hisCarerName = carerName[0].FieldValue;
        }

        let event = new MouseEvent('click', { bubbles: true });
        this.btnViewTaggedChildAllegation.nativeElement.dispatchEvent(event);
    }



}
