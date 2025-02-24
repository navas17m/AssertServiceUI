import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { ConfigTableNames } from '../configtablenames';
import { ValChangeDTO } from '../dynamic/ValChangeDTO';
import { PagesComponent } from '../pages.component';
import { PersonalInfoVisible } from '../personalinfo/personalinfo';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablenames';
import { UserProfile } from '../systemadmin/DTO/userprofile';
import { ChildPlacementNewDTO } from './DTO/childplacementnewdto';
import { ChildProfile } from './DTO/childprofile';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'ChildRespite',
    templateUrl: './childrespite.component.template.html',
    styleUrls: ['../form-elements/wizard/wizard.component.scss'],
    styles: [`.ng-invalid:not(form)  {
      border-left: 5px solid #a94442; /* red */}`]
})
export class ChildRespiteComponet {
    isLoading: boolean = false;
    isLoadingDischarge: boolean = false;

    submittedCNC = false;
    submittedCPM = false;
    submittedTrnsCNC = false;

    siblingCheck = false; parentCheck = false;
    objChildProfile: ChildProfile = new ChildProfile();
    objChildProfileTransfer: ChildProfile = new ChildProfile();
    objChildProfileInput: ChildProfile = new ChildProfile();
    objCarerInfo;
    objSecondCarerInfo;
    ChildProfileProfileId;
    lstChildProfile;
    lstCarerInfo; lstApprovedCarerInfo;
    lstCarerInfoTransfer = [];
    lstLocalAuthority;
    lstPlacementType;
    lstPlacementCategory;
    lstAgencySocialWorker;
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objUserProfileDTO: UserProfile = new UserProfile();
    objQeryVal;
    placementId;
    arrayChildList = [];
    objPersonalInfoVisible: PersonalInfoVisible = new PersonalInfoVisible();
    objChildPlacementDTO: ChildPlacementNewDTO = new ChildPlacementNewDTO();
    arrChildPlacementDTO = [];
    dynamicformcontrol = [];
    dynamicformcontrolRespiteEnd = [];
    lstSibling = []; lstSiblingCategory = []; lstSiblingRespiteStart = []; lstSiblingRespiteEnd = [];
    lstParents = []; lstParentCategory = []; lstParentsRespiteStart = []; lstParentsRespiteEnd = [];
    lstChildSNPMapping;lstChildProfileDropDown=[];
    showSiblingeTable = false; showSiblingeTableRespiteEnd = false;
    showParentTable = false; showParentTableRespiteEnd = false;
    public steps: any[];
    public childNCarerForm: FormGroup;
    public childPlacementForm: FormGroup;
    public notificationForm: FormGroup;
    public childTransferForm: FormGroup;
    public CarerForm: FormGroup;
    public BackupCarerForm: FormGroup;
    @ViewChild('dynamic') dynamicCtrl;
    //@ViewChild('respite') respiteCtrl;
    carerHeader = "Carer";
    lstBackupCarer; vacancyId; lstBackupCarerEnd;
    lstChildProfileTransfer;lstChildProfileTransferDropDown=[];
    srcChildPath = "assets/img/app/Photonotavail.png"; srcFirstCarerPath = "assets/img/app/Photonotavail.png";
    srcSecondCarerPath = "assets/img/app/Photonotavail.png"; srcTrnChildPath = "assets/img/app/Photonotavail.png";
    srcTrnFirstCarerPath = "assets/img/app/Photonotavail.png"; srcTrnSecondCarerPath = "assets/img/app/Photonotavail.png";
    srcPlacedCarerPath = "assets/img/app/Photonotavail.png"; srcBackupCarerPath = "assets/img/app/Photonotavail.png";
    AgencyProfileId: number; controllerName = "ChildPlacement";
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=79;
    constructor(private apiService: APICallService,  private route: ActivatedRoute,
        private _formBuilder: FormBuilder, private _router: Router,private modal: PagesComponent) {
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.placementId = this.objQeryVal.Id;
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildPlacementDTO.AgencyProfileId = this.AgencyProfileId;
        apiService.post(this.controllerName, "GetDynamicControls", this.objChildPlacementDTO).then(data => { this.dynamicformcontrol = data; });
        apiService.post(this.controllerName,"GetDynamicControlsForDischarge",this.objChildPlacementDTO).then(data => { this.dynamicformcontrolRespiteEnd = data; });
        this.fnLoadDropDowns();

        this.steps = [
            { name: 'Child & Carer Information', icon: 'fa-child', active: true, valid: false, hasError: false },
            { name: 'Respite Information', icon: 'fa-user', active: false, valid: false, hasError: false },
            //{ name: 'Notification', icon: 'fa-flag', active: false, valid: false, hasError: false },
            { name: 'Notification & Place Child', icon: 'fa-flag', active: false, valid: false, hasError: false }
        ]

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.objPlacementInfo.ChildId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    //btn Submit
    btnSave(AddtionalEmailIds, EmailIds): void {
        this.isLoading = true;
        this.objChildPlacementDTO.NotificationEmailIds = EmailIds;
        this.objChildPlacementDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;

        this.objChildPlacementDTO.PlacementDate = this.modal.GetDateTimeSaveFormat(this.objChildPlacementDTO.PlacementDate);
        this.objChildPlacementDTO.AgencyProfileId = this.AgencyProfileId;

        this.objChildPlacementDTO.ChildPlacementId = this.objPlacementInfo.ChildPlacementId;
        this.objChildPlacementDTO.ChildId = this.objChildProfile.ChildId;
        if (this.showBackupCarer) {
            this.objChildPlacementDTO.CarerParentId = this.objBackupCarerInfo.CarerParentId;
            this.objChildPlacementDTO.ChildRespiteDetail.IsBackupCarer = true;
            this.objChildPlacementDTO.ChildRespiteDetail.BackupCarerId = this.objBackupCarerInfo.CarerInfo.CarerId;
        }
        else {
            this.objChildPlacementDTO.CarerParentId = this.objCarerInfo.CarerParentId;
            this.objChildPlacementDTO.ChildRespiteDetail.IsBackupCarer = false;
        }

        //this.objChildPlacementDTO.PlacementCategoryId = this.objPlacementInfo.PlacementCategoryId;
        this.objChildPlacementDTO.OldPlacementId = this.objPlacementInfo.ChildPlacementId;
        this.objChildPlacementDTO.PlacementStartTypeId = 2;
        this.objChildPlacementDTO.DynamicValue = this.dynamicCtrl.dynamicformcontrols;
        this.objChildPlacementDTO.PlacementTypeId = this.objPlacementInfo.PlacementTypeId;
        this.objChildPlacementDTO.VacancyId = this.objPlacementInfo.VacancyId;
        this.objChildPlacementDTO.ChildRespiteDetail.IsPlanned = true;
        this.objChildPlacementDTO.ChildRespiteDetail.IsPaid = this.showRate;

        this.objChildPlacementDTO.PlacementEndDate = this.modal.GetDateSaveFormat(this.objChildPlacementDTO.PlacementEndDate);

        this.arrChildPlacementDTO.push(this.objChildPlacementDTO);
        if (this.lstSiblingCategory.length > 0) {
            for (let item of this.lstSiblingCategory) {
                let objChildPlacement = new ChildPlacementNewDTO();
                objChildPlacement.AgencyProfileId = this.AgencyProfileId;
                objChildPlacement.AgencySocialWorkerId = this.objChildPlacementDTO.AgencySocialWorkerId;
                objChildPlacement.LocalAuthorityId = this.objChildPlacementDTO.LocalAuthorityId;
                objChildPlacement.PlacementDate = this.objChildPlacementDTO.PlacementDate;
                objChildPlacement.OldPlacementId = this.objPlacementInfo.ChildPlacementId;
                objChildPlacement.PlacementEndDate = this.objChildPlacementDTO.PlacementEndDate;
                objChildPlacement.PlacementTypeId = this.objChildPlacementDTO.PlacementTypeId;
                objChildPlacement.ChildId = item.ChildId;
                objChildPlacement.PlacementCategoryId = this.objPlacementInfo.PlacementCategoryId;
                if (this.showBackupCarer) {
                    objChildPlacement.CarerParentId = this.objBackupCarerInfo.CarerParentId;
                    objChildPlacement.ChildRespiteDetail.IsBackupCarer = true;
                    objChildPlacement.ChildRespiteDetail.BackupCarerId = this.objBackupCarerInfo.CarerInfo.CarerId;
                }
                else {
                    objChildPlacement.ChildRespiteDetail.IsBackupCarer = false;
                    objChildPlacement.CarerParentId = this.objCarerInfo.CarerParentId;
                }
                objChildPlacement.PlacementStartTypeId = 2;
                objChildPlacement.VacancyId = this.objPlacementInfo.VacancyId;
                objChildPlacement.ChildRespiteDetail.IsPlanned = true;
                objChildPlacement.ChildRespiteDetail.IsPaid = this.showRate;
                objChildPlacement.DynamicValue = this.dynamicCtrl.dynamicformcontrols;
                this.arrChildPlacementDTO.push(objChildPlacement);
            }
        }
        if (this.lstParentCategory.length > 0) {
            for (let item of this.lstParentCategory) {
                let objChildPlacement = new ChildPlacementNewDTO();
                objChildPlacement.AgencyProfileId = this.AgencyProfileId;
                objChildPlacement.AgencySocialWorkerId = this.objChildPlacementDTO.AgencySocialWorkerId;
                objChildPlacement.LocalAuthorityId = this.objChildPlacementDTO.LocalAuthorityId;
                objChildPlacement.PlacementDate = this.objChildPlacementDTO.PlacementDate;
                objChildPlacement.PlacementEndDate = this.objChildPlacementDTO.PlacementEndDate;
                objChildPlacement.OldPlacementId = this.objChildPlacementDTO.PlacementTypeId;
                objChildPlacement.PlacementTypeId = this.objChildPlacementDTO.PlacementTypeId
                objChildPlacement.ChildId = item.ChildId;
                objChildPlacement.PlacementCategoryId = this.objPlacementInfo.PlacementCategoryId;
                if (this.showBackupCarer) {
                    objChildPlacement.CarerParentId = this.objBackupCarerInfo.CarerParentId;
                    objChildPlacement.ChildRespiteDetail.IsBackupCarer = true;
                    objChildPlacement.ChildRespiteDetail.BackupCarerId = this.objBackupCarerInfo.CarerInfo.CarerId;
                }
                else {
                    objChildPlacement.ChildRespiteDetail.IsBackupCarer = false;
                    objChildPlacement.CarerParentId = this.objCarerInfo.CarerParentId;
                }
                objChildPlacement.PlacementStartTypeId = 2;
                objChildPlacement.VacancyId = this.objPlacementInfo.VacancyId;
                objChildPlacement.ChildRespiteDetail.IsPlanned = true;
                objChildPlacement.ChildRespiteDetail.IsPaid = this.showRate;
                objChildPlacement.DynamicValue = this.dynamicCtrl.dynamicformcontrols;
                this.arrChildPlacementDTO.push(objChildPlacement);
            }
        }
       // console.log(this.arrChildPlacementDTO);
        this.apiService.post(this.controllerName, "ChildRespiteStart", this.arrChildPlacementDTO).then(data => this.Respone(data));

    }
    private Respone(data) {
        this.objChildPlacementDTO.PlacementEndDate = this.modal.GetDateEditFormat(this.objChildPlacementDTO.PlacementEndDate);
        this.isLoading = false;
        this.arrChildPlacementDTO = [];
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.objUserAuditDetailDTO.ActionId =1;
            this.objUserAuditDetailDTO.RecordNo = this.objPlacementInfo.ChildId;
            this.modal.alertSuccess(Common.GetChildPlacedMsg);
        }

        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.objPlacementInfo.ChildId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        this._router.navigate(['/pages/referral/redirectlink/2']);
    }
    private ResponeTransfer(data) {
        this.isLoadingDischarge = false;
        this.arrChildPlacementDTO = [];
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.objUserAuditDetailDTO.ActionId =1;
            this.objUserAuditDetailDTO.RecordNo = this.objPlacementInfo.ChildId;
            this.modal.alertSuccess(Common.GetChildDischargedMsg);
        }

        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.objPlacementInfo.ChildId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        this._router.navigate(['/pages/referral/redirectlink/2']);
    }
    fnLoadDropDowns()
    {
        let agencyId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildProfile.AgencyProfileId = agencyId;
        this.objChildProfile.ChildStatusId = 19;
        this.apiService.post("ChildProfile", "GetAllForTransferRespiteDischarge", this.objChildProfile).then(data =>{
            this.lstChildProfile = data;
            data.forEach(item => {
                if (item.ChildOrParentId!=3) {
                    this.lstChildProfileDropDown.push(item);
                }
            });
        });
        this.apiService.get("ChildProfile","GetAllChildSiblingNParentMapping",this.objChildProfile.AgencyProfileId).then(data => this.lstChildSNPMapping = data);

        this.apiService.post("ChildProfile","GetAllForRespiteDischarge",this.objChildProfile).then(data => {
            this.lstChildProfileTransfer = data;
            data.forEach(item => {
                if (item.ChildOrParentId!=3) {
                    this.lstChildProfileTransferDropDown.push(item);
                }
            });
            this.lstChildProfileTransferDropDown = [...this.lstChildProfileTransferDropDown];
        });

        this.apiService.get("CarerInfo", "ApprovedCarerParentAll", this.objChildProfile.AgencyProfileId).then(data => this.lstCarerInfo = data);
        this.apiService.get("CarerInfo", "ApprovedCarerParentAllForRespiteEnd", this.objChildProfile.AgencyProfileId).then(data => this.lstApprovedCarerInfo = data);
        this.apiService.get("CarerInfo", "BackupCarerAllForRespiteEnd", this.objChildProfile.AgencyProfileId).then(data => this.lstBackupCarerEnd = data);
        this.apiService.get("LocalAuthority", "getall", this.AgencyProfileId).then(data => this.fnReturnLA(data));
        this.objUserProfileDTO.AgencyProfile.AgencyProfileId = agencyId;
        //this.objUserProfileDTO.UserTypeCnfg.UserTypeId = 3;
        //this._userProfileService.GetAllByUserTypeId(this.objUserProfileDTO).then(data => this.lstAgencySocialWorker =data);

        this.objConfigTableNamesDTO.AgencyProfileId = agencyId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.PlacementType;
        this.apiService.post("ConfigTableValues","GetByTableNamesId",this.objConfigTableNamesDTO).then(data => { this.lstPlacementType = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.PlacementCategory;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.lstPlacementCategory = data; });

        this.childNCarerForm = this._formBuilder.group({
            ChildProfile: ['0', Validators.required],
            //CarerInfo: ['0', Validators.required],
            //BackupCarerInfo: ['0', Validators.required],
            rdoPSibling: [],
            rdoPParents: [],
        });

        this.childPlacementForm = this._formBuilder.group({
            //ChildProfile: ['0', Validators.required],
            //CarerInfo: ['0', Validators.required],
            PlacementDate: ['', Validators.required],
            PlacementType: ['0', Validators.required],
            PlacementCategory: ['0', Validators.required],
            LocalAuthority: ['0', Validators.required],
            AgencySocialWorker: ['0', Validators.required],
            RespiteEndDate: [''],
            Rate: [''],

            //chkCNP:[],
        });
        this.CarerForm = this._formBuilder.group({
            CarerInfo: ['0', Validators.required],
        });
        this.BackupCarerForm = this._formBuilder.group({
            BackupCarerInfo: ['0', Validators.required],
        });
        this.childTransferForm = this._formBuilder.group({
            ChildProfileTransfer: ['0', Validators.required],
            CarerInfoTransfer: ['0', Validators.required],
            TransferDate: ['', Validators.required],
        });
        this.notificationForm = this._formBuilder.group({});

        this.objChildProfile = null;
        this.objCarerInfo = null;
        this.objChildProfileTransfer = null;
        this.objSecondCarerInfo = null;
        this.objCarerInfoTransfer = null;
        this.objSecondCarerInfoTransfer = null;
        this.objCarerInfoChildTransfer = null;
    }
    fnReturnLA(data) {
        this.lstLocalAuthority = data;
    }
    fnLoadSiblingNParent(IsSibling: boolean,value)
    {
        //Load Siblings
        let arrSiblingLink = this.lstChildSNPMapping.filter(item => item.SiblingOrParentId == value && item.IsSibling == IsSibling);

        let arrSibling = [];
        if (arrSiblingLink.length > 0) {
            arrSiblingLink.forEach(itemParent => {
                this.lstChildSNPMapping.forEach(item => {
                    if (item.LinkId == itemParent.LinkId) {
                        let tempSibling=arrSibling.filter(v => v.SiblingOrParentId == item.SiblingOrParentId);
                        if(tempSibling.length==0)
                        {
                            arrSibling.push(item);
                        }
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
                           this.lstParentsRespiteStart.push(item);
                           this.parentCheck = true;
                           this.showParentTable = true;

                        }
                    }
                }
                );
            }
            for (let itemPar of arrSibling) {
                this.lstChildProfileTransfer.forEach(item => {
                    if (item.ChildId == itemPar.SiblingOrParentId && itemPar.SiblingOrParentId != value) {
                        if (IsSibling && item.ChildOrParentId == 1) {
                            item.HasChildSiblings = true;
                            this.lstSibling.push(item);
                        }
                        else //if (!IsSibling && item.ChildOrParentId == 2)
                        {
                           item.HasChildParents = true;
                           item.IsActive=true;
                           this.lstParentsRespiteEnd.push(item);
                           this.parentCheck = true;
                           this.showParentTableRespiteEnd=true;
                        }
                    }
                }
                );
            }
        }
             //console.log(this.lstSibling);
    }
	test1=null;testBC=null;
    fnLoadChildDetails(value) {
        this.showParentTable=false;
        this.showSiblingeTable=false;
		this.showAllBackupCarer=false;
		this.selectAllBackupCarer=false;
		this.selectBackupCarer=false;
        this.carerLabel = "Carer";
        this.showBackupCarer = false;
		this.objCarerInfo=null;
		this.objBackupCarerInfo=null;
		this.test1=null;this.testBC=null;
        this.lstCarerInfoTransfer = [];
        if (value != "") {
            this.lstSibling = [];
            this.lstParents = [];
            this.lstSiblingRespiteStart = [];
            this.lstParentsRespiteStart = [];
            this.fnLoadSiblingNParent(true, value);
            this.fnLoadSiblingNParent(false, value);

            //Load Selected Child details
            this.lstChildProfile.forEach(item => {
                if (item.ChildId == value) {
                    this.objChildProfile = item;
                    this.objChildPlacementDTO.LocalAuthorityId = item.LocalAuthority.LocalAuthorityId;
                    this.fnShowImage(this.objChildProfile.PersonalInfo.ImageId, "Child");
                }
            }
            );

            this.objCarerInfoChildTransfer = null;
            this.objCarerInfoTransfer = null;
            this.objBackupCarerInfo = null;
            this.objPlacementInfo = null;
            let arrChildId = [];
            for (let item of this.lstCarerInfo) {
                let check = true;
                let childPlacement = item.CarerInfo.ChildPlacement;

                if (childPlacement != null) {
                    childPlacement.forEach(subItem => {
                        if (subItem.ChildId == value) {
                            check = false;
                            this.vacancyId = subItem.VacancyId;
                        }
                    });
                }
                if (check) {

                    if (item.AvailableVacancies > 0)
                    {
                        this.lstCarerInfoTransfer.push(item);
                    }
                }
                else {

                    for (let citem of item.CarerInfo.ChildPlacement) {
                        if (citem.ChildId == value) {
                            this.objPlacementInfo = citem;
                            this.objCarerInfoChildTransfer = item;
                            break;
                        }
                    }
                    for (let citem of item.CarerInfo.ChildPlacement) {
                        if (citem.ChildId != value && citem.VacancyId == this.objPlacementInfo.VacancyId) {
                            arrChildId.push(citem.ChildId + '-' + citem.ChildPlacementId);
                        }
                    }
                }
            }
            //Select sibling only for the current selected child placement
            //delete duplicate item from array
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
                        this.lstSiblingRespiteStart.push(item);
                        break;
                    }
                }
            }

            //for (let childId of tmp) {
            //    for (let item of this.lstParents) {
            //        let childNPlacementId = childId.split('-');
            //        if (childNPlacementId[0] == item.ChildId) {
            //            item.ChildPlacementId = childNPlacementId[1];
            //            this.lstParentsRespiteStart.push(item);
            //            break;
            //        }
            //    }
            //}

        }
        else
            this.objChildProfile = null;
        //Load Backup carer
        if (this.vacancyId) {
            this.apiService.get(this.controllerName, "GetCarerVacancyDetailsById", this.vacancyId).then(data => {
                this.apiService.get("CarerInfo", "BackupCarerForRespiteStart", parseInt(data.CarerParentId)).then(
                    out => this.lstBackupCarer = out
                )
            });
        }
    }
    objCarerInfoChildTransfer;
    objPlacementInfo;
    fnLoadRespiteEndChildDetails(value)
    {
        this.showSiblingeTableRespiteEnd=false;
        this.showParentTableRespiteEnd=false;
        this.objCarerInfoChildTransfer = null;
        this.objCarerInfoTransfer = null;
        this.lstCarerInfoTransfer = [];
        this.objPlacementInfo = null;
        if (value != "") {
            this.lstSibling = [];
            this.lstParents = [];
            this.lstSiblingRespiteEnd = [];
            this.lstParentsRespiteEnd = [];
            this.fnLoadSiblingNParent(true, value);
            this.fnLoadSiblingNParent(false, value);

            //Load Selected Child details
            this.lstChildProfileTransfer.forEach(item => {
                if (item.ChildId == value) {
                    this.objChildProfileTransfer = item;
                    this.fnShowImage(this.objChildProfileTransfer.PersonalInfo.ImageId, "TrnChild");
                }
            });
            let arrChildId = [];
            for (let item of this.lstApprovedCarerInfo) {
                //let check = true;
                //let childPlacement = item.CarerInfo.ChildPlacement;
                ////console.log(childPlacement);
                //if (childPlacement != null) {
                //    childPlacement.forEach(subItem => {
                //        if (subItem.ChildId == value) {
                //            check = false;
                //        }
                //    });

                //}
                //if (check) {
                //    this.lstCarerInfoTransfer.push(item);
                //}
                for (let citem of item.CarerInfo.ChildPlacement) {
                    if (citem.ChildId == value) {
                        if (item.CarerTypeId == 1) {
                            this.objPlacementInfo = citem;
                            this.objCarerInfoChildTransfer = item;
                            if (citem.ChildRespiteDetail.IsBackupCarer) {
                                if (item.CarerTypeId == 1) {
                                    this.lstBackupCarerEnd.forEach(item => {
                                        if (item.CarerInfo.CarerId == citem.ChildRespiteDetail.BackupCarerId) {
                                            this.objCarerInfoChildTransfer = item;
                                        }

                                    });
                                }
                            }
                            this.fnShowImage(this.objCarerInfoChildTransfer.CarerInfo.PersonalInfo.ImageId, "PlacedCarer");
                            break;
                        }
                        else
                            this.carerHeader = "Carer";
                    }
                }
                for (let citem of item.CarerInfo.ChildPlacement) {
                    if (this.objPlacementInfo != null) {
                        if (citem.ChildId != value && citem.VacancyId == this.objPlacementInfo.VacancyId) {
                            arrChildId.push(citem.ChildId + '-' + citem.ChildPlacementId);
                        }
                    }
                }
            }
            //Select sibling only for the current selected child placement
            //delete duplicate item from array
            if (arrChildId != null) {
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
                            this.lstSiblingRespiteEnd.push(item);
                            break;
                        }
                    }
                }
                //for (let childId of tmp) {
                //    for (let item of this.lstParents) {
                //        let childNPlacementId = childId.split('-');
                //        if (childNPlacementId[0] == item.ChildId) {
                //            item.ChildPlacementId = childNPlacementId[1];
                //            this.lstParentsRespiteEnd.push(item);
                //            break;
                //        }
                //    }
                //}
            }
        }
        else
            this.objChildProfileTransfer = null;

    }
    fnLoadCarerDetails(value) {
        this.objCarerInfo = null;
        this.objSecondCarerInfo = null;
        if (value != "") {
            this.lstCarerInfo.forEach(item => {
                if (item.CarerParentId == value && item.CarerTypeId == 1) {
                    this.objCarerInfo = item;
                    this.fnShowImage(this.objCarerInfo.CarerInfo.PersonalInfo.ImageId, "FirstCarer");
                }
            }
            );
            this.lstCarerInfo.forEach(item => {
                if (item.CarerParentId == value && item.CarerTypeId == 2) {
                    this.objSecondCarerInfo = item;
                    this.fnShowImage(this.objSecondCarerInfo.CarerInfo.PersonalInfo.ImageId, "SecondCarer");
                }
            });
        }
        this.fnLoadAgencySocialWorker(this.objCarerInfo.CarerParentId);
    }
    AgencySocialWorkerDTO;
    fnLoadAgencySocialWorker(CarerParentId) {
        //Select AgencySocialWorker name
        this.apiService.get("UserProfile", "GetAllAgencySocialWorker", this.AgencyProfileId).then(data => {
            this.AgencySocialWorkerDTO = data;
            this.lstAgencySocialWorker = this.AgencySocialWorkerDTO.UserProfile;

            this.AgencySocialWorkerDTO.AgencySocialWorker.forEach(item => {
                if (item.CarerParentId == CarerParentId) {
                    this.objChildPlacementDTO.AgencySocialWorkerId = item.UserProfileId;
                }

            });
        });
    }
    objCarerInfoTransfer;
    objSecondCarerInfoTransfer;
    fnLoadCarerDetailsTransfer(value)
    {
        this.objCarerInfoTransfer = null;
        this.objSecondCarerInfo = null;
        if (value != "") {
            this.lstCarerInfo.forEach(item => {
                if (item.CarerParentId == value && item.CarerTypeId == 1) {
                    this.objCarerInfoTransfer = item;
                    this.fnShowImage(this.objCarerInfoTransfer.CarerInfo.PersonalInfo.ImageId, "TrnFirstCarer");
                }
            }
            );
            this.lstCarerInfo.forEach(item => {
                if (item.CarerParentId == value && item.CarerTypeId == 2) {
                    this.objSecondCarerInfoTransfer = item;
                    this.fnShowImage(this.objSecondCarerInfoTransfer.CarerInfo.PersonalInfo.ImageId, "TrnSecondCarer");
                }
            });
        }
    }
    public next() {
        this.submittedCNC = true;
        let showBackupCarer = this.showBackupCarer;
        let childNCarer = this.childNCarerForm;
        let CarerForm = this.CarerForm;
        let BackupCarerForm=this.BackupCarerForm;
        let childPlacement = this.childPlacementForm;
        let notification = this.notificationForm;
        let lstSibling = this.lstSibling;
        let lstSiblingCategory = this.lstSiblingCategory;
        let lstParents = this.lstParentsRespiteStart;
        let lstParentCategory = this.lstParentCategory;
        let objChildPlacementDTO = this.objChildPlacementDTO;
        if (this.steps[this.steps.length - 1].active)
            return false;
        this.steps.some(function (step, index, steps) {
            if (index < steps.length - 1) {
                if (step.active) {
                    if (step.name == 'Child & Carer Information') {
                        if (!showBackupCarer) {
                            if (childNCarer.valid && CarerForm.valid) {
                                step.active = false;
                                step.valid = true;
                                steps[index + 1].active = true;
                                for (let item of lstSibling) {
                                    if (item.IsActive) {
                                        let tem=lstSiblingCategory.filter(x=>x.ChildId==item.ChildId);
                                        if(tem.length==0)
                                        {
                                           item.PlacementCategoryId=null;
                                           lstSiblingCategory.push(item);
                                        }
                                        //lstSiblingCategory.push(item);
                                    }
                                }
                                for (let item of lstParents) {
                                    if (item.IsActive) {
                                        lstParentCategory.push(item);
                                    }
                                }
                                return true;
                            }
                            else {
                                step.hasError = true;
                            }
                        }
                        else
                        {
                            if (childNCarer.valid && BackupCarerForm.valid) {
                                step.active = false;
                                step.valid = true;
                                steps[index + 1].active = true;
                                for (let item of lstSibling) {
                                    if (item.IsActive) {
                                        let tem=lstSiblingCategory.filter(x=>x.ChildId==item.ChildId);
                                        if(tem.length==0)
                                        {
                                           item.PlacementCategoryId=null;
                                           lstSiblingCategory.push(item);
                                        }
                                    }
                                }
                                for (let item of lstParents) {
                                    if (item.IsActive) {
                                        lstParentCategory.push(item);
                                    }
                                }
                                return true;
                            }
                            else {
                                step.hasError = true;
                            }
                        }
                    }

                    if (step.name == 'Respite Information') {
                        if (childPlacement.valid) {

                            step.active = false;
                            step.valid = true;
                            steps[index + 1].active = true;
                            return true;
                        }
                        else {
                            step.hasError = true;
                        }
                    }

                }
            }
        });
    }
    public prev() {
        if (this.steps[0].active)
            return false;
        this.steps.some(function (step, index, steps) {
            if (index != 0) {
                if (step.active) {
                    step.active = false;
                    steps[index - 1].active = true;
                    return true;
                }
            }
        });
    }
    fnShowSibling(value)
    {
        if (value) {
            this.showSiblingeTable = true;
            this.showParentTable = false;
            this.siblingCheck = true;
            this.parentCheck = false;

        }
        else
        {
            this.showSiblingeTable = false;
            this.showParentTable = false;
            this.siblingCheck = false;

        }
    }
    fnShowParents(value) {
        if (value)
        {
            this.showSiblingeTable = false;
            this.showParentTable = true;
            this.siblingCheck = false;
            this.parentCheck = true;
        }
        else {
            this.showParentTable = false;
            this.showSiblingeTable = false;
            this.parentCheck = false;
        }
    }
    fnShowSiblingRespiteEnd(value) {
        if (value) {
            this.showSiblingeTableRespiteEnd = true;
            this.showParentTableRespiteEnd = false;
            this.siblingCheck = true;
            this.parentCheck = false;
        }
        else {
            this.showSiblingeTableRespiteEnd = false;
            this.showParentTableRespiteEnd = false;
            this.siblingCheck = false;
        }
    }
    fnShowParentsRespiteEnd(value) {
        if (value) {
            this.showSiblingeTableRespiteEnd = false;
            this.showParentTableRespiteEnd = true;
            this.siblingCheck = false;
            this.parentCheck = true;
        }
        else {
            this.showSiblingeTableRespiteEnd = false;
            this.showParentTableRespiteEnd = false;
            this.parentCheck = false;
        }
    }
    fnDischarge(dynamicControl, AddtionalEmailIds, EmailIds) {
        this.submittedTrnsCNC = true;
        if (this.childTransferForm.valid) {
            this.isLoadingDischarge = true;
            this.objChildPlacementDTO.DischargeDate = this.modal.GetDateTimeSaveFormat(this.objChildPlacementDTO.DischargeDate);

            this.arrChildPlacementDTO = [];
            this.objChildPlacementDTO.NotificationEmailIds = EmailIds;
            this.objChildPlacementDTO.CarerParentId=this.objCarerInfoChildTransfer.CarerParentId;
            this.objChildPlacementDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.objChildPlacementDTO.AgencyProfileId = this.AgencyProfileId;
            this.objChildPlacementDTO.ChildPlacementId = this.objPlacementInfo.ChildPlacementId,
            this.objChildPlacementDTO.ChildId = this.objPlacementInfo.ChildId;
            this.objChildPlacementDTO.VacancyId = this.objPlacementInfo.VacancyId;
            this.objChildPlacementDTO.DynamicValue = dynamicControl;
            if(this.objPlacementInfo.ChildRespiteDetail!=null)
            {
            this.objChildPlacementDTO.ChildRespiteDetail.IsBackupCarer = this.objPlacementInfo.ChildRespiteDetail.IsBackupCarer;
            }
            this.arrChildPlacementDTO.push(this.objChildPlacementDTO);
            if (this.lstSiblingRespiteEnd.length > 0) {
                for (let item of this.lstSiblingRespiteEnd) {
                    if (item.IsActive == true) {
                        let objChildPlacement = new ChildPlacementNewDTO();
                        objChildPlacement.AgencyProfileId = this.AgencyProfileId;
                        objChildPlacement.ChildPlacementId = item.ChildPlacementId,
                        objChildPlacement.ChildId = item.ChildId;
                        objChildPlacement.DynamicValue = dynamicControl;
                        objChildPlacement.DischargeDate = this.objChildPlacementDTO.DischargeDate;
                        objChildPlacement.VacancyId = this.objPlacementInfo.VacancyId;
                        objChildPlacement.ChildRespiteDetail.IsBackupCarer = this.objPlacementInfo.ChildRespiteDetail.IsBackupCarer;
                        this.arrChildPlacementDTO.push(objChildPlacement);
                    }
                }
            }
            if (this.lstParentsRespiteEnd.length > 0) {
                for (let item of this.lstParentsRespiteEnd) {
                    if (item.IsActive == true) {
                        let objChildPlacement = new ChildPlacementNewDTO();
                        objChildPlacement.AgencyProfileId = this.AgencyProfileId;
                        objChildPlacement.ChildPlacementId = item.ChildPlacementId,
                        objChildPlacement.ChildId = item.ChildId;
                        objChildPlacement.DynamicValue = dynamicControl;
                        objChildPlacement.DischargeDate = this.objChildPlacementDTO.DischargeDate;
                        objChildPlacement.VacancyId = this.objPlacementInfo.VacancyId;
                        objChildPlacement.ChildRespiteDetail.IsBackupCarer = this.objPlacementInfo.ChildRespiteDetail.IsBackupCarer;
                        this.arrChildPlacementDTO.push(objChildPlacement);
                    }
                }
            }
            // console.log(this.arrChildPlacementDTO);
            this.apiService.post(this.controllerName,"ChildRespiteEnd",this.arrChildPlacementDTO).then(data => this.ResponeTransfer(data));
        }

    }
    //set hide and visible
    DynamicOnValChange(InsValChange: ValChangeDTO) {

        if (InsValChange.currnet.FieldCnfg.FieldName == "PlacementAgreement")
        {
            InsValChange.currnet.IsVisible = false;

        }
    }
    DynamicOnValChangeRespiteEnd(InsValChange: ValChangeDTO) {

        InsValChange.all.forEach(item =>
        {
            switch (item.FieldCnfg.FieldName) {
                case "PlacementLeavingTimeAddress":
                    {
                        item.IsMandatory = false;
                        item.IsVisible = false;
                        break;
                    }
                case "DischargedToWhom":
                    {
                        item.IsMandatory = false;
                        item.IsVisible = false;
                        break;
                    }
                case "DischargedAddress":
                    {
                        item.IsMandatory = false;
                        item.IsVisible = false;
                        break;
                    }
            }

        });

    }
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
                        case "FirstCarer":
                            {
                                this.srcFirstCarerPath = "data:image/jpeg;base64," + data;
                                break;
                            }
                        case "SecondCarer":
                            {
                                this.srcSecondCarerPath = "data:image/jpeg;base64," + data;
                                break;
                            }
                        case "TrnChild":
                            {
                                this.srcTrnChildPath = "data:image/jpeg;base64," + data;
                                break;
                            }
                        case "TrnFirstCarer":
                            {
                                this.srcTrnFirstCarerPath = "data:image/jpeg;base64," + data;
                                break;
                            }
                        case "TrnSecondCarer":
                            {
                                this.srcTrnSecondCarerPath = "data:image/jpeg;base64," + data;
                                break;
                            }
                        case "PlacedCarer":
                            {
                                this.srcPlacedCarerPath = "data:image/jpeg;base64," + data;
                                break;
                            }
                        case "BackupCarer":
                            {
                                this.srcBackupCarerPath = "data:image/jpeg;base64," + data;
                                break;
                            }
                    }
                }
            });
        }
        else
        {
            switch (type) {
                case "Child":
                    {
                        this.srcChildPath = "assets/img/app/Photonotavail.png";
                        break;
                    }
                case "FirstCarer":
                    {
                        this.srcFirstCarerPath = "assets/img/app/Photonotavail.png";
                        break;
                    }
                case "SecondCarer":
                    {
                        this.srcSecondCarerPath = "assets/img/app/Photonotavail.png";
                        break;
                    }
                case "TrnChild":
                    {
                        this.srcTrnChildPath = "assets/img/app/Photonotavail.png";
                        break;
                    }
                case "TrnFirstCarer":
                    {
                        this.srcTrnFirstCarerPath = "assets/img/app/Photonotavail.png";
                        break;
                    }
                case "TrnSecondCarer":
                    {
                        this.srcTrnSecondCarerPath = "assets/img/app/Photonotavail.png";
                        break;
                    }
                case "PlacedCarer":
                    {
                        this.srcPlacedCarerPath = "assets/img/app/Photonotavail.png";
                        break;
                    }
                case "BackupCarer":
                    {
                        this.srcBackupCarerPath = "assets/img/app/Photonotavail.png";
                        break;
                    }
            }
        }

    }
    lstTempCarer;
    carerTypeId = 1;
    showBackupCarer = false;
	showAllBackupCarer=false;
    carerLabel = "Carer";
	selectBackupCarer=false;
	selectAllBackupCarer=false;
    fnSelectCarer(value)
    {

        if (value) {
			this.selectBackupCarer=true;
			this.selectAllBackupCarer=false;
            this.carerLabel = "Backup Carer";
            this.showBackupCarer = true;
			this.showAllBackupCarer=true;
			 //Load Backup carer
			if (this.vacancyId) {
				this.apiService.get(this.controllerName, "GetCarerVacancyDetailsById", this.vacancyId).then(data => {
					this.apiService.get("CarerInfo", "BackupCarerForRespiteStart", parseInt(data.CarerParentId)).then(
						out => this.lstBackupCarer = out
					)
				});
			}
        }
        else
        {
			this.selectBackupCarer=false;
            this.carerLabel = "Carer";
            this.showBackupCarer = false;
			this.showAllBackupCarer=false;
        }
    }
	fnSelectAllBackupCarer(value)
	{
		if (value) {
		this.selectAllBackupCarer=true;
		this.selectBackupCarer=false;
                this.apiService.get("CarerInfo", "BackupCarerAllForRespiteStart", 0).then(data => this.lstBackupCarer = data);
        }
		else
		{
			this.selectAllBackupCarer=false;
		}
	}
    objBackupCarerInfo;
    fnLoadBackupCarerDetails(value)
    {
        this.objBackupCarerInfo = null;
        this.submittedCNC = false;
        if (value != "") {
            this.lstBackupCarer.forEach(item => {
                if (item.CarerInfo.CarerId == value) {
                    this.fnLoadAgencySocialWorker(item.CarerParentId);
                    this.objBackupCarerInfo = item;
                    this.fnShowImage(this.objBackupCarerInfo.CarerInfo.PersonalInfo.ImageId, "BackupCarer");
                    this.objCarerInfo = this.lstCarerInfo.filter(T => T.CarerParentId == this.objBackupCarerInfo.CarerParentId)[0];
                }
            }
            );
        }
    }
    showRate = false;
    fnChangePaidRespite(value)
    {
        if (value)
            this.showRate = true;
        else
            this.showRate = false;
    }
}
