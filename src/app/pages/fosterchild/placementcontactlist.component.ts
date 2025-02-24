
import { Component} from '@angular/core';
import { Router } from '@angular/router'
import { Common } from '../common'
import { Base } from '../services/base.service'
import { PlacementContactDTO} from './DTO/placementcontactdto'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';

@Component
    ({
        selector: 'PlacementContactList',
        templateUrl: './placementcontactlist.component.template.html',
    })

export class PlacementContactListComponent {
    public searchText: string = "";
    lstPlacementContact = [];
    rows=[];
    columns =[
        {name:'Local Authority',prop:'LocalAuthorityName',sortable:true,width:'200'},
        {name:'Name',prop:'Name',sortable:true,width:'150'},
        {name:'Job Title',prop:'JobTitleName',sortable:true,width:'150'},
        {name:'Contact',prop:'Contact',sortable:true,width:'150'},
        {name:'Edit',prop:'Edit',sortable:false,width:'60'},
        {name:'View',prop:'View',sortable:false,width:'60'},
        {name:'Delete',prop:'Delete',sortable:false,width:'60'},
        ];
    ChildID: number;
    objPlacementContactDTO: PlacementContactDTO = new PlacementContactDTO();
    returnVal;
    controllerName = "PlacementContact";
    FormCnfgId = 175;
    LocalAuthorityList;
    AgencyProfileId;
    constructor(private apiService: APICallService, private _router: Router, private modal: PagesComponent) {
      
       // this.apiService.get("LocalAuthority", "getall", parseInt(Common.GetSession("AgencyProfileId"))).then(data => { this.LocalAuthorityList = data });
        this.bindPlacementContactList();
        
    }

    edit(id) {
        this._router.navigate(['/pages/child/placementcontact', id]);
    }

    private bindPlacementContactList() {
        this.apiService.post(this.controllerName, "GetAll", this.objPlacementContactDTO).then(data => {
            this.lstPlacementContact = data;
            this. rows = this.lstPlacementContact.map(item => ({
                ...item,
                Name: item.FirstName + ' ' +item.LastName,
                Contact: item.ContactInfo.AddressLine1 + "\n" + item.ContactInfo.HomePhone + "\n" + item.ContactInfo.EmailId
              }))
        });
    }

    delete(PlacementContactInfoId) {
        this.apiService.delete(this.controllerName, PlacementContactInfoId).then(data => this.Respone(data));
    }

    fnAddData() {
        this._router.navigate(['/pages/child/placementcontact', 0]);
    }
    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.bindPlacementContactList();
        }
    }
    onEdit($event){
        this.edit($event.PlacementContactInfoId);
    }
    onDelete($event){
        this.delete($event.PlacementContactInfoId);
    }

}