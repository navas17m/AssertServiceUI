import { Component, Input } from '@angular/core';
import { APICallService } from '../services/apicallservice.service';
import { Router,ActivatedRoute } from '@angular/router';
import { Common } from '../common';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'ChildSnapshotNew',
    templateUrl: './childsnapshotnew.component.template.html',
    styles:[`.img-thumbnail {
        padding: 0.25rem;
        background-color: #fff;
        border: 1px solid #dee2e6;
        border-radius: 0.25rem;
        max-width: 80%;
        height: auto;
    }`]
})
export class ChildSnapshotNewComponet {
    showSnapshot=false;
    objChildSnapshot;
    inschildId;
    controllerName = "ChildSnapshot";
    objChildProfile;
    objChildHealthImmunisationInfo = [];
    objChildHealthMedicalVisitInfo = [];
    objChildSanctionDetails = [];
    objChildHealthAppointmentInfo = [];
    objIncidents = [];
    objChildCLAReview = [];
    objChildDayLogJournal = [];
    objPhysicianInfo = [];
    objChildEducationalInfo = [];
    objChildMedicationInfo = [];
    objDueDate = [];
    objChildPlacement = [];
    objChildPlacementRespite = [];
    objBackupCarerPlacement = [];
    objPlacementDischarge;
    objPlacementTransfer;
    objStatutoryMediccal = [];
    objChildReferral = [];
    globalObjComplaintInfoList = [];
    objComplaintInfoList: ComplaintInfo[] = [];
    srcPath = "assets/img/app/Photonotavail.png";
    objQeryVal;
    childId;
    objClaDocumentation;
    lstChildFamilyPersonOrgInvolved = [];
    objAgencySSWInfo;
    @Input()
    set ChildId(id: number) {
        this.objChildProfile=null;
        this.inschildId = id;
        this.getSnapshotInfo(id);
        this.GetChildCLADocumentation();
        this.bindChildFamilyPersonOrgInvolved();
    }
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=307;

    constructor(private spinner: NgxSpinnerService,private apiService: APICallService,private route: ActivatedRoute,private _router: Router ) {
        this.route.params.subscribe(data => this.objQeryVal = data);
        if (this.objQeryVal.mid == 4) {
            if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != "null") {
                this.childId = Common.GetSession("ChildId");
                //this.fnLoadChileProfile();
                this.getSnapshotInfo(this.childId);
                this.GetChildCLADocumentation();
                this.bindChildFamilyPersonOrgInvolved();
            }
            else {
                Common.SetSession("UrlReferral", "pages/child/childsnapshot/4");
                this._router.navigate(['/pages/child/childprofilelist/1/4']);
            }
        }
        else {
            if (Common.GetSession("ReferralChildId") != null && Common.GetSession("ReferralChildId") != "null") {
                this.childId = Common.GetSession("ReferralChildId");
                this.getSnapshotInfo(this.childId);
                this.GetChildCLADocumentation();
                this.bindChildFamilyPersonOrgInvolved();
            }
            else {
                Common.SetSession("UrlReferral", "pages/referral/childsnapshot/16");
                this._router.navigate(['/pages/referral/childprofilelist/0/16']);
            }
        }

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    LASocialWorkerEmail;
    LASocialWorkerTelephone;
    LASocialWorker;
    LAManager;
    LAManagerTelephone;
    LAManagerEmail;
    EDTNumber;
    AreaTeam;
    DynamicValue = [];
    DateofFirstPlacement;
    
    getSnapshotInfo(id) {
        if (id != null) {
          this.spinner.show();
            this.apiService.get(this.controllerName, "GetAllByChildId", id).then(data => {
                this.DateofFirstPlacement = data.DateofFirstPlacement;
                this.objChildProfile = data.ChildProfile;
                this.GetAgencySSWInfo(this.objChildProfile.SupervisingSocialWorkerId);
                this.fnShowImage(this.objChildProfile.PersonalInfo.ImageId);
                this.objChildHealthImmunisationInfo = data.HealthImmunisationInfo;
                this.objChildHealthMedicalVisitInfo = data.HealthMedicalVisitInfo;
                this.objChildSanctionDetails = data.SanctionDetails;
                this.objChildHealthAppointmentInfo = data.HealthAppointmentInfo;
                this.objIncidents = data.IncidentInfo;
                this.objChildCLAReview = data.CLAReview;
                this.objChildDayLogJournal = data.DayLogJournal;
                this.objPhysicianInfo = data.PhysicianInfo;
                this.objChildEducationalInfo = data.ChildEducationalInfo;
                this.objChildMedicationInfo=data.MedicationInfo;
                this.objDueDate = data.DueDate;
                this.objChildPlacement = data.lstChildPlacement.filter(x =>  x.PlacementStartTypeId !=2 && x.PlacementEndDate == null);
                this.objChildPlacementRespite = data.lstChildPlacement.filter(x => x.PlacementStartTypeId == 2 && x.PlacementEndDate == null && x.ChildRespiteDetail != null
                    && x.ChildRespiteDetail.IsBackupCarer == 0);
                this.objBackupCarerPlacement = data.lstChildPlacement.filter(x => x.PlacementStartTypeId == 2 && x.PlacementEndDate == null
                    && x.ChildRespiteDetail != null && x.ChildRespiteDetail.IsBackupCarer == 1);
                this.objPlacementDischarge = data.lstChildPlacement.filter(item => item.PlacementEndDate == null
                    || item.PlacementEndReasonId == 4 || item.PlacementStartTypeId == 2);
                this.objPlacementTransfer = data.lstChildPlacement.filter(item => item.PlacementEndReasonId == 3);
                this.objChildReferral = data.ChildReferral;
                this.DynamicValue = data.ChildReferral.DynamicValue;
                this.spinner.hide();

            });
        }
    }

