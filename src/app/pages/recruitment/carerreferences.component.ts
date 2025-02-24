import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerReferenceInfo } from './DTO/carerreferenceinfo';
@Component({
    selector: 'CarerReferences',
    templateUrl: './carerreferences.component.template.html',
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

export class CarerReferencesComponet {
    public returnVal:any[];
    @Output() OnCopyReftoSecondCarer: EventEmitter<any> = new EventEmitter();
    objCarerReferenceInfoDTO: CarerReferenceInfo = new CarerReferenceInfo();
    objCarerReferenceInfoList: CarerReferenceInfo[] = [];
    objCarerRefList: CarerReferenceInfo[] = [];
    submitted = false;
    familyId;
    relationList;
    isEdit = false;
    insIsCopyRefVisibleOrginal = false;
    insIsCopyRefVisible = false;
    isCopy = false;
    deletbtnAccess = false;
    isDirty = false;
    lstReferenceCheckName=[];
    insMemberTypeId;
    @Input()
    set ReferenceInfo(refinfo: CarerReferenceInfo[]) {

        if (refinfo != null) {
            this.FillList(refinfo);
        }
    }
    get ReferenceInfo(): CarerReferenceInfo[] {
        this.objCarerRefList = this.objCarerReferenceInfoList;
        // this.objCarerReferenceInfoList = [];

        return this.objCarerRefList;
    }

    @Input()
    set Dirty(val: boolean) {
        // console.log("valDirty " + val);
        this.isDirty = val;
        if (val == false)
        {
            this.objCarerReferenceInfoList.filter(x => x.StatusId == 1).forEach(x => {
                x.StatusId = 4;
            })

        }
    }
    get Dirty(): boolean {
        return this.isDirty;
    }


    @Input()
    set IsCopyRefVisible(value: boolean) {
        this.insIsCopyRefVisible = value;
        this.insIsCopyRefVisibleOrginal = value;
    }

    @Input()
    set FormCnfgId(Id: number) {
        if (Id != null)
            this.deletbtnAccess = this.pComponent.GetDeletAccessPermission(Id);
    }

    @Input()formName='';

    @Input()
    set MemberTypeId(Id:any) {
        if (Id)
        {
          this.insMemberTypeId=Id;
          this.fnBindReferencesCheckName();
        }
    }


    @Input()
    set FillCopyRefToSecondCarer(value) {
        if (value) {
            // console.log("FillCopyRefToSecondCarer");
            //  // console.log(value.StatusId)
            //  this.objCarerReferenceInfoList.push(value);
            let addReference: CarerReferenceInfo = new CarerReferenceInfo();
            addReference.PersonalInfo.FirstName = value.PersonalInfo.FirstName;
            addReference.PersonalInfo.MiddleName = value.PersonalInfo.MiddleName;
            addReference.PersonalInfo.lastName = value.PersonalInfo.lastName;
            addReference.ContactInfo.AddressLine1 = value.ContactInfo.AddressLine1;
            addReference.ContactInfo.HomePhone = value.ContactInfo.HomePhone;
            addReference.ContactInfo.EmailId = value.ContactInfo.EmailId;
            addReference.StatusId = 1;
            addReference.IsActive = true;
            addReference.CarerReferenceInfoId = 0;
          //  addReference.ComplianceCheckId=value.ComplianceCheckId;
           // console.log("copy");
           // console.log(value.ComplianceCheckName);
            let checkName=this.lstReferenceCheckName.filter(x=>x.CheckName==value.ComplianceCheckName);
            if(checkName.length>0)
            {
              //  console.log(checkName);
                addReference.ComplianceCheckId=checkName[0].CheckTypeId;
            }
          //  console.log(addReference);
            this.objCarerReferenceInfoList.push(addReference);
        }
    }

    @Input()
    set ChangeStatus(Id: number) {
        if (Id != null && Id == 1 && this.objCarerReferenceInfoList.length > 0) {
            this.objCarerReferenceInfoList.filter(x => x.StatusId == 1).forEach(item => {
                item.StatusId = 0;
            })
        }

    }

    FillList(refinfo: CarerReferenceInfo[]) {
        //  alert(1);
        this.objCarerReferenceInfoList = [];
        if (refinfo != null && refinfo[0] != null) {
            refinfo.forEach(item => {
                let addReference: CarerReferenceInfo = new CarerReferenceInfo();
                addReference.PersonalInfo.PersonalInfoId = item.PersonalInfo.PersonalInfoId;
                addReference.PersonalInfo.FirstName = item.PersonalInfo.FirstName;
                addReference.PersonalInfo.MiddleName = item.PersonalInfo.MiddleName;
                addReference.PersonalInfo.lastName = item.PersonalInfo.lastName;
                addReference.ContactInfo.ContactInfoId = item.ContactInfo.ContactInfoId;
                addReference.ContactInfo.AddressLine1 = item.ContactInfo.AddressLine1;
                addReference.ContactInfo.HomePhone = item.ContactInfo.HomePhone;
                addReference.ContactInfo.EmailId = item.ContactInfo.EmailId;
                if (item.StatusId != 3)
                    addReference.IsActive = true;
                else
                    addReference.IsActive = false;
                addReference.StatusId = item.StatusId;
                addReference.CarerReferenceInfoId = item.CarerReferenceInfoId;
                addReference.ComplianceCheckId=item.ComplianceCheckId;
                addReference.GivingWrittenComments= item.GivingWrittenComments;
                this.objCarerReferenceInfoList.push(addReference);
            });
        }

    }

    fnSetDirty(val: boolean) {
        this.isDirty = val;
        //  console.log("111 " + this.isDirty);
    }
    //validators
    _Form: FormGroup;
    agencyId;
    constructor(_formBuilder: FormBuilder, private _http: HttpClient, private pComponent: PagesComponent, private apiService: APICallService) {
        this._Form = _formBuilder.group({
            FirstName: ['', [Validators.required]],
            MiddleName: [''],
            lastName: ['', [Validators.required]],
            AddressLine1: [''],
            HomePhone: ['', [Validators.minLength(10), Validators.maxLength(20)]],
            isCopy: [],
            EmailId: ['',Validators.email],
            ComplianceCheckId:['0'],
            GivingWrittenComments:[]
        })



        //GetReferencesCheckName
    }

    fnBindReferencesCheckName()
    {
        this.apiService.get("CarerInfo", "GetReferencesCheckName", this.insMemberTypeId).then(data => {
            this.lstReferenceCheckName=data;
        });

    }

    Submitfamilyinfo(finfo, _Form) {
        this.submitted = true;
        if (_Form.valid) {
            let addReference: CarerReferenceInfo = new CarerReferenceInfo();
            addReference.PersonalInfo.FirstName = finfo.PersonalInfo.FirstName;
            addReference.PersonalInfo.MiddleName = finfo.PersonalInfo.MiddleName;
            addReference.PersonalInfo.lastName = finfo.PersonalInfo.lastName;
            addReference.ContactInfo.AddressLine1 = finfo.ContactInfo.AddressLine1;
            addReference.ContactInfo.HomePhone = finfo.ContactInfo.HomePhone;
            addReference.ContactInfo.EmailId = finfo.ContactInfo.EmailId;
            addReference.GivingWrittenComments = finfo.GivingWrittenComments;
            addReference.StatusId = 1;
            addReference.IsActive = true;
            addReference.CarerReferenceInfoId = 0;
            addReference.IsCopyRefToSecondCarer = false;
            addReference.ComplianceCheckId=finfo.ComplianceCheckId;
            this.objCarerReferenceInfoList.push(addReference);
            this.isDirty = true;
            this.submitted = false;
            this.SubmitCancel();
            /// console.log(this.isCopy);
            if (this.isCopy) {
                addReference.IsCopyRefToSecondCarer = true;
             //   console.log("addRef");
                let checkName=this.lstReferenceCheckName.filter(x=>x.CheckTypeId==finfo.ComplianceCheckId);
                if(checkName.length>0)
                {
                 //   console.log(checkName);
                    addReference.ComplianceCheckName=checkName[0].CheckName;
                }

              //  console.log(addReference);
                this.OnCopyReftoSecondCarer.emit(addReference);
            }
            this.isCopy = false;
            //  this.pComponent.alertSuccess('Reference Details Saved Successfully');

        }
    }

    private EditData(item, id) {
        this.insIsCopyRefVisible = false;
        this.isEdit = true;
        this.CopyProperty(item, this.objCarerReferenceInfoDTO);
        this.familyId = id;
    }

    private CopyProperty(source: CarerReferenceInfo, target: CarerReferenceInfo) {
        target.PersonalInfo.FirstName = source.PersonalInfo.FirstName;
        target.PersonalInfo.MiddleName = source.PersonalInfo.MiddleName;
        target.PersonalInfo.lastName = source.PersonalInfo.lastName;
        target.ContactInfo.AddressLine1 = source.ContactInfo.AddressLine1;
        target.ContactInfo.HomePhone = source.ContactInfo.HomePhone;
        target.ContactInfo.EmailId = source.ContactInfo.EmailId;
        target.StatusId = 2;
        target.ComplianceCheckId=source.ComplianceCheckId;
        target.GivingWrittenComments = source.GivingWrittenComments;
    }

    i = 0;
    private Updatefamilyinfo(_Form) {
        this.submitted = true;
        if (_Form.valid) {
            this.i = 0;
            this.objCarerReferenceInfoList.forEach(item => {
                if (this.i == this.familyId) {
                    this.CopyProperty(this.objCarerReferenceInfoDTO, item);
                }
                this.i++;
            });
            this.isDirty = true;
        }
        this.submitted = false;
        //   this.pComponent.alertSuccess('Reference Details Updated Successfully');
        this.isEdit = false;
        this.SubmitCancel();
    }

    private DeleteData(item) {
        //   if (confirm(Common.GetDeleteConfirmMsg)) {
        item.StatusId = 3;
        item.IsActive = false;
        this.isDirty = true;
        // }
    }

    public SubmitCancel() {
        this.insIsCopyRefVisible = this.insIsCopyRefVisibleOrginal;
        this.isEdit = false;
        //this.objCarerReferenceInfoDTO.PersonalInfo.FirstName = null;
        //this.objCarerReferenceInfoDTO.PersonalInfo.MiddleName = null;
        //this.objCarerReferenceInfoDTO.PersonalInfo.lastName = null;
        //this.objCarerReferenceInfoDTO.ContactInfo.AddressLine1 = null;
        //this.objCarerReferenceInfoDTO.ContactInfo.HomePhone = null;

        this.objCarerReferenceInfoDTO = new CarerReferenceInfo();
    }
}
