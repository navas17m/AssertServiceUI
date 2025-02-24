import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';
import { ApplicantListDTO, CarerInfo } from './DTO/carerinfo';
import { CarerParentDTO } from './DTO/carerparent';
@Component({
    selector: 'applicantlist',
    templateUrl: './applicantlist.component.template.html',
})
export class ApplicantListComponet {
    public searchText: string = "";
    @ViewChild('header') headerCtrl;
    selectName;
    SelectCode;
    CarerStatusName;
    applicantList: CarerInfo[] = [];
    objApplicantListDTO: ApplicantListDTO = new ApplicantListDTO();
    CarerStatusId;
    carerStatusList;
    areaOfficeList;
    agencyId;
    AreaOfficeid;
    IsVisible = false;
    IsSelected = 0; objQeryVal;
    loading = false;
    ApplicantProfileVal: CarerParentDTO = new CarerParentDTO();
    objApplicantProfileVal: CarerParentDTO = new CarerParentDTO();
    controllerName = "CarerInfo";
    insUserTypeId;
    //Snapshot Popup
    insSnpCarerId;
    _Form: FormGroup;
    @ViewChild('btnSnapshot') infobtnSnapShot: ElementRef;
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    UserTypeId = 0;
    CanSeeAllCarer="0";
    pageSize:number=10;
    gridMessages;
    arrayStatus = [];
    selectedStatus;
    constructor(private _router: Router, private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute,
        private renderer: Renderer2, private apiService: APICallService,
        private pComponent: PagesComponent) {
          this.gridMessages = {'totalMessage':'Carers'};
            this.insUserTypeId=Common.GetSession("UserTypeId");
        this._Form = _formBuilder.group({
            CarerStatusId: ['0'],
            AreaOfficeid: ['0'],
            AreaofficeId: ['0'],
            searchText: [],
            CarerLoadingTypeId:['0']
        });

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

        //if(this.insUserTypeId!=3)
        this.objApplicantListDTO.CarerLoadingTypeId=1;

        this.CanSeeAllCarer = Common.GetSession("CanSeeAllCarer");

        if(this.insUserTypeId==3 && this.CanSeeAllCarer=="1")
        this.objApplicantListDTO.CarerLoadingTypeId=1;
      else if(this.insUserTypeId==3 && this.CanSeeAllCarer=="0")
        this.objApplicantListDTO.CarerLoadingTypeId=0;

        if (Common.GetSession("CarerParentId") != "0" && Common.GetSession("CarerParentId") != null) {
            this.IsSelected = parseInt(Common.GetSession("CarerParentId"));
        }
        else if (Common.GetSession("IEDraftSequenceNo") != null && Common.GetSession("IEDraftSequenceNo") != "0") {
            this.IsSelected = parseInt(Common.GetSession("IEDraftSequenceNo"));
        }

        //Bind AreaOffice
        this.agencyId = Common.GetSession("AgencyProfileId");
        this.apiService.get("AreaOfficeProfile", "GetByUserMapping").then(data => { this.areaOfficeList = data; });
        this.objApplicantListDTO.AreaOfficeid = 0;

        //Bind Carer Status
        this.apiService.get("ModuleStausCnfg", "GetByModuleId", 13).then(data => { this.ResponseBindStatus(data); });

    }


    fnSnapShot(carerID) {
        if(this.insUserTypeId!="4")
        {
        this.insSnpCarerId = carerID;
        let event = new MouseEvent('click', { bubbles: true });
        this.infobtnSnapShot.nativeElement.dispatchEvent(event);
        }
    }

    ResponseBindStatus(data) {

        if (data.length > 0) {
           // this.carerStatusList = data;
            this.fnLoadStatus(data);
            //set default
            let defaultval = data.filter(x => x.IsDefault != 0);

            if (defaultval.length > 0) {
                this.objApplicantListDTO.CarerStatusId = defaultval[0].IsDefault;
                let temp:any=[];
                temp.push(defaultval[0].IsDefault)
                this.selectedStatus=temp;
            }
            else
                this.objApplicantListDTO.CarerStatusId = -1;

            this.BindApplicantList();
        }
        else {
            this.pComponent.alertDanger("Please contact administrator to assign the carer status for your role");
        }
    };

