import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Common } from '../common';
import { ConfigTableNames } from '../configtablenames';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import { AnnualReviewApprovalRecomDTO } from './DTO/annualreviewapprovalrecom';

@Component({
    selector: 'AnnualReviewApprovalRecommendation',
    templateUrl: './annualreviewappprovalrecom.component.template.html',
    styles: [`[required]  {
        border-left: 5px solid blue;
    }

    .ng-valid[required], .ng-valid.required  {
            border-left: 5px solid #42A948; /* green */
}
    label + .ng-invalid:not(form)  {
        border-left: 5px solid #a94442; /* red */
}`]
})

export class AnnualReviewApprovalRecommendationComponet {
    public returnVal:any[];
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    objAnnualReviewApprovalRecomDTO: AnnualReviewApprovalRecomDTO = new AnnualReviewApprovalRecomDTO();
    objAnnualReviewApprovalRecomInfoList: AnnualReviewApprovalRecomDTO[] = [];
    objAnnualReviewApprovalRecomRefList: AnnualReviewApprovalRecomDTO[] = [];
    submitted = false;
    ApprovalRecomId;
    relationList;
    isEdit = false;
    ethinicityList;
    religionList;
    AgencyProfileId: number;
    deletbtnAccess = false;
    isDirty = false;
    @Input()
    set ApprovalRecom(refinfo: AnnualReviewApprovalRecomDTO[]) {
      if (refinfo != null && refinfo.length>0) {
            this.FillList(refinfo);
        }
    }
    get ApprovalRecom(): AnnualReviewApprovalRecomDTO[] {
        this.objAnnualReviewApprovalRecomRefList = this.objAnnualReviewApprovalRecomInfoList;
        //  this.objAnnualReviewApprovalRecomInfoList = [];
        return this.objAnnualReviewApprovalRecomRefList;
    }

    @Input()
    set Dirty(val: boolean) {
        // console.log("valDirty " + val);
        this.isDirty = val;
    }
    get Dirty(): boolean {
        return this.isDirty;
    }

    @Input()
    set StatusChange(Id: number) {
        if (Id != null && Id == 1 && this.objAnnualReviewApprovalRecomInfoList.length > 0) {
            this.objAnnualReviewApprovalRecomInfoList.filter(x => x.StatusId == 1).forEach(item => {
                item.StatusId = 0;
            })
        }
    }

    FillList(refinfo: AnnualReviewApprovalRecomDTO[]) {
        this.objAnnualReviewApprovalRecomInfoList = [];
        if (refinfo != null && refinfo[0] != null) {
            refinfo.forEach(item => {
                if (item.StatusId != 3) {
                    let addApprovalRecom: AnnualReviewApprovalRecomDTO = new AnnualReviewApprovalRecomDTO();
                    addApprovalRecom.CarerAnnualReviewApprovalRecomId = item.CarerAnnualReviewApprovalRecomId;
                    addApprovalRecom.NoOfChildren = item.NoOfChildren;
                    addApprovalRecom.Age = item.Age;
                    addApprovalRecom.Gender = item.Gender;
                    addApprovalRecom.Ethnicity = item.Ethnicity;
                    addApprovalRecom.Religion = item.Religion;
                    addApprovalRecom.EthnicityName = item.EthnicityName;
                    addApprovalRecom.ReligionName = item.ReligionName;
                    addApprovalRecom.IsActive = true;
                    addApprovalRecom.StatusId=item.StatusId;
                    this.objAnnualReviewApprovalRecomInfoList.push(addApprovalRecom);
                }
            });
        }
    }

    //validators
    _Form: FormGroup;

