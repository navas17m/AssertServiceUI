import { Component, ViewEncapsulation, Input, OnInit, ViewChild, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { AppConfig } from "../../app.config";
import {  Common } from '../common'
import { BaseDTO } from '../basedto'
import {DashboardResolver} from './dashbordresolver.service'
import { ActivatedRoute } from '@angular/router';
import { APICallService } from '../services/apicallservice.service';
import {PagesComponent} from '../pages.component';
import { ChartConfiguration, ChartOptions } from 'chart.js';

declare var $: any;

@Component({
    selector: 'az-dashboard',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent implements OnInit {
    @ViewChild('btnViewChildIncidentDetails') btnViewChildIncidentDetails: ElementRef;
    @ViewChild('btnViewDetails') btnViewDetails: ElementRef;
    @ViewChild('btnViewGridDetails') btnViewGridDetails: ElementRef;

    UserTypeId: number;
    returnVal;
    inputVal;
    objDashbordInfo: DashboardDTO = new DashboardDTO();
    objDashbordInfoLanding: DashboardDTO = new DashboardDTO();
    objDashbordInfoScroll: DashboardDTO = new DashboardDTO();
    objCarerEthnicity;
    objChildEthnicity = [];
    objPlacementoffer;
    objChildPlacementType;
    objSchedule7Notification;
    objBehaviourNameWithColor;
    objobjChildDisability;
    objChildIncident;
    objCarerApprovedDetails;
    objCarerSocialWorker;
    objDashboardInfoDTO: DashboardDTOInfo = new DashboardDTOInfo();
    objDashboardDTO: DashboardDTO = new DashboardDTO();
    footerMessage={
      'emptyMessage': '',
      'totalMessage': ' Records'
    };
    objColor = ['success', 'primary', 'warning', 'danger', 'info',  'main',
                'success', 'primary', 'warning', 'danger', 'info',  'main',
                'success', 'primary', 'warning', 'danger', 'info',  'main',
                'success', 'primary', 'warning', 'danger', 'info',  'main',
                'success', 'primary', 'warning', 'danger', 'info',  'main',
                'success', 'primary', 'warning', 'danger', 'info',  'main',
                'success', 'primary', 'warning', 'danger', 'info',  'main'];
      carerEthnicityColumns =[
          {name:'Ethnicity',prop:'EthnicityName',sortable:true,width:50},
          {name:'PC Count',prop:'Count',sortable:true,width:20},
          {name:'SC Count',prop:'scCount',sortable:true,width:20}];
      childEthnicityColumns =[
          {name:'Ethnicity',prop:'EthnicityName',sortable:true,width:50},
          {name:'Count',prop:'Count',sortable:true,width:20},
          ];
      schedule7Columns =[
          {name:'Notification Type',prop:'EthnicityName',sortable:true,width:50},
          {name:'Count',prop:'Count',sortable:true,width:10},
          ];
      carerApprovalColumns =[
            {name:'Name',prop:'CarerName',sortable:true,width:50},
            {name:'Approved',prop:'ApprovedVacancy',sortable:true,width:20},
            {name:'Available',prop:'AvailableVacancy',sortable:true,width:20}];
      childDisabilityColumns =[
          {name:'Disability',prop:'EthnicityName',sortable:true,width:50},
          {name:'Count',prop:'Count',sortable:true,width:10},
          ];
    lstBehaviourType = ['Addictive Tendancies', 'Offending Tendancies', 'Mental Health Issues', 'Placement Issues'];
    public data: any;
    public bubbles: any;
    //Chart
    public config: any;
    public configFn: any;

    public lineChartType:string = 'bar';
    public lineChartData: ChartConfiguration<'line'>['data'] = { datasets: [] };
    public lineChartOptions: ChartOptions<'line'>;

    //public doughnutChartType: string = 'pie';
    public pieChartType: string = 'doughnut';
    public pieChartData: ChartConfiguration<'pie'>['data'] = { datasets: [] };
    public pieChartOptions: ChartOptions<'pie'>;
    public pieChartLegend: boolean = true;


    ClosedFinacialYear: number = 0;
    CurrentFinacialYear: number = 0;
    PlacedFinacialYear: number = 0;
    DischargedFinacialYear: number = 0;

    currentFinancialYear: number;
    showFinancialYear = false;
    showAll=false;
    chartCarerCount;
    chartChildCount;
    self;
    agencyId;
    areaOfficeList = [];
    LodingOnScroll = false;
    IsScrolled = false;
    @HostListener('window:scroll')
    _onWindowScroll(): void {
        if (window.scrollY > 550 && this.IsScrolled == false) {
            this.IsScrolled = true;
            this.bindScrolleDbashBordInfo();
        }
    }
    constructor(private apiService: APICallService, private modal: PagesComponent, rs: DashboardResolver,
        private route: ActivatedRoute, private _appConfig: AppConfig, private renderer: Renderer2) {
        // this.config = this._appConfig.config;
        // this.configFn = this._appConfig;
        // this.IsScrolled = false;
        // this.LodingOnScroll = false;
        // this.UserTypeId = parseInt(Common.GetSession("UserTypeId"));
        // let data = this.route.snapshot.data['getDashboarDataRS'];
        // //console.log(data);
        // // this.fnChartData(data);
        // if( this.UserTypeId==3)
        //     this.objDashbordInfo=data;
        // this.objDashbordInfoLanding = data;
        // if (this.objDashbordInfoLanding.IsShowDashboard)
        //     this.showFinancialYear = true;
        // // IsShowDashboard
        // //  this.fnChartData(this.route.snapshot.data['getDashboarData']);
        // //  let dta = this.route.snapshot.data['getDashboarData'];

        // //Bind AreaOffice
        // this.agencyId = Common.GetSession("AgencyProfileId");
        // this.apiService.get("AreaOfficeProfile", "GetByUserMapping").then(data => { this.areaOfficeList = data; });
        // if(Common.GetSession("First")=="1")
        // {
        //      Common.SetSession("First", "0");
        //      let PasswordExpiryDateCount=parseInt(Common.GetSession("PasswordExpiryDateCount"));
        //      if(PasswordExpiryDateCount<30 && PasswordExpiryDateCount>0)
        //          this.modal.showInfo("Your password is going to expire in "+PasswordExpiryDateCount+ " day(s)");
        // }
    }

    fnShowAll()
    {
        this.showAll=!this.showAll;
        this.objDashboardDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objDashboardDTO.UserTypeId = parseInt(Common.GetSession("UserTypeId"));
        this.objDashboardDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
        this.apiService.post("Dashboard", "GetDashboardInfo", this.objDashboardDTO).then(data => {

            this.objDashbordInfo=data;
            this.fnOnInit();
        });
    }
    bindScrolleDbashBordInfo() {
        this.objDashboardDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objDashboardDTO.UserTypeId = parseInt(Common.GetSession("UserTypeId"));
        this.objDashboardDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
        this.apiService.post("Dashboard", "GetScrolledDashboardInfo", this.objDashboardDTO).then(data => this.responseScrolledDbashBordInfo(data));
    }


    responseScrolledDbashBordInfo(data) {
        this.LodingOnScroll = true;
        this.objDashbordInfoScroll = data;
        //  console.log("scrolled " + this.objDashbordInfoScroll.NoofInitialEnquiryReceived);
        ///scrolled info data
        if (this.objDashbordInfoScroll) {
            this.objChildEthnicity = this.objDashbordInfoScroll.ChildEthnicity;
            if (this.objDashbordInfoScroll.ChildEthnicity2 != null && this.objDashbordInfoScroll.ChildEthnicity2.length > 0) {

                this.objDashbordInfoScroll.ChildEthnicity2.forEach(item => {

                    let findEthi = this.objChildEthnicity.filter(x => x.EthnicityId == item.EthnicityId);
                    if (findEthi.length > 0) {
                        findEthi[0].Count = findEthi[0].Count + item.Count;
                    }
                    else {
                        this.objChildEthnicity.push(item);
                    }
                })
            }
            this.objPlacementoffer = this.objDashbordInfoScroll.CarerPlacementoffer;
           // console.log(this.objPlacementoffer);
            this.objChildPlacementType = this.objDashbordInfoScroll.ChildPlacementoffer;
            this.objCarerSocialWorker = this.objDashbordInfoScroll.DashboardCarerSocialWorker;
            this.fnChartData(data);
            //this.ngOnInit();
            this.fnOnInit();
        }
    }


    fnAreaOfficceChange(val) {
        if (val != null && val != "") {
            this.modal.PageLoading();
            this.objDashbordInfo.IsShowDashboard = false;
            this.objDashboardInfoDTO.AreaOfficeProfileId = val;
            this.objDashboardInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objDashboardInfoDTO.UserTypeId = parseInt(Common.GetSession("UserTypeId"));
            this.objDashboardInfoDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
            this.apiService.post("Dashboard", "GetDashboardInfo", this.objDashboardInfoDTO).then(data => {
                this.responseYearChange(data);
            });
        }
    }

    fnYearChange(val) {
        if (val != null && val != "") {
            this.currentFinancialYear = val;
            this.modal.PageLoading();
            this.objDashbordInfoScroll.IsShowDashboard = false;
            this.objDashboardInfoDTO.FinancialYear = val;
            this.objDashboardInfoDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objDashboardInfoDTO.UserTypeId = parseInt(Common.GetSession("UserTypeId"));
            this.objDashboardInfoDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
            this.apiService.post("Dashboard", "GetScrolledDashboardInfo", this.objDashboardInfoDTO).then(data => {
                //  this.objDashbordInfo.IsShowDashboard = true;
                // console.log(data);
                //  this.fnChartData(data);
                this.responseYearChange(data);
                // this.objDashbordInfo = data;
                // console.log("Dashboard");
                // console.log(this.objDashbordInfo);
                //  this.modal.PageLoadingStop();
            });
        }

    }

    responseYearChange(data) {
        //this.objDashbordInfoScroll = null;
        this.objDashbordInfoScroll = new DashboardDTO();
        //  console.log("Dashboard1");
        //  console.log(this.objDashbordInfo);
        // console.log("Dashboard2");
        this.objDashbordInfoScroll = data;

        this.objChildEthnicity = this.objDashbordInfoScroll.ChildEthnicity;
        if (this.objDashbordInfoScroll.ChildEthnicity2 != null && this.objDashbordInfoScroll.ChildEthnicity2.length > 0) {

            this.objDashbordInfoScroll.ChildEthnicity2.forEach(item => {

                let findEthi = this.objChildEthnicity.filter(x => x.EthnicityId == item.EthnicityId);
                if (findEthi.length > 0) {
                    findEthi[0].Count = findEthi[0].Count + item.Count;
                }
                else {
                    this.objChildEthnicity.push(item);
                }
            })
        }
        this.objPlacementoffer = this.objDashbordInfoScroll.CarerPlacementoffer;
        this.objChildPlacementType = this.objDashbordInfoScroll.ChildPlacementoffer;
        this.objCarerSocialWorker = this.objDashbordInfoScroll.DashboardCarerSocialWorker;
        this.fnChartData(data);
        //  this.ngOnInit();
        //  console.log(this.objCarerSocialWorker);
        this.fnLoadChart();
        this.modal.PageLoadingStop();
    }

    minYear;
    maxYear;
    public ngAfterViewInit(): void {

        let date = new Date();
        let m = date.getMonth() + 1;
        let y = date.getFullYear();

        if (m < 4)
            y = y - 1;

        this.minYear = y - 1;
        this.maxYear = y;
        this.currentFinancialYear = this.maxYear;
        // const component = this;
        // (<any>jQuery(".dial").val(this.maxYear)).knob({
        //     min: this.minYear,
        //     max: this.maxYear,
        //     lineCap: 'butt',//'butt',
        //     displayPrevious: true,
        //     bgColor: this.configFn.rgba(this.config.colors.default, 0.9),
        //     fgColor: this.config.colors.sidebarBgColor,
        //     inputColor: '#024a88',
        //     width: '100',
        //     height: '100',
        //     thickness: .2,
        //     release: function (year) {
        //         component.fnYearChange(year);
        //         return null;
        //     },
        //     change: null,
        //     draw: null,
        // });
    }


    public fnSetImage(image) {
        if (image) {
            return "data:image/jpeg;base64," + image;
        }
        else
            return "assets/img/app/Photonotavail.png";
    }

    fnChartData(data) {
        this.ClosedFinacialYear = data.ClosedFinacialYear;
        this.CurrentFinacialYear = data.CurrentFinacialYear;
        this.PlacedFinacialYear = data.PlacedFinacialYear;
        this.DischargedFinacialYear = data.DischargedFinacialYear;
        this.chartCarerCount = data.chartCarerCount;
        this.chartChildCount = data.chartChildCount;
    }
    carerApprovedDetails=[];
    ngOnInit() {
        if(this.UserTypeId==3)
        {
            this.fnOnInit();
        }

    }
    fnLoadChart():void{
      this.lineChartData.labels = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
      this.lineChartData.datasets = [
          {
              data: this.chartCarerCount,
              label: 'Carer',
              fill: true,
              tension: 0.5,
              borderWidth: 2,
              backgroundColor: this.configFn.rgba(this.config.colors.danger, 0.5),
              borderColor: this.config.colors.danger,
              pointBorderColor: this.config.colors.default,
              pointHoverBorderColor:  this.config.colors.danger,
              pointHoverBackgroundColor: this.config.colors.default,
              hoverBackgroundColor:  this.config.colors.danger
          },
          {
              data: this.chartChildCount,
              label: 'Child',
              fill: true,
              tension: 0.5,
              borderWidth: 2,
              backgroundColor: this.configFn.rgba(this.config.colors.info, 0.5),
              borderColor: this.config.colors.info,
              pointBorderColor: this.config.colors.default,
              pointHoverBorderColor:  this.config.colors.info,
              pointHoverBackgroundColor: this.config.colors.default,
              hoverBackgroundColor:  this.config.colors.info
          },
      ];
      this.lineChartOptions = {
          scales: {
              y: {
                  display: true,
                  beginAtZero: true,
                  ticks: {
                      color: this.configFn.rgba(this.config.colors.gray, 0.7),
                      stepSize: 5000
                  },
                  grid: {
                      display: true,
                      color: this.configFn.rgba(this.config.colors.gray, 0.1)
                  }
              },
              x: {
                  display: true,
                  beginAtZero: true,
                  ticks: {
                      color: this.configFn.rgba(this.config.colors.gray, 0.7)
                  },
                  grid: {
                      display: true,
                      color: this.configFn.rgba(this.config.colors.gray, 0.1)
                  }
              }
          },
          plugins: {
              legend: {
                  display: true,
                  labels: {
                      color: this.configFn.rgba(this.config.colors.gray, 0.9),
                  }
              },
              tooltip: {
                  enabled: true,
                  backgroundColor: this.configFn.rgba(this.config.colors.main, 0.7)
              }
          }
      }
      this.pieChartData.labels = ['Closed', 'Current', 'Placed', 'Discharged'];
      this.pieChartData.datasets = [{
        data: [this.ClosedFinacialYear, this.CurrentFinacialYear, this.PlacedFinacialYear, this.DischargedFinacialYear],
        backgroundColor: [
          this.configFn.rgba(this.config.colors.danger, 0.7),
          this.configFn.rgba(this.config.colors.warning, 0.7),
          this.configFn.rgba(this.config.colors.success, 0.7),
          this.configFn.rgba(this.config.colors.info, 0.7)
        ],
        hoverBackgroundColor: [
          this.config.colors.danger,
          this.config.colors.warning,
          this.config.colors.success,
          this.config.colors.info
        ],
        borderColor: this.config.colors.grayLight,
        borderWidth: 1,
        hoverBorderWidth: 3
      }];
      this.pieChartOptions = {
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: this.configFn.rgba(this.config.colors.gray, 0.9),
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: this.configFn.rgba(this.config.colors.main, 0.7)
            }
        }
      };

    }
    fnOnInit()
    {
        if (this.objDashbordInfo) {
            this.objCarerEthnicity = this.objDashbordInfo.CarerEthnicity;
          //  this.objChildEthnicity = this.objDashbordInfo.ChildEthnicity;
            if (this.objDashbordInfo.ChildEthnicity2 != null && this.objDashbordInfo.ChildEthnicity2.length > 0) {

                this.objDashbordInfo.ChildEthnicity2.forEach(item => {

                    let findEthi = this.objChildEthnicity.filter(x => x.EthnicityId == item.EthnicityId);
                    if (findEthi.length > 0) {
                        findEthi[0].Count = findEthi[0].Count + item.Count;
                    }
                    else {
                        this.objChildEthnicity.push(item);
                    }
                })
            }

           // this.objPlacementoffer = this.objDashbordInfo.CarerPlacementoffer;
           /// this.objChildPlacementType = this.objDashbordInfo.ChildPlacementoffer;

            this.objSchedule7Notification = this.objDashbordInfo.Schedule7Notification;
            this.objBehaviourNameWithColor = this.objDashbordInfo.ChildBehaviourColorMapping;
            this.objobjChildDisability = this.objDashbordInfo.ChildDisability;
            this.objCarerSocialWorker = this.objDashbordInfo.DashboardCarerSocialWorker;
            this.objChildIncident = this.objDashbordInfo.ChildIncident;
            this.objCarerApprovedDetails = this.objDashbordInfo.CarerApprovedDetails;
            this.carerApprovedDetails = this.objCarerApprovedDetails.map(item => ({
              ...item,CarerName : item.PCCarerName + item.SCCarerName + '(' + item.CarerCode + ')'
            }) );

            //  console.log(this.objCarerSocialWorker);
            this.fnLoadChart();
        }
    }
    isDefaultSortOrderVal: string;
    lstIncidentInfo = [];
    fnChildIncidentDetailView(ctvId) {
        this.lstIncidentInfo = [];
        this.apiService.get("Dashboard", "GetChildIncidentDetailsByCTVId", ctvId).then(data => {
            this.lstIncidentInfo = data;
            this.isDefaultSortOrderVal = "desc";
        });
        let event = new MouseEvent('click', { bubbles: true });
        this.btnViewChildIncidentDetails.nativeElement.dispatchEvent(event);
    }
    lstGridDetails = [];
    insGridTitle;
    loadingGrid=false;
    insDetailsGrid;
    insDetailsVisibleGrid=false;
    fnGridDetailView(typeId,type)
    {
        this.lstGridDetails = [];
        this.insDetailsVisibleGrid=false;
        this.loadingGrid=true;
        let obj=new DashboardTopDetailsDTO();
        obj.Type=type;
        obj.TypeId=typeId;
        obj.AreaOfficeProfileId=this.objDashboardInfoDTO.AreaOfficeProfileId;
        //alert(type);
        this.apiService.post("Dashboard", "GetGridDetails", obj).then(data => {
            this.lstGridDetails = data;
           // console.log(data);
            this.loadingGrid=false;
        });


        switch(type)
        {
            case 'ApprovedCarerEthnicity':
                this.insGridTitle='Approved Carer Ethnicity';
                this.insDetailsVisibleGrid=true;
                break;
            case 'ApprovedCarerPlaces':
                this.insGridTitle='Approved Carer Places';
                this.insDetailsVisibleGrid=true;
                break;
            case 'PlacedChildrenDisability':
                this.insGridTitle='Placed Children Disability';
                this.insDetailsVisibleGrid=true;
                break;
        }

        this.lstGridDetails = [];
        let event = new MouseEvent('click', { bubbles: true });
        this.btnViewGridDetails.nativeElement.dispatchEvent(event);

    }


    popupDetailsColumns =[];
    lstDetails = [];
    insTitle;
    loading=false;
    insDetails;
    insDetailsVisible=false;
    fnDetails(type,typeId)
    {

        this.insDetailsVisible=false;
        this.loading=true;
        let obj=new DashboardTopDetailsDTO();
        obj.Type=type;
        obj.TypeId=typeId;
        obj.AreaOfficeProfileId=this.objDashboardInfoDTO.AreaOfficeProfileId;
        this.insTitle=type;
        //alert(type);
        this.lstDetails = [];
        this.apiService.post("Dashboard", "GetTopDetails", obj).then(data => {
            data.map((i:any)=>{
                let code=i.Code!=null?' ('+i.Code+')':''
                let scName=i.SCName!=null?i.SCName:''
                i.fullName=i.Name+ scName+code,
                i.AreChecksRequired=i.AreChecksRequired?'Yes':'No'
                i.backupCarerName=i.Details+code

                let LstAssignedFosterCarerNames="";
                if (i.LstAssignedFosterCarerNames && i.LstAssignedFosterCarerNames.length > 0) {
                    i.LstAssignedFosterCarerNames.forEach(element => {
                        LstAssignedFosterCarerNames += element + ','
                    });
                }
            })
            console.log(data);
            this.lstDetails = data;
            this.loading=false;

            switch(type)
            {
                case 'Current Referral':
                    this. popupDetailsColumns =[
                        {name:'Child / Young person Name',prop:'fullName',sortable:true,width:200},
                        {name:'Referral Date',prop:'ReferralDate',sortable:true,width:200,datetime:'Y'},
                        {name:'Recommended Carer',prop:'Details',sortable:true,width:200}];

                    this.insDetails='Recommended Carer';
                    this.insDetailsVisible=true;
                    break;
                case 'Closed Referral':
                    this. popupDetailsColumns =[
                        {name:'Child / Young person Name',prop:'fullName',sortable:true,width:200},
                        {name:'Recommended Carer',prop:'Details',sortable:true,width:200}];
                    this.insDetails='Recommended Carer';
                    this.insDetailsVisible=true;

                    break;
                case 'Placed':
                    this. popupDetailsColumns =[
                        {name:'Child / Young person Name',prop:'fullName',sortable:true,width:200},
                        {name:'Foster Carer Name',prop:'CarerName',sortable:true,width:200},
                        {name:'Placement Date',prop:'PlacementDate',sortable:true,width:200,datetime:'Y'},
                        {name:'LA Name',prop:'LAName',sortable:true,width:200},
                        {name:'LA Social Worker Name',prop:'LASWName',sortable:true,width:200}];

                    this.insDetails='Foster Carer Name';
                    this.insDetailsVisible=true;
                    break;
                case 'Placement End':
                    this. popupDetailsColumns =[
                        {name:'Child / Young person Name',prop:'fullName',sortable:true,width:200},
                        {name:'Foster Carer Name',prop:'ChildPlacement.PCCarerName',sortable:true,width:200},
                        {name:'Placement Date',prop:'ChildPlacement.PlacementDate',sortable:true,width:200,datetime:'Y'},
                        {name:'Placement End Date',prop:'ChildPlacement.PlacementEndDate',sortable:true,width:200,datetime:'Y'},
                       ];

                    this.insDetails='Last Placed Carer Name';
                    this.insDetailsVisible=true;
                    break;
                case 'Staying Put':
                    this.popupDetailsColumns = [
                        { name: 'Child / Young person Name', prop: 'fullName', sortable: true, width: 200 },
                        { name: 'DOB', prop: 'DOB', sortable: true, width: 200, datetime: 'Y' },
                        { name: 'Age', prop: 'Age', sortable: true, width: 200, },
                        { name: 'Foster Carer Name', prop: 'CarerName', sortable: true, width: 200, },
                        { name: 'Placement Date', prop: 'PlacementDate', sortable: true, width: 200, datetime: 'Y' },
                    ];
                    this.insDetailsVisible = true;
                    break;

                case 'Applicant Enquiries':
                    this.popupDetailsColumns = [
                        { name: 'Carer / Applicant Name', prop: 'fullName', sortable: true, width: 200 },
                        { name: 'Enquiry Date', prop: 'EnquiryDate', sortable: true, width: 200, datetime: 'Y' },
                    ];
                    this.insDetailsVisible = true;
                    break;
                case 'Applicant Stage 1':
                    this.popupDetailsColumns = [
                        { name: 'Carer / Applicant Name', prop: 'fullName', sortable: true, width: 200 },
                        { name: 'Enquiry Date', prop: 'EnquiryDate', sortable: true, width: 200, datetime: 'Y' },
                        { name: 'Stage 1 Date', prop: 'Stage1Date', sortable: true, width: 200, datetime: 'Y' },
                    ];
                    this.insDetailsVisible = true;
                    break;
                case 'Applicant Stage 2':
                    this.popupDetailsColumns = [
                        { name: 'Carer / Applicant Name', prop: 'fullName', sortable: true, width: 200 },
                        { name: 'Enquiry Date', prop: 'EnquiryDate', sortable: true, width: 200, datetime: 'Y' },
                        { name: 'Stage 1 Date', prop: 'Stage1Date', sortable: true, width: 200, datetime: 'Y' },
                        { name: 'Stage 2 Date', prop: 'Stage2Date', sortable: true, width: 200, datetime: 'Y' },
                    ];
                    this.insDetailsVisible = true;
                    break;
                case 'Onhold':
                    this.popupDetailsColumns = [
                        { name: 'Carer / Applicant Name', prop: 'fullName', sortable: true, width: 200 },
                        { name: 'Status', prop: 'CarerStatusChange.StatusName', sortable: true, width: 200,  },
                        { name: 'Date', prop: 'CarerStatusChange.ChangeDate', sortable: true, width: 200, datetime: 'Y' },
                        { name: 'Reason', prop: 'CarerStatusChange.ReasonName', sortable: true, width: 200, },
                    ];
                    this.insDetailsVisible = true;
                    break;

                case 'Applicant Rejected':
                    this.popupDetailsColumns = [
                        { name: 'Carer / Applicant Name', prop: 'fullName', sortable: true, width: 200 },
                        { name: 'Status', prop: 'CarerStatusChange.StatusName', sortable: true, width: 200, },
                        { name: 'Date', prop: 'CarerStatusChange.ChangeDate', sortable: true, width: 200, datetime: 'Y' },
                        { name: 'Reason', prop: 'CarerStatusChange.ReasonName', sortable: true, width: 200, },
                    ];
                    this.insDetailsVisible = true;
                    break;
                case 'Applicant Withdrawn':
                    this.popupDetailsColumns = [
                        { name: 'Carer / Applicant Name', prop: 'fullName', sortable: true, width: 200 },
                        { name: 'Status', prop: 'CarerStatusChange.StatusName', sortable: true, width: 200, },
                        { name: 'Date', prop: 'CarerStatusChange.ChangeDate', sortable: true, width: 200, datetime: 'Y' },
                        { name: 'Reason', prop: 'CarerStatusChange.ReasonName', sortable: true, width: 200, },
                    ];
                    this.insDetailsVisible = true;
                    break;

                case 'Approved Carer':
                    this.popupDetailsColumns = [
                        { name: 'Carer / Applicant Name', prop: 'fullName', sortable: true, width: 200 },
                        { name: 'Approval Date', prop: 'ApprovalDate', sortable: true, width: 200, datetime: 'Y' },
                        { name: 'Approved Vacancy', prop: 'NumberofApproval', sortable: true, width: 200, },
                        { name: 'Available Vacancy', prop: 'AvailableVacancy', sortable: true, width: 200, },
                    ];
                    this.insDetailsVisible = true;
                    break;

                    case 'Resigned Carer':
                        this.popupDetailsColumns = [
                            { name: 'Carer / Applicant Name', prop: 'fullName', sortable: true, width: 200 },
                            { name: 'Status', prop: 'CarerStatusChange.StatusName', sortable: true, width: 200, },
                            { name: 'Date', prop: 'CarerStatusChange.ChangeDate', sortable: true, width: 200, datetime: 'Y' },
                            { name: 'Reason', prop: 'CarerStatusChange.ReasonName', sortable: true, width: 200, },
                        ];
                        this.insDetailsVisible = true;
                        break;

                case 'Terminated Carer':
                    this.popupDetailsColumns = [
                        { name: 'Carer / Applicant Name', prop: 'fullName', sortable: true, width: 200 },
                        { name: 'Status', prop: 'CarerStatusChange.StatusName', sortable: true, width: 200, },
                        { name: 'Date', prop: 'CarerStatusChange.ChangeDate', sortable: true, width: 200, datetime: 'Y' },
                        { name: 'Reason', prop: 'CarerStatusChange.ReasonName', sortable: true, width: 200, },
                    ];
                    this.insDetailsVisible = true;
                    break;
                case 'Backup Carer':
                    this.popupDetailsColumns = [
                        { name: 'Name', prop: 'Name', sortable: true, width: 200 },
                        { name: 'Carer Name', prop: 'backupCarerName', sortable: true, width: 200 },
                        { name: 'Are Checks Required', prop: 'AreChecksRequired', sortable: true, width: 200, },
                    ];

                    this.insDetails = 'Carer Name';
                    this.insDetailsVisible = true;
                    break;
                case 'Active Users':
                    this. popupDetailsColumns =[
                        {name:'Name',prop:'Name',sortable:true,width:200},
                        {name:'User Type',prop:'Details',sortable:true,width:200},
                        {name:'Role',prop:'RoleName',sortable:true,width:200,},
                       ];

                    this.insDetails='User Type';
                    this.insDetailsVisible=true;
                    break;
                case 'Agency SSW':
                    this. popupDetailsColumns =[
                        {name:'Name',prop:'Name',sortable:true,width:200},
                        {name:'Assigned Foster Carer Name',prop:'LstAssignedFosterCarerNames',sortable:true,width:200},

                       ];

                    this.insDetails='User Type';
                    this.insDetailsVisible=true;
                    break;

                case 'Disability Child':
                    this.popupDetailsColumns = [
                        { name: 'Child / Young person Name', prop: 'fullName', sortable: true, width: 200 },
                        { name: 'Disability', prop: 'DisabilityStrIds', sortable: true, width: 200 },

                    ];
                    this.insDetails = 'User Type';
                    this.insDetailsVisible = true;
                    break;
                case 'Child Missing Placement':
                    this.popupDetailsColumns = [
                        { name: 'Child / Young person Name', prop: 'fullName', sortable: true, width: 200 },
                        { name: 'Foster Carer Name', prop: 'CarerName', sortable: true, width: 200 },

                    ];
                    this.insDetails = 'User Type';
                    this.insDetailsVisible = true;
                    break;
                case 'TSD Completed Carer':
                    this.popupDetailsColumns = [
                        { name: 'Carer / Applicant Name', prop: 'fullName', sortable: true, width: 200 },
                        { name: 'TSD Completed Date', prop: 'DateStr', sortable: true, width: 200, datetime: 'Y' },

                    ];
                    this.insDetails = 'User Type';
                    this.insDetailsVisible = true;
                    break;

            }
        });



        let event = new MouseEvent('click', { bubbles: true });
        this.btnViewDetails.nativeElement.dispatchEvent(event);

    }



    public randomizeType(): void {
        this.lineChartType = this.lineChartType === 'line' ? 'bar' : 'line';
        this.pieChartType = this.pieChartType === 'doughnut' ? 'pie' : 'doughnut';
    }

    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }



}
export class DashboardTopDetailsDTO extends BaseDTO {

