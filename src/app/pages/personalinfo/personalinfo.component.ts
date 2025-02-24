/// <reference path="../pages.component.ts" />
import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Common } from '../common';
import { ConfigTableNames } from '../configtablenames';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import { PersonalInfo, PersonalInfoVisible } from './personalinfo';

@Component({
    selector: 'personalinfo',
    templateUrl: './personalinfo.component.template.html',
    styleUrls: ['../form-elements/inputs/image-uploader/image-uploader.component.scss'],
})

export class PersonalInfoComponet {
    AgencyId;
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    listTitle = [];
    submitted = false;
    personalinfoval: any;
    objVisible: PersonalInfoVisible = new PersonalInfoVisible();
    currentDate = "1988-12-12";
    gendertype: number = 1;
    insSaveasDraft = false;
    @Input()
    set personalinfoval1(pv: any) {

        let currentDate = new Date();
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        let date = year + "-" + month + "-" + day;
        this.currentDate = date;
        // console.log(this.currentDate);


        this.personalinfoval = (pv != null) ? pv : new PersonalInfo();
        this.setDOB(pv);
        this.fnngAfterViewInit();
    }

    get personalinfoval1(): any {
        //  this.personalinfoval.DateOfBirth = this.module.GetDateSaveFormat(this.personalinfoval.DateOfBirth);
        if (this.personalinfoval.FirstName)
            this.personalinfoval.FirstName = this.personalinfoval.FirstName.trim();

        if (this.personalinfoval.MiddleName)
            this.personalinfoval.MiddleName = this.personalinfoval.MiddleName.trim();

        if (this.personalinfoval.lastName)
            this.personalinfoval.lastName = this.personalinfoval.lastName.trim();

        if (this.personalinfoval.PreviousName)
            this.personalinfoval.PreviousName = this.personalinfoval.PreviousName.trim();
        return this.personalinfoval;
    }

    //------formbuilder input
    @Input()
    set formbuilder(formbuilder: any) {
        this.submitted = formbuilder;
    }
    get formbuilder(): any {

        return this._personalinfoForm;
    }
    @Input()
    set Visible(visi: PersonalInfoVisible) {

        this.objVisible = visi;
        this.getFormGroup(visi);
    }
    get Visible(): PersonalInfoVisible {

        return this.objVisible;
    }
    ///------------------

    @Input()
    set GenderType(value: number) {
        this.gendertype = value;
        //  console.log(this.gendertype);
    }
    get GenderType() {
        return this.gendertype;
    }

    @Input()
    set SaveasDraft(value) {
        this.insSaveasDraft = value;
    }

    setDOB(data) {
        if (data != null) {
            if (data.DateOfBirth != null) {
                this.personalinfoval.DateOfBirth = this.module.GetDateEditFormat(data.DateOfBirth);
                // this.personalinfoval.DateOfBirth = data.DateOfBirth.split('T')[0];
                this.fnDateChange(this.personalinfoval.DateOfBirth);
            }
        }
    }
    //validators
    _personalinfoForm: FormGroup;

