import { LocalAuthority } from './../systemadmin/DTO/localauthority';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { CarerAddressHistoryDTO } from '../fostercarer/DTO/careraddresshistorydto';
import { Common } from '../common';
@Component({
    selector: 'CarerAddressHistory',
    templateUrl: './careraddresshistory.component.template.html',
})

export class CarerAddressHistoryComponent {
  objCarerAddressHistoryDTO: CarerAddressHistoryDTO = new CarerAddressHistoryDTO();
  objCarerAddressHistoryList: CarerAddressHistoryDTO[] = [];
  objCarerAddressList: CarerAddressHistoryDTO[] = [];
  _Form: FormGroup;
  submitted = false;
  isDirty = false;
  isEdit = false;
  AgencyProfileId:number;
  LocalAuthorityList;
  LocalAuthorityName:string;
  deletbtnAccess = false;
  addressId:number;
    @Input()
    set AddressInfo(addressinfo: CarerAddressHistoryDTO[]) {

        if (addressinfo != null) {
            this.FillList(addressinfo);
        }
    }
    get AddressInfo(): CarerAddressHistoryDTO[] {
        this.objCarerAddressList = this.objCarerAddressHistoryList;
        return this.objCarerAddressList;
    }

    @Input()
    set FormCnfgId(Id: number) {
        if (Id != null)
            this.deletbtnAccess = this.pComponent.GetDeletAccessPermission(Id);
    }

    FillList(refinfo: CarerAddressHistoryDTO[]) {
        //  alert(1);
        this.objCarerAddressHistoryList = [];
        if (refinfo != null && refinfo[0] != null) {
            refinfo.forEach(item => {
                let addAddress: CarerAddressHistoryDTO = new CarerAddressHistoryDTO();
                  addAddress.CarerAddressHistoryId = item.CarerAddressHistoryId;
                  addAddress.ContactInfoId = item.ContactInfoId;
                  addAddress.IsCurrentAddress = item.IsCurrentAddress;
                  addAddress.ContactInfo.AddressLine1 = item.ContactInfo.AddressLine1;
                  addAddress.ContactInfo.PostalCode = item.ContactInfo.PostalCode;
                  addAddress.DateMoved = this.pComponent.GetDateEditFormat(item.DateMoved);
                  addAddress.DateMovedOut = this.pComponent.GetDateEditFormat(item.DateMovedOut);
                  addAddress.LocalAuthorityName = item.LocalAuthorityName;
                  addAddress.AddressWhenApplied = item.AddressWhenApplied;
                  addAddress.LocalAuthorityId = item.LocalAuthorityId;
                this.objCarerAddressHistoryList.push(addAddress);
            });
        }

    }



    constructor(_formBuilder: FormBuilder, private _http: HttpClient, private pComponent: PagesComponent, private apiService: APICallService) {
      this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
      this._Form = _formBuilder.group({
        AddressLine1: ['', [Validators.required,Validators.maxLength(300)]],
        PostalCode: ['',[Validators.required,Validators.minLength(7),Validators.maxLength(10)]],
        DateMoved:['',[Validators.required]],
        DateMovedOut:[''],
        IsCurrentAddress:[''],
        AddressWhenApplied:[''],
        LocalAuthorityId:['']
    })
    this.objCarerAddressHistoryDTO.DateMoved = null;
    this.objCarerAddressHistoryDTO.DateMovedOut = null;
    this.apiService.get('carerinfo', "GetApplicantFormDDLValues", this.AgencyProfileId).then(data => {
      this.LocalAuthorityList = data.LocalAuthority;
    });

    }

    Submitaddressinfo(ainfo,LAName, _Form) {
      this.submitted = true;
      if (_Form.valid) {
          let addAddress: CarerAddressHistoryDTO = new CarerAddressHistoryDTO();

          addAddress.ContactInfo.AddressLine1 = ainfo.ContactInfo.AddressLine1;
          addAddress.ContactInfo.PostalCode = ainfo.ContactInfo.PostalCode;
          addAddress.DateMoved = ainfo.DateMoved;
          addAddress.DateMovedOut = ainfo.DateMovedOut;
          addAddress.IsCurrentAddress = ainfo.IsCurrentAddress;
          addAddress.AddressWhenApplied = ainfo.AddressWhenApplied;
          addAddress.LocalAuthorityId = ainfo.LocalAuthorityId;
          addAddress.LocalAuthorityName = LAName;
          addAddress.StatusId = 1;
          addAddress.IsActive = true;
          if (ainfo.IsCurrentAddress ==1)
          {
            this.objCarerAddressHistoryList.forEach(element => {
              element.IsCurrentAddress =0;
              element.StatusId = 2;
            });
          }
          if (ainfo.AddressWhenApplied ==1)
          {
            this.objCarerAddressHistoryList.forEach(element => {
              element.AddressWhenApplied =0;
              element.StatusId =2;
            });
          }

          this.objCarerAddressHistoryList.push(addAddress);
          this.isDirty = true;
          this.submitted = false;
          this.SubmitCancel();


      }
  }
  i = 0;
  private UpdateAddressInfo(_Form,LAName) {
        this.submitted = true;
        if (_Form.valid) {
          if (this.objCarerAddressHistoryDTO.IsCurrentAddress ==1)
          {
            this.objCarerAddressHistoryList.forEach(element => {
              element.IsCurrentAddress =0;
              element.StatusId =2;
            });
          }
          if (this.objCarerAddressHistoryDTO.AddressWhenApplied ==1)
          {
            this.objCarerAddressHistoryList.forEach(element => {
              element.AddressWhenApplied =0;
              element.StatusId =2;
            });
          }
            this.i = 0;
            this.objCarerAddressHistoryList.forEach(item => {
                if (this.i == this.addressId) {
                    this.CopyProperty(this.objCarerAddressHistoryDTO, item);
                    item.LocalAuthorityName = LAName;
                }
                this.i++;
            });
            this.isDirty = true;
        }
        this.submitted = false;
        //   this.pComponent.alertSuccess('Reference Details Updated Successfully');
        this.isEdit = false;
        this.SubmitCancel();
    }
  private DeleteData(item) {
    //   if (confirm(Common.GetDeleteConfirmMsg)) {
    item.StatusId = 3;
    item.IsActive = false;
    this.isDirty = true;
    // }
  }
  private EditData(item, id) {

    this.isEdit = true;
    this.CopyProperty(item, this.objCarerAddressHistoryDTO);

    this.addressId = id;
  }

private CopyProperty(source: CarerAddressHistoryDTO, target: CarerAddressHistoryDTO) {
  target.ContactInfo.AddressLine1 = source.ContactInfo.AddressLine1;
  target.ContactInfo.PostalCode = source.ContactInfo.PostalCode;
  target.DateMoved = source.DateMoved;
  target.DateMovedOut =source.DateMovedOut;
  target.IsCurrentAddress = source.IsCurrentAddress;
  if (source.AddressWhenApplied == null)
    target.AddressWhenApplied = 0;
  else
    target.AddressWhenApplied = source.AddressWhenApplied;
  target.LocalAuthorityId = source.LocalAuthorityId;
  target.LocalAuthorityName = source.LocalAuthorityName;
  target.StatusId = 2;

}

  public SubmitCancel() {
        this.isEdit = false;
        this.objCarerAddressHistoryDTO = new CarerAddressHistoryDTO();
        this.objCarerAddressHistoryDTO.DateMoved = null;
        this.objCarerAddressHistoryDTO.DateMovedOut =null;
    }


    public onSearchChange(value: any): void {
      this.LocalAuthorityName = value.LocalAuthorityName;
    }
}
