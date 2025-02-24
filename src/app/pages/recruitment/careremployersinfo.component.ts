import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagesComponent } from '../pages.component';
import { CarerEmployerInfo } from './DTO/careremployerinfo';
@Component({
    selector: 'CarerEmployerInfo',
    templateUrl: './careremployersinfo.component.template.html',
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

export class CarerEmployerInfoComponet {
    public returnVal:any[];
    objCarerEmployerInfoDTO: CarerEmployerInfo = new CarerEmployerInfo();
    objCarerEmployerInfoList: CarerEmployerInfo[] = [];
    objCarerEmpList: CarerEmployerInfo[] = [];
    submitted = false;
    EmployerInfoId;
    isEdit = false;
    deletbtnAccess = false;
    isDirty = false;
    @Input() formName:string;
    @Input()
    set EmployerInfo(refinfo: CarerEmployerInfo[]) {
        this.FillList(refinfo);
    }

    get EmployerInfo(): CarerEmployerInfo[] {
        this.objCarerEmpList = this.objCarerEmployerInfoList;
        // this.objCarerEmployerInfoList = [];
        return this.objCarerEmpList;
    }

    @Input()
    set Dirty(val: boolean) {
        // console.log("valDirty " + val);
        this.isDirty = val;
        if (val == false) {
            this.objCarerEmpList.filter(x => x.StatusId == 1).forEach(x => {
                x.StatusId = 4;
            })
        }
    }
    get Dirty(): boolean {
        return this.isDirty;
    }

    @Input()
    set ChangeStatus(Id: number) {
        if (Id != null && Id == 1 && this.objCarerEmployerInfoList.length > 0) {
            this.objCarerEmployerInfoList.filter(x => x.StatusId == 1).forEach(item => {
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
    constructor(_formBuilder: FormBuilder, private _http: HttpClient, private pComponent: PagesComponent) {
        this._Form = _formBuilder.group({
            //  FirstName: ['', Validators.required],
            AddressLine1: [''],
            Phone: ['', [Validators.minLength(10), Validators.maxLength(20)]],
            EmployementDurationAndPost: [''],
            EmailId: ['',Validators.email],
            ReferenceTypeId: [],
            CompanyName: ['', Validators.required],
            ContactName: [''],
            NoticePeriod: [''],
            DisciplinaryInCareer: [''],
            SuitableDateForYourReference: [''],
            ProvidingReference:['']
        })
        this.objCarerEmployerInfoDTO.ReferenceTypeId = 1;
    }

    FillList(EmpInfo: CarerEmployerInfo[]) {
        this.objCarerEmployerInfoList = [];

        if (EmpInfo != null && EmpInfo[0] != null) {
            EmpInfo.forEach(item => {
                let addEmployee: CarerEmployerInfo = new CarerEmployerInfo();
                //addEmployee.PersonalInfo.PersonalInfoId = item.PersonalInfo.PersonalInfoId;
                // addEmployee.PersonalInfo.FirstName = item.PersonalInfo.FirstName;
                addEmployee.ContactInfo.ContactInfoId = item.ContactInfo.ContactInfoId;
                addEmployee.ContactInfo.AddressLine1 = item.ContactInfo.AddressLine1;
                addEmployee.ContactInfo.OfficePhone = item.ContactInfo.OfficePhone;
                addEmployee.ContactInfo.EmailId = item.ContactInfo.EmailId;
                addEmployee.EmployementDurationAndPost = item.EmployementDurationAndPost;
                addEmployee.ReferenceTypeId = item.ReferenceTypeId;
                addEmployee.CompanyName = item.CompanyName;
                addEmployee.ContactName = item.ContactName;
                addEmployee.NoticePeriod = item.NoticePeriod;
                addEmployee.DisciplinaryInCareer = item.DisciplinaryInCareer;
                addEmployee.SuitableDateForYourReference = item.SuitableDateForYourReference;
                addEmployee.ProvidingReference = item.ProvidingReference;
                if (item.StatusId != 3)
                    addEmployee.IsActive = true;
                else
                    addEmployee.IsActive = false;
                addEmployee.StatusId = item.StatusId;
                addEmployee.CarerEmlpoyerInfoId = item.CarerEmlpoyerInfoId;
                this.objCarerEmployerInfoList.push(addEmployee);
            })
        }
    }

    Submitfamilyinfo(_Form) {
        this.submitted = true;
        if (_Form.valid) {
            this.objCarerEmployerInfoDTO.SuitableDateForYourReference = this.pComponent.GetDateSaveFormat(this.objCarerEmployerInfoDTO.SuitableDateForYourReference);

            let addEmployee: CarerEmployerInfo = new CarerEmployerInfo();
            // addEmployee.PersonalInfo.FirstName = this.objCarerEmployerInfoDTO.PersonalInfo.FirstName;
            addEmployee.ContactInfo.AddressLine1 = this.objCarerEmployerInfoDTO.ContactInfo.AddressLine1;
            addEmployee.ContactInfo.OfficePhone = this.objCarerEmployerInfoDTO.ContactInfo.OfficePhone;
            addEmployee.ContactInfo.EmailId = this.objCarerEmployerInfoDTO.ContactInfo.EmailId;
            addEmployee.EmployementDurationAndPost = this.objCarerEmployerInfoDTO.EmployementDurationAndPost;
            addEmployee.ReferenceTypeId = this.objCarerEmployerInfoDTO.ReferenceTypeId;
            addEmployee.CompanyName = this.objCarerEmployerInfoDTO.CompanyName;
            addEmployee.ContactName = this.objCarerEmployerInfoDTO.ContactName;
            addEmployee.NoticePeriod = this.objCarerEmployerInfoDTO.NoticePeriod;
            addEmployee.DisciplinaryInCareer = this.objCarerEmployerInfoDTO.DisciplinaryInCareer;
            addEmployee.SuitableDateForYourReference = this.objCarerEmployerInfoDTO.SuitableDateForYourReference;
            addEmployee.ProvidingReference = this.objCarerEmployerInfoDTO.ProvidingReference;
            addEmployee.StatusId = 1;
            addEmployee.IsActive = true;
            addEmployee.CarerEmlpoyerInfoId = 0;
            this.objCarerEmployerInfoList.push(addEmployee);
            this.submitted = false;
            this.SubmitCancel();
            this.isDirty = true;
            //  this.pComponent.alertSuccess('Employer Details Saved Successfully');
        }
    }

    dateString;
    private EditData(item, id) {
        this.isEdit = true;
        this.CopyProperty(item, this.objCarerEmployerInfoDTO, 'edit');
        this.EmployerInfoId = id;

    }

    private CopyProperty(source: CarerEmployerInfo, target: CarerEmployerInfo, type: string) {
        // target.PersonalInfo.FirstName = source.PersonalInfo.FirstName;
        target.ContactInfo.AddressLine1 = source.ContactInfo.AddressLine1;
        target.ContactInfo.OfficePhone = source.ContactInfo.OfficePhone;
        target.ContactInfo.EmailId = source.ContactInfo.EmailId;
        target.EmployementDurationAndPost = source.EmployementDurationAndPost;

        target.ReferenceTypeId = source.ReferenceTypeId;
        target.CompanyName = source.CompanyName;
        target.ContactName = source.ContactName;
        target.NoticePeriod = source.NoticePeriod;
        target.DisciplinaryInCareer = source.DisciplinaryInCareer;
        target.SuitableDateForYourReference = source.SuitableDateForYourReference;
        target.ProvidingReference = source.ProvidingReference;
        target.StatusId = 2;

        if (type == 'edit')
            target.SuitableDateForYourReference = this.pComponent.GetDateEditFormat(source.SuitableDateForYourReference);
        else
            target.SuitableDateForYourReference = this.pComponent.GetDateSaveFormat(source.SuitableDateForYourReference);


    }

    i = 0;
    private UpdateExPartnerinfo(_Form) {
        this.submitted = true;
        if (_Form.valid) {
            this.i = 0;
            this.objCarerEmployerInfoList.forEach(item => {
                if (this.i == this.EmployerInfoId) {
                    this.CopyProperty(this.objCarerEmployerInfoDTO, item, 'update');

                }
                this.i++;
            });

            this.submitted = false;
            //  this.pComponent.alertSuccess('Employer Details Updated Successfully');
            this.isEdit = false;
            this.SubmitCancel();
            this.isDirty = true;
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
        // }
    }

    public SubmitCancel() {
        this.isEdit = false;
        //  this.objCarerEmployerInfoDTO.PersonalInfo.FirstName = null;
        this.objCarerEmployerInfoDTO.ContactInfo.AddressLine1 = null;
        this.objCarerEmployerInfoDTO.ContactInfo.OfficePhone = null;
        this.objCarerEmployerInfoDTO.ContactInfo.EmailId = null;
        this.objCarerEmployerInfoDTO.EmployementDurationAndPost = null;
        this.objCarerEmployerInfoDTO.ReferenceTypeId = 1;
        this.objCarerEmployerInfoDTO.CompanyName = null;
        this.objCarerEmployerInfoDTO.ContactName = null;
        this.objCarerEmployerInfoDTO.NoticePeriod = null;
        this.objCarerEmployerInfoDTO.DisciplinaryInCareer = null;
        this.objCarerEmployerInfoDTO.SuitableDateForYourReference = null;
        this.objCarerEmployerInfoDTO.ProvidingReference = null;
    }
}
