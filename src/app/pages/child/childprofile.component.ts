import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ChildProfile } from './DTO/childprofile'
import {Common, deepCopy, CompareStaticValue}  from  '../common'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ConfigTableNames } from '../configtablenames';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablenames';
import {  PersonalInfoVisible} from '../personalinfo/personalinfo';
import {PagesComponent}  from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { unitsDesc } from 'fullcalendar';

@Component({
    selector: 'childprofile',
    templateUrl: './childprofile.component.template.html',
//     styles: [
//         `[required]  {
//             border-left: 5px solid blue;
//         }

//    .ng-valid[required], .ng-valid.required  {
//             border-left: 5px solid #42A948;
//     }
//    label + .ng-invalid:not(form)  {
//         border-left: 5px solid #a94442;
//     }`]
})

export class ChildProfileComponet {
    @ViewChild('ddHasSibling') ddHasSibling;
    //@ViewChild('ddHasParent',{static:false}) ddHasParent;
    MandatoryAlert; submitted = false; isParentNChild: boolean = false;
    objChildProfile: ChildProfile = new ChildProfile();
    objChildProfileOG: ChildProfile = new ChildProfile();
    ChildProfileProfileId; _childProfile: FormGroup;
    formNFA: FormGroup; areaOfficeList;
    localAuthorityList; ethinicityList; OfstedEthnicityList
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    submittedNFA = false; yesNoNotKnown; childGeography = []; nFAReason; objQeryVal; SequenceNo;
    arrayChildList = []; arrayParentList = []; lstChildListForDD;
    objPersonalInfoVisible: PersonalInfoVisible = new PersonalInfoVisible();
    AgencyProfileId: number; IsChildCodeVisible = false; SaveText = "Save"; IsShowNFA = true;
    isLoading: boolean = false; controllerName = "ChildProfile";
    @ViewChild('LAElement') LAElement:NgSelectComponent;
    hasParent: boolean =false;
    siblingIds;
    constructor(private apiService: APICallService, private route: ActivatedRoute,
        private _formBuilder: FormBuilder, private _router: Router, private model: PagesComponent,
        private renderer: Renderer2, private _eRef: ElementRef) {


        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.ChildProfileProfileId = Common.GetSession("ReferralChildId");
        this.route.params.subscribe(data => {
            this.objQeryVal = data;
            this.SequenceNo = this.objQeryVal.Id;
            this.fnLoadChild(this.route.snapshot.data['getchilds']);

            this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
            this.objConfigTableNamesDTO.Name = ConfigTableNames.ChildGeography;
            this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => {
                this.childGeography = data;
                if (this.SequenceNo > 0) {
                    if (Common.GetSession("ReferralChildId") == null || Common.GetSession("ReferralChildId") == "null") {
                        Common.SetSession("UrlReferral", "pages/referral/quickreferral/1/16");
                        this._router.navigate(['/pages/referral/childprofilelist/0/16']);
                    }
                    if (this.ChildProfileProfileId != null && this.ChildProfileProfileId != "null") {
                        this.IsChildCodeVisible = true;
                        this.SaveText = "Save Changes";

                        this.apiService.get(this.controllerName, "GetById", this.ChildProfileProfileId).then(data => {
                            this.objChildProfile = data;

                            this.fnChangeChildGeography(this.objChildProfile.GeographicalId);
                            if (this.objChildProfile.ChildStatusId != 18)
                                this.IsShowNFA = false;
                            if (this.objChildProfile.ChildStatusId == 17)
                                this.objChildProfile.NoFurtherAction = true;
                            //this.ddHasSibling.optionsModel = this.objChildProfile.SiblingIds;
                            this.siblingIds = this.arrayChildList.filter(item => this.objChildProfile.SiblingIds.indexOf(item.id) !== -1);
                            //this.ddHasParent.optionsModel = this.objChildProfile.ParentIds;
                            if (this.objChildProfile.SiblingIds.length > 0) {
                                this.objChildProfile.HasChildSiblings = true
                            }
                            if (this.objChildProfile.ParentIds.length > 0) {
                                this.objChildProfile.HasChildParents = true
                            }
                            if (this.objChildProfile.ChildOrParentId == 2) {
                                this.isParentNChild = true;

                            }
                            this.objChildProfileOG = deepCopy<any>(this.objChildProfile);
                            this.setChangeDate();
                        });
                    }
                }
            });
            this.fnLoadDropDowns();
            this.objChildProfile.AgencyProfileId = this.AgencyProfileId;
            //this.objChildProfile.ChildStatusId = 18;
        });
    }
    fnChangeChildNParent(value) {
        if (value == 2)
            this.isParentNChild = true;
        else
            this.isParentNChild = false;
    }
    dateString;
    setChangeDate() {
        this.objChildProfile.ParentDateOfBirth = this.model.GetDateEditFormat(this.objChildProfile.ParentDateOfBirth);
        this.objChildProfile.ParentDateOfBirth2 = this.model.GetDateEditFormat(this.objChildProfile.ParentDateOfBirth2);
        this.objChildProfile.LANotifiedDate = this.model.GetDateEditFormat(this.objChildProfile.LANotifiedDate);
        this.objChildProfile.ReferralDate = this.model.GetDateEditFormat(this.objChildProfile.ReferralDate);
        this.objChildProfile.NFADate = this.model.GetDateEditFormat(this.objChildProfile.NFADate);
    }
    fnLoadChild(data) {
        //Multiselect dropdown array forming code.
        if (data) {
            data.forEach(item => {
                if (this.ChildProfileProfileId != item.ChildId && item.ChildOrParentId == 1) {
                    this.arrayChildList.push({ id: item.ChildId, name: item.PersonalInfo.FullName + "(" + item.ChildCode + ")" });
                }
                if(item.ChildOrParentId == 3)
                this.hasParent=true;
                //else if (this.ChildProfileProfileId != item.ChildId && item.ChildOrParentId == 2)
                //    this.arrayParentList.push({ id: item.ChildId, name: item.PersonalInfo.FullName + "(" + item.ChildCode + ")" });
            });
            if(Common.GetSession("ChildOrParentId")=="3")
            {
                data.forEach(item => {
                    if (this.ChildProfileProfileId != item.ChildId && item.ChildOrParentId == 1) {
                        this.arrayParentList.push({ id: item.ChildId, name: item.PersonalInfo.FullName + " (" + item.ChildCode + ")" });
                    }
                });
            }
            else
            {
                data.forEach(item => {
                    if (this.ChildProfileProfileId != item.ChildId && item.ChildOrParentId == 3) {
                        this.arrayParentList.push({ id: item.ChildId, name: item.PersonalInfo.FullName + " (" + item.ChildCode + ")" });
                    }
                });
            }
        }
    }
    private _getInputElement(nativeElement: any): any {
        if ((nativeElement.localName === 'select' || nativeElement.localName === 'input') && !nativeElement.hidden) return nativeElement;

        let input;

        [].slice.call(nativeElement.children).every(c => {
            input = this._getInputElement(c);
            if (input) return false; // break
            return true; // continue!
        });

        return input;
    }
    //btn Submit
    $calendar: any;
    isValid = true;
    isDirty = true;
    IsNewOrSubmited = 1;//New=1 and Submited=2
    btnSave(ddHasSibling, piFormbuilder): void {
        this.submitted = true;
        if (this.objChildProfile.NoFurtherAction) {
            this.submittedNFA = true;
        }
        else
            this.submittedNFA = false;
        if (!this._childProfile.valid) {
            if(this.LAElement.hasValue == true)
                this.model.GetErrorFocus(this._childProfile);
            else
                this.model.GetErrorFocus(this._childProfile,this.LAElement);
        } else if (!piFormbuilder.valid) {
            this.model.GetErrorFocus(piFormbuilder);
        }
        if (this.isParentNChild && (this.objChildProfile.ParentName == null || this.objChildProfile.ParentName == ""))
            this.isValid = false;
        else
            this.isValid = true;

        if (this._childProfile.valid && piFormbuilder.valid && this.isValid) {
            this.isLoading = true;
            let type = "save";
            if (this.SequenceNo > 0) {
                type = "update";
                if (this.objChildProfile.NoFurtherAction)
                    this.objChildProfile.ChildStatusId = 17;
            }
            else {
                if (!this.objChildProfile.NoFurtherAction)
                    this.objChildProfile.ChildStatusId = 18;
                else
                    this.objChildProfile.ChildStatusId = 17;
            }
            this.objChildProfile.AgencyProfileId = this.AgencyProfileId;
            if(ddHasSibling!=undefined)
            {
                var res = ddHasSibling.map(item => item.id);
                //this.objChildProfile.SiblingIds = ddHasSibling;
                this.objChildProfile.SiblingIds = res;
                // this.objChildProfile.ParentIds = ddHasParent;
            }
            this.objChildProfile.ParentDateOfBirth = this.model.GetDateSaveFormat(this.objChildProfile.ParentDateOfBirth);
            this.objChildProfile.ParentDateOfBirth2 = this.model.GetDateSaveFormat(this.objChildProfile.ParentDateOfBirth2);
            this.objChildProfile.LANotifiedDate = this.model.GetDateSaveFormat(this.objChildProfile.LANotifiedDate);
            this.objChildProfile.NFADate = this.model.GetDateSaveFormat(this.objChildProfile.NFADate);
            this.objChildProfile.ReferralDate = this.model.GetDateSaveFormat(this.objChildProfile.ReferralDate);
            this.objChildProfile.PersonalInfo.DateOfBirth = this.model.GetDateSaveFormat(this.objChildProfile.PersonalInfo.DateOfBirth);

            this.isDirty = true;
            if (this.ChildProfileProfileId != null && this.ChildProfileProfileId != "null"
                && CompareStaticValue(this.objChildProfile, this.objChildProfileOG)
            ) {
                this.isDirty = false;
            }

            if (this.isDirty) {

                if (this.objChildProfile.NoFurtherAction) {
                    if (this.formNFA.valid) {
                        this.apiService.save(this.controllerName, this.objChildProfile, type).then(data => { this.Respone(data); });
                    }
                    else
                    {
                        this.isLoading = false;
                    }
                }
                else {
                    this.apiService.save(this.controllerName, this.objChildProfile, type).then(data => { this.Respone(data); });
                }
            }
            else {
                this.submitted = false;
                this.isLoading = false;
                this.objChildProfile.ParentDateOfBirth = this.model.GetDateEditFormat(this.objChildProfile.ParentDateOfBirth);
                this.objChildProfile.ParentDateOfBirth2 = this.model.GetDateEditFormat(this.objChildProfile.ParentDateOfBirth2);
                this.objChildProfile.LANotifiedDate = this.model.GetDateEditFormat(this.objChildProfile.LANotifiedDate);
                this.objChildProfile.NFADate = this.model.GetDateEditFormat(this.objChildProfile.NFADate);
                this.objChildProfile.ReferralDate = this.model.GetDateEditFormat(this.objChildProfile.ReferralDate);
                this.objChildProfile.PersonalInfo.DateOfBirth = this.model.GetDateEditFormat(this.objChildProfile.PersonalInfo.DateOfBirth);

                if (this.IsNewOrSubmited == 1)
                    this.model.alertWarning(Common.GetNoChangeAlert);
                else if (this.IsNewOrSubmited == 2)
                    this.model.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
            }
        }
    }

    private Respone(data) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.model.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.model.alertSuccess(Common.GetSaveSuccessfullMsg);
            this.IsNewOrSubmited = 2;
            this.objChildProfileOG = deepCopy<any>(this.objChildProfile);
        }
        this._router.navigate(['/pages/referral/childprofilelist/0/16']);
    }

    ChildPlacingAuthorityVisi = false;
    fnChangeChildGeography(value) {
        //console.log(value);
        //console.log(this.childGeography);
        let data = this.childGeography.filter(x => x.CofigTableValuesId == value);
        //console.log("############3");
        //console.log(data);
        if (data.length > 0 && data[0].Value == "Out of Area") {
            this.ChildPlacingAuthorityVisi = true
        }
        else {
            this.ChildPlacingAuthorityVisi = false;
        }
    }

    fnLoadDropDowns() {
        this.objPersonalInfoVisible.TitleVisible = false;
        this.objPersonalInfoVisible.PreviousNameVisible = false;
        this.apiService.get("AreaOfficeProfile", "getall").then(data => { this.areaOfficeList = data; });
        this.apiService.get("LocalAuthority", "getall", this.AgencyProfileId).then(data => { this.localAuthorityList = data });

        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Ethnicity;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.ethinicityList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.YesNoNotKnown;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.yesNoNotKnown = data; });
        //  this.objConfigTableNamesDTO.Name = ConfigTableNames.ChildGeography;
        //  this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.childGeography = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.NFAReason;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.nFAReason = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.OfstedEthnicity;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.OfstedEthnicityList = data; });

        this._childProfile = this._formBuilder.group({
            AreaOfficeProfileId: [0, Validators.required],
            Ethinicity: ['0', Validators.required],
            ChildInEducation: ['0', Validators.required],
            childGeography: ['0', Validators.required],
            LocalAuthority: ['0', Validators.required],
            HasChildSiblings: [''],
            HasChildParents: [''],
            ddHasChildParent:['0'],
            ChildIdentifier: [''],
            OfstedEtnicity: ['0'],
            ChildOrParent: [''],
            ParentName: [''],
            ParentDOB: [''],
            ParentName2: [''],
            ParentDOB2: [''],
            ChildPlacingAuthorityId: ['0'],
            LANotifiedDate: [''],
            ReferralDate: [''],
            IsOutofHoursPlacement:[],
        });
        this.formNFA = this._formBuilder.group({
            chkNoFurtherAction: [''],
            NFADate: ['', Validators.required],
            NFAReason: ['0', Validators.required],
        });
    }
}
