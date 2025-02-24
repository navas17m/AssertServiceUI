import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildChronologyOfEvent } from './DTO/childchronologyofevent'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
@Component
    ({
    selector: 'childchronologyofeventlist',
    templateUrl: './childchronologyofeventlist.component.template.html'
    })

export class ChildChronologyOfEventListComponent {
    public searchText: string = "";
    //lstChildChronologyOfEvent = [];
    ChildID: number;
    objChildChronologyOfEvent: ChildChronologyOfEvent = new ChildChronologyOfEvent();
    returnVal; controllerName = "ChildChronologyOfEvent";
    lstChildChronologyofEvent = [];
    columns =[
      {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
      {name:'Event Date',prop:'EventDate',sortable:true,width:'120'},
      {name:'Event Name',prop:'EventType',sortable:true,width:'100'},
      {name:'Worker Name',prop:'NameOfWorker',sortable:true,width:'100'},
      {name:'Edit',prop:'Edit',sortable:false,width:'60'},
      {name:'View',prop:'View',sortable:false,width:'60'},
      {name:'Delete',prop:'Delete',sortable:false,width:'60'}
      ];
    constructor(private apiService: APICallService,private _router: Router, private modal: PagesComponent)
    {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
           this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindChildChronologyOfEvent();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/childchronologyofeventlist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/16']);
        }
    }

    private bindChildChronologyOfEvent() {
        //this.apiService.get(this.controllerName,"GetAllByChildId",this.ChildID).then(data => { this.lstChildChronologyOfEvent = data; });
        this.apiService.get(this.controllerName,"GetListByChildId",this.ChildID).then(data => { this.lstChildChronologyofEvent = data; });

    }

    fnAddData() {
        this._router.navigate(['/pages/child/childchronologyofeventdata/0/4']);
    }

    editChildChronologyOfEvent(ChildChronologyOfEventId) {
        this._router.navigate(['./pages/child/childchronologyofeventdata', ChildChronologyOfEventId,4]);
    }

    deleteChildChronologyOfEvent(SequenceNo) {
        this.objChildChronologyOfEvent.SequenceNo = SequenceNo;
        //this.objChildChronologyOfEvent.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildChronologyOfEvent).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindChildChronologyOfEvent();
        }
    }
    onEdit($event){
      this.editChildChronologyOfEvent($event.SequenceNo);
    }
    onDelete($event){
          this.deleteChildChronologyOfEvent($event.SequenceNo);
    }

}
