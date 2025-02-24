import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablenames';
import { ChildPlacementNewDTO } from './DTO/childplacementnewdto';
import { ChildProfile } from './DTO/childprofile';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'ChildDischarge',
    templateUrl: './childdischarge.component.template.html',
    styles: [`.ng-invalid:not(form)  {
      border-left: 5px solid #a94442; /* red */}`]
})
export class ChildDischargeComponet {
    isLoading: boolean = false;
    submitted = false;
    objChildProfile: ChildProfile = new ChildProfile();
    objChildProfileTransfer: ChildProfile = new ChildProfile();
    objCarerInfo;
    objSecondCarerInfo;
    ChildProfileProfileId;
    lstChildProfile;lstChildProfileDropDown=[];
    lstCarerInfo; lstApprovedCarerInfo;
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objQeryVal;
    placementId;
    objChildPlacementDTO: ChildPlacementNewDTO = new ChildPlacementNewDTO();
    arrChildPlacementDTO = [];
    dynamicformcontrol = [];
    public childDischargeForm: FormGroup;
    showSiblingeTableDischarge = false;
    showParentTableDischarge = false;
    lstSibling = []; lstSiblingCategory = []; lstSiblingDischarge = [];
    lstParents = []; lstParentCategory = []; lstParentsDischarge = [];
    lstChildSNPMapping;
    @ViewChild('dynamic') dynamicCtrl;
    siblingCheck = false; parentCheck = false;
    AgencyProfileId: number;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=78;
    constructor(private apiService:APICallService, private route: ActivatedRoute,
        private _formBuilder: FormBuilder,  private _router: Router,
        private model: PagesComponent) {
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.placementId = this.objQeryVal.Id;
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildPlacementDTO.AgencyProfileId = this.AgencyProfileId;
        apiService.post("ChildPlacement", "GetDynamicControlsForDischarge", this.objChildPlacementDTO).then(data => { this.dynamicformcontrol = data; });
        this.fnLoadDropDowns();

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.objPlacementInfo.ChildId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    private Respone(data) {
        this.isLoading = false;
        this.arrChildPlacementDTO = [];
        if (data.IsError == true) {
            this.model.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.objUserAuditDetailDTO.ActionId =1;
            this.objUserAuditDetailDTO.RecordNo = this.objPlacementInfo.ChildId;
            this.model.alertSuccess(Common.GetChildDischargedMsg);
        }

        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.objPlacementInfo.ChildId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        this._router.navigate(['/pages/referral/redirectlink/3']);
    }
    fnLoadDropDowns() {
        this.objChildProfile.AgencyProfileId = this.AgencyProfileId;
        this.objChildProfile.ChildStatusId = 19;
        this.apiService.post("ChildProfile", "GetAllForTransferRespiteDischarge", this.objChildProfile).then(data => {
            this.lstChildProfile = data;
            data.forEach(item => {
                if (item.ChildOrParentId!=3) {
                    this.lstChildProfileDropDown.push(item);
                }
            });
        });
        this.apiService.get("CarerInfo", "ApprovedCarerParentAll", this.objChildProfile.AgencyProfileId).then(data =>{ this.lstApprovedCarerInfo = data});
        this.apiService.get("ChildProfile", "GetAllChildSiblingNParentMapping", this.objChildProfile.AgencyProfileId).then(data => {this.lstChildSNPMapping = data});

        //this.objConfigTableNamesDTO.AgencyProfileId = 1;
        //this.objConfigTableNamesDTO.Name = ConfigTableNames.PlacementType;
        //this._cnfgTblValueServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.lstPlacementType = data; });
        this.childDischargeForm = this._formBuilder.group({
            ChildProfile: ['0', Validators.required],
            DischargeDate: ['', Validators.required],
        });
        this.objChildProfile = null;
        this.objCarerInfo = null;
        this.objChildProfileTransfer = null;
        this.objSecondCarerInfo = null;
    }
    objPlacementInfo;
    fnLoadChildDetails(value) {
        this.showSiblingeTableDischarge = false;
        this.showParentTableDischarge = false;
        this.lstSibling = [];
        this.lstParents = [];
        this.lstSiblingDischarge = [];
        this.lstParentsDischarge = [];
        this.objChildProfile = null;
        this.objCarerInfo = null;
        this.lstCarerInfo = [];
        this.objPlacementInfo = null;
        this.fnLoadSiblingNParentTrans(true, value);
        this.fnLoadSiblingNParentTrans(false, value);

        let arrChildId = [];
        if (value != "") {
            //Load Selected Child details
            this.lstChildProfile.forEach(item => {
                if (item.ChildId == value) {
                    this.objChildProfile = item;
                    this.fnShowImage(this.objChildProfile.PersonalInfo.ImageId, "Child");
                }
            });
            for (let item of this.lstApprovedCarerInfo) {
                let check = true;
                let childPlacement = item.CarerInfo.ChildPlacement;

                if (childPlacement != null) {
                    childPlacement.forEach(subItem => {
                        if (subItem.ChildId == value) {
                            check = false;
                        }
                    });
                }
                if (check) {
                    this.lstCarerInfo.push(item);
                }
                else {
                    for (let citem of item.CarerInfo.ChildPlacement) {
                        if (item.CarerInfo.CarerTypeid == 1) {
                            if (citem.ChildId == value) {
                                this.objPlacementInfo = citem;
                                this.objCarerInfo = item;
                                this.fnShowImage(this.objCarerInfo.CarerInfo.PersonalInfo.ImageId, "Carer");
                                break;
                            }
                        }
                    }
                    for (let citem of item.CarerInfo.ChildPlacement) {
                        if (citem.ChildId != value) {
                            arrChildId.push(citem.ChildId + '-' + citem.ChildPlacementId);
                        }
                    }

                }
            }
            //console.log(arrChildId);
            //Select sibling only for the current selected child placement
            //delete duplicate item from array
            if (arrChildId.length == 0) {
                this.showSiblingeTableDischarge = false;
                this.showParentTableDischarge = false;
                this.siblingCheck = false;
                this.parentCheck = false;
            }
            var tmp = [];
            for (var i = 0; i < arrChildId.length; i++) {
                if (tmp.indexOf(arrChildId[i]) == -1) {
                    tmp.push(arrChildId[i]);
                }
            }

            for (let childId of tmp) {
                for (let item of this.lstSibling) {
                    let childNPlacementId = childId.split('-');
                    if (childNPlacementId[0] == item.ChildId) {
                        item.ChildPlacementId = childNPlacementId[1];
                        this.lstSiblingDischarge.push(item);
                        break;
                    }
                }
            }
            // for (let childId of tmp) {
            //    for (let item of this.lstParents) {
            //        let childNPlacementId = childId.split('-');
            //        if (childNPlacementId[0] == item.ChildId) {
            //            item.ChildPlacementId = childNPlacementId[1];
            //            this.lstParentsDischarge.push(item);
            //            break;
            //        }
            //    }
            // }
            //console.log(this.lstSiblingTrans);
        }

    }
    fnLoadSiblingNParentTrans(IsSibling: boolean, value) {
        //Load Siblings
        let arrSiblingLink = this.lstChildSNPMapping.filter(item => item.SiblingOrParentId == value && item.IsSibling == IsSibling);

        let arrSibling = [];
        if (arrSiblingLink.length > 0) {
            arrSiblingLink.forEach(itemParent => {
                this.lstChildSNPMapping.forEach(item => {
                    if (item.LinkId == itemParent.LinkId) {
                        arrSibling.push(item);
                    }
                });

            });
            for (let itemPar of arrSibling) {
                this.lstChildProfile.forEach(item => {
                    if (item.ChildId == itemPar.SiblingOrParentId && itemPar.SiblingOrParentId != value) {
                        if (IsSibling && item.ChildOrParentId == 1) {
                            item.HasChildSiblings = true;
                            this.lstSibling.push(item);
                        }
                        else //if (!IsSibling && item.ChildOrParentId == 2)
                        {
                           item.HasChildParents = true;
                           //this.lstParents.push(item);
                           item.IsActive=true;
                           this.lstParentsDischarge.push(item);
                           this.parentCheck = true;
                           this.showParentTableDischarge = true;
                        }
                    }
                }
                );
            }
        }

    }
    fnDischarge(dynamicForm, AddtionalEmailIds, EmailIds) {

        this.submitted = true;
        if (this.childDischargeForm.valid && dynamicForm.valid) {
            this.isLoading = true;
            this.objChildPlacementDTO.DischargeDate = this.model.GetDateTimeSaveFormat(this.objChildPlacementDTO.DischargeDate);

            this.arrChildPlacementDTO = [];
            this.objChildPlacementDTO.NotificationEmailIds = EmailIds;
            this.objChildPlacementDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.objChildPlacementDTO.AgencyProfileId = this.AgencyProfileId;
            this.objChildPlacementDTO.ChildPlacementId = this.objPlacementInfo.ChildPlacementId;
            this.objChildPlacementDTO.ChildId = this.objPlacementInfo.ChildId;
            this.objChildPlacementDTO.PlacementDate = this.objPlacementInfo.PlacementDate;
            this.objChildPlacementDTO.VacancyId = this.objPlacementInfo.VacancyId;
            this.objChildPlacementDTO.DynamicValue = this.dynamicCtrl.dynamicformcontrols;
            this.arrChildPlacementDTO.push(this.objChildPlacementDTO);
            if (this.lstSiblingDischarge.length > 0) {
                for (let item of this.lstSiblingDischarge) {
                    if (item.IsActive == true) {
                        let objChildPlacement = new ChildPlacementNewDTO();
                        objChildPlacement.AgencyProfileId = this.AgencyProfileId;
                        objChildPlacement.PlacementDate = this.objPlacementInfo.PlacementDate;
                        objChildPlacement.PlacementEndDate = this.objChildPlacementDTO.PlacementEndDate;
                        objChildPlacement.ChildPlacementId = item.ChildPlacementId;
                        objChildPlacement.ChildId = item.ChildId;
                        objChildPlacement.DynamicValue = this.dynamicCtrl.dynamicformcontrols;
                        objChildPlacement.DischargeDate = this.objChildPlacementDTO.DischargeDate;
                        objChildPlacement.VacancyId = this.objPlacementInfo.VacancyId;
                        this.arrChildPlacementDTO.push(objChildPlacement);
                    }
                }
            }
            if (this.lstParentsDischarge.length > 0) {
                for (let item of this.lstParentsDischarge) {
                    if (item.IsActive == true) {
                        let objChildPlacement = new ChildPlacementNewDTO();
                        objChildPlacement.AgencyProfileId = this.AgencyProfileId;
                        objChildPlacement.PlacementDate = this.objPlacementInfo.PlacementDate;
                        objChildPlacement.PlacementEndDate = this.objChildPlacementDTO.PlacementEndDate;
                        objChildPlacement.ChildPlacementId = item.ChildPlacementId;
                        objChildPlacement.ChildId = item.ChildId;
                        objChildPlacement.DynamicValue = this.dynamicCtrl.dynamicformcontrols;
                        objChildPlacement.DischargeDate = this.objChildPlacementDTO.DischargeDate;
                        objChildPlacement.VacancyId = this.objPlacementInfo.VacancyId;
                        this.arrChildPlacementDTO.push(objChildPlacement);
                    }
                }
            }

           // console.log(this.arrChildPlacementDTO);
            this.apiService.post("ChildPlacement", "ChildDischarge", this.arrChildPlacementDTO).then(data => this.Respone(data));

        }

    }
    fnShowSiblingDischarge(value) {
        if (value) {
            this.showSiblingeTableDischarge = true;
            this.showParentTableDischarge = false;
            this.siblingCheck = true;
            this.parentCheck = false;
        }
        else {
            this.showSiblingeTableDischarge = false;
            this.showParentTableDischarge = false;
            this.siblingCheck = false;
        }
    }
    fnShowParentsDischarge(value) {
        if (value) {
            this.showSiblingeTableDischarge = false;
            this.showParentTableDischarge = true;
            this.siblingCheck = false;
            this.parentCheck = true;
        }
        else {
            this.showSiblingeTableDischarge = false;
            this.showParentTableDischarge = false;
            this.parentCheck = false;
        }
    }
    srcChildPath = "assets/img/app/Photonotavail.png"; srcCarerPath = "assets/img/app/Photonotavail.png";
    fnShowImage(ImageId, type) {
        if (ImageId != null) {
            this.apiService.get("UploadDocuments","GetImageById",ImageId).then(data => {
                if (data != null) {
                    switch (type) {
                        case "Child":
                            {
                                this.srcChildPath = "data:image/jpeg;base64," + data;
                                break;
                            }
                        case "Carer":
                            {
                                this.srcCarerPath = "data:image/jpeg;base64," + data;
                                break;
                            }

                    }
                }
            });
        }

    }
}