    Name: string;
    SCName:string;
    Code:string;
    Details:string;
    Date:Date;
    TypeId:number;
    AreaOfficeProfileId:number;
    CarerParentId:number;
    Type:string;
}

export class DashboardDTO extends BaseDTO {

    RoleProfileId: number;

    UserTypeId: number;
    UserProfileId: number;

    Current: number;
    Closed: number;
    Placed: number;
    PlacementEnd: number;
    ApprovedCarer: number;
    Enquiries: number;
    Stage1: number;
    Stage2: number;
    Onhold: number;
    Rejected: number;
    ActiveUsers: number;
    Terminated: number;
    AgencySSW: number;
    BackupCarer: number;
    Resigned: number;
    Withdrawn: number;
    AgencyStaff: number;

    StayInPut1: number;
    Disability1: number;
    TSDTrainingCompleted1: number;
    ChildMissingPlacemen1: number;

    NoofInitialEnquiryReceived: number;
    Applicant: number;
    FosterCarersinHousehold: number;
    ChildreninPlacements: number;
    VacantPlaces: number;

    ApprovedApplicant: number;
    WithdrawnApplicant: number;
    RejectedApplicant: number;
    Applicationinprogress: number;

    ApprovedFosterPlaces: number;
    NumberofFosterCarersinHousehold: number;
    NumberofFosteringHouseholds: number;

