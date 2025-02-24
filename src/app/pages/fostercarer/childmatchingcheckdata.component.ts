import { Component, Pipe, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common}  from  '../common'
import { ChildMatchingChecklistDTO } from '../fosterchild/DTO/childmatchingchecklistdto'
import { ValChangeDTO } from '../dynamic/ValChangeDTO'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'ChildMatchingChecklistData',
    templateUrl: './childmatchingcheckdata.component.template.html',
})

export class FCChildMatchingChecklistDataComponent {
    CarerParentId;
    objChildMatchingChecklistDTO: ChildMatchingChecklistDTO = new ChildMatchingChecklistDTO();
    submitted = false;
    dynamicformcontrol = [];
    _Form: FormGroup;
    SequenceNo;
    objQeryVal;
    formId;
    ChildID: number;
    isLoading: boolean = false; controllerName = "ChildMatchingChecklist";
    //Doc
    FormCnfgId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    PageAActive = "active";
    DocumentActive; isUploadDoc: boolean = false;
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {


        this.route.params.subscribe(data => this.objQeryVal = data);
        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 44]);
        }

        this.objChildMatchingChecklistDTO.ChildId = this.objQeryVal.cid;
        this.objChildMatchingChecklistDTO.SequenceNo = this.objQeryVal.Id;
    
        apiService.post(this.controllerName, "GetDynamicControls", this.objChildMatchingChecklistDTO).then(data => { 
            this.dynamicformcontrol = data; 
        });
        this._Form = _formBuilder.group({});
        //Doc
        this.formId = 227;
        this.TypeId = this.objQeryVal.cid;
        this.tblPrimaryKey = this.objQeryVal.Id;

    }

  
   
    fnPageA() {
        this.PageAActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.PageAActive = "";
        this.DocumentActive = "active";
    }
  

    DnamicOnValChange(InsValChange: ValChangeDTO) {
        if (InsValChange.currnet.FieldCnfg.FieldName == "EthnicityCultureId") {
            let EthnicityCulture = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "EthnicityCulture");
            if (InsValChange.currnet.GridDisplayField == "Part Match" || InsValChange.currnet.GridDisplayField == "No Match")
                EthnicityCulture[0].IsVisible = true;
            else
                EthnicityCulture[0].IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "LanguageId") {
            let Language = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "Language");
            if (InsValChange.currnet.GridDisplayField == "Part Match" || InsValChange.currnet.GridDisplayField == "No Match")
                Language[0].IsVisible = true;
            else
                Language[0].IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "ReligionId") {
            let Religion = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "Religion");
            if (InsValChange.currnet.GridDisplayField == "Part Match" || InsValChange.currnet.GridDisplayField == "No Match")
                Religion[0].IsVisible = true;
            else
                Religion[0].IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "LocalityId") {
            let Locality = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "Locality");
            if (InsValChange.currnet.GridDisplayField == "Part Match" || InsValChange.currnet.GridDisplayField == "No Match")
                Locality[0].IsVisible = true;
            else
                Locality[0].IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "EducationId") {
            let Education = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "Education");
            if (InsValChange.currnet.GridDisplayField == "Part Match" || InsValChange.currnet.GridDisplayField == "No Match")
                Education[0].IsVisible = true;
            else
                Education[0].IsVisible = false;
        }
    }
}