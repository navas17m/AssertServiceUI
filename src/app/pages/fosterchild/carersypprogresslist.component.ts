import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Common } from '../common'
import { PagesComponent } from '../pages.component'
import { CarersYpProgressDTO} from './DTO/carersypprogressdto'
import { APICallService } from '../services/apicallservice.service';
import {Base} from '../services/base.service'

@Component
    ({
        selector: 'CarersYpProgressList',
        templateUrl: './carersypprogresslist.component.template.html',
    })

export class CarersYpProgressListComponent {
    public searchText: string = "";
    objCarersYpProgressList: CarersYpProgressDTO = new CarersYpProgressDTO();
    lstYpProgressList = [];
    objQeryVal;
    AgencyProfileId;
    _Form: FormGroup;
    controllerName = "CarersYpProgress";
    ChildID;

    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute,
        private renderer: Renderer2, private _router: Router, private module: PagesComponent) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));


        this._Form = _formBuilder.group({
            searchText: [],
        });

        if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != 'null') {
            this.ChildID = parseInt(Common.GetSession("ChildId"));
            this.bindCarersYpProgressList();
        }
        else {
            Common.SetSession("UrlReferral", "pages/child/carersypprogresslist/4");
            this._router.navigate(['/pages/referral/childprofilelist/1/16']);
        }

    }




    private bindCarersYpProgressList() {
        this.apiService.get(this.controllerName, "GetAllByChildId", this.ChildID).then(data => {
            this.lstYpProgressList = data;
        });
    }

    fnAddData() {
        this._router.navigate(['/pages/child/carersypprogress/0']);
    }

    fnEdit(id) {
        this._router.navigate(['/pages/child/carersypprogress/' + id]);
    }

    fndelete(id) {
        this.apiService.delete(this.controllerName, id).then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.module.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindCarersYpProgressList();
        }
    }
}