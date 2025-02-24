import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildFeedbackInfo } from './DTO/childfeedbackinfodto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

@Component
    ({
    selector: 'childfeedbackinfolist',
    templateUrl: './childfeedbackinfolist.component.template.html',
    
    })

export class ChildFeedbackInfoListComponent {
    public searchText: string = "";
    childFeedbackInfoList = [];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'FeedbackDate',prop:'FeedbackDate',sortable:true,width:'100',date:'Y'},
        {name:'Incident',prop:'Incident',sortable:true,width:'100'},
        {name:'Outcome',prop:'Outcome',sortable:true,width:'100'},
        {name:'Edit',prop:'Edit',sortable:false,width:'100'},
        {name:'View',prop:'View',sortable:false,width:'100'},
        {name:'Delete',prop:'Delete',sortable:false,width:'100'}
       ];
    ChildID: number;
    objChildFeedBackInfo: ChildFeedbackInfo = new ChildFeedbackInfo();
    returnVal; controllerName = "ChildFeedbackInfo"; 

    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent)
    {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));;
            this.bindChildFeedbackInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/feedbacklist/19");
            this._router.navigate(['/pages/referral/feedbacklist/1/19']);
        }
    }

    private bindChildFeedbackInfo() {
        //this.apiService.get(this.controllerName,"GetAllByChildId",this.ChildID).then(data => this.lstChildHealthInfo = data);
        this.apiService.get(this.controllerName,"GetListAll",this.ChildID).then(data => this.childFeedbackInfoList = data);
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childfeedbackinfo/0/19']);
    }

    editChildFeedbackInfo(ChildFeedbackInfoId) { 
       
        this._router.navigate(['/pages/child/childfeedbackinfo', ChildFeedbackInfoId,19]);
    }
    
    deleteChildFeedbackInfo(SequenceNo) {            
        this.objChildFeedBackInfo.SequenceNo = SequenceNo;
        //this.objChildHealthInfo.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildFeedBackInfo).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);           
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);           
            this.bindChildFeedbackInfo();
        }
    }
    onEdit($event){
        this.editChildFeedbackInfo($event.SequenceNo);
    }
    onDelete($event){
        this.deleteChildFeedbackInfo($event.SequenceNo);
    }
}