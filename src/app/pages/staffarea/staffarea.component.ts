
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
    isAdmin = false;
    objQeryVal;
    formConfigId = 352;
     _Form: FormGroup;
    AccessFormCnfgId = 353;
    @ViewChild('uploads') uploadCtrl;
    docVisible = true; CategoryId: number;
    lstCategorys = [];
    lstSubCategorys = [];

    lstCategorysOG=[];
    objStaffAreaCategoryCnfgDTO=new StaffAreaCategoryCnfgDTO();
    _staffAreaForm: FormGroup;
    submitted=false;
    controllerName="StaffAreaCategoryCnfg";
    headerText;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
         private renderer: Renderer2, private pComponent: PagesComponent) {
        this._Form = _formBuilder.group({
            CategoryId: ['0'],
            fromDate:[],
            toDate:[],
        });

      this.objStaffAreaCategoryCnfgDTO.AgencyProfileId=parseInt(Common.GetSession("AgencyProfileId"));
      this.objStaffAreaCategoryCnfgDTO.RoleCnfgId=parseInt(Common.GetSession("RoleProfileId"));
      this.fnLoadCategory();

    }

    fnLoadCategory()
    {
        this.apiService.post("StaffAreaCategoryCnfg", "GetAllByRoleId",this.objStaffAreaCategoryCnfgDTO).then(data => {
            this.lstCategorys = data.filter(x=>x.IsApproved==true && (x.ParentCategoryId==null || x.ParentCategoryId==0));
            //console.log(this.lstCategorys);
            this.lstCategorysOG=data;
        });
    }


    insFormDate=null;
    insToDate=null;
    fnClear()
    {
        this.insFormDate=null;
        this.insToDate=null;
      //  this.uploadCtrl.SetSearchClear();
       if(this.CategoryId)
        this.uploadCtrl.GetByDocumentTypeIdNew(this.CategoryId);
    }


    fnSearch()
    {
       if(this.insFormDate!=undefined && this.insToDate!=undefined)
       {

        let temp=this.pComponent.GetDateSaveFormat(this.insFormDate)+'/'+this.pComponent.GetDateSaveFormat(this.insToDate)
        this.uploadCtrl.SetSearchFromToDate(temp);
       }
       else if(this.insFormDate!=undefined)
        this.uploadCtrl.SetSearchFromDate(this.pComponent.GetDateSaveFormat(this.insFormDate));
       else if(this.insToDate!=undefined)
         this.uploadCtrl.SetSearchToDate(this.pComponent.GetDateSaveFormat(this.insToDate));

    }

    IsVisibleBack=false;
    fnBack()
    {
        this.IsVisibleBack=false;
        this.lstCategorys=this.lstCategorysOG.filter(x=>x.IsApproved==true && (x.ParentCategoryId==null || x.ParentCategoryId==0));
    }


    ChangeCategory(CategoryId) {

        //this.insFormDate=null;
        //this.insToDate=null;

        this.lstCategorys.forEach(x=>{
            x.IsActive=false;
        })

        let temp=this.lstCategorys.filter(x=>x.StaffAreaCategoryCnfgId==CategoryId);
        if(temp.length>0)
        {
            temp[0].IsActive=true;
        }

        let findSub=this.lstCategorysOG.filter(x=>x.ParentCategoryId==CategoryId);
        if(findSub.length>0)
        {
            this.IsVisibleBack=true;
            this.lstCategorys=findSub;
        }

        if (CategoryId != "" && CategoryId != null && CategoryId != 0) {
            this.docVisible = false;
            this.uploadCtrl.SetDocumentTypeId(CategoryId);

            this.uploadCtrl.GetByDocumentTypeId(CategoryId);
            this.CategoryId=CategoryId;



        }
        else {
            this.docVisible = true;
        }
    }

}


export class StaffAreaCategoryCnfgDTO extends BaseDTO {
    StaffAreaCategoryCnfgId: number;
    Category: string;
    IsApproved: boolean;
    RoleCnfgId:number;
}