    FosteringNoOfVancancy1Children: number;
    FosteringNoOfVancancy2Children: number;
    FosteringNoOfVancancy3Children: number;
    FosteringNoOfVancancyMore3Children: number;
    TSDTrainingCompleted: number;
    NumberofChildrenPlaced: number;
    NumberofPlacmentsEnded: number;
    NumberofChildrenTurned18: number;
    StayInPutPlacedFinacialYear: number;

    ChildMissingPlacementTotal: number;
    DurationOfTimeMissing24hrs: number;
    DurationOfTimeMissing1to6days: number;
    DurationOfTimeMissing1wkto28days: number;
    DurationOfTimeMissingAbove28days: number;

    NoOfTimeMissing24hrs: number;
    NoOfTimeMissing1to6days: number;
    NoOfTimeMissing1wkto28days: number;
    NOOfTimeMissingAbove28days: number;

    PlacedFinacialYear: number;
    DischargedFinacialYear: number;
    ClosedFinacialYear: number;
    CurrentFinacialYear: number;

    IsShowDashboard: boolean;


    chartCarerCount = [];
    chartChildCount = [];
    CarerEthnicity = [];
    CarerPlacementoffer = [];
    ChildPlacementoffer = [];
    ChildEthnicity = [];
    Schedule7Notification = [];
    ChildBehaviourColorMapping = [];
    ChildDisability = [];
    ChildEthnicity2 = [];
    DashboardCarerSocialWorker = [];
    ChildIncident = [];
    CarerApprovedDetails = [];
}

export class DashboardDTOInfo {
    FinancialYear: number;
    AgencyProfileId: number;
    UserTypeId: number;
    UserProfileId: number;
    AreaOfficeProfileId: number;

}
