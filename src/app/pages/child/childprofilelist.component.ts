import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChildProfile } from './DTO/childprofile'
import { Common} from '../common'
import { FormBuilder, FormGroup } from '@angular/forms';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
@Component({
    selector: 'childprofilelist',

    templateUrl: './childprofilelist.component.template.html',
})

export class ChildProfileListComponet {
    public searchText: string = "";
    lstChildProfile;
    insChildProfileDTO: ChildProfile = new ChildProfile();
    ChildId;
    limitPerPage:number=10;
    IsShow = false;
    objQeryVal;
    @ViewChild('header') headerCtrl;
    lstChildStatus;
    lstLocalAuthority;
    lstSSW;
    lstAreaOffice;
    lstAllChild;
    ChildStatusId = 0;
    //Snapshot Popup
    insSnpChildId;
    @ViewChild('btnSnapshot') infobtnSnapShot: ElementRef;
    controllerName = "ChildProfile";
    AgencyProfileId: number; FormCnfgId;
    insBehaviourNameWithColor = [];
    lstBehaviourType = ['Addictive Tendancies', 'Offending Tendancies', 'Mental Health Issues', 'Placement Issues'];
    loading = false; _Form: FormGroup;
    insUserTypeId = 0;
    insUserProfileId = 0;
    arrayStatus = []; selectedStatus;
    footerMessage={
      'emptyMessage': '',
      'totalMessage': ' - Children'
    };
    constructor(private apiService: APICallService, _formBuilder: FormBuilder, private route: ActivatedRoute,
        private _router: Router, private modal: PagesComponent, private renderer: Renderer2) {

        this.route.params.subscribe(data => this.objQeryVal = data);
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.insChildProfileDTO.AgencyProfileId = this.AgencyProfileId;
        this.fnLoadChildList();
        this.apiService.get("LocalAuthority", "getall", this.AgencyProfileId).then(data => { this.lstLocalAuthority = data });
        this.apiService.get("AreaOfficeProfile", "getall").then(data => { this.lstAreaOffice = data });
        this.apiService.get(this.controllerName, "GetBehaviourNameWithColor").then(data => { this.insBehaviourNameWithColor = data; });

        this.insUserTypeId = parseInt(Common.GetSession("UserTypeId"));
        this.insUserProfileId = parseInt(Common.GetSession("UserProfileId"));
        if (this.insUserTypeId != 4 )
            this.apiService.get("CarerSocialWorkerMapping", "GetAll").then(data => { this.lstSSW = data });
        else
            this.apiService.get("CarerSocialWorkerMapping", "GetAllByCarerUserProfileId", this.insUserProfileId).then(data => { this.lstSSW = data });

        this._Form = _formBuilder.group({
            LocalAuthorityId: ['0'],
            AreaOfficeProfileId: ['0'],
            ChildStatusId: ['0'],
            SSWId: ['0'],
            searchText: [],
        });
    }

    fnLoadChildList() {
        //this.insChildProfileDTO.CreatedUserId = parseInt(Common.GetSession("UserProfileId"));
        //this.insChildProfileDTO.ChildStatusId = this.ChildStatusId;
        //this.apiService.post(this.controllerName, "GetAll", this.insChildProfileDTO).then(data => {
        //    //this.lstAllChild = data;
        //    this.lstChildProfile = data;
        if (parseInt(this.objQeryVal.Id) == 0 && parseInt(this.objQeryVal.mid) == 16) {
            this.FormCnfgId = 70;
            this.ChildId = Common.GetSession("ReferralChildId");
            this.apiService.get("ModuleStausCnfg", "GetChildStatusByModuleId", 16).then(data => {
                this.ResponseBindStatus(data);
            });
        }
        else {
            this.FormCnfgId = 80;
            this.ChildId = Common.GetSession("ChildId");
            this.apiService.get("ModuleStausCnfg", "GetChildStatusByModuleId", 4).then(data => { this.ResponseBindStatus(data); });

        }
        //this.fnLoadChild();
        //  console.log("!!!!!!!!!");
        // console.log(this.lstAllChild);
        //});
    }

    fnSnapShot(childId) {
        if (this.insUserTypeId != 4)
        {
            this.insSnpChildId = childId;
            let event = new MouseEvent('click', { bubbles: true });
            this.infobtnSnapShot.nativeElement.dispatchEvent(event);
        }
    }

    AreaOfficeProfileId = 0; LocalAuthorityId = 0; SSWId = 0;
    fnSelectChild(ChildId) {
        if (parseInt(this.objQeryVal.Id) == 0) {
            Common.SetSession("ReferralChildId", ChildId);
            Common.SetSession("ChildId", null);
        }
        else {
            Common.SetSession("ChildId", ChildId);
            Common.SetSession("ReferralChildId", null);
        }

        this.fnSelectRow(ChildId);
        if (Common.GetSession("UrlReferral") != null) {
            let url = Common.GetSession("UrlReferral");
            Common.SetSession("UrlReferral", null);
            if (url != null && url != "null")
                this._router.navigate([url]);
        }
    }