    constructor(_formBuilder: FormBuilder,
        private apiServices: APICallService, private module: PagesComponent
    ) {
        this.AgencyId = Common.GetSession("AgencyProfileId");
        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyId;
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Title;
        this.apiServices.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.listTitle = data; });
    }
    getFormGroup(objVisible: PersonalInfoVisible) {

        let group: any = {};
        if (this.objVisible.TitleVisible)
            group['TitleId'] = this.objVisible.TitleMandatory ? new FormControl('0', Validators.required)
                : new FormControl('0');


        if (this.objVisible.FirstNameVisible) {
            group['FirstName'] = this.objVisible.FirstNameMandatory ? new FormControl('', Validators.required)
                : new FormControl('');
        }

        if (this.objVisible.MiddleNameVisible) {
            group['MiddleName'] = this.objVisible.MiddleNameMandatory ? new FormControl('', Validators.required)
                : new FormControl('');
        }

        if (this.objVisible.lastNameVisible) {
            group['lastName'] = this.objVisible.lastNameMandatory ? new FormControl('', Validators.required)
                : new FormControl('');
        }

        if (this.objVisible.PreviousNameVisible) {
            group['PreviousName'] = this.objVisible.PreviousNameMandatory ? new FormControl('', Validators.required)
                : new FormControl('');
        }

        if (this.objVisible.DateOfBirthVisible) {
            group['DateOfBirth'] = this.objVisible.DateOfBirthMandatory ? new FormControl('', Validators.required)
                : new FormControl('');
            //, CustomValidators.minDate('01/01/1900')
        }

        if (this.objVisible.AgeVisible) {
            group['Age'] = this.objVisible.AgeMandatory ? new FormControl('', Validators.required)
                : new FormControl('');
        }
        if (this.objVisible.genderIdVisible) {

            group['options'] = this.objVisible.genderIdMandatory ? new FormControl('0', Validators.required)
                : new FormControl('0');
        }


        this._personalinfoForm = new FormGroup(group);

        //  this.changeEve("", "");
    }
    age;
    private fnDateChange(val) {


        if (val != null && val != '') {
            let date = new Date();
            let d = date.getDate();
            let m = date.getMonth();
            let y = date.getFullYear();

            let dateDob = new Date(this.module.GetDateSaveFormat(val));
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
                this.personalinfoval.Age = age;
            else
                this.personalinfoval.Age = null;
        }

    }

    //private dateChanged(newDate) {
    //    if (newDate != null) {
    //        let date = new Date(newDate);
    //        this.personalinfoval.DateOfBirth = (date);//.format('yyyy-MM-dd');
    //    }

    //    //   var datePipe = new DatePipe(newDate);
    //    //   this.personalinfoval.DateOfBirth = datePipe.transform(date, 'dd/MM/yyyy');
    //}
    public image: any;
    showFileTooLarge = false;
    imageFile;
    reader = new FileReader();
    byteReader = new FileReader();
    fileChange(input) {
        if (input.files.length) {
            const file = input.files[0];
            // this.imageFile = input.files[0];
            if (file.size < 1000000) {
                this.showFileTooLarge = false;
                this.reader.onload = () => {
                    this.image = this.reader.result;
                    this.personalinfoval.ImageString = this.image.split(',')[1];
                }
                this.reader.readAsDataURL(file);
                //this.byteReader.onload = () => {
                //    this.imageFile = this.byteReader.result;
                //}
                //this.byteReader.readAsBinaryString(file);
            }
            else {
                this.showFileTooLarge = true;
                this.image = '';
            }
        }
    }
    fnngAfterViewInit() {
        //  console.log("imageId");
        if (this.personalinfoval.ImageId != null) {

            //   console.log(this.personalinfoval.ImageId);
            this.apiServices.get("UploadDocuments", "GetImageById", this.personalinfoval.ImageId).then(data => this.Response(data));
            //  this.uploadServie.GetImageById(this.personalinfoval.ImageId).then(data => this.Response(data));
        }
        else if (this.personalinfoval.ImageString != null) {
            this.srcPath = "data:image/jpeg;base64," + this.personalinfoval.ImageString;
        }
        else {
            this.srcPath = "./assets/img/app/noimage.png";
        }
    }
    output; srcPath = "./assets/img/app/noimage.png";
    fnUpload() {
        //let imgInfo = new ImageInfoDTO();
        //imgInfo.ImageString = this.image.split(',')[1];
        //this.uploadServie.SaveImage(imgInfo).then(data => this.output=data);
        //console.log(this.image.split(',')[1]);
        //var formData = new FormData();
        //formData.append("file", this.imageFile);
        //let xhr: XMLHttpRequest = new XMLHttpRequest();
        //xhr.open('POST', this.url, true);
        //xhr.send(formData);

    }
    fnShow() {

        //  this.uploadServie.GetImageById(13).then(data => this.Response(data));
        this.apiServices.get("UploadDocuments", "GetImageById", 13).then(data => this.Response(data));
    }
    Response(data) {
        this.srcPath = "data:image/jpeg;base64," + data;
    }
    removeImage(): void {
        // console.log(this.image);
        this.image = '';
    }

}
