import { BaseDTO } from '../basedto';
import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import * as XLSX from 'xlsx'
import { time } from 'd3';
import * as moment from 'moment';
@Component({
    selector: 'UploadChildPlacement',
    templateUrl: './uploadplacement.component.template.html',
})

export class UploadChildPlacementComponent {

    submitted = false;
    _Form: FormGroup;
    objQeryVal;
    AgencyProfileId: number; ChildId: number;
    isLoading: boolean = false;
    controllerName = "ChildProfile";
    lstPlacementDetails: UploadChildPlacementDTO[] =[];
    //UPload File Details
    file:File;
    arrayBuffer:any;
    filelist:any;
    @ViewChild('inputFile') myInputVariable: ElementRef;

    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent, private renderer: Renderer2) {
        this.route.params.subscribe(data => this.objQeryVal = data);
        this.ChildId = this.objQeryVal.cid
    }

    fnClear(){

        this.lstPlacementDetails=[];
        this.arrayBuffer = [];
    }

  addfile(event)
  {
    this.file= event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
    this.arrayBuffer = fileReader.result;
    var data = new Uint8Array(this.arrayBuffer);
    var arr = new Array();
    for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");
    var workbook = XLSX.read(bstr, {type:"binary"});
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
   // console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
    this.FillList(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
      var arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});
          this.filelist = [];
        //  console.log(this.filelist)
    }
    this.myInputVariable.nativeElement.value = '';
  }

  FillList(refinfo) {
    this.lstPlacementDetails = [];
    if (refinfo != null ) {
        refinfo.forEach(item => {
                let addChildDetails: UploadChildPlacementDTO = new UploadChildPlacementDTO();
                addChildDetails.ChildIdentifier = item.ChildIdentifier;                ;
                addChildDetails.ChildOrParent = item.ChildORParentChild;
                addChildDetails.ChildFirstName = item.FirstName;
                addChildDetails.ChildMiddleName = item.MiddleName;
                addChildDetails.ChildLastName = item.LastName;
                addChildDetails.DateOfBirth = item.DateOfBirth;
                addChildDetails.Gender = item.Gender;
                addChildDetails.AreaOfficeName = item.AreaOffice;
                addChildDetails.LocalAuthorityName = item.LocalAuthority;
                addChildDetails.Ethnicity = item.Ethnicity;
                addChildDetails.OfstedEthnicity = item.OfstedEthnicity;
                addChildDetails.ChildGeography = item.ChildGeography;
                addChildDetails.ChildInEducation = item.IstheChildCurrentlyinEducation;
                addChildDetails.ReferralDate = item.ReferralDate;
                addChildDetails.CarerCode = item.CarerCode;
                addChildDetails.CarerName = item.CarerName;
                addChildDetails.PlacementDate = item.PlacementDate;
                addChildDetails.PlacementTime = item.PlacementTime;
                addChildDetails.PlacementType = item.PlacementType;
                addChildDetails.ChildPlacementCategory = item.ChildPlacementCategory;
                addChildDetails.AgencySocialWorker = item.AgencySocialWorker;
                addChildDetails.PlacementReason = item.PlacementReason;
                addChildDetails.PlacementAgreement = item.PlacementAgreement;
                addChildDetails.AnyComments = item.AnyComments;
                addChildDetails.IsActive = true;
                addChildDetails.SiblingChildIdentifier=item.SiblingChildIdentifier;

                //set string create date
                let date = new Date();
                let d = date.getDate();
                let m = date.getMonth() + 1;
                let y = date.getFullYear();
                let h = date.getHours();
                let min = date.getMinutes();
                let day = "" + d;
                if (d < 10)
                    day = "0" + d;
                let month = "" + m;
                if (m < 10)
                    month = "0" + m;
                let minute = "" + min;
                if (min < 10)
                    minute = "0" + min;
                let dateNew = y + "-" + month + "-" + day + " " + h + ":" + minute;
                addChildDetails.strCreatedDate = dateNew;

                this.lstPlacementDetails.push(addChildDetails);
        });
    }
   }

    clicksubmit() {
        this.submitted = true;
        if (this.lstPlacementDetails.length>0) {
            this.isLoading = true;

            let type = "save";
            if (this.objQeryVal.id != 0)
                type = "update"

          //  console.log(this.lstPlacementDetails);
           this.apiService.post(this.controllerName,"SaveUploadPlacement", this.lstPlacementDetails).then(data => this.Respone(data, type));
        }
    }

    insErrorMsg;
    private Respone(data, type) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.insErrorMsg=data.ErrorMessage;
            this.modal.alertDanger("Error while saving record. Record not saved successfully");
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            this.lstPlacementDetails=[];
            this._router.navigate(['/pages/referral/childprofilelist/0/16']);
        }
    }

    fnDownload(){

        window.location.href ="assets/UploadChildPlacement.xlsx"
    }

    public GetDateSaveFormat(val) {
       // console.log(val);
        if (val) {
            //val=val.rplace("-", "/");

          // console.log(val.replace("/", "-"));
          // val="22/12/2021";
            var re = /-/;
            if (val != '' && val != null && val.search(re) == -1) {
                let dtParsed, dtFormatted, out = '';
                dtParsed = moment(val, 'DD/MM/YYYY')
                dtFormatted = dtParsed.format('YYYY-MM-DD');
                //console.log(dtFormatted);
                return dtFormatted;
            }
            else if (val != '' && val != null) {
                return val;
            }
        }
        else
            return null;
    }
}


export class UploadChildPlacementDTO extends BaseDTO {
    ChildIdentifier: string;
    ChildOrParent: string;
    ChildFirstName: string;
    ChildMiddleName: string;
    ChildLastName: string;
    DateOfBirth: Date=null;
    Gender: string = null;
    AreaOfficeName:string;
    LocalAuthorityName:string;
    Ethnicity:string;
    OfstedEthnicity:string;
    ChildGeography:string;
    ChildInEducation:string;
    ReferralDate:Date=null;
    CarerCode:string;
    CarerName:string;
    PlacementDate:Date;
    PlacementTime:any;
    PlacementType:string;
    ChildPlacementCategory:string;
    AgencySocialWorker:string;
    PlacementReason:string;
    PlacementAgreement:string;
    AnyComments:string;
    SiblingChildIdentifier:string;
    strCreatedDate:string;
}

