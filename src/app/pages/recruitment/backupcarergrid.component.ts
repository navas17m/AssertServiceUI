import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { BackupCarerDTO } from './DTO/backupcarer';
import { BackupCarerInfoDTO } from './DTO/backupcarerinfo';
@Component({
    selector: 'BackupCarerGrid',
    templateUrl: './backupcarergrid.component.template.html'
})

export class BackupCarerGridComponent {
  objBackupCarerDTO: BackupCarerDTO = new BackupCarerDTO();
  objBackupCarerList: BackupCarerDTO[] = [];
  objBkpCarerList: BackupCarerDTO[] = [];
  objBack
  _Form: FormGroup;
  submitted = false;
  isDirty = false;
  isEdit = false;
  AgencyProfileId:number;
  deletbtnAccess = false;
  backupCarerId:number;
  bkpCarerId:number;
  @Input()
    set BackupCarers(backupCarers:BackupCarerDTO[]) {
        if (backupCarers != null) {
            this.FillList(backupCarers);
        }
    }
    get BackupCarers(): BackupCarerDTO[] {
        this.objBkpCarerList = this.objBackupCarerList;
        return this.objBkpCarerList;
    }

    @Input()
    set FormCnfgId(Id: number) {
        if (Id != null)
            this.deletbtnAccess = this.pComponent.GetDeletAccessPermission(Id);
    }
    @Input()
    set ChangeStatus(Id: number) {
        if (Id != null && Id == 1 && this.objBackupCarerList.length > 0) {
            this.objBackupCarerList.filter(x => x.StatusId == 1).forEach(item => {
                item.StatusId = 0;
            })
        }

    }

    constructor(_formBuilder: FormBuilder, private _http: HttpClient, private pComponent: PagesComponent, private apiService: APICallService) {
      this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
      this._Form = _formBuilder.group({
        FirstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        AddressLine1: [''],
        HomePhone: ['', [Validators.minLength(10), Validators.maxLength(20)]],
        EmailId: [],
        AgreedToBeBackupCarer:[]

    })

  }
  FillList(backupCarers:BackupCarerDTO[]) {
    this.objBackupCarerList = [];
    if (backupCarers?.length>0 ) {
      backupCarers.forEach(item => {
            let addBkpCarer: BackupCarerDTO = new BackupCarerDTO();
            addBkpCarer.BackupCarerInfo.PersonalInfo.FirstName = item.BackupCarerInfo.PersonalInfo.FirstName;
            addBkpCarer.BackupCarerInfo.PersonalInfo.lastName = item.BackupCarerInfo.PersonalInfo.lastName;
            addBkpCarer.BackupCarerInfo.ContactInfo.AddressLine1 = item.BackupCarerInfo.ContactInfo.AddressLine1;
            addBkpCarer.BackupCarerInfo.ContactInfo.HomePhone = item.BackupCarerInfo.ContactInfo.HomePhone;
            addBkpCarer.BackupCarerInfo.ContactInfo.EmailId = item.BackupCarerInfo.ContactInfo.EmailId;
            addBkpCarer.AgreedToBeBackupCarer = item.AgreedToBeBackupCarer;
            addBkpCarer.StatusId = item.StatusId;
            this.objBackupCarerList.push(addBkpCarer);
        });
    }
}
private EditData(item, id) {
    this.isEdit = true;
    this.CopyProperty(item, this.objBackupCarerDTO);
    this.bkpCarerId = id;
}
private CopyProperty(source: BackupCarerDTO, target: BackupCarerDTO) {
  target.BackupCarerInfo.PersonalInfo.FirstName = source.BackupCarerInfo.PersonalInfo.FirstName;
  target.BackupCarerInfo.PersonalInfo.lastName = source.BackupCarerInfo.PersonalInfo.lastName;
  target.BackupCarerInfo.ContactInfo.AddressLine1 = source.BackupCarerInfo.ContactInfo.AddressLine1;
  target.BackupCarerInfo.ContactInfo.HomePhone = source.BackupCarerInfo.ContactInfo.HomePhone;
  target.BackupCarerInfo.ContactInfo.EmailId = source.BackupCarerInfo.ContactInfo.EmailId;
  target.AgreedToBeBackupCarer = source.AgreedToBeBackupCarer;
  target.StatusId = 2;
}
SubmitBackupCarerInfo(bcInfo, _Form) {
  this.submitted = true;
  if (_Form.valid) {
      let addBC: BackupCarerDTO = new BackupCarerDTO();
      addBC.BackupCarerInfo.PersonalInfo.FirstName = bcInfo.BackupCarerInfo.PersonalInfo.FirstName;
      addBC.BackupCarerInfo.PersonalInfo.lastName = bcInfo.BackupCarerInfo.PersonalInfo.lastName;
      addBC.BackupCarerInfo.ContactInfo.AddressLine1 = bcInfo.BackupCarerInfo.ContactInfo.AddressLine1;
      addBC.BackupCarerInfo.ContactInfo.HomePhone = bcInfo.BackupCarerInfo.ContactInfo.HomePhone;
      addBC.BackupCarerInfo.ContactInfo.EmailId = bcInfo.BackupCarerInfo.ContactInfo.EmailId;
      addBC.AgreedToBeBackupCarer = bcInfo.AgreedToBeBackupCarer;
      addBC.StatusId = 1;
      addBC.IsActive = true;
      addBC.BackupCarerDetailsId = 0;
      this.objBackupCarerList.push(addBC);
      this.isDirty = true;
      this.submitted = false;
      this.SubmitCancel();
  }
}
public SubmitCancel() {
  this.isEdit = false;
  this.objBackupCarerDTO = new BackupCarerDTO();
}
i = 0;
private UpdateBackupCarerInfo(_Form) {
    this.submitted = true;
    if (_Form.valid) {
        this.i = 0;
        this.objBackupCarerList.forEach(item => {
            if (this.i == this.bkpCarerId) {
                this.CopyProperty(this.objBackupCarerDTO, item);
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
}
