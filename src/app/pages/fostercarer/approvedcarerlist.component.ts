import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { ApplicantListDTO, CarerInfo } from '../recruitment/DTO/carerinfo';
import { CarerParentDTO } from '../recruitment/DTO/carerparent';
import { APICallService } from '../services/apicallservice.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
@Component({
    selector: 'ApprovedCarerList',
    templateUrl: './approvedcarerlist.component.template.html',
})



export class ApprovedCarerListComponet {
    public searchText: string = "";
    controllerName = "CarerInfo";
    pageNumber: number = 0;
    ColumnMode = ColumnMode;
    @ViewChild('header') headerCtrl;
    @ViewChild('ngxdatatable') ngxdatatable: any;
    selectName;
    SelectCode;
    lstSSW;
    CarerStatusName;
    applicantList: CarerInfo[] = [];
    objApplicantListDTO: ApplicantListDTO = new ApplicantListDTO();
    CarerStatusId;
    carerStatusList;
    areaOfficeList;
    agencyId;
    AreaOfficeid;
    IsVisible = false;
    IsSelected = 0;
    objQeryVal;
    loading = false;
    insCarerDetails;
    CarerProfileVal: CarerParentDTO = new CarerParentDTO();
    objCarerProfileVal: CarerParentDTO = new CarerParentDTO();
    insUserTypeId;
    UserTypeId = 0;
    CanSeeAllCarer="0";
    //Snapshot Popup
    insSnpCarerId;
    @ViewChild('btnSnapshot') infobtnSnapShot: ElementRef;
    insUserProfileId = 0;
    footerMessage = {
      'emptyMessage' : '',
      'totalMessage' : 'Carers'
    };
    limitPerPage:number = 10;
    arrayStatus = [];
    selectedStatus;
        constructor(private _router: Router,
        private activatedroute: ActivatedRoute,
        private renderer: Renderer2,
        private apiService: APICallService,
        private pComponent: PagesComponent) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
        this.insUserTypeId=Common.GetSession("UserTypeId");

        this.insUserTypeId = parseInt(Common.GetSession("UserTypeId"));
        this.insUserProfileId = parseInt(Common.GetSession("UserProfileId"));
        if (this.insUserTypeId != 4 )
            this.apiService.get("CarerSocialWorkerMapping", "GetAll").then(data => { this.lstSSW = data });
        else
            this.apiService.get("CarerSocialWorkerMapping", "GetAllByCarerUserProfileId", this.insUserProfileId).then(data => { this.lstSSW = data });

        this.CanSeeAllCarer = Common.GetSession("CanSeeAllCarer");
       // console.log(this.CanSeeAllCarer);
        if(this.insUserTypeId==3 && this.CanSeeAllCarer=="1")
          this.objApplicantListDTO.CarerLoadingTypeId=1;
        else if(this.insUserTypeId==3 && this.CanSeeAllCarer=="0")
          this.objApplicantListDTO.CarerLoadingTypeId=0;

        if (Common.GetSession("ACarerParentId") != "0" || Common.GetSession("ACarerParentId") != null) {
            this.IsVisible = true;

        } else
            this.IsVisible = false;

        if (this.insCarerDetails != null)
            this.IsSelected = parseInt(this.insCarerDetails.CarerParentId);// parseInt(Common.GetSession("ACarerParentId"));


        //Bind AreaOffice
        this.agencyId = Common.GetSession("AgencyProfileId");
        this.apiService.get("AreaOfficeProfile", "GetByUserMapping").then(data => { this.areaOfficeList = data; });
        this.objApplicantListDTO.AreaOfficeid = 0;

