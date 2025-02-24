import { Component, ViewChild,ElementRef,Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { APICallService } from '../services/apicallservice.service';
import { BaseDTO } from '../basedto';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
@Component({
    selector: 'staffarea',
    templateUrl: './staffarea.component.template.html',
})
export class StaffAreaComponent {
    @ViewChild('btnCategoty') infoCategoty: ElementRef;
    isAdmin = true;
    objQeryVal;
    formConfigId = 3521;
     _Form: FormGroup;
    AccessFormCnfgId = 352;
    @ViewChild('uploads') uploadCtrl;
    docVisible = true;
    CategoryId: number=null;
    SubCategoryId: number=null;
    lstCategorys = [];
    lstCategorysSub = [];
    lstParentCategorys = [];
    lstCategorysOG=[];
    objStaffAreaCategoryCnfgDTO=new StaffAreaCategoryCnfgDTO();
    _staffAreaForm: FormGroup;
    submitted=false;
    controllerName="StaffAreaCategoryCnfg";
    headerText;
    isLoading;
    searchText;
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder, private renderer: Renderer2, private pComponent: PagesComponent) {

        this.StaffAreaCategoryCnfgId=null;
        this._Form = _formBuilder.group({
            CategoryId: ['0'],
            SubCategoryId:['0']
        });

        this._staffAreaForm = _formBuilder.group
        ({
            Category: ['', Validators.required],
            IsApproved:[],
            ParentCategoryId:[],
        });

      this.fnLoadCategory();

    }

    fnLoadCategory()
    {
        this.apiService.get("StaffAreaCategoryCnfg", "GetAll").then(data => {
            this.lstCategorys = data.filter(x=>x.IsApproved==true);
            this.lstParentCategorys= data.filter(x=>x.IsApproved==true && x.ParentCategoryId==null);
            this.lstCategorysOG=data;//.filter(x=>x.IsApproved==true);
        });
    }

    ChangeCategory(CategoryId) {
        this.CategoryId=CategoryId;
        this.SubCategoryId=null;
        this.lstCategorysSub=this.lstCategorysOG.filter(x=>x.IsApproved==true && x.ParentCategoryId==CategoryId);
        if (CategoryId != "" && CategoryId != null && CategoryId != 0) {
            this.docVisible = false;
            this.uploadCtrl.SetDocumentTypeId(CategoryId);

            this.uploadCtrl.GetByDocumentTypeId(CategoryId);
        }
        else {
            this.docVisible = true;
        }
    }


    fnChangeSubCategory(CategoryId) {
        if (CategoryId != "" && CategoryId != null && CategoryId != 0) {
            this.docVisible = false;
            this.uploadCtrl.SetDocumentTypeId(CategoryId);
            this.uploadCtrl.GetByDocumentTypeId(CategoryId);
        }
        else {
            this.uploadCtrl.SetDocumentTypeId(this.CategoryId);
            this.uploadCtrl.GetByDocumentTypeId(this.CategoryId);
        }
    }

    ///Add
    fnShowCategory()
    {
        this.StaffAreaCategoryCnfgId=null;
        this.objStaffAreaCategoryCnfgDTO=new StaffAreaCategoryCnfgDTO();
        let event = new MouseEvent('click', { bubbles: true });
        this.infoCategoty.nativeElement.dispatchEvent(event);
    }
    StaffAreaCategoryCnfgId;
    fnStaffAreaSubmit(forms)
    {

        this.submitted=true;
        if (this._staffAreaForm.valid) {
            let type = "save";
            if (this.StaffAreaCategoryCnfgId != null && this.StaffAreaCategoryCnfgId != 0)
                type = "update"

            this.objStaffAreaCategoryCnfgDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.apiService.save(this.controllerName, this.objStaffAreaCategoryCnfgDTO, type).then(data => this.Respone(data, type));
           }

    }


    private Respone(data, type) {

        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.StaffAreaCategoryCnfgId=null;
            this.objStaffAreaCategoryCnfgDTO.Category=null;
            this.submitted=false;
            if (type == "save")
                this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
            else if (type == "update")
                this.pComponent.alertSuccess(Common.GetUpdateSuccessfullMsg);

            this.fnLoadCategory();
            this.CategoryId=data.SequenceNumber;
            let event = new MouseEvent('click', { bubbles: true });
            this.infoCategoty.nativeElement.dispatchEvent(event);
            this.ChangeCategory(this.CategoryId);
            this.submitted=false;
        }
    }

    editStaffArea(Id)
    {
      this.StaffAreaCategoryCnfgId=Id;
      this.apiService.get(this.controllerName,"GetById",Id).then(data=>{
        this.objStaffAreaCategoryCnfgDTO=data;
      })
    }

    fndeleteCategoty(item)
    {
        // let temp=new StaffAreaCategoryCnfgDTO();
        // temp.StaffAreaCategoryCnfgId =item.StaffAreaCategoryCnfgId;
        // this.apiService.delete(this.controllerName,temp).then(data=>{
        //     this.responeseDelete(data);
        // })

        this.apiService.delete(this.controllerName, item.StaffAreaCategoryCnfgId).then(data => this.responeseDelete(data));
    }


    responeseDelete(data)
    {

        this.submitted=false;
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
          this.fnLoadCategory();
          this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
        }

    }
}


export class StaffAreaCategoryCnfgDTO extends BaseDTO {
    StaffAreaCategoryCnfgId: number;
    Category: string;
    IsApproved: boolean;
    RoleCnfgId:number;
    ParentCategoryId:number=null;
}
