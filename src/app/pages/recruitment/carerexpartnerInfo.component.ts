import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Common } from '../common';
import { ConfigTableNames } from '../configtablenames';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import { CarerExPartnerInfo } from './DTO/carerexpartnerinfo';
@Component({
    selector: 'CarerExPartnerInfo',
    templateUrl: './carerexpartnerInfo.component.template.html',
//     styles: [`[required]  {
//         border-left: 5px solid blue;
//     }

//     .ng-valid[required], .ng-valid.required  {
//             border-left: 5px solid #42A948; /* green */
// }
//     label + .ng-invalid:not(form)  {
//         border-left: 5px solid #a94442; /* red */
// }`]
})

export class CarerExPartnerinfoComponet {
    public returnVal:any[];
    controllerName = "ChildDayLogJournal";
    insFormCnfgId;
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objCarerExPartnerInfoDTO: CarerExPartnerInfo = new CarerExPartnerInfo();
    objCarerExPartnerInfoList: CarerExPartnerInfo[] = [];
    objCarerExParList: CarerExPartnerInfo[] = [];
    submitted = false;
    ExPartnerInfoId;
    isEdit = false;
    relationList;
    isDirty = false;
    @Input() formName:string;
    @Input()
    set ExPartnerinfo(ExPartner: CarerExPartnerInfo[]) {
        // this.objCarerFamilyInfoList = familyinfos == null ? this.objCarerFamilyInfoList : familyinfos;
        this.FillList(ExPartner);
    }
    get ExPartnerinfo(): CarerExPartnerInfo[] {
        this.objCarerExParList = this.objCarerExPartnerInfoList;
        //   this.objCarerExPartnerInfoList = [];
        return this.objCarerExParList;
    }

    @Input()
    set Dirty(val: boolean) {
        // console.log("valDirty " + val);
        this.isDirty = val;
        if (val == false) {
            this.objCarerExParList.filter(x => x.StatusId == 1).forEach(x => {
                x.StatusId = 4;
            })

        }
    }
    get Dirty(): boolean {
        return this.isDirty;
    }

    @Input()
    set ChangeStatus(Id: number) {
        if (Id != null && Id == 1 && this.objCarerExPartnerInfoList.length > 0) {
            this.objCarerExPartnerInfoList.filter(x => x.StatusId == 1).forEach(item => {
                item.StatusId = 0;
            })
        }

    }

    @Input()
    set FormCnfgId(Id: number) {
        if (Id != null)
            this.deletbtnAccess = this.pComponent.GetDeletAccessPermission(Id);
    }

