import { Component} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildCLAReview } from './DTO/childclareview'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component
    ({
    selector: 'childclareviewlist',
    templateUrl: './childclareviewlist.component.template.html',
    })

export class ChildCLAReviewListComponent {
    public searchText: string = "";
    childCLAReviewList=[];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date of Review',prop:'ReviewDate',sortable:true,width:'100',date:'Y'},
        {name:'Review Type',prop:'CLAReviewType',sortable:true,width:'300'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'}
       ];

    lstChildCLAReview = [];
    ChildID: number;objQeryVal;
    objChildCLAReview: ChildCLAReview = new ChildCLAReview();
    returnVal; controllerName = "ChildCLAReview";
    loading = false;insActivePage:number;
    isDefaultSortOrderVal: string;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
     FormCnfgId=82;
    constructor(private activatedroute: ActivatedRoute,private apiService: APICallService,private _router: Router, private modal: PagesComponent)
    {
        this.insActivePage=1;
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildCLAReview();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childclareviewlist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/4']);
        }
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    public onPageChange() {
        let tem = document.querySelector('.pagination .page-item.active a');
        this.insActivePage=parseInt(tem.innerHTML);
    }

    private bindChildCLAReview() {
        this.loading = true;
        this.apiService.get(this.controllerName, "GetList", this.ChildID).then(data =>
        {
            this.loading = false;
            this.childCLAReviewList=data;
            this.isDefaultSortOrderVal = "desc";
            //console.log(this.childCLAReviewList);
            //this.lstChildCLAReview = data;
            // = this.getTableSource(this.lstChildCLAReview);
            if(this.objQeryVal.apage!=undefined)
            this.insActivePage= parseInt(this.objQeryVal.apage);
        });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childclareviewdata/0/4/1']);
    }

    editChildCLAReview(ChildCLAReviewId) {
        this._router.navigate(['/pages/child/childclareviewdata', ChildCLAReviewId,4,this.insActivePage]);
    }

    deleteChildCLAReview(SequenceNo) {
        this.objChildCLAReview.SequenceNo = SequenceNo;
        //this.objChildCLAReview.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildCLAReview).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildCLAReview();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.objChildCLAReview.SequenceNo;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
    onEdit($event){
        this.editChildCLAReview($event.SequenceNo);
    }
    onDelete($event){
        this.deleteChildCLAReview($event.SequenceNo);
    }
}
