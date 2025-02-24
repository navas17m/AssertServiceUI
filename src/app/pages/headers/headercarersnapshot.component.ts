//import { APICallService } from '../services/apicallservice.service';
//import { Component, Input, OnInit, Injectable, Directive, ViewChild} from '@angular/core';
////import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
//import { Router, ActivatedRoute, Params } from '@angular/router';
//import { Common} from '../common'
//import { PagesComponent } from '../pages.component';
//import { CarerParentDTO } from '../recruitment/DTO/carerparent';
//@Component({
//    selector: 'HeaderCarerSnapshot',
//    templateUrl: './headercarersnapshot.component.template.html',

//})
//export class HeaderCarerSnapshotComponet {
//    controllerName = "CarerInfo";
//    objCarerParentDTO: CarerParentDTO = new CarerParentDTO();

//    objCarerSnapshot;
//    insCarerId;

//    objCarerProfile;
//    objSCCarerProfile;
//    objAnnualReview = [];
//    objTrainingAttended = [];
//    objHealthandSafety = [];
//    objSafeCareStrategies = [];
//    objSupervisoryHomeVisit = [];
//    objPetQuestionnaire = [];
//    objDayLogJournalEntries = [];
//    onjPCStatutoryCheck = [];
//    objSCStatutoryCheck = [];
//    objApprovalDetails;


//    objChildPlacement = [];
//    objPlacementDischargeHistory = [];
//    objTransferHistory = [];
//    objBackupCarerPlacement = [];

//    srcPath = "assets/img/app/Photonotavail.png";
//    scsrcPath = "assets/img/app/Photonotavail.png";

//    @Input()
//    set CarerId(id: number) {
//        this.insCarerId = id;
//        this.getSnapshotInfo(id);
//    }


//    constructor(private apiService: APICallService) {
//    }


//    getSnapshotInfo(id) {
//        if (id != null && id != '') {
//            this.objCarerParentDTO.CarerId = id;

//            this.apiService.get(this.controllerName, "GetSnapShotInfo", id).then(data => {
//                // this.cssServices.GetSnapShotDetails(id).then(data => {
//                // console.log(data);
//                this.objCarerProfile = data.PrimaryCarer;
//                this.objSCCarerProfile = data.SecondCarer;
//                this.objAnnualReview = data.CarerAnnualReview;
//                this.objTrainingAttended = data.CarerTrainingProfile;
//                this.objHealthandSafety = data.CarerHealthAndSafetyInfo;
//                this.objSafeCareStrategies = data.CarerSaferPolicy;
//                this.objSupervisoryHomeVisit = data.CarerSupervisoryHomeVisit;
//                this.objPetQuestionnaire = data.CarerPetQuestionnaire;
//                this.objDayLogJournalEntries = data.CarerDayLogJournal;
//                this.onjPCStatutoryCheck = data.PCStatutoryCheck;
//                this.objSCStatutoryCheck = data.SCStatutoryCheck;
//                this.objApprovalDetails = data.CarerApprovalPreference;
//                this.fnShowImage(this.objCarerProfile.PersonalInfo.ImageId);
//                if (data.SecondCarer)
//                    this.fnSCShowImage(this.objSCCarerProfile.PersonalInfo.ImageId);

//                this.objChildPlacement = data.lstChildPlacement.filter(x => x.PlacementStartTypeId == 1 && x.PlacementEndDate == null);

//                this.objPlacementDischargeHistory = data.lstChildPlacement.filter(item => item.PlacementEndDate == null
//                    || item.PlacementEndReasonId == 4 || item.PlacementStartTypeId == 2);

//                this.objTransferHistory = data.lstChildPlacement.filter(item => item.PlacementEndReasonId == 3);

//                this.objBackupCarerPlacement = data.lstChildPlacement.filter(x => x.PlacementStartTypeId == 1 && x.PlacementEndDate == null);

//                //  console.log(this.objChildPlacement);
//            });
//        }
//    }

//    public fnShowImage(ImageId) {
//        if (ImageId != null) {
//            this.apiService.get("UploadDocuments", "GetImageById", ImageId).then(data => {
//                //this.uploadServie.GetImageById(ImageId).then(data => {
//                this.srcPath = "data:image/jpeg;base64," + data;
//            });
//        }
//        else {
//            this.srcPath = "assets/img/app/Photonotavail.png";
//        }
//    }

//    public fnSCShowImage(ImageId) {
//        if (ImageId != null) {
//            this.apiService.get("UploadDocuments", "GetImageById", ImageId).then(data => {
//                // this.uploadServie.GetImageById(ImageId).then(data => {
//                this.scsrcPath = "data:image/jpeg;base64," + data;
//            });
//        }
//        else {
//            this.scsrcPath = "assets/img/app/Photonotavail.png";
//        }
//    }


//}