    //validators
    _Form: FormGroup;
    agencyId;
    deletbtnAccess = false;
    constructor(_formBuilder: FormBuilder, private _http: HttpClient,
        private pComponent: PagesComponent, private apiService: APICallService) {
        this._Form = _formBuilder.group({
            FirstName: [''],
            MiddleName: [''],
            lastName: [''],
            AddressLine1: [''],
            HomePhone: ['', [Validators.minLength(10), Validators.maxLength(20)]],
            RelationshipDurationAndDetail: [],
            RelationshipId: ['0'],
            EmailId:[''],
        })

        this.agencyId = Common.GetSession("AgencyProfileId");
        this.objConfigTableNamesDTO.AgencyProfileId = this.agencyId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.ExPartnerRelationship;
        //    ctvServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.relationList = data; })
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.relationList = data; });
    }

    FillList(ExPartner: CarerExPartnerInfo[]) {
        this.objCarerExPartnerInfoList = [];
        if (ExPartner != null && ExPartner[0] != null) {
            ExPartner.forEach(item => {
                let addExPartner: CarerExPartnerInfo = new CarerExPartnerInfo();
                addExPartner.PersonalInfo.PersonalInfoId = item.PersonalInfo.PersonalInfoId;
                addExPartner.PersonalInfo.FirstName = item.PersonalInfo.FirstName;
                addExPartner.PersonalInfo.MiddleName = item.PersonalInfo.MiddleName;
                addExPartner.PersonalInfo.lastName = item.PersonalInfo.lastName;
                addExPartner.ContactInfo.ContactInfoId = item.ContactInfo.ContactInfoId;
                addExPartner.ContactInfo.AddressLine1 = item.ContactInfo.AddressLine1;
                addExPartner.ContactInfo.HomePhone = item.ContactInfo.HomePhone;
                addExPartner.ContactInfo.EmailId = item.ContactInfo.EmailId;
                addExPartner.RelationshipDurationAndDetail = item.RelationshipDurationAndDetail;
                addExPartner.RelationshipTypeId = item.RelationshipTypeId;
                addExPartner.RelationshipTypeName = item.RelationshipTypeName;
                if (item.StatusId != 3)
                    addExPartner.IsActive = true;
                else
                    addExPartner.IsActive = false;
                addExPartner.StatusId = item.StatusId;
                addExPartner.CarerExPartnerInfoId = item.CarerExPartnerInfoId;
                this.objCarerExPartnerInfoList.push(addExPartner);
            })
        }
    }

    Submitfamilyinfo(_Form) {
        this.submitted = true;
        if (_Form.valid) {
            let addExPartner: CarerExPartnerInfo = new CarerExPartnerInfo();
            addExPartner.PersonalInfo.FirstName = this.objCarerExPartnerInfoDTO.PersonalInfo.FirstName;
            addExPartner.PersonalInfo.MiddleName = this.objCarerExPartnerInfoDTO.PersonalInfo.MiddleName;
            addExPartner.PersonalInfo.lastName = this.objCarerExPartnerInfoDTO.PersonalInfo.lastName;
            addExPartner.ContactInfo.AddressLine1 = this.objCarerExPartnerInfoDTO.ContactInfo.AddressLine1;
            addExPartner.ContactInfo.HomePhone = this.objCarerExPartnerInfoDTO.ContactInfo.HomePhone;
            addExPartner.ContactInfo.EmailId = this.objCarerExPartnerInfoDTO.ContactInfo.EmailId;
            addExPartner.RelationshipDurationAndDetail = this.objCarerExPartnerInfoDTO.RelationshipDurationAndDetail;
            addExPartner.RelationshipTypeId = this.objCarerExPartnerInfoDTO.RelationshipTypeId;
            addExPartner.RelationshipTypeName = this.objCarerExPartnerInfoDTO.RelationshipTypeName;
            addExPartner.StatusId = 1;
            addExPartner.IsActive = true;
            addExPartner.CarerExPartnerInfoId = 0;
            this.objCarerExPartnerInfoList.push(addExPartner);
            this.submitted = false;
            this.SubmitCancel();
            this.isDirty = true;
            //   this.pComponent.alertSuccess('Ex-Partner Details Saved Successfully');
        }
    }

    private EditData(item, id) {
        this.isEdit = true;
        this.CopyProperty(item, this.objCarerExPartnerInfoDTO);
        this.ExPartnerInfoId = id;
    }

    private CopyProperty(souerce: CarerExPartnerInfo, target: CarerExPartnerInfo) {
        target.PersonalInfo.FirstName = souerce.PersonalInfo.FirstName;
        target.PersonalInfo.MiddleName = souerce.PersonalInfo.MiddleName;
        target.PersonalInfo.lastName = souerce.PersonalInfo.lastName;
        target.ContactInfo.AddressLine1 = souerce.ContactInfo.AddressLine1;
        target.ContactInfo.HomePhone = souerce.ContactInfo.HomePhone;
        target.ContactInfo.EmailId = souerce.ContactInfo.EmailId;
        target.RelationshipDurationAndDetail = souerce.RelationshipDurationAndDetail;
        target.RelationshipTypeId = souerce.RelationshipTypeId;
        target.StatusId = 2;
    }


    i = 0;
    private UpdateExPartnerinfo(_Form) {
        this.submitted = true;
        if (_Form.valid) {
            this.i = 0;
            this.objCarerExPartnerInfoList.forEach(item => {
                if (this.i == this.ExPartnerInfoId) {
                    this.CopyProperty(this.objCarerExPartnerInfoDTO, item);
                }
                this.i++;
            });
            this.isDirty = true;
            this.submitted = false;
            //  this.pComponent.alertSuccess('Ex-Partner Details Updated Successfully');
            this.isEdit = false;
            this.SubmitCancel();
        }

    }
    fnSetDirty(val: boolean) {
        this.isDirty = val;
    }
    private DeleteData(item) {
        //  if (confirm(Common.GetDeleteConfirmMsg)) {
        item.StatusId = 3;
        item.IsActive = false;
        this.isDirty = true;
        //  }
    }

    public SubmitCancel() {
        this.isEdit = false;
        this.objCarerExPartnerInfoDTO.PersonalInfo.FirstName = null;
        this.objCarerExPartnerInfoDTO.PersonalInfo.MiddleName = null;
        this.objCarerExPartnerInfoDTO.PersonalInfo.lastName = null;
        this.objCarerExPartnerInfoDTO.ContactInfo.AddressLine1 = null;
        this.objCarerExPartnerInfoDTO.ContactInfo.HomePhone = null;
        this.objCarerExPartnerInfoDTO.ContactInfo.EmailId = null;
        this.objCarerExPartnerInfoDTO.RelationshipDurationAndDetail = null;
        this.objCarerExPartnerInfoDTO.RelationshipTypeId = 0;
    }

    relationChange(va, finfo) {
        const NAME = this.relationList.find((item: any) => item.CofigTableValuesId == va).Value;
        finfo.RelationshipTypeName = NAME;
    }
}