    fnSelectRow(ChildId) {
        if (this.lstChildProfile != null) {
            for (let insCP of this.lstChildProfile) {
                if (insCP.ChildId == ChildId) {
                    this.IsShow = true;
                    insCP.IsSelected = true;

                    this.apiService.get(this.controllerName, "GetSelectedChildDetails", ChildId).then(data => {
                        let selectedChildDetails = data;

                        this.insChildProfileDTO.ChildCode = insCP.ChildCode;
                        this.insChildProfileDTO.PersonalInfo = insCP.PersonalInfo;
                        this.fnAgeCalculation(insCP.PersonalInfo.DateOfBirth);
                        this.insChildProfileDTO.RecommendedCarers = selectedChildDetails.RecommendedCarers;
                        this.insChildProfileDTO.SupervisingSocialWorker = selectedChildDetails.SupervisingSocialWorker;
                        this.insChildProfileDTO.LocalAuthority = insCP.LocalAuthority;
                        this.insChildProfileDTO.AreaOfficeProfile = insCP.AreaOfficeProfile;
                        this.insChildProfileDTO.ChildIdentifier = insCP.ChildIdentifier;
                        this.insChildProfileDTO.ChildOrParentId = insCP.ChildOrParentId;
                        this.insChildProfileDTO.Type = selectedChildDetails.Type;
                        this.insChildProfileDTO.CarerName = selectedChildDetails.CarerName;
                        this.insChildProfileDTO.LastPlacedCarerName = selectedChildDetails.LastPlacedCarerName;
                        this.insChildProfileDTO.NewChildStatusId = selectedChildDetails.ChildStatusId;
                        this.insChildProfileDTO.LASocialWorker = selectedChildDetails.LASocialWorker;
                        this.insChildProfileDTO.KnownAllergies = selectedChildDetails.KnownAllergies;
                        this.headerCtrl.fnShowImage(insCP.PersonalInfo.ImageId);
                        Common.SetSession("CarerId", selectedChildDetails.CarerParentId);
                        Common.SetSession("ChildAge", JSON.stringify(this.insChildProfileDTO.PersonalInfo.Age));
                        Common.SetSession("CarerName", selectedChildDetails.CarerName);
                        Common.SetSession("SSWId", selectedChildDetails.SupervisingSocialWorkerId);
                        Common.SetSession("SSWName", selectedChildDetails.SupervisingSocialWorker);
                        Common.SetSession("SelectedChildProfile", JSON.stringify(this.insChildProfileDTO));
                        Common.SetSession("ChildStatusId", insCP.ChildStatusId);
                        Common.SetSession("ChildOrParentId", insCP.ChildOrParentId);
                        Common.SetSession("HasChildSiblings", selectedChildDetails.HasChildSiblings);
                        //New
                        Common.SetSession("ChildLocalAuthorityId", insCP.LocalAuthority.LocalAuthorityId);
                        Common.SetSession("ChildLocalAuthorityName", insCP.LocalAuthority.LocalAuthorityName);
                        Common.SetSession("ChildLASocialWorkerId", selectedChildDetails.LASocialWorkerId);
                        Common.SetSession("ChildLASocialWorkerName", selectedChildDetails.LASocialWorker);

                    });
                }
                else
                    insCP.IsSelected = false;
            }
        }
    }

    getRowClass =(row)=>{
        return {
          'rowSelected':row.IsSelected
        }
      }

    private fnAgeCalculation(dob) {


        if (dob != null && dob != '') {
            let date = new Date();
            let d = date.getDate();
            let m = date.getMonth();
            let y = date.getFullYear();

            let dateDob = new Date(dob);
            let dDob = dateDob.getDate();
            let mDob = dateDob.getMonth();
            let yDob = dateDob.getFullYear();

            let age = y - yDob;

            let todayDate = new Date(y, m, d);
            let dobDate = new Date(y, mDob, dDob);

            todayDate.setDate(todayDate.getDate() + 1);

            if (dobDate >= todayDate) {
                age--;
            }

            if (age != null)
                this.insChildProfileDTO.PersonalInfo.Age = age;
            else
                this.insChildProfileDTO.PersonalInfo.Age = null;
        }

    }

    fnAddData() {
        this._router.navigate(['/pages/referral/childprofile/0']);
    }

    fnDelete(Id) {
        // if (confirm("Are you sure you want to delete this?")) {
        this.apiService.delete(this.controllerName, Id).then(data => {
            if (data.IsError == true) {
                this.modal.alertDanger(data.ErrorMessage);
            }
            else if (data.IsError == false) {
                this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
                //this.fnLoadChildList();
                this.fnLoadChild();
            }
        });
        // }
    }

