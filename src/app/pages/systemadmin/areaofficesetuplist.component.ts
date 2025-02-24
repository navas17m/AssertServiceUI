import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
    selector: 'AreaOfficeSetupList',
    templateUrl: './areaofficesetuplist.component.template.html',
})

export class AreaOfficeSetupListComponet implements OnInit {
    public searchText: string = "";
    returnVal=[];
    controllerName = "AreaOfficeProfile";
    rows;
    // rows = [
    //     { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    //     { name: 'Dany', gender: 'Male', company: 'KFC' },
    //     { name: 'Molly', gender: 'Female', company: 'Burger King' }
    //   ];
    columns = [{ key:'AreaOfficeName',title: 'Area Office Name' }, { key:'AgencyProfile.AgencyName',title: 'Agency Name' }];
    @ViewChild('myTable') table: DatatableComponent;
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=7;
    constructor(private apiService: APICallService, private _router: Router, private pComponent: PagesComponent) {
        this.BindAreaofficeList();
           this.rows=[
            {
                "name": "Ethel Price",
                "gender": "female",
                "company": "Johnson, Johnson and Partners, LLC CMP DDC",
                "age": 22
            },
            {
                "name": "Claudine Neal",
                "gender": "female",
                "company": "Sealoud",
                "age": 55
            },
            {
                "name": "Beryl Rice",
                "gender": "female",
                "company": "Velity",
                "age": 67
            },
            {
                "name": "Wilder Gonzales",
                "gender": "male",
                "company": "Geekko"
            },
            {
                "name": "Georgina Schultz",
                "gender": "female",
                "company": "Suretech"
            },
            {
                "name": "Carroll Buchanan",
                "gender": "male",
                "company": "Ecosys"
            },
            {
                "name": "Valarie Atkinson",
                "gender": "female",
                "company": "Hopeli"
            },
            {
                "name": "Schroeder Mathews",
                "gender": "male",
                "company": "Polarium"
            },
            {
                "name": "Lynda Mendoza",
                "gender": "female",
                "company": "Dogspa"
            },
            {
                "name": "Sarah Massey",
                "gender": "female",
                "company": "Bisba"
            },
            {
                "name": "Robles Boyle",
                "gender": "male",
                "company": "Comtract"
            },
            {
                "name": "Evans Hickman",
                "gender": "male",
                "company": "Parleynet"
            },
            {
                "name": "Dawson Barber",
                "gender": "male",
                "company": "Dymi"
            },
            {
                "name": "Bruce Strong",
                "gender": "male",
                "company": "Xyqag"
            },
            {
                "name": "Nellie Whitfield",
                "gender": "female",
                "company": "Exospace"
            },
            {
                "name": "Jackson Macias",
                "gender": "male",
                "company": "Aquamate"
            },
            {
                "name": "Pena Pena",
                "gender": "male",
                "company": "Quarx"
            },
            {
                "name": "Lelia Gates",
                "gender": "female",
                "company": "Proxsoft"
            },
            {
                "name": "Letitia Vasquez",
                "gender": "female",
                "company": "Slumberia"
            },
            {
                "name": "Trevino Moreno",
                "gender": "male",
                "company": "Conjurica"
            },
            {
                "name": "Barr Page",
                "gender": "male",
                "company": "Apex"
            },
            {
                "name": "Kirkland Merrill",
                "gender": "male",
                "company": "Utara"
            }]

        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
        this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
      }
    ngOnInit():void{

    }

    BindAreaofficeList() {
        this.apiService.get(this.controllerName, "getall", parseInt(Common.GetSession("AgencyProfileId"))).then(data => { this.returnVal = data; console.log(data)});

    }

    fnAddData() {
        this._router.navigate(['/pages/systemadmin/areaofficesetup/0']);
    }

    editAreaOffice(editmodule) {
        //console.log(editmodule);
        this._router.navigate(['/pages/systemadmin/areaofficesetup/' + editmodule]);
    }

    deleteId = 0;
    deleteAreaOffice(areaOfficeProfileId) {
        this.deleteId = areaOfficeProfileId
        this.apiService.delete(this.controllerName, areaOfficeProfileId).then(data => this.Respone(data));
            //this._Service.postAreaOfficeSetup(deleteOffice, "delete").then(data => this.Respone(data));
    }

    private Respone(data) {
        if (data.IsError == true) {
            this.pComponent.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {            
            this.pComponent.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.BindAreaofficeList();
            this.objUserAuditDetailDTO.ActionId = 3;
            this.objUserAuditDetailDTO.RecordNo = this.deleteId;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 0;
            this.objUserAuditDetailDTO.ChildCarerEmpId = 0;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }
}