    fnLoadStatus(data) {
        //Multiselect dropdown array forming code.
        if (data) {
            data.forEach(item => {
                this.arrayStatus.push({ id: item.ModuleStatusCnfgId, name: item.StatusName });
            }
            );
        }
    }

    fnStatusChange(event:any)
    {
        if (event.value.length == 0)
            this.objApplicantListDTO.CarerStatusId = -1;
        else this.objApplicantListDTO.CarerStatusId = 0;

        this.objApplicantListDTO.CarerStatusIds = event.value;
        this.BindApplicantList();
    }

    fnClickAddApplicant() {
        this._router.navigate(['/pages/recruitment/initialenquiry/1/13']);
    }


    BindApplicantList() {
        this.applicantList = [];
        this.lstDraftTemp = [];
        this.loading = true;

        let AgencyProfileId: number = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objSaveDraftInfoDTO.FormCnfgId = 23;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = AgencyProfileId;
        let temApplicantList = [];

        if (this.objApplicantListDTO.CarerStatusId == 1 || this.objApplicantListDTO.CarerStatusId == -1) {
            this.apiService.post("SaveAsDraftInfo", "getall", this.objSaveDraftInfoDTO).then(data => {
                //Draft
                if (data != null && data.length > 0 && this.UserTypeId != 4) {
                    let jsonData: CarerInfo;
                    data.forEach(item => {
                        jsonData = JSON.parse(item.JsonList);
                        this.lstDraftTemp.push(jsonData);
                    });
                }
                //Main Table
                this.apiService.post(this.controllerName, "CarerParentAll", this.objApplicantListDTO).then(data => {
                    temApplicantList = data;
                    this.applicantList = this.lstDraftTemp.concat(temApplicantList);
                    this.loading = false;
                });

            });
        }
        else
        {
            //Main Table
            this.apiService.post(this.controllerName, "CarerParentAll", this.objApplicantListDTO).then(data => {
                this.applicantList = data;
                this.loading = false;
            });
        }

    }
    lstDraftTemp = [];
    fnLoadSaveDraft() {
    }
    ChangeStatus(statusId) {
        this.objApplicantListDTO.CarerStatusId = statusId;
        this.BindApplicantList();
    }
    ChangeAreaOffice(areaofficeID) {
        this.objApplicantListDTO.AreaOfficeid = areaofficeID;
        this.BindApplicantList();
    }

    ChangeCarerLoadingType(CarerLoadingTypeId)
    {
        this.objApplicantListDTO.CarerLoadingTypeId = CarerLoadingTypeId;
        this.BindApplicantList();
    }

