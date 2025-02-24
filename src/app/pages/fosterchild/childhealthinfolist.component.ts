import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildHealthInfo } from './DTO/childhealthinfo'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

@Component
    ({
    selector: 'childhealthinfolist',
    templateUrl: './childhealthinfolist.component.template.html',
    
    })

export class ChildHealthInfoListComponent {
    public searchText: string = "";
    lstChildHealthInfo = [];
    childHealthInfoList = [];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Height',prop:'Height',sortable:true,width:'100'},
        {name:'Weight',prop:'Weight',sortable:true,width:'100'},
        {name:'Parental Responsibility',prop:'ParentalResponsibility',sortable:true,width:'100'},
        {name:'Edit',prop:'Edit',sortable:false,width:'100'},
        {name:'View',prop:'View',sortable:false,width:'100'},
        {name:'Delete',prop:'Delete',sortable:false,width:'100'}
       ];
    ChildID: number;
    objChildHealthInfo: ChildHealthInfo = new ChildHealthInfo();
    returnVal; controllerName = "ChildHealthInfo"; 

    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent)
    {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));;
            this.bindChildHealthInfo();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childhealthinfolist/19");
            this._router.navigate(['/pages/referral/childprofilelist/1/19']);
        }
    }

    private bindChildHealthInfo() {
        //this.apiService.get(this.controllerName,"GetAllByChildId",this.ChildID).then(data => this.lstChildHealthInfo = data);
        this.apiService.get(this.controllerName,"GetListByChildId",this.ChildID).then(data => this.childHealthInfoList = data);
    }

    fnAddData() {
        this._router.navigate(['/pages/child/childhealthinfo/0/19']);
    }

    editChildHealthInfo(ChildHealthInfoId) { 
        this._router.navigate(['/pages/child/childhealthinfo', ChildHealthInfoId,19]);
    }
    
    deleteChildHealthInfo(SequenceNo) {            
        this.objChildHealthInfo.SequenceNo = SequenceNo;
        //this.objChildHealthInfo.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildHealthInfo).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);           
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);           
            this.bindChildHealthInfo();
        }
    }
    onEdit($event){
        this.editChildHealthInfo($event.SequenceNo);
    }
    onDelete($event){
        this.deleteChildHealthInfo($event.SequenceNo);
    }
}