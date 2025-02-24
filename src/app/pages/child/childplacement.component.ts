import { Component, ViewChild} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { ChildProfile } from './DTO/childprofile'
//import { ChildPlacementDTO } from './DTO/childplacementdto'
import { Common} from '../common'
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UserProfile } from '../systemadmin/DTO/userprofile'
import { ConfigTableNames } from '../configtablenames'
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablenames'
import {  PersonalInfoVisible} from '../personalinfo/personalinfo';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { json } from 'd3';
import { ChildPlacementNewDTO } from './DTO/childplacementnewdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'ChildPlacement',
    templateUrl: './childplacement.component.template.html',
    styleUrls: ['../form-elements/wizard/wizard.component.scss'],
    styles: [`.ng-invalid:not(form)  {
      border-left: 5px solid #a94442; /* red */}`]
})
export class ChildPlacementComponet {
    isLoading: boolean = false;
    isLoadingTransfer: boolean = false;
    submittedCPM = false;
    objChildProfile: ChildProfile = new ChildProfile();
    objChildProfileTransfer: ChildProfile = new ChildProfile();
    objChildProfileInput: ChildProfile = new ChildProfile();
    objCarerInfo; test1 = null;
    objSecondCarerInfo;
    ChildProfileProfileId;
    lstChildProfile;
    lstOriginalChildProfile;
    lstCarerInfo; lstCarerForPlacement;lstApprovedCarerInfo;
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
    lstSibling = []; lstSiblingCategory = []; lstSiblingTrans=[];
    lstParents = []; lstParentCategory = []; lstParentsTrans=[];
    lstChildSNPMapping;
    showSiblingeTable = false; showSiblingeTableTrans = false;
    showParentTable = false; showParentTableTrans = false;
    public steps: any[];
    public childNCarerForm: FormGroup;
    public childPlacementForm: FormGroup;
    public notificationForm: FormGroup;
    public childTransferForm: FormGroup;
    @ViewChild('dynamic') dynamicCtrl;
    lstChildProfileTransfer;lstChildProfileTransferDropDown=[];
    srcChildPath = "assets/img/app/Photonotavail.png";srcFirstCarerPath = "assets/img/app/Photonotavail.png";
    srcSecondCarerPath = "assets/img/app/Photonotavail.png"; srcTrnChildPath = "assets/img/app/Photonotavail.png";
    srcTrnFirstCarerPath = "assets/img/app/Photonotavail.png"; srcTrnSecondCarerPath = "assets/img/app/Photonotavail.png";
    srcPlacedCarerPath = "assets/img/app/Photonotavail.png";
    AgencyProfileId: number;
    AgencySocialWorkerDTO; controllerName = "ChildPlacement";
    IsStayingputChildSelected=false;IsChildSelected=true;
    submittedCNC = false;submittedTrnsCNC = false;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=77;
    constructor(private apiService: APICallService,
        private route: ActivatedRoute,  private _formBuilder: FormBuilder, private _router: Router, private modal: PagesComponent) {
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.placementId = this.objQeryVal.Id;
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objChildPlacementDTO.AgencyProfileId = this.AgencyProfileId;
        apiService.post("ChildPlacement","GetDynamicControls",this.objChildPlacementDTO).then(data => { this.dynamicformcontrol = data; });

        this.fnLoadDropDowns();

        this.steps = [
            { name: 'Child & Carer Information', icon: 'fa-child', active: true, valid: false, hasError: false },
            { name: 'Placement Information', icon: 'fa-user', active: false, valid: false, hasError: false },
            //{ name: 'Notification', icon: 'fa-flag', active: false, valid: false, hasError: false },
            { name: 'Notification & Place Child', icon: 'fa-flag', active: false, valid: false, hasError: false }
        ]

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.refChildId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    //btn Submit
    btnSave(AddtionalEmailIds, EmailIds): void {

        this.isLoading = true;
        this.arrChildPlacementDTO = [];
        this.objChildPlacementDTO.NotificationEmailIds = EmailIds;
        this.objChildPlacementDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
        this.objChildPlacementDTO.AgencyProfileId = this.AgencyProfileId;
        this.objChildPlacementDTO.ChildId = this.objChildProfile.ChildId;
        this.objChildPlacementDTO.CarerParentId = this.objCarerInfo.CarerParentId;
        this.objChildPlacementDTO.PlacementStartTypeId = 1;
        this.objChildPlacementDTO.DynamicValue = this.dynamicCtrl.dynamicformcontrols;
        this.objChildPlacementDTO.IsStayingPut=this.IsStayingputChildSelected;
        this.objChildPlacementDTO.PlacementDate = this.modal.GetDateTimeSaveFormat(this.objChildPlacementDTO.PlacementDate);
        this.arrChildPlacementDTO.push(this.objChildPlacementDTO);
        if (this.lstSiblingCategory.length > 0)
        {


            for (let item of this.lstSiblingCategory)
            {
                let objChildPlacement = new ChildPlacementNewDTO();
                objChildPlacement.AgencyProfileId = this.AgencyProfileId;
                objChildPlacement.AgencySocialWorkerId = this.objChildPlacementDTO.AgencySocialWorkerId;
                objChildPlacement.LocalAuthorityId = this.objChildPlacementDTO.LocalAuthorityId;
                objChildPlacement.PlacementDate = this.modal.GetDateTimeSaveFormat(this.objChildPlacementDTO.PlacementDate);
                objChildPlacement.PlacementTypeId = this.objChildPlacementDTO.PlacementTypeId
                objChildPlacement.ChildId = item.ChildId;
                objChildPlacement.PlacementCategoryId = item.PlacementCategoryId;
                objChildPlacement.CarerParentId = this.objCarerInfo.CarerParentId;
                objChildPlacement.PlacementStartTypeId = 1;
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
                objChildPlacement.PlacementDate = this.modal.GetDateTimeSaveFormat(this.objChildPlacementDTO.PlacementDate);
                objChildPlacement.PlacementTypeId = this.objChildPlacementDTO.PlacementTypeId
                objChildPlacement.ChildId = item.ChildId;
                objChildPlacement.PlacementCategoryId = item.PlacementCategoryId;
                objChildPlacement.CarerParentId = this.objCarerInfo.CarerParentId;
                objChildPlacement.PlacementStartTypeId = 1;
                objChildPlacement.DynamicValue = this.dynamicCtrl.dynamicformcontrols;
                this.arrChildPlacementDTO.push(objChildPlacement);
            }
        }
      //  alert(this.objChildPlacementDTO.PlacementDate);
        this.objChildPlacementDTO.PlacementDate = this.modal.GetDateTimeSaveFormat(this.objChildPlacementDTO.PlacementDate);
        //console.log(JSON.stringify(this.arrChildPlacementDTO[0]));
        console.log(JSON.stringify(this.arrChildPlacementDTO));
        this.apiService.post(this.controllerName, "ChildPlacement", this.arrChildPlacementDTO).then(data =>{ this.Respone(data)});


    }
    private Respone(data) {
        this.isLoading = false;
        this.arrChildPlacementDTO = [];
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.objUserAuditDetailDTO.ActionId =1;
            this.objUserAuditDetailDTO.RecordNo = this.refChildId;
            this.modal.alertSuccess(Common.GetChildPlacedMsg);
        }

        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.refChildId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        this._router.navigate(['/pages/referral/redirectlink/1']);
    }
    private ResponeTransfer(data) {
        this.isLoadingTransfer = false;
        this.arrChildPlacementDTO = [];
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.objUserAuditDetailDTO.ActionId =1;
            this.objUserAuditDetailDTO.RecordNo = this.refChildId;
            this.modal.alertSuccess(Common.GetChildTransferdMsg);
        }

        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.refChildId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        this._router.navigate(['/pages/referral/redirectlink/1']);
    }
    refChildId;
    fnLoadNormalChild()
    {

        this.objChildProfile = null;
        this.objCarerInfo=null;
        this.IsStayingputChildSelected=false;
        this.IsChildSelected==true?this.IsChildSelected=false:this.IsChildSelected=true;
        this.lstChildProfile=this.lstOriginalChildProfile.filter(item => item.ChildStatusId != 19 && item.ChildStatusId != 17 && item.PersonalInfo.Age<18);
        this.submittedCNC=false;
        this.refChildId=null;
        this.test1 = null;
    }

    fnLoadStayingputChild()
    {
        this.objChildProfile = null;
        this.objCarerInfo=null;
        this.IsChildSelected=false;
        this.IsStayingputChildSelected==true?this.IsStayingputChildSelected=false:this.IsStayingputChildSelected=true;
        this.lstChildProfile=this.lstOriginalChildProfile.filter(item => item.ChildStatusId != 19 && item.ChildStatusId != 17 && item.PersonalInfo.Age>=18);
        this.submittedCNC=false;
        this.refChildId=null;
        this.test1 = null;
    }
    fnLoadDropDowns()
    {

        this.objChildProfile.AgencyProfileId = this.AgencyProfileId;
        this.objChildProfile.ChildStatusId = 18;

        this.apiService.post("ChildProfile","GetAllForPlacement",this.objChildProfile).then(data => {
            this.lstOriginalChildProfile=data;
            this.lstChildProfile = data.filter(item => item.ChildStatusId != 19 && item.ChildStatusId != 17 && item.PersonalInfo.Age<18);
            if (Common.GetSession("RefPlacementChildId") != null && Common.GetSession("RefPlacementChildId") != "null") {
                this.refChildId = Common.GetSession("RefPlacementChildId");
                this.fnLoadChildDetails(this.refChildId);
                Common.SetSession("RefPlacementChildId", "null")
            }
        });
        this.objChildProfile.ChildStatusId = 19;
        this.apiService.post("ChildProfile", "GetAllForTransferRespiteDischarge", this.objChildProfile).then(data => {
            this.lstChildProfileTransfer = data;
            data.forEach(item => {
                if (item.ChildOrParentId!=3) {
                    this.lstChildProfileTransferDropDown.push(item);
                }
            });
        });
        this.apiService.get("ChildProfile", "GetAllChildSiblingNParentMapping", this.objChildProfile.AgencyProfileId).then(data => this.lstChildSNPMapping = data);
        this.apiService.get("CarerInfo", "ApprovedVacantCarerParentAll", this.objChildProfile.AgencyProfileId).then(data => this.lstCarerInfo = data);
        this.apiService.get("CarerInfo", "ApprovedCarerParentAll", this.objChildProfile.AgencyProfileId).then(data => this.lstApprovedCarerInfo = data);
        this.apiService.get("LocalAuthority", "getall", this.AgencyProfileId).then(data => this.fnReturnLA(data));

        this.objUserProfileDTO.AgencyProfile.AgencyProfileId = this.AgencyProfileId;
        this.objUserProfileDTO.UserTypeCnfg.UserTypeId = 19;
        this.apiService.post("UserProfile", "GetAllByUserTypeId", this.objUserProfileDTO).then(data => this.lstAgencySocialWorker = data);


        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.PlacementType;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.lstPlacementType = data; });

        this.objConfigTableNamesDTO.Name = ConfigTableNames.PlacementCategory;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.lstPlacementCategory = data; });


        this.childNCarerForm = this._formBuilder.group({
            ChildProfile: ['0', Validators.required],
            CarerInfo: ['0', Validators.required],
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

            //chkCNP:[],
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
        //console.log(arrSiblingLink);
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
                if (itemPar.SiblingOrParentId != value) {
				this.objChildProfile=new ChildProfile();
                if(!IsSibling)
                    this.objChildProfile.ChildOrParentId=3;
                else
                    this.objChildProfile.ChildOrParentId=0;
					this.objChildProfile.ChildId=parseInt(itemPar.SiblingOrParentId);
						this.objChildProfile.AgencyProfileId = this.AgencyProfileId;
						this.apiService.post("ChildProfile","GetByIdForPlacement",this.objChildProfile).then(data => {
						if (data.ChildStatusId != 19) {
                            if(IsSibling)
                            {
                                data.HasChildSiblings = true;
                                this.lstSibling.push(data);
                            }
                            else
                            {
                                data.HasChildParents = true;
                                this.lstParents.push(data);
                            }
                        }
					});

                    }
            }
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
                this.lstChildProfileTransfer.forEach(item => {
                    if (item.ChildId == itemPar.SiblingOrParentId && itemPar.SiblingOrParentId != value) {
                        if (IsSibling && item.ChildOrParentId == 1) {
                            item.HasChildSiblings = true;
                            this.lstSibling.push(item);
                        }
                        else //if (!IsSibling && item.ChildOrParentId == 2)
                        {
                           item.IsActive=true;
                           item.HasChildParents = true;
                           this.lstParentsTrans.push(item);
                           this.parentCheck = true;
                           this.showParentTableTrans = true;
                           //this.lstParents.push(item);
                        }
                    }
                }
                );
            }
        }

    }
    fnShowImage(ImageId, type) {
        if (ImageId != null) {
            this.apiService.get("UploadDocuments", "GetImageById",ImageId).then(data => {
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

                    }
                }
            });
        }
        else {
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

            }
        }

    }
    fnLoadChildDetails(value)
    {

        if (value != "") {

            this.showSiblingeTable = false;
            this.showParentTable = false;
            this.siblingCheck = false;
            this.lstSibling = [];
            this.lstParents = [];
            this.fnLoadSiblingNParent(true, value);
            this.fnLoadSiblingNParent(false, value);
            //Load Selected Child details
			this.objChildProfile = new ChildProfile();
			this.objChildProfile.ChildId=parseInt(value);
			  this.objChildProfile.AgencyProfileId = this.AgencyProfileId;
              this.objChildProfile.ChildOrParentId=0;

			   this.apiService.post("ChildProfile","GetByIdForPlacement",this.objChildProfile).then(data => {
					this.objChildProfile = data;
					this.objChildPlacementDTO.LocalAuthorityId = data.LocalAuthority.LocalAuthorityId;
					this.fnShowImage(this.objChildProfile.PersonalInfo.ImageId, "Child");
        });

            //this.lstChildProfile.forEach(item => {
              //  if (item.ChildId == value) {
                 //   this.objChildProfile = item;
                //    this.objChildPlacementDTO.LocalAuthorityId = item.LocalAuthority.LocalAuthorityId;
               //     this.fnShowImage(this.objChildProfile.PersonalInfo.ImageId, "Child");

               // }
          //  }
           // );
            this.objCarerInfo = "";
            if(this.IsChildSelected)
                this.lstCarerForPlacement = this.lstCarerInfo;
            else
                this.lstCarerForPlacement = this.lstApprovedCarerInfo;
            //this.lstCarerForPlacement = this.lstCarerInfo.filter(item => item.CarerInfo.ApprovedGender == this.objChildProfile.PersonalInfo.GenderId
            //    || item.CarerInfo.ApprovedGender==3);

        }
        else
            this.objChildProfile = null;
    }
    objCarerInfoChildTransfer;
    objPlacementInfo;
    fnLoadTransferChildDetails(value)
    {
        this.objCarerInfoChildTransfer = null;
        this.objCarerInfoTransfer = null;
        this.lstCarerInfoTransfer = [];
        this.objPlacementInfo = null;
        this.showSiblingeTableTrans = false;
        this.showParentTableTrans = false;

        this.lstSibling = [];
        this.lstParents = [];
        this.lstSiblingTrans = [];
        this.lstParentsTrans = [];
        this.fnLoadSiblingNParentTrans(true, value);
        this.fnLoadSiblingNParentTrans(false, value);
        let arrChildId = [];
        if (value != "") {
            //Load Selected Child details
            this.lstChildProfileTransfer.forEach(item => {
                if (item.ChildId == value) {
                    this.objChildProfileTransfer = item;
                    this.fnShowImage(this.objChildProfileTransfer.PersonalInfo.ImageId, "TrnChild");
                }
            });
            //Load Carer and placement info for selected child

            for (let item of this.lstApprovedCarerInfo)
            {
                let check=true;
                let childPlacement = item.CarerInfo.ChildPlacement;

                if (childPlacement != null) {
                    childPlacement.forEach(subItem => {
                        if (subItem.ChildId == value) {
                            check = false;
                        }
                    });
                }
                if(this.objChildProfileTransfer.PlacementStartTypeId!=4)
                {
                    if (check && item.AvailableVacancies>0) {
                        this.lstCarerInfoTransfer.push(item);
                    }
                    else
                    {
                        for (let citem of item.CarerInfo.ChildPlacement)
                        {
                            if (citem.ChildId == value) {
                                if (item.CarerInfo.CarerTypeid == 1) {
                                    this.objPlacementInfo = citem;
                                    this.objCarerInfoChildTransfer = item;
                                    //console.log(this.objCarerInfoChildTransfer.CarerInfo.PersonalInfo);
                                    this.fnShowImage(this.objCarerInfoChildTransfer.CarerInfo.PersonalInfo.ImageId, "PlacedCarer");
                                }
                            }
                            else
                                arrChildId.push(citem.ChildId + '-' + citem.ChildPlacementId);
                        }

                    }
                }
                else
                {
                    if (check && item.AvailableVacancies>0) {
                        //console.log("1");
                        this.lstCarerInfoTransfer.push(item);
                    }
                    else
                    {
                        for (let citem of item.CarerInfo.ChildPlacement)
                        {
                            if (citem.ChildId == value) {
                                if (item.CarerInfo.CarerTypeid == 1) {
                                    this.objPlacementInfo = citem;
                                    this.objCarerInfoChildTransfer = item;
                                    //console.log(this.objCarerInfoChildTransfer.CarerInfo.PersonalInfo);
                                    this.fnShowImage(this.objCarerInfoChildTransfer.CarerInfo.PersonalInfo.ImageId, "PlacedCarer");
                                }
                            }
                            else
                                arrChildId.push(citem.ChildId + '-' + citem.ChildPlacementId);
                        }

                    }
                }
            }
            //Select sibling only for the current selected child placement
            //delete duplicate item from array
            if (arrChildId.length == 0) {
                this.showSiblingeTableTrans = false;
                this.showParentTableTrans = false;
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
                for (let item of this.lstSibling)
                {
                    let childNPlacementId = childId.split('-');
                    if (childNPlacementId[0] == item.ChildId) {
                        item.ChildPlacementId = childNPlacementId[1];
                        this.lstSiblingTrans.push(item);
                        break;
                    }
                }
            }
            //for (let childId of tmp) {
            //    for (let item of this.lstParents) {
            //        let childNPlacementId = childId.split('-');
            //        if (childNPlacementId[0] == item.ChildId) {
            //            item.ChildPlacementId = childNPlacementId[1];
            //            this.lstParentsTrans.push(item);
            //            break;
            //        }
            //    }
            //}
           //console.log(this.lstSiblingTrans);
        }
        else
            this.objChildProfileTransfer = null;
    }
    fnLoadCarerDetails(value) {
        this.objCarerInfo = null;
        this.objSecondCarerInfo = null;
        if (value != "") {
            this.lstCarerForPlacement.forEach(item => {
                if (item.CarerParentId == value && item.CarerTypeId == 1) {
                    this.objCarerInfo = item;
                    this.fnShowImage(this.objCarerInfo.CarerInfo.PersonalInfo.ImageId,"FirstCarer");
                }
            }
            );
            this.lstCarerForPlacement.forEach(item => {
                if (item.CarerParentId == value && item.CarerTypeId == 2) {
                    this.objSecondCarerInfo = item;
                    this.fnShowImage(this.objSecondCarerInfo.CarerInfo.PersonalInfo.ImageId,"SecondCarer");
                }
            });
            this.fnLoadAgencySocialWorker(this.objCarerInfo.CarerParentId);
        }
    }
    fnLoadAgencySocialWorker(CarerParentId)
    {
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
        this.objSecondCarerInfoTransfer = null;
        this.objCarerInfoTransfer = null;
        this.objSecondCarerInfo = null;
        if (value != "") {
            if(this.objChildProfileTransfer.PlacementStartTypeId!=4)
            {
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
        else
        {
            this.lstApprovedCarerInfo.forEach(item => {
                if (item.CarerParentId == value && item.CarerTypeId == 1) {
                    this.objCarerInfoTransfer = item;
                    this.fnShowImage(this.objCarerInfoTransfer.CarerInfo.PersonalInfo.ImageId, "TrnFirstCarer");
                }
            }
            );
            this.lstApprovedCarerInfo.forEach(item => {
                if (item.CarerParentId == value && item.CarerTypeId == 2) {
                    this.objSecondCarerInfoTransfer = item;
                    this.fnShowImage(this.objSecondCarerInfoTransfer.CarerInfo.PersonalInfo.ImageId, "TrnSecondCarer");
                }
            });
        }
        }
    }
    public next() {
        this.submittedCNC = true;
        let submittedCPM = this.submittedCPM;
        let childNCarer = this.childNCarerForm;
        let childPlacement = this.childPlacementForm;
        let notification = this.notificationForm;
        let lstSibling = this.lstSibling;
        let lstSiblingCategory = this.lstSiblingCategory;
        let lstParents = this.lstParents;
        let lstParentCategory = this.lstParentCategory;
        let objChildPlacementDTO = this.objChildPlacementDTO;
        if (this.steps[this.steps.length - 1].active)
            return false;
        this.steps.some(function (step, index, steps) {
            if (index < steps.length - 1) {
                if (step.active) {

                    if (step.name == 'Child & Carer Information') {
                        submittedCPM = true;
                        if (childNCarer.valid) {
                            step.active = false;
                            step.valid = true;
                            steps[index + 1].active = true;
                            for (let item of lstSibling)
                            {
                                if (item.IsActive)
                                {
                                    //checck validation for duplicate
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

                    if (step.name == 'Placement Information') {

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
    siblingCheck = false; parentCheck = false;
    fnShowSibling(value)
    {
        this.test1 = null;
        if (value) {
            this.showSiblingeTable = true;
            this.showParentTable = false;
            this.siblingCheck = true;
            this.parentCheck = false;
            this.objCarerInfo = "";
            this.lstCarerForPlacement = this.lstCarerInfo.filter(item => item.CarerInfo.IsSiblingAcceptable == 1);
        }
        else
        {
            this.showSiblingeTable = false;
            this.showParentTable = false;
            this.siblingCheck = false;
            this.objCarerInfo = "";
            this.lstCarerForPlacement = this.lstCarerInfo.filter(item => item.CarerInfo.ApprovedGender == this.objChildProfile.PersonalInfo.GenderId
                || item.CarerInfo.ApprovedGender == 3);

        }
    }
    fnShowParents(value) {
        if (value) {
            this.showParentTable = true;
            this.showSiblingeTable = false;
            this.siblingCheck = false;
            this.parentCheck = true;
        }
        else
        {
            this.showParentTable = false;
            this.showSiblingeTable = false;
            //this.siblingCheck = true;
            this.parentCheck = false;
        }
    }
    fnShowSiblingTrans(value) {
        if (value) {
            this.showSiblingeTableTrans = true;
            this.showParentTableTrans = false;
            this.siblingCheck = true;
            this.parentCheck = false;
        }
        else
        {
            this.showSiblingeTableTrans = false;
            this.showParentTableTrans = false;
            this.siblingCheck = false;
        }
    }
    fnShowParentsTrans(value) {
        if (value) {
            this.showSiblingeTableTrans = false;
            this.showParentTableTrans = true;
            this.siblingCheck = false;
            this.parentCheck = true;
        }
        else
        {
            this.showSiblingeTableTrans = false;
            this.showParentTableTrans = false;
            this.parentCheck = false;
        }
    }
    fnTransfer(AddtionalEmailIds, EmailIds) {

        this.submittedTrnsCNC = true;
        if (this.childTransferForm.valid) {
            this.isLoadingTransfer = true;

            this.arrChildPlacementDTO = [];
            this.objChildPlacementDTO.NotificationEmailIds = EmailIds;
            this.objChildPlacementDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.objChildPlacementDTO.AgencyProfileId = this.AgencyProfileId;
            this.objChildPlacementDTO.ChildPlacementId = this.objPlacementInfo.ChildPlacementId,
            this.objChildPlacementDTO.ChildId = this.objPlacementInfo.ChildId;
            this.objChildPlacementDTO.PlacementCategoryId = this.objPlacementInfo.PlacementCategoryId;
            this.objChildPlacementDTO.CarerParentId = this.objCarerInfoTransfer.CarerParentId;
            if(this.objChildProfileTransfer.PlacementStartTypeId!=4)
                this.objChildPlacementDTO.PlacementStartTypeId = 3;
            else
                this.objChildPlacementDTO.PlacementStartTypeId = 4;
            this.objChildPlacementDTO.OldPlacementId = this.objPlacementInfo.ChildPlacementId;
            this.objChildPlacementDTO.VacancyId = this.objPlacementInfo.VacancyId;
            this.objChildPlacementDTO.LocalAuthorityId = this.objPlacementInfo.LocalAuthorityId;
            this.objChildPlacementDTO.AgencySocialWorkerId = this.objPlacementInfo.AgencySocialWorkerId;
            this.objChildPlacementDTO.PlacementTypeId = this.objPlacementInfo.PlacementTypeId;
            this.arrChildPlacementDTO.push(this.objChildPlacementDTO);

            //console.log(this.objChildPlacementDTO);
            if (this.lstSiblingTrans.length > 0) {
                for (let item of this.lstSiblingTrans) {
                    if (item.IsActive == true) {
                        let objChildPlacement = new ChildPlacementNewDTO();
                        objChildPlacement.AgencyProfileId = this.AgencyProfileId;
                        objChildPlacement.PlacementDate = this.modal.GetDateTimeSaveFormat(this.objChildPlacementDTO.PlacementDate);
                        objChildPlacement.ChildPlacementId = item.ChildPlacementId,
                        objChildPlacement.OldPlacementId = this.objPlacementInfo.ChildPlacementId;
                        objChildPlacement.ChildId = item.ChildId;
                        objChildPlacement.PlacementCategoryId = this.objPlacementInfo.PlacementCategoryId;
                        objChildPlacement.CarerParentId = this.objCarerInfoTransfer.CarerParentId;
                        if(this.objChildProfileTransfer.PlacementStartTypeId!=4)
                            objChildPlacement.PlacementStartTypeId = 3;
                        else
                            this.objChildPlacementDTO.PlacementStartTypeId = 4;
                        objChildPlacement.VacancyId = this.objPlacementInfo.VacancyId;
                        objChildPlacement.LocalAuthorityId = this.objPlacementInfo.LocalAuthorityId;
                        objChildPlacement.AgencySocialWorkerId = this.objPlacementInfo.AgencySocialWorkerId;
                        objChildPlacement.PlacementTypeId = this.objPlacementInfo.PlacementTypeId;
                        this.arrChildPlacementDTO.push(objChildPlacement);
                    }
                }
            }
            if (this.lstParentsTrans.length > 0) {
                for (let item of this.lstParentsTrans) {
                    if (item.IsActive == true) {
                        let objChildPlacement = new ChildPlacementNewDTO();
                        objChildPlacement.AgencyProfileId = this.AgencyProfileId;
                        objChildPlacement.OldPlacementId = this.objPlacementInfo.ChildPlacementId;
                        objChildPlacement.PlacementDate = this.modal.GetDateTimeSaveFormat(this.objChildPlacementDTO.PlacementDate);
                        objChildPlacement.ChildPlacementId = item.ChildPlacementId,
                        objChildPlacement.ChildId = item.ChildId;
                        objChildPlacement.PlacementCategoryId = this.objPlacementInfo.PlacementCategoryId;
                        objChildPlacement.CarerParentId = this.objCarerInfoTransfer.CarerParentId;
                        if(this.objChildProfileTransfer.PlacementStartTypeId!=4)
                            objChildPlacement.PlacementStartTypeId = 3;
                        else
                            this.objChildPlacementDTO.PlacementStartTypeId = 4;
                        objChildPlacement.VacancyId = this.objPlacementInfo.VacancyId;
                        objChildPlacement.LocalAuthorityId = this.objPlacementInfo.LocalAuthorityId;
                        objChildPlacement.AgencySocialWorkerId = this.objPlacementInfo.AgencySocialWorkerId;
                        objChildPlacement.PlacementTypeId = this.objPlacementInfo.PlacementTypeId;
                        this.arrChildPlacementDTO.push(objChildPlacement);
                    }
                }
            }
            this.objChildPlacementDTO.PlacementDate = this.modal.GetDateTimeSaveFormat(this.objChildPlacementDTO.PlacementDate);
            //console.log(this.arrChildPlacementDTO);
            this.apiService.post("ChildPlacement", "ChildTransfer", this.arrChildPlacementDTO).then(data => this.ResponeTransfer(data));
        }

    }
    ApprovedGender = 0; Age = 0; Ethinicity = 0; Religion = 0; Disability = 0;ImmigrationStatus = 0;
    fnFilterCarer(checked,value)
    {

        if (value == "0")
        {
            if (checked)
                this.Age = 1;
            else
                this.Age = 0;
        }
        if (value == "1") {
            if (checked)
                this.ApprovedGender = 1;
            else
                this.ApprovedGender = 0;
        }
        if (value == "2") {
            if (checked)
                this.Ethinicity = 1;
            else
                this.Ethinicity = 0;
        }
        if (value == "3") {
            if (checked)
                this.Religion = 1;
            else
                this.Religion = 0;
        }
        if (value == "4") {
            if (checked)
                this.Disability = 1;
            else
                this.Disability = 0;
        }
        if (value == "5") {
            if (checked)
                this.ImmigrationStatus = 1;
            else
                this.ImmigrationStatus = 0;
        }
        this.lstCarerForPlacement = this.lstCarerInfo.filter(item =>
            (this.ApprovedGender == 0 || (item.CarerInfo.ApprovedGender == this.objChildProfile.PersonalInfo.GenderId
                || item.CarerInfo.ApprovedGender == 3))
            && (this.Age == 0 || (item.CarerInfo.AgeRangeMin <= this.objChildProfile.PersonalInfo.Age
                && item.CarerInfo.AgeRangeMax > this.objChildProfile.PersonalInfo.Age))
            && (this.Ethinicity == 0 || this.fnCheckValue(item.CarerInfo.EthinicityIds, this.objChildProfile.EthinicityId))
            && (this.Religion == 0 || this.fnCheckValue(item.CarerInfo.ReligionIds, this.objChildProfile.ReligionId))
            && (this.Disability == 0 || this.fnCheckDisablility(item.CarerInfo.DisabilityIds, this.objChildProfile.DisabilityStrIds))
            && (this.ImmigrationStatus == 0 || this.fnCheckValue(item.CarerInfo.ImmigrationStatusIds, this.objChildProfile.ImmigrationStatusId))
        );
    }
    fnCheckDisablility(arrString, value): boolean {
        var result = false;
        if (arrString != null && value != null) {
            var arr = arrString.split(',');
            var valArr = value.split(',');
            valArr.forEach(itm => {
                arr.forEach(item => {
                    if (item == itm)
                        result = true;
                });
            });
        }
        return result;
    }
    fnCheckValue(arrString,value): boolean
    {
        var result = false;
        if (arrString != null) {
            var arr = arrString.split(',');
            arr.forEach(item => {
                if (item == value)
                    result = true;
            });
        }
        return result;
    }

}
