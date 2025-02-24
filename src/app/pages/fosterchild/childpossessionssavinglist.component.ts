
import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildPossessionsSavingDTO } from './DTO/childpossessionssavingdto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
 
@Component
    ({
    selector: 'ChildPossessionsSavingList', 
    templateUrl: './childpossessionssavinglist.component.template.html',
    })

export class ChildPossessionsSavingListComponent {
    public searchText: string = "";
    lstChildPossessionsSaving = [];
    childPossessionsSavingList = [];
    columns =[
        {name:'Date of Completion Checklist',prop:'DateofCompletionChecklist',sortable:true,width:'200'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
        ];
    ChildID: number;
    objChildPossessionsSavingDTO: ChildPossessionsSavingDTO = new ChildPossessionsSavingDTO();
    returnVal; controllerName = "ChildPossessionsSaving";
    loading = false;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindCarePlan();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/possessionssavinglist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/4']);
        }
    }

    private bindCarePlan() {
        this.loading = true;
        this.apiService.get(this.controllerName, "GetListByChildId", this.ChildID).then(data => {
            this.loading = false;
            this.childPossessionsSavingList = data;
        });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/possessionssavingdata/0']);
    }

    edit(ChildCarePlanId) {
        this._router.navigate(['/pages/child/possessionssavingdata', ChildCarePlanId]);
    }

    delete(SequenceNo) {
        this.objChildPossessionsSavingDTO.SequenceNo = SequenceNo;
        //this.objChildPossessionsSavingDTO.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildPossessionsSavingDTO).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindCarePlan();
        }
    }
    onEdit($event){
        this.edit($event.SequenceNo);
     }
    onDelete($event){
        this.delete($event.SequenceNo);
    }
}