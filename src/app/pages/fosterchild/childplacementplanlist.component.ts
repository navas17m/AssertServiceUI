

import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { ChildPlacementPlanDTO } from './DTO/childplacementplandto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

@Component
    ({
    selector: 'ChildPlacementPlanList',
    templateUrl: './childplacementplanlist.component.template.html',
    })

export class ChildPlacementPlanListComponent {
    public searchText: string = "";
    lstChildPlacementPlan = [];
    childPlacementPlanList = [];
    columns =[
        {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
        {name:'Date of Placement Plan',prop:'DateofPlacementPlan',sortable:true,width:'200',date:'Y'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
        ];
    ChildID: number;
    objChildPlacementPlanDTO: ChildPlacementPlanDTO = new ChildPlacementPlanDTO();
    returnVal; controllerName = "ChildPlacementPlan";
    loading = false;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent) {
        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindCarePlan();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/placementplanlist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/4']);
        }
    }

    private bindCarePlan() {
        this.loading = true;
        this.apiService.get(this.controllerName, "GetListByChildId", this.ChildID).then(data => {
            this.loading = false;
            this.childPlacementPlanList = data;
        });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/placementplandata/0/4']);
    }

    edit(ChildCarePlanId) {
        this._router.navigate(['/pages/child/placementplandata', ChildCarePlanId,4]);
    }

    delete(SequenceNo) {
        this.objChildPlacementPlanDTO.SequenceNo = SequenceNo;
        //this.objChildPlacementPlanDTO.UniqueID = UniqueID;
        this.apiService.delete(this.controllerName, this.objChildPlacementPlanDTO).then(data => this.Respone(data));
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