    constructor(_formBuilder: FormBuilder,
        private module: PagesComponent, private apiService: APICallService) {

        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objConfigTableNamesDTO.AgencyProfileId = this.AgencyProfileId;

        this.objConfigTableNamesDTO.Name = ConfigTableNames.Ethnicity;
        // _cnfgTblValueServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.ethinicityList = data; });
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.ethinicityList = data; });
        this.objConfigTableNamesDTO.Name = ConfigTableNames.Religion;
        this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.religionList = data; });
        //_cnfgTblValueServices.getConfigTableValues(this.objConfigTableNamesDTO).then(data => { this.religionList = data; });

        this._Form = _formBuilder.group({
            NoOfChildren: ['', Validators.required],
            Age: [''],
            Gender: ['', Validators.required],
            Ethnicity: ['0', Validators.required],
            Religion: ['0', Validators.required],
        })

        this.deletbtnAccess = this.module.GetDeletAccessPermission(53);
    }

    fnSetDirty(val: boolean) {
        this.isDirty = val;
    }

    SubmitApprovalRecom(finfo, _Form) {
        this.submitted = true;
        if (_Form.valid) {
            let addApprovalRecom: AnnualReviewApprovalRecomDTO = new AnnualReviewApprovalRecomDTO();
            addApprovalRecom.NoOfChildren = finfo.NoOfChildren;
            addApprovalRecom.Age = finfo.Age;
            addApprovalRecom.Gender = finfo.Gender;
            addApprovalRecom.Ethnicity = finfo.Ethnicity;
            addApprovalRecom.Religion = finfo.Religion;
            addApprovalRecom.EthnicityName = finfo.EthnicityName;
            addApprovalRecom.ReligionName = finfo.ReligionName;
            addApprovalRecom.StatusId = 1;
            addApprovalRecom.IsActive = true;
            this.objAnnualReviewApprovalRecomInfoList.push(addApprovalRecom);
            this.submitted = false;
            this.isDirty = true;
            this.SubmitCancel();
            //   this.module.alertSuccess('Approval Recommendation Details Saved Successfully');
        }
    }

    private EditData(item, id) {
        this.isEdit = true;
        this.CopyProperty(item, this.objAnnualReviewApprovalRecomDTO);
        this.ApprovalRecomId = id;
    }

    private CopyProperty(souerce: AnnualReviewApprovalRecomDTO, target: AnnualReviewApprovalRecomDTO) {
        target.NoOfChildren = souerce.NoOfChildren;
        target.Age = souerce.Age;
        target.Gender = souerce.Gender;
        target.Ethnicity = souerce.Ethnicity;
        target.Religion = souerce.Religion;
        target.EthnicityName = souerce.EthnicityName;
        target.ReligionName = souerce.ReligionName;
        target.StatusId = 2;
    }


    i = 0;
    private UpdateApprovalRecom(_Form) {
        this.submitted = true;
        if (_Form.valid) {
            this.i = 0;
            this.objAnnualReviewApprovalRecomInfoList.forEach(item => {
                if (this.i == this.ApprovalRecomId) {
                    this.CopyProperty(this.objAnnualReviewApprovalRecomDTO, item);
                }
                this.i++;
            });
            this.isDirty = true;
            this.submitted = false;
            this.isEdit = false;
            this.SubmitCancel();
        }
    }

    private DeleteData(item) {
        //   if (confirm(Common.GetDeleteConfirmMsg)) {
        item.StatusId = 3;
        item.IsActive = false;
        this.isDirty = true;
        //}
    }

    public SubmitCancel() {
        this.submitted = false;
        this.isEdit = false;
        this.objAnnualReviewApprovalRecomDTO.NoOfChildren = null;
        this.objAnnualReviewApprovalRecomDTO.Age = null;
        this.objAnnualReviewApprovalRecomDTO.Gender = null;
        this.objAnnualReviewApprovalRecomDTO.Ethnicity = null;
        this.objAnnualReviewApprovalRecomDTO.Religion = null;
        this.objAnnualReviewApprovalRecomDTO.EthnicityName = null;
        this.objAnnualReviewApprovalRecomDTO.ReligionName = null;
    }

    ReligionChange(id) {
        this.objAnnualReviewApprovalRecomDTO.ReligionName = this.religionList.find((item: any) => item.CofigTableValuesId == id).Value;
    }

    EthnicityChange(id) {
        this.objAnnualReviewApprovalRecomDTO.EthnicityName = this.ethinicityList.find((item: any) => item.CofigTableValuesId == id).Value;
    }
}
