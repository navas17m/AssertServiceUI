import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';


@Component
    ({
        selector: 'ChildMatchingChecklist',
        templateUrl: './childmatchingchecklist.component.template.html',

    })

export class FCChildMatchingCheckListComponent {
    public searchText: string = "";
    loading = false;
    controllerName = "ChildMatchingChecklist";
    lstChildMatchingChecklist = [];
    CarerParentId: number;
    returnVal;
    columns =[
      {name:'',prop:'IsDocumentExist',sortable:false,width:'30'},
      {name:'Child Name',prop:'ChildName',sortable:false,width:'150'},
      {name:'Checklist Date',prop:'ChecklistDate',sortable:true,width:'150'},
      {name:'Ethnicity Culture',prop:'EthnicityCulture',sortable:true,width:'150'},
      {name:'Language',prop:'Language',sortable:true,width:'150'},
      {name:'Religion',prop:'Religion',sortable:true,width:'150'},
      {name:'Name of Duty Worker',prop:'NameofDutyWorker',sortable:true,width:'150'},
      {name:'View',prop:'View',sortable:false,width:'60'}

     ];
    constructor(private _router: Router, private module: PagesComponent, private apiService: APICallService) {

        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 44]);
        }
        else
        {
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            this.bindChildMatchingChecklist();
        }
    }

    bindChildMatchingChecklist() {
        this.loading = true;
        this.apiService.get(this.controllerName, "GetListByCarerParentId", this.CarerParentId).then(data => {
            this.lstChildMatchingChecklist = data;
            this.loading = false;
        });
    }


    edit(id,ChildId) {
        this._router.navigate(['/pages/fostercarer/matchingchecklistdata', id,ChildId, 3]);
    }
    onEdit(item){
      this.edit(item.SequenceNo, item.ChildId);
    }

}