        //Bind Carer Status
        this.apiService.get("ModuleStausCnfg", "GetByModuleId", 3).then(data => { this.ResponseBindStatus(data); });
    }
    onSort($event){
      this.ngxdatatable.offset = this.pageNumber ;
    }
    onFooterPageChange($event){
      this.pageNumber = $event.page - 1;
    }

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
            this.objApplicantListDTO.CarerStatusId = -2;
        else this.objApplicantListDTO.CarerStatusId = 0;
        this.objApplicantListDTO.CarerStatusIds = event.value;
        this.BindApplicantList();
    }




    ResponseBindStatus(data) {

        //  console.log(data);
        if (data.length > 0) {
           // this.carerStatusList = data;
           this.fnLoadStatus(data);
            //set default
            let defaultval = data.filter(x => x.IsDefault != 0);
            if (defaultval.length > 0)
            {
                this.objApplicantListDTO.CarerStatusId = defaultval[0].IsDefault;
                let temp:any=[];
                temp.push(defaultval[0].IsDefault)
                this.selectedStatus=temp;
            }else
                this.objApplicantListDTO.CarerStatusId = -2;
            this.BindApplicantList();
        }
        else {
            this.pComponent.alertDanger("Please contact administrator to assign the carer staus for your role");
        }
    };

    showTerminatedDeRegisteredDate=false;
    BindApplicantList() {
        this.applicantList = [];
        this.loading = true;
        this.apiService.post(this.controllerName, "CarerParentAll", this.objApplicantListDTO).then(data => {
            this.loading = false;
            data.filter(x=>x.CarerStatusId!=16).forEach(element => {
                element.TerminatedDeRegisteredDate="";
            });
            this.applicantList = data;
            if(data.filter(x=>x.CarerStatusId==16).length>0)
            {
                this.showTerminatedDeRegisteredDate=true;
            }
            else
            {
                this.showTerminatedDeRegisteredDate=false;
            }
        });
    }


    fnSnapShot(carerID) {
        if(this.insUserTypeId!="4")
        {
        this.insSnpCarerId = carerID;
        let event = new MouseEvent('click', { bubbles: true });
        this.infobtnSnapShot.nativeElement.dispatchEvent(event);
        }

    }
    ChangeCarerLoadingType(CarerLoadingTypeId)
    {
        this.objApplicantListDTO.CarerLoadingTypeId = CarerLoadingTypeId;
        this.BindApplicantList();
    }
    ChangeStatus(statusId) {
        this.objApplicantListDTO.CarerStatusId = statusId;
        this.BindApplicantList();
    }
    ChangeAreaOffice(areaofficeID) {

        this.objApplicantListDTO.AreaOfficeid = areaofficeID;
        this.BindApplicantList();
    }

    ChangeSSW(SSWId) {

      this.objApplicantListDTO.SupervisingSocialWorkerId = SSWId;
      this.BindApplicantList();
    }

    selectApplicant(item) {
        let pcName = item.PCFullName;
        let scName = "";
        if (item.SCFullName != null)
            scName = item.SCFullName


        this.selectName = pcName + scName;
        this.SelectCode = item.CarerCode;
        this.CarerStatusName = item.CarerStatusName;
        Common.SetSession("ACarerParentId", item.CarerParentId);
        this.IsVisible = true;
        this.IsSelected = item.CarerParentId;

        this.apiService.get(this.controllerName, "GetSelectedCarerDetails", item.CarerParentId).then(data => {
            let selectCarerDetails = data;


            Common.SetSession("ACarerSSWId", selectCarerDetails.SupervisingSocialWorkerId);
            Common.SetSession("ACarerSSWName", selectCarerDetails.SupervisingSocialWorker);

            this.CarerProfileVal.PCFullName = item.PCFullName;
            this.CarerProfileVal.SCFullName = item.SCFullName;
            this.CarerProfileVal.CarerCode = item.CarerCode;
            this.CarerProfileVal.CarerParentId = item.CarerParentId;
            this.CarerProfileVal.CarerId = item.CarerId;
            this.CarerProfileVal.CarerStatusName = item.CarerStatusName;
            this.CarerProfileVal.CarerStatusId = item.CarerStatusId;
            this.CarerProfileVal.ContactInfo.City = item.ContactInfo.City;
            this.CarerProfileVal.ContactInfo.AddressLine1 = item.ContactInfo.AddressLine1;
            this.CarerProfileVal.ContactInfo.HomePhone = item.ContactInfo.HomePhone;
            this.CarerProfileVal.ContactInfo.MobilePhone = item.ContactInfo.MobilePhone;
            this.CarerProfileVal.ContactInfo.EmailId = item.ContactInfo.EmailId;
            this.CarerProfileVal.AreaOfficeName = item.AreaOfficeName;
            this.CarerProfileVal.ApprovalDate = item.ApprovalDate;
            this.CarerProfileVal.PersonalInfo.ImageId = item.PersonalInfo.ImageId;
            this.CarerProfileVal.AvailableVacancies = selectCarerDetails.AvailableVacancies;
            this.CarerProfileVal.ApproveVacancies = selectCarerDetails.ApproveVacancies;
            this.CarerProfileVal.SupervisingSocialWorker = selectCarerDetails.SupervisingSocialWorker;

            this.CarerProfileVal.ApprovedGender = selectCarerDetails.ApprovedGender;
            this.CarerProfileVal.CategoryofApproval = selectCarerDetails.CategoryofApproval;
            this.CarerProfileVal.AgeRange = selectCarerDetails.AgeRange;
            this.CarerProfileVal.SiblingGroupAcceptible = selectCarerDetails.SiblingGroupAcceptible;

            this.objCarerProfileVal = this.CarerProfileVal;
            this.headerCtrl.fnShowImage(item.PersonalInfo.ImageId);
            Common.SetSession("SelectedCarerProfile", JSON.stringify(this.CarerProfileVal));



            //redirect
            if (this.objQeryVal.rid == 1)
                this._router.navigate(['/pages/fostercarer/carerapplication', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 2)
                this._router.navigate(['/pages/fostercarer/approvalmatching', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 3)
                this._router.navigate(['/pages/fostercarer/backupcarerlist', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 4)
                this._router.navigate(['/pages/recruitment/carerdaylogjournallist', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 5)
                this._router.navigate(['/pages/fostercarer/fcinitialenquiry', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 6)
                this._router.navigate(['/pages/fostercarer/fccarerinitialhomevisit', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 7)
                this._router.navigate(['/pages/fostercarer/fcpersonaldetails', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 8)
                this._router.navigate(['/pages/fostercarer/facarerfamily', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 9)
                this._router.navigate(['/pages/fostercarer/carertrainingprofilelist', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 10)
                this._router.navigate(['/pages/superadmin/statutorychecklist/3/3']);
            else if (this.objQeryVal.rid == 11)
                this._router.navigate(['/pages/fostercarer/annualreviewlist/3']);
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
                this._router.navigate(['/pages/fostercarer/fccarerstatuschange', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 20)
                this._router.navigate(['/pages/fostercarer/uploaddocuments', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 21)
                this._router.navigate(['/pages/recruitment/swapcarer', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 22)
                this._router.navigate(['/pages/fostercarer/careroohreportlist', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 23)
                this._router.navigate(['/pages/fostercarer/carerplacementrefusalinfolist', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 24)
                this._router.navigate(['/pages/fostercarer/carerformfaddendum/36']);
            else if (this.objQeryVal.rid == 25)
                this._router.navigate(['/pages/fostercarer/assessmentappointmentlist/36']);
            else if (this.objQeryVal.rid == 26)
                this._router.navigate(['/pages/fostercarer/fccarerapprove', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 27)
                this._router.navigate(['/pages/fostercarer/placementdischargehistory', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 28)
                this._router.navigate(['/pages/fostercarer/careraddresshistorylist', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 29)
                this._router.navigate(['/pages/fostercarer/carerchecklist', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 30)
                this._router.navigate(['/pages/fostercarer/holidaydetailslist', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 31)
                this._router.navigate(['/pages/fostercarer/fcapmlist', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 32)
                this._router.navigate(['/pages/fostercarer/allegationlist', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 33)
                this._router.navigate(['/pages/fostercarer/complaintslist', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 34)
                this._router.navigate(['/pages/fostercarer/incidentlist', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 35)
                this._router.navigate(['/pages/fostercarer/carerimmunisationinfolist', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 36)
                this._router.navigate(['/pages/fostercarer/carerchronologyofevent', this.objQeryVal.mid]);
            else if (this.objQeryVal.rid == 37)
                this._router.navigate(['/pages/fostercarer/shvnonplacementlist', 3]);
            else if (this.objQeryVal.rid == 38)
                this._router.navigate(['/pages/fostercarer/familyguide', 3]);
            else if (this.objQeryVal.rid == 39)
                this._router.navigate(['/pages/fostercarer/irmdeterminationlist', 3]);
            else if (this.objQeryVal.rid == 40)
                this._router.navigate(['/pages/fostercarer/carermanagementdecisionlist', 3]);
            else if (this.objQeryVal.rid == 41)
                this._router.navigate(['/pages/fostercarer/fireescapeplanlist', 3]);
            else if (this.objQeryVal.rid == 42)
                this._router.navigate(['/pages/fostercarer/carersnapshot', 3]);
            else if (this.objQeryVal.rid == 43)
                this._router.navigate(['/pages/fostercarer/complementslist', 3]);
            else if (this.objQeryVal.rid == 44)
                this._router.navigate(['/pages/fostercarer/matchingchecklist', 3]);
             else if (this.objQeryVal.rid == 45)
                this._router.navigate(['/pages/fostercarer/carerpolicies', 3]);
            else if (this.objQeryVal.rid == 46)
                this._router.navigate(['/pages/fostercarer/disclosurelist', 15]);
            else if (this.objQeryVal.rid == 47)
                this._router.navigate(['/pages/fostercarer/annualreviewlistrainbow', 3]);
            else if (this.objQeryVal.rid == 48)
                this._router.navigate(['/pages/fostercarer/ofstednotificationlist', 3]);
            else if (this.objQeryVal.rid == 49)
                this._router.navigate(['/pages/fostercarer/Schedule6list', 15]);
            else if (this.objQeryVal.rid == 50)
              this._router.navigate(['/pages/fostercarer/riskassessmentlist/3']);
            else if (this.objQeryVal.rid == 51)
              this._router.navigate(['/pages/fostercarer/annualreviewlistnurture/3']);

        });

       /// this.BindApplicantList();
    }



    deleteApplicant(delData) {

        //this._carerService.post(delData, "delete").then(data => this.Respone(data));
        this.apiService.get(this.controllerName, delData).then(data => this.Respone(data));
    }

    private Respone(data) {

        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.BindApplicantList();

        }
    }
    getRowClass =(row)=>{
      return {
        'rowSelected':row.CarerParentId==this.IsSelected
      }
    }
    setPageSize(pageSize:string){
      this.limitPerPage = parseInt(pageSize);
    }
}
