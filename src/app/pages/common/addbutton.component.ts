import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Common } from '../common';
declare var $: any;

@Component({
    selector: 'AddButton',
    template: `<button style="cursor:pointer;" *ngIf="insVisible" [disabled]="insdisabled" class="btn btn-success {{insSize}}" (click)="fnClick()">{{insText}}</button>`,

})

export class AddButtonComponent {
    @Output() Click: EventEmitter<any> = new EventEmitter();
    insVisible = false;
    insText = "Add";
    insFormCnfgId;
    insSize = "";
    insFormRoleAccessMapping = [];
    UserProfileId;
    insdisabled
 
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
    set Visible(value: any) {
        this.insVisible = value;
    }

    constructor() {
        var $input = $('#btnSubmit,input[type="text"],input[type="checkbox"],input[type="date"],input[type="datetime"],input[type="datetime-local"],input[type="time"],input[type="radio"],input[type="number"],input[type="file"],button,Checkboxlist,select,select option,textarea');
        $input.removeAttr("disabled");
       

    }


    fnClick() {
        Common.SetSession("ViweDisable", "0");
        this.Click.emit();
    }


    CheckFormAccess(FormId) {
        this.insFormRoleAccessMapping = JSON.parse(Common.GetSession("FormRoleAccessMapping"));

        // //  console.log(this.insFormRoleAccessMapping);
        //   console.log(FormId);

        this.UserProfileId = Common.GetSession("UserProfileId");
        if (this.UserProfileId == 1) {
            this.insVisible = true;
        }
        else if (FormId != null && this.insFormRoleAccessMapping != null) {
            let check = this.insFormRoleAccessMapping.filter(data => data.FormCnfgId == FormId && data.AccessCnfgId == 2);
            if (check.length > 0) {
                this.insVisible = true;
            }
            else {
                this.insVisible = false;
            }
        }
    }

}