    selectApplicant(item) {

        if (item.CarerCode == "Draft") {
            this.IsSelected = item.SequenceNo;
            Common.SetSession("IEDraftSequenceNo", item.SequenceNo);

            // sessionStorage.removeItem('CarerParentId');
            // sessionStorage.removeItem('CarerSSWId');
            // sessionStorage.removeItem('CarerSSWName');
            // sessionStorage.removeItem('SelectedApplicantProfile');
            Common.SetSession("CarerParentId", "0");
            this.ApplicantProfileVal.PCFullName = "";
            this.ApplicantProfileVal.SCFullName = "";
            this.ApplicantProfileVal.CarerCode = "";
            this.ApplicantProfileVal.CarerParentId = 0;
            this.ApplicantProfileVal.CarerId = 0;
            this.ApplicantProfileVal.CarerStatusName = "";
            this.ApplicantProfileVal.CarerStatusId = 0;
            this.ApplicantProfileVal.ContactInfo.City = "";
            this.ApplicantProfileVal.AreaOfficeName = "";
            this.ApplicantProfileVal.CreatedDate = null;
            this.ApplicantProfileVal.PersonalInfo.ImageId = 0;
            this.objApplicantProfileVal = this.ApplicantProfileVal;
            Common.SetSession("SelectedApplicantProfile", JSON.stringify(this.ApplicantProfileVal));
        }
        else {
            Common.SetSession("IEDraftSequenceNo", "0");
            let pcName = item.PCFullName;
            let scName = "";
            if (item.SCFullName != null)
                scName = item.SCFullName;

            this.selectName = pcName + scName;
            this.SelectCode = item.CarerCode;
            this.CarerStatusName = item.CarerStatusName;
            Common.SetSession("CarerParentId", item.CarerParentId);
            this.IsVisible = true;
            this.IsSelected = item.CarerParentId;

            this.apiService.get(this.controllerName, "GetSelectedCarerDetails", item.CarerParentId).then(data => {
                let selectCarerDetails = data;

                Common.SetSession("CarerSSWId", selectCarerDetails.SupervisingSocialWorkerId);
                Common.SetSession("CarerSSWName", selectCarerDetails.SupervisingSocialWorker);

                this.ApplicantProfileVal.PCFullName = item.PCFullName;
                this.ApplicantProfileVal.SCFullName = item.SCFullName;
                this.ApplicantProfileVal.CarerCode = item.CarerCode;
                this.ApplicantProfileVal.CarerParentId = item.CarerParentId;
                this.ApplicantProfileVal.CarerId = item.CarerId;
                this.ApplicantProfileVal.CarerStatusName = item.CarerStatusName;
                this.ApplicantProfileVal.CarerStatusId = item.CarerStatusId;
                this.ApplicantProfileVal.ContactInfo.City = item.ContactInfo.City;
                this.ApplicantProfileVal.AreaOfficeName = item.AreaOfficeName;
                this.ApplicantProfileVal.CreatedDate = item.DateOfEnquiry;
                this.ApplicantProfileVal.PersonalInfo.ImageId = item.PersonalInfo.ImageId;
                this.ApplicantProfileVal.SupervisingSocialWorker = selectCarerDetails.SupervisingSocialWorker;
                this.objApplicantProfileVal = new CarerParentDTO();
                this.objApplicantProfileVal = this.ApplicantProfileVal;
                this.headerCtrl.fnShowImage(item.PersonalInfo.ImageId);
                Common.SetSession("SelectedApplicantProfile", JSON.stringify(this.ApplicantProfileVal));

                //redirect
                if (this.objQeryVal.rid == 1)
                    this._router.navigate(['/pages/recruitment/carerapplication', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 2)
                    this._router.navigate(['/pages/recruitment/carerapprove', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 3)
                    this._router.navigate(['/pages/recruitment/backupcarerlist', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 4)
                    this._router.navigate(['/pages/recruitment/carerdaylogjournallist', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 5)
                    this._router.navigate(['/pages/recruitment/initialenquiry', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 6)
                    this._router.navigate(['/pages/recruitment/carerinitialhomevisit', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 7)
                    this._router.navigate(['/pages/recruitment/personaldetails', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 8)
                    this._router.navigate(['/pages/recruitment/carerfamily', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 9)
                    this._router.navigate(['/pages/recruitment/carertrainingprofilelist', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 10)
                    this._router.navigate(['/pages/superadmin/statutorychecklist/3/13']);
                else if (this.objQeryVal.rid == 12)
                    this._router.navigate(['/pages/recruitment/safercarepolicylist', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 13)
                    this._router.navigate(['/pages/recruitment/carerhealthandsafetylist', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 14)
                    this._router.navigate(['/pages/recruitment/carerpetquestionnairelist', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 15)
                    this._router.navigate(['/pages/fostercarer/carersupervisoryhomevisitlist', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 16)
                    this._router.navigate(['/pages/fostercarer/carerunannouncedhomevisitlist', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 17)
                    this._router.navigate(['/pages/fostercarer/carertransferclosingsummarylist', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 18)
                    this._router.navigate(['/pages/recruitment/carerstatuschange', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 19)
                    this._router.navigate(['/pages/recruitment/carerstatuschange', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 20)
                    this._router.navigate(['/pages/fostercarer/uploaddocuments', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 21)
                    this._router.navigate(['/pages/recruitment/swapcarer', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 22)
                    this._router.navigate(['/pages/recruitment/careroohreportlist', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 24)
                    this._router.navigate(['/pages/recruitment/carerformfaddendum/37']);
                else if (this.objQeryVal.rid == 25)
                    this._router.navigate(['/pages/recruitment/assessmentappointmentlist/37']);
                else if (this.objQeryVal.rid == 26)
                    this._router.navigate(['/pages/fostercarer/fccarerapprove', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 27)
                    this._router.navigate(['/pages/recruitment/carerchecklist', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 28)
                    this._router.navigate(['/pages/recruitment/apmlist', this.objQeryVal.mid]);
                else if (this.objQeryVal.rid == 29)
                    this._router.navigate(['/pages/recruitment/careraddresshistorylist/13']);
                else if (this.objQeryVal.rid == 30)
                    this._router.navigate(['/pages/recruitment/carermanagementdecisionlist/13']);
                else if (this.objQeryVal.rid == 31)
                    this._router.navigate(['/pages/recruitment/fireescapeplanlist/13']);


                else if (this.objQeryVal.rid == 32)
                    this._router.navigate(['/pages/recruitment/initialcheck/13']);
                else if (this.objQeryVal.rid == 33)
                    this._router.navigate(['/pages/recruitment/prospectivechecks/13']);
                else if (this.objQeryVal.rid == 34)
                    this._router.navigate(['/pages/recruitment/assessortrackerlist/13']);
                else if (this.objQeryVal.rid == 35)
                    this._router.navigate(['/pages/recruitment/carersnapshot/13']);
                else if (this.objQeryVal.rid == 36)
                    this._router.navigate(['/pages/recruitment/carerapplicationnew',this.objQeryVal.mid])
                else if (this.objQeryVal.rid == 37)
                  this._router.navigate(['/pages/recruitment/riskassessmentlist/13'])
            });
        }

        //   this.BindApplicantList();
    }

    deleteApplicant(item) {
        if (item != null && item.CarerCode == "Draft") {
            this.objSaveDraftInfoDTO.SequenceNo = item.SequenceNo;
            this.apiService.delete("SaveAsDraftInfo", this.objSaveDraftInfoDTO).then(data => this.Respone(data));
        }
        else {
            let carerid = item.CarerId;
            this.apiService.delete(this.controllerName, carerid).then(data => this.Respone(data));
        }
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            sessionStorage.removeItem('IEDraftSequenceNo');
            sessionStorage.removeItem('CarerParentId');
            sessionStorage.removeItem('CarerSSWId');
            sessionStorage.removeItem('CarerSSWName');
            Common.SetSession("CarerParentId", '0');
            Common.SetSession("IEDraftSequenceNo", '0');
            this.ApplicantProfileVal.PCFullName = "";
            this.ApplicantProfileVal.SCFullName = "";
            this.ApplicantProfileVal.CarerCode = "";
            this.ApplicantProfileVal.CarerParentId = 0;
            this.ApplicantProfileVal.CarerId = 0;
            this.ApplicantProfileVal.CarerStatusName = "";
            this.ApplicantProfileVal.CarerStatusId = 0;
            this.ApplicantProfileVal.ContactInfo.City = "";
            this.ApplicantProfileVal.AreaOfficeName = "";
            this.ApplicantProfileVal.CreatedDate = null;
            this.ApplicantProfileVal.PersonalInfo.ImageId = 0;
            this.objApplicantProfileVal = this.ApplicantProfileVal;
            Common.SetSession("SelectedApplicantProfile", JSON.stringify(this.ApplicantProfileVal));

            this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.BindApplicantList();
        }
    }
    getRowClass =(row)=>{
      return {
        'rowSelected': this.IsSelected!=0&&(row.CarerParentId==this.IsSelected || row.SequenceNo==this.IsSelected)
      }
    }
    setRowsPerPage(e)
    {
      this.pageSize = e.target.innerHTML;
    }
}
