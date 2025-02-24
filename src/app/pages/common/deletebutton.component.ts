import { Component, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BsModalRef,BsModalService } from 'ngx-bootstrap/modal'

import { Common } from '../common';

@Component({
    selector: 'DeleteButton',
    template:
   `<button  
        style="cursor:pointer;" 
        title="Delete" *ngIf="insVisible" [disabled]="insdisabled" class="btn btn-danger btn-xs {{insSize}}" (click)="onDeleteRecord(template)"><i style="font-size:20px" class="fa fa-trash-o"></i></button>
        <ng-template #template>
            <div class="modal-body">
                <div class="modal-header state modal-danger">
                    <h5 class="modal-title" id="modal-error-label"><i class="fa fa-warning"></i>Are you sure you want to delete this?</h5>
                    <button type="button" class="close pull-right" (click)="modalRef.hide()">
                        <span aria-hidden="true" style="color:white">×</span>
                    </button>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" style="cursor:pointer;"  class="btn btn-danger closebtn"  (click)="fnClick()"  data-dismiss="modal">Yes</button>
                <button type="button" style="cursor:pointer;" class="btn btn-default" (click)="modalRef.hide()">No</button>
            </div>
        </ng-template>`,

})

export class DeleteButtonComponent {
    @Output() Click: EventEmitter<any> = new EventEmitter();
    insVisible = false;
    insText = "Delete";
    insFormCnfgId;
    insSize = "";
    insFormRoleAccessMapping = [];
    UserProfileId;
    insdisabled;
    insSequenceNo;
    modalRef:BsModalRef;
    @Input()
    set Text(value: any) {
        if (value != null && value != '')
            this.insText = value;
    }

    @Input()
    set FormCnfgId(value: any) {
        this.insFormCnfgId = value;
        this.CheckFormAccess(value);
    }


    @Input()
    set Size(value: any) {
        if (value == 's' || value == 'S')
            this.insSize = "btn-xs";
    }

    @Input()
    set Disabled(value: any) {
        this.insdisabled = value;
    }

    @Input()
    set SequenceNo(value: any) {
        this.insSequenceNo = value;
    }


    constructor(private modalService:BsModalService) {

    }


    fnClick() {
        this.Click.emit(null);
        this.modalRef.hide();
    }

    onDeleteRecord(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    // DialogOpen(template: TemplateRef<any>){
    //     this.modalRef = this.modalService.show(template);
    //   }
    CheckFormAccess(FormId) {

        this.insFormRoleAccessMapping = JSON.parse(Common.GetSession("FormRoleAccessMapping"));

        this.UserProfileId = Common.GetSession("UserProfileId");
        if (this.UserProfileId == 1) {
            this.insVisible = true;
        }
        else if (FormId != null && this.insFormRoleAccessMapping != null) {
            let check = this.insFormRoleAccessMapping.filter(data => data.FormCnfgId == FormId && data.AccessCnfgId == 4);
            if (check.length > 0) {
                this.insVisible = true;
            }
            else {
                this.insVisible = false;
            }
        }
    }

}
