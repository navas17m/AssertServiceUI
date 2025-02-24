import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { environment } from '../../../environments/environment';
import { UploadDocumentsDTO } from '../uploaddocument/DTO/uploaddocumentsdto';
import { FosterCarerPoliciesFCSignatureDTO} from '../recruitment/DTO/carerinfo'
@Component({
    selector: 'FosterCarerPolicies',
    templateUrl: './fostercarerpolicieslist.component.template.html',
    styles:[`  .modal-content {
        position: relative;
        display: -webkit-box;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        width: 150% !important;
        margin-left: -30%;
        height: 50%;
        pointer-events: auto;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 0.3rem;
        outline: 0;
    }`]

})

export class FosterCarerPoliciesComponent {
    public searchText: string = "";
    _Form: FormGroup;
    controllerName = "CarerInfo";
    objQeryVal;
    CarerParentId;
    loading=false;
    lstUploadedFiles=[];
    FormCnfgId=132;
    objUploadDocumentsDTO: UploadDocumentsDTO = new UploadDocumentsDTO();
    @ViewChild('btnFCSignatureModel') FCSignatureModel: ElementRef;
    lstSignature=[];
    isLoading=false;
    submitted=false;
    dynamicformcontrol=[];
    objFosterCarerPoliciesFCSignatureDTO:FosterCarerPoliciesFCSignatureDTO=new FosterCarerPoliciesFCSignatureDTO();
    columns =[
      {name:'Title',prop:'Title',sortable:true,width:'200'},
      {name:'Date Uploaded',prop:'UploadedDate',sortable:true,width:'120',date:'Y'},
      {name:'Description',prop:'Description',sortable:true,width:'150'},
      {name:'Expiry Date',prop:'ExpiryDate',sortable:true,width:'100',date:'Y'},
      {name:'Download',prop:'Download',sortable:false,width:'60',size:'s'},
      {name:'Signature', prop:'IsFCSignatureSigned',sortable:false,width:'60'}];

    constructor(private _formBuilder: FormBuilder, private renderer: Renderer2,
        private route: ActivatedRoute, private _router: Router, private module: PagesComponent, private apiService: APICallService) {
        this.route.params.subscribe(data => this.objQeryVal = data);

        if ((Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 45]);
        }
        else {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.fnGetSingnature();
        }
        this._Form = _formBuilder.group({
        });
    }


    fnGetSingnature()
    {
        this.apiService.get(this.controllerName,"GetFCPoliciesSignByCarerParentId",this.CarerParentId).then(data=>{
            this.lstSignature=data;
            this.fnBindUploadDocs();
        })
    }


    fnBindUploadDocs() {
        this.loading = true;
        this.objUploadDocumentsDTO.ExpiryDate = null;
        this.objUploadDocumentsDTO.FormCnfgId = 132;
        this.objUploadDocumentsDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.apiService.post("UploadDocuments", "GetAll", this.objUploadDocumentsDTO).then(data => {

            data.map(item=>{
                if(this.lstSignature.filter(x=>x.DocumentId==item.DocumentId).length>0)
                  item.IsFCSignatureSigned=true;
                else
                 item.IsFCSignatureSigned=false;
            })

            this.lstUploadedFiles = data;
            this.loading = false;
        });
    }

    fnDownload(Id, FileName) {
        let agencyId = Common.GetSession("AgencyProfileId");
        window.location.href = environment.api_downloadurl + Id + "," + agencyId;
    }


    fnFCSignature(id,docName){
        this.submitted = false;
       // this._router.navigate(['/pages/fostercarer/carerpoliciesdata/'+id]);
        this.objFosterCarerPoliciesFCSignatureDTO.DocumentId =id;
        this.objFosterCarerPoliciesFCSignatureDTO.DocumentName=docName;
        this.objFosterCarerPoliciesFCSignatureDTO.CarerParentId = this.CarerParentId;

        this.apiService.post(this.controllerName, "GetFCPoliciesSignByDocumentId", this.objFosterCarerPoliciesFCSignatureDTO).then(data => {
            this.dynamicformcontrol = data;

            let event = new MouseEvent('click', { bubbles: true });
            this.FCSignatureModel.nativeElement.dispatchEvent(event);
        });


    }

    clicksubmitsign(SectionAdynamicValue, SectionAdynamicForm) {
        this.submitted = true;

        if (SectionAdynamicForm.valid) {
            this.isLoading=true;
            let type = "save";
            this.objFosterCarerPoliciesFCSignatureDTO.DynamicValue = SectionAdynamicValue;
           // this.objFosterCarerPoliciesFCSignatureDTO.DocumentId = this.insDocId;
           // this.objFosterCarerPoliciesFCSignatureDTO.CarerParentId = this.CarerParentId;
           //  console.log(this.objFosterCarerPoliciesFCSignatureDTO);
            this.apiService.post(this.controllerName, "SaveFCPoliciesSignature", this.objFosterCarerPoliciesFCSignatureDTO).then(data => this.Respone(data, type));
        }
        else {
            this.module.GetErrorFocus(SectionAdynamicForm);
        }
    }

    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
           // console.log(this.objFosterCarerPoliciesFCSignatureDTO.DocumentId);
            let temp=this.lstUploadedFiles.filter(x=>x.DocumentId==this.objFosterCarerPoliciesFCSignatureDTO.DocumentId);
           // console.log(temp);
            if(temp.length>0)
            {
              //  console.log(temp);
                temp[0].IsFCSignatureSigned=true;
            }
            let event = new MouseEvent('click', { bubbles: true });
            this.FCSignatureModel.nativeElement.dispatchEvent(event);
        }
    }
    onSignClick(item){
      this.fnFCSignature(item.DocumentId,item.Title);
    }
    onDownload(item){
      this.fnDownload(item.DocumentId,item.DocumentName);
    }
}
