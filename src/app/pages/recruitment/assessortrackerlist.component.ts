import { APICallService } from '../services/apicallservice.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component} from '@angular/core';
import { Common } from '../common'
import { PagesComponent } from '../pages.component'

@Component
    ({
        selector: 'AssessorTrackerList',
        templateUrl: './assessortrackerlist.component.template.html',
    })

export class AssessorTrackerListComponent {
    public searchText: string = "";
    controllerName = "CarerAssessorTrack";
    lstAssessorTrackerList = [];
    CarerParentId: number;
    objQeryVal;
    FormCnfgId
    //pageSize:number=10;
    limitPerPage:number=10;
    gridMessages;
    constructor(private _router: Router,
        private activatedroute: ActivatedRoute, private pComponent: PagesComponent, private apiService: APICallService) {
            this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
            this.gridMessages={
              'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
              'totalMessage': ' - Records'
            };
            if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
                this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 4]);
            }
            else if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
                this._router.navigate(['/pages/recruitment/applicantlist', 13, 34]);
            }
            else if (this.objQeryVal.mid == 3) {
                this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
                this.bindCarerAssessorTrack();
            }
            else if (this.objQeryVal.mid == 13) {
                this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
                this.bindCarerAssessorTrack();
            }
            this.FormCnfgId=303;
    }

    private bindCarerAssessorTrack() {
        if (this.CarerParentId != null && this.CarerParentId != 0)
            this.apiService.get(this.controllerName, "GetAllByCarerParentId", this.CarerParentId).then(data => {
                 this.lstAssessorTrackerList = data
         });
    }

    fnAddData() {
        this._router.navigate(['/pages/recruitment/assessortrackerdata/0',this.objQeryVal.mid]);
    }

    edit(id) {

        this._router.navigate(['/pages/recruitment/assessortrackerdata', id,this.objQeryVal.mid]);
    }

    delete(historyId) {
        this.apiService.delete(this.controllerName, historyId).then(data => this.Respone(data));

    }

    private Respone(data) {
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindCarerAssessorTrack();
        }
    }
    setPageSize(pageSize:string){
        this.limitPerPage = parseInt(pageSize);
      }
  
}