    showStatus = false; showPlacementDate = false; showDischargeDate = false; showReferralDate = true;
    showDischargePlacementDate = false; showDeleteButton = true;
    fnLoadChild() {
        this.lstChildProfile = null;
        this.loading = true;
        this.insChildProfileDTO.CreatedUserId = parseInt(Common.GetSession("UserProfileId"));
        this.insChildProfileDTO.ChildStatusId = this.ChildStatusId;
        this.insChildProfileDTO.AreaOfficeProfile.AreaOfficeProfileId = this.AreaOfficeProfileId;
        this.insChildProfileDTO.LocalAuthority.LocalAuthorityId = this.LocalAuthorityId;
        this.insChildProfileDTO.SupervisingSocialWorkerId = this.SSWId;
        this.apiService.post(this.controllerName, "GetAll", this.insChildProfileDTO).then(data => {
            this.lstChildProfile = data;
            this.loading = false;
            this.fnShowGridColumn();
        });
        //this.lstChildProfile = this.lstAllChild.filter(item => (this.ChildStatusId == 0 || item.ChildStatusId == this.ChildStatusId)
        //    && (this.AreaOfficeProfileId == 0 || item.AreaOfficeProfile.AreaOfficeProfileId == this.AreaOfficeProfileId)
        //    && (this.LocalAuthorityId == 0 || item.LocalAuthority.LocalAuthorityId == this.LocalAuthorityId));
    }
    fnShowGridColumn() {
        //Show status if all status selected
        if (this.selectedStatus.length > 1)
            this.showStatus = true;
        else
            this.showStatus = false;
        //Show placement date
        if (this.selectedStatus.length ==1 && this.selectedStatus[0] == 19) {
            this.showPlacementDate = true;
        }
        else {
            this.showPlacementDate = false;
        }
        //Show discharge date
        if (this.selectedStatus.length ==1 && this.selectedStatus[0] == 20) {
            this.showReferralDate = false;
            this.showDischargePlacementDate = true;
            this.showDischargeDate = true;
        }
        else {
            this.showReferralDate = true;
            this.showDischargePlacementDate = false;
            this.showDischargeDate = false;
        }
        if (this.ChildId != null)
            this.fnSelectRow(this.ChildId);
    }
    ResponseBindStatus(data) {
        // console.log(data);
        if (data.length > 0) {
            this.lstChildStatus = data;
            data.forEach(item => {
                this.arrayStatus.push({ id: item.ModuleStatusCnfgId, name: item.StatusName });
            }
            );
            //set default
            let defaultval = data.filter(x => x.IsDefault != 0);
            if (defaultval.length > 0) {
                this.ChildStatusId = defaultval[0].IsDefault;
                let temp:any=[];
                temp.push(defaultval[0].IsDefault)
                this.selectedStatus=temp;
                this.insChildProfileDTO.CreatedUserId = parseInt(Common.GetSession("UserProfileId"));
                this.insChildProfileDTO.ChildStatusId = this.ChildStatusId;
                this.insChildProfileDTO.ChildStatusIds=this.selectedStatus;
                this.loading = true;
                this.apiService.post(this.controllerName, "GetAll", this.insChildProfileDTO).then(data => {
                    this.lstChildProfile = data;
                    this.loading = false;
                    this.fnShowGridColumn();
                });
            }
            if (defaultval.length == 0) {
                this.insChildProfileDTO.CreatedUserId = parseInt(Common.GetSession("UserProfileId"));
                this.insChildProfileDTO.ChildStatusId = 0;
                this.insChildProfileDTO.ChildStatusIds=this.selectedStatus.push('0');
                this.loading = true;
                this.apiService.post(this.controllerName, "GetAll", this.insChildProfileDTO).then(data => {
                    this.lstChildProfile = data;
                    this.loading = false;
                    this.fnShowGridColumn();
                });
                this.showStatus = true;
            }
        }
        else {
            this.modal.alertDanger("Please contact administrator to assign the child staus for your role");
        }
    };
    setPageSize(pageSize:string)
    {
      this.limitPerPage = parseInt(pageSize);
    }
    fnStatusChange(event:any)
    {
        this.selectedStatus=event.value;
        this.insChildProfileDTO.ChildStatusIds=event.value;
        this.fnLoadChild();
    }

    fnStatusAllChange(event:any)
    {
        this.selectedStatus=event.value;
        this.insChildProfileDTO.ChildStatusIds=event.value;
        this.fnLoadChild();
    }

    fnUnSelectAllChange(event:any)
    {
        this.selectedStatus=event.value;
        this.insChildProfileDTO.ChildStatusIds=event.value;
        this.fnLoadChild();
    }
}
