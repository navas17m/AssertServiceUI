import { filter } from 'rxjs/operators';
import { Component, Input, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Common } from '../common';
import { ConfigTableNames } from '../configtablenames';
import { PagesComponent } from '../pages.component';
import { CarerFamilyInfo } from '../recruitment/DTO/carerfamilyinfo';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import { ContactValidator } from '../validator/contact.validator';
declare var $: any;
import { AgencyKeyNameValueCnfgDTO } from '../superadmin/DTO/agencykeynamecnfgdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'Familyinfo',
    templateUrl: './family.component.template.html',
})

export class FamilyComponet {
    public returnVal:any[];
    controllerName = "CarerFamilyInfo";
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objFamilyDTO: CarerFamilyInfo = new CarerFamilyInfo();
    IsSchoolNameVisible = false;
    objCarerFamilyList = [];
    carerParentId;
    submitted = false;
    ethinicityList = [];
    religionList = [];
    familyId;
    relationList;
    inscarerId;
    isEdit = false;
    @Input()
    set CarerId(id: number) {
        this.inscarerId = id
        this.BindFamilyList(id);
    }
    AllowInsert = false;
    @Input()
    set IsAllowInsert(input) {
        this.AllowInsert = input;
    }
    @Input() formName:string;
    //validators
    _Form: FormGroup;
    agencyId;
    cID; objQeryVal;
    FormCnfgId;
    isLoading: boolean = false;
    IsStayingPut:boolean=false;
    elem:any;
    @ViewChild('Relationship') ngSelectElem:NgSelectComponent;
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    relationLst=[
      {'CofigTableValuesId':33304,'Value':'SON'},
      {'CofigTableValuesId':33305,'Value':'DAUGHTER'}];
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(_formBuilder: FormBuilder,
        private _router: Router,
        private activatedroute: ActivatedRoute, private pComponent: PagesComponent, private apiService: APICallService) {

        this.cID = this.inscarerId;
        this.objFamilyDTO.IsChecksRequired = false;
        this.objFamilyDTO.IsLivingAtHome = false;
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.agencyId = Common.GetSession("AgencyProfileId");
        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 8]);
        }

        if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 8]);
        }

        this.FormCnfgId = 31;
        if (this.objQeryVal.mid == 3)
            this.FormCnfgId = 51;

        this.objConfigTableNamesDTO.AgencyProfileId = this.agencyId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.RelationshipType;
        //ctvServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.relationList = data; })
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.relationList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Ethnicity;
        //  ctvServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.ethinicityList = data; });
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.ethinicityList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Religion;
        /// ctvServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.religionList = data; });
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.religionList = data; });

        this._Form = _formBuilder.group({
            FirstName: ['', [Validators.required]],
            MiddleName: [''],
            lastName: ['', [Validators.required]],
            DateOfBirth: [''],
            RelationshipId: ['0', Validators.required],
            TelePhoneNumber: [''],//, [ContactValidator.validatePhoneNumber]
            EmailId:[''],
            PreviousName: [''],
            SchoolNameAndAddress: [''],
            IsLivingAtHome: [''],
            hdnFamilyId: [''],
            EthinicityId: ['0'],
            ReligionId: ['0'],
            Address: [],
            IsChecksRequired: [],
            IsOtherFamilyMember:[]
        })

        //Get Set Are Checks Required
        this.objAgencyKeyNameValueCnfgDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 20;
        this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
            if(data)
            {
                this.objAgencyKeyNameValueCnfgDTO = data;
                if(this.objAgencyKeyNameValueCnfgDTO.Value!=null && this.objAgencyKeyNameValueCnfgDTO.Value=="1")
                {
                    this.objFamilyDTO.IsChecksRequired=true;
                }
            }
        });
    }

    insCarerDetails;
    BindFamilyList(id) {
        if (this.objQeryVal.mid == 3 && (id == 0 || id == null || id == '')) {
            if (Common.GetSession("SelectedCarerProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
                id = this.insCarerDetails.CarerId;
            }
        }
        else if (this.objQeryVal.mid == 13 && (id == 0 ||id == null || id == '')) {
            if (Common.GetSession("SelectedApplicantProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
                id = this.insCarerDetails.CarerId;
            }
        }
        this.inscarerId = id;
        if (id != null) {
            if(this.formName != 'ApplicationFormNew')
              this.apiService.get(this.controllerName, "GetAll", id).then(data => { this.objCarerFamilyList = data;});
            else if (this.formName == 'ApplicationFormNew')
              this.apiService.get(this.controllerName, "GetAll", id).then(data =>
            { this.objCarerFamilyList = data.filter(item => item.RelationshipName == "SON" || item.RelationshipName == "DAUGHTER");
             });
        }
    }

    fnChangeRelationship(rID) {
        let relationName = this.relationList.find((item: any) => item.CofigTableValuesId == rID).Value;
        if (relationName.toLowerCase() == "daughter" || relationName.toLowerCase() == "son")
            this.IsSchoolNameVisible = true;
        else
            this.IsSchoolNameVisible = false;
        if(relationName.toLowerCase()=="staying put young person")
            this.IsStayingPut=true;
        else
            this.IsStayingPut=false;
    }

    SubmitCancel() {
        //this.objFamilyDTO.PersonalInfo.FirstName = "";
        //this.objFamilyDTO.PersonalInfo.MiddleName = "";
        //this.objFamilyDTO.PersonalInfo.lastName = null;
        //this.objFamilyDTO.PersonalInfo.DateOfBirth = null;
        //this.objFamilyDTO.RelationshipId = 0;
        //this.objFamilyDTO.EthinicityId = 0;
        //this.objFamilyDTO.ReligionId = 0;
        //this.objFamilyDTO.TelePhoneNumber = null;
        //this.objFamilyDTO.SchoolNameAndAddress = null;
        //this.objFamilyDTO.IsChecksRequired = null;
        //this.objFamilyDTO.IsLivingAtHome = null;
        //this.objFamilyDTO.ContactInfo.AddressLine1 = null;
        //this.objFamilyDTO.CarerFamilyInfoId = 0;
        this.isEdit = false;
        this.submitted = false;
        this.ViewFalse();
        this.IsView = false;
        this.objFamilyDTO = new CarerFamilyInfo();
        this.IsStayingPut=false;
    }


    private EditData(item, id) {
        this.isEdit = true;
        this.CopyProperty(item, this.objFamilyDTO);
    }

    private CopyProperty(souerce: CarerFamilyInfo, target: CarerFamilyInfo) {
        target.PersonalInfo.PersonalInfoId = souerce.PersonalInfo.PersonalInfoId;
        target.PersonalInfo.FirstName = souerce.PersonalInfo.FirstName;
        target.PersonalInfo.MiddleName = souerce.PersonalInfo.MiddleName;
        target.PersonalInfo.lastName = souerce.PersonalInfo.lastName;
        target.PersonalInfo.DateOfBirth = souerce.PersonalInfo.DateOfBirth;
        target.ContactInfo.AddressLine1 = souerce.ContactInfo.AddressLine1;
        target.ContactInfo.ContactInfoId = souerce.ContactInfo.ContactInfoId;
        target.RelationshipId = souerce.RelationshipId;
        target.EthinicityId = souerce.EthinicityId;
        target.ReligionId = souerce.ReligionId;
        target.TelePhoneNumber = souerce.TelePhoneNumber;
        target.EmailId = souerce.EmailId;
        target.SchoolNameAndAddress = souerce.SchoolNameAndAddress;
        target.IsChecksRequired = souerce.IsChecksRequired;
        target.IsLivingAtHome = souerce.IsLivingAtHome;
        target.CarerFamilyInfoId = souerce.CarerFamilyInfoId;
        target.IsOtherFamilyMember = souerce.IsOtherFamilyMember;
       this.setDate(souerce);
        this.fnChangeRelationship(souerce.RelationshipId)
    }

    setDate(data) {
        this.objFamilyDTO.PersonalInfo.DateOfBirth = this.pComponent.GetDateEditFormat(this.objFamilyDTO.PersonalInfo.DateOfBirth);
    }

    Submitfamilyinfo(_Form) {
        this.submitted = true;
        if(this.ngSelectElem.hasValue==false)
            this.elem=this.ngSelectElem;
        if (_Form.valid) {
            this.isLoading = true;
            let type = "save"
            if (this.isEdit)
                type = "update";

            if (this.objQeryVal.mid == 3) {
                this.carerParentId = Common.GetSession("ACarerParentId");
            } else if (this.objQeryVal.mid == 13) {
                this.carerParentId = Common.GetSession("CarerParentId");
            }
            //this.carerParentId = Common.GetSession("CarerParentId");
            //   this.carerId = Common.GetSession("CarerId");
            this.objFamilyDTO.PersonalInfo.DateOfBirth = this.pComponent.GetDateSaveFormat(this.objFamilyDTO.PersonalInfo.DateOfBirth);
            this.objFamilyDTO.CarerId = this.inscarerId;
            this.objFamilyDTO.CarerParentId = this.carerParentId;
            // console.log(this.objFamilyDTO);
            // this.familyServices.post(this.objFamilyDTO, type).then(data => this.Respone(data, type));
            this.apiService.save(this.controllerName, this.objFamilyDTO, type).then(data => this.Respone(data, type,this.objFamilyDTO.CarerFamilyInfoId));
            this.isEdit = false;
        } else
            this.pComponent.GetErrorFocus(_Form,this.elem);

    }

    DeleteFamily(id: number) {

        // this.familyServices.post(id, "delete").then(data => this.Respone(data, "delete"));
       // console.log(id);
        this.apiService.delete(this.controllerName, id).then(data => this.Respone(data, "delete",id));
    }

    private Respone(data, type, id?) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = id;
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.carerParentId;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            }
            else if (type == "update") {
                this.pComponent.alertSuccess(Common.GetUpdateSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = id;
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.carerParentId;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            }
            else if (type == "delete") {
                this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId = 3;
                this.objUserAuditDetailDTO.RecordNo = id;
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.carerParentId;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            }
            this.BindFamilyList(this.inscarerId);
            this.SubmitCancel();
            this.submitted = false;
            this.objFamilyDTO = new CarerFamilyInfo();
            this.objFamilyDTO.IsChecksRequired = false;
            this.objFamilyDTO.IsLivingAtHome = false;
            this.objFamilyDTO.PersonalInfo.DateOfBirth = null;

        }
    }


    IsView = false;
    ViewData(item, id) {
      this.objUserAuditDetailDTO.ActionId = 5;
      this.objUserAuditDetailDTO.RecordNo = item.CarerFamilyInfoId;
      this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
      this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
      this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
      this.objUserAuditDetailDTO.ChildCarerEmpId = this.carerParentId;
      Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        this.submitted = false;
        this.EditData(item, id);
        this.IsView = true;

        setTimeout(function () {
            var $input = $('#btnSubmit,input[type="text"],input[type="checkbox"],input[type="date"],input[type="datetime-local"],input[type="time"],input[type="radio"],input[type="number"],input[type="file"],button,Checkboxlist,select,select option,textarea');
            $input.attr("disabled", true);
        }.bind(this), 0);


        setTimeout(function () {
            var $input = $('#btnSubmit,input[type="text"],input[type="checkbox"],input[type="date"],input[type="datetime"],input[type="datetime-local"],input[type="time"],input[type="radio"],input[type="number"],input[type="file"],button,Checkboxlist,select,select option,textarea');
            $input.attr("disabled", true);
            var $input = $('ViewButton,#btnReset');
            $input.removeAttr("disabled");
        }.bind(this), 0);


    }

    ViewFalse() {

        setTimeout(function () {
            var $input = $('#btnSubmit,input[type="text"],input[type="checkbox"],input[type="date"],input[type="datetime-local"],input[type="time"],input[type="radio"],input[type="number"],input[type="file"],button,Checkboxlist,select,select option,textarea');
            $input.removeAttr("disabled");
        }.bind(this), 0);
    }
}
