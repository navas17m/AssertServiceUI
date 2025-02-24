
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PagesComponent } from '../pages.component';
import { LocalAuthoritySWVisitDateHistoryDTO } from './DTO/localauthorityswhistorydto';


@Component({
    selector: 'LocalAuthoritySWVDateHistory',
    templateUrl: './localauthorityswvisitdatehistory.component.template.html',
})

export class LocalAuthoritySWVDateHistoryComponent {
    objVisitDateHistoryDTO: LocalAuthoritySWVisitDateHistoryDTO = new LocalAuthoritySWVisitDateHistoryDTO();
    listsubmitted = false;
    _Form1: FormGroup;
    objQeryVal;
    invoicelist = [];
    isEdit = false;
    CreditNoteDetailsId;
    limit=10;
    objVisitDateHistoryList: LocalAuthoritySWVisitDateHistoryDTO[] = [];
    deletbtnAccess = false;
    @Input()
    set Value(val) {
        this.FillList(val);
    }
    get Value() {

        return this.objVisitDateHistoryList;
    }
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private moduel: PagesComponent) {
        this.objVisitDateHistoryDTO.DateofLastVisit = null;
        this.route.params.subscribe(data => this.objQeryVal = data);
        this._Form1 = _formBuilder.group({
            DateofLastVisit: ['', Validators.required],
            Comments: [''],
        });

        if (this.objQeryVal.mid == 16) {
            this.deletbtnAccess = this.moduel.GetDeletAccessPermission(75);
        }
        else if (this.objQeryVal.mid == 4) {
            this.deletbtnAccess = this.moduel.GetDeletAccessPermission(89);
        }
    }

    //Grid
    FillList(details: LocalAuthoritySWVisitDateHistoryDTO[]) {
        this.objVisitDateHistoryList = [];
        if (details != null && details[0] != null) {
            details.forEach(item => {
                let add: LocalAuthoritySWVisitDateHistoryDTO = new LocalAuthoritySWVisitDateHistoryDTO();
                add.Comments = item.Comments;
                add.DateofLastVisit = item.DateofLastVisit;
                add.IsActive = true;
                add.StatusId = 4;
                add.LocalAuthoritySWVisitDateHistoryId = item.LocalAuthoritySWVisitDateHistoryId;
                this.objVisitDateHistoryList.push(add);
                this.objVisitDateHistoryList =[...this.objVisitDateHistoryList];
            })
        }
    }

    AddDetails(_Form) {
        this.listsubmitted = true;
        if (_Form.valid) {
            this.objVisitDateHistoryDTO.DateofLastVisit = this.moduel.GetDateSaveFormat(this.objVisitDateHistoryDTO.DateofLastVisit);
            let add: LocalAuthoritySWVisitDateHistoryDTO = new LocalAuthoritySWVisitDateHistoryDTO();
            add.Comments = this.objVisitDateHistoryDTO.Comments;
            add.DateofLastVisit = this.objVisitDateHistoryDTO.DateofLastVisit;
            add.IsActive = true;
            add.StatusId = 1;
            add.LocalAuthoritySWVisitDateHistoryId = 0;
            this.objVisitDateHistoryList.push(add);
            this.objVisitDateHistoryList =[...this.objVisitDateHistoryList];
            this.listsubmitted = false;
            this.SubmitCancel();
        }
    }

    private EditData(item, id) {
        this.isEdit = true;
        this.CopyProperty(item, this.objVisitDateHistoryDTO,"edit");
        this.CreditNoteDetailsId = id;
    }

    dateString;
    private CopyProperty(souerce: LocalAuthoritySWVisitDateHistoryDTO, target: LocalAuthoritySWVisitDateHistoryDTO, type: string) {
        target.Comments = souerce.Comments;
        target.StatusId = 2;

        if (type == 'edit')
            target.DateofLastVisit = this.moduel.GetDateEditFormat(souerce.DateofLastVisit);
        else
            target.DateofLastVisit = this.moduel.GetDateSaveFormat(souerce.DateofLastVisit);

    }

    i = 0;
    private UpdateDetails(_Form) {
        this.listsubmitted = true;
        if (_Form.valid) {
            this.i = 0;
            this.objVisitDateHistoryList.forEach(item => {
                if (this.i == this.CreditNoteDetailsId) {
                    this.CopyProperty(this.objVisitDateHistoryDTO, item,"update");
                }
                this.i++;
            });
        }
        this.listsubmitted = false;
        this.isEdit = false;
        this.SubmitCancel();
    }

    private DeleteData(item) {
      //  if (confirm(Common.GetDeleteConfirmMsg)) {
            item.StatusId = 3;
            item.IsActive = false;
      //  }
    }

    public SubmitCancel() {
        this.isEdit = false;
        this.objVisitDateHistoryDTO.Comments = null;
        this.objVisitDateHistoryDTO.DateofLastVisit = null;
    }
}