    private bindChildFamilyPersonOrgInvolved() {
        if(this.childId)
        {
        this.apiService.get("ChildFamilyPersonOrgInvolved", "GetAllByChildId", this.childId).then(data =>
            {               
               
                let socialWorker=data.filter(x=>x.FieldValue == "SOCIAL WORKER");   
                if(socialWorker.length>0)
                {           
                    this.lstChildFamilyPersonOrgInvolved=data.filter(x=>x.SequenceNo!=socialWorker[0].SequenceNo);
                }
                else
                {
                    this.lstChildFamilyPersonOrgInvolved=data;
                }              
                
                let temManager=this.lstChildFamilyPersonOrgInvolved.filter(x=>x.FieldName=="ContactTypeId" && x.FieldValue=="LA Manager")
                if(temManager.length>0)
                {
                   
                    let temManagerValue=this.lstChildFamilyPersonOrgInvolved.filter(x=>x.SequenceNo==temManager[0].SequenceNo);
                    if(temManagerValue.length>0)
                    {
                       
                        let val1 = temManagerValue.filter(x => x.FieldName == "Name");
                        if (val1.length > 0)
                            this.LAManager = val1[0].FieldValue;
                        let val2 = temManagerValue.filter(x => x.FieldName == "Phone");
                        if (val2.length > 0)
                            this.LAManagerTelephone = val2[0].FieldValue;
                        let val3 = temManagerValue.filter(x => x.FieldName == "EmailAddress");
                        if (val3.length > 0)
                            this.LAManagerEmail = val3[0].FieldValue;
                    }
                }

            });
        }
    }

    private GetAgencySSWInfo(id) {
        if(id!=0 && id!=null)
            this.apiService.get("UserProfile", "GetById", id).then(data =>{
                this.objAgencySSWInfo = data;
            });
    }

    GetChildCLADocumentation() {
        if(this.childId)
        {
        this.apiService.get("ChildCLADocumentationDynamic", "GetByChildId", this.childId).then(data => {
            this.objClaDocumentation= data;
        });
    }
    }
    public fnShowImage(ImageId) {
        if (ImageId && ImageId != null && ImageId != 0) {
            this.apiService.get("UploadDocuments", "GetImageById", ImageId).then(data => {
                this.srcPath = "data:image/jpeg;base64," + data;
            });
        }
        else {
            this.srcPath = "assets/img/app/Photonotavail.png";
        }
    }

    LoadAlreadyStoreDate(data) {
        this.globalObjComplaintInfoList = [];
        if (data != null) {
            data.forEach(item => {
                this.objComplaintInfoList = [];
                item.forEach(subItem => {
                    let add: ComplaintInfo = new ComplaintInfo();
                    add.FieldCnfgId = subItem.FieldCnfgId;
                    add.FieldName = subItem.FieldName;
                    add.FieldValue = subItem.FieldValue;
                    add.FieldDataTypeName = subItem.FieldDataTypeName;
                    add.FieldValueText = subItem.FieldValueText;
                    add.UniqueID = subItem.UniqueID;
                    add.SequenceNo = subItem.SequenceNo;
                    add.DisplayName = subItem.DisplayName;
                    add.ComplianceCheckId = subItem.ComplianceCheckId;
                    add.UserProfileId = subItem.UserProfileId;
                    this.objComplaintInfoList.push(add);
                });
                this.globalObjComplaintInfoList.push(this.objComplaintInfoList);
            });
        }
    }
}

export class ComplaintInfo {
    FieldCnfgId: number;
    FieldName: string;
    FieldValue: string;
    SequenceNo: number;
    FieldDataTypeName: string;
    FieldValueText: string;
    StatusId: number;
    UniqueID: number;
    DisplayName: string;
    ComplianceCheckId: number;
    UserProfileId: number;
}
