import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Common } from '../common';
@Component({
    selector: 'EditButton',
    template: `<button style="cursor:pointer;"  data-animation="false"
                        data-placement="bottom" title="Edit" *ngIf="insVisible" [disabled]="insdisabled" class="btn btn-warning btn-xs {{insSize}}" (click)="fnClick()"><i style="font-size:20px" class="fa  fa fa-edit"></i></button>`,

})

export class EditButtonComponent {
    @Output() Click: EventEmitter<any> = new EventEmitter();
    insVisible = false;
    insText = "Edit";
    insFormCnfgId;
    insSize = "";
    insFormRoleAccessMapping = [];
    UserProfileId;
    insdisabled;
    isSaveAsDraft:number=0;

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
    set IsSaveAsDraft(value: number) {
        this.isSaveAsDraft = value;   
        if(value==1)
            this.CheckFormAccess(this.insFormCnfgId);    
    }
    
    @Input()
    set Disabled(value: any) {
        this.insdisabled = value;
    }


    @Input()
    set Size(value: any) {
        if (value == 's' || value == 'S')
            this.insSize = "btn-xs";
    }


    fnClick() {
        this.Click.emit();
    }


    CheckFormAccess(FormId) {

        this.insFormRoleAccessMapping = JSON.parse(Common.GetSession("FormRoleAccessMapping"));

        this.UserProfileId = Common.GetSession("UserProfileId");
        if (this.UserProfileId == 1) {
            this.insVisible = true;
        }
        else if (FormId != null && this.insFormRoleAccessMapping != null) {
            if(this.isSaveAsDraft==0)
            {               
                let check = this.insFormRoleAccessMapping.filter(data => data.FormCnfgId == FormId && data.AccessCnfgId == 3);
                if (check.length > 0) {
                    this.insVisible = true;
                }
                else {
                    this.insVisible = false;
                }
            }
            else
            {              
                this.insVisible = true;
            }
        }
    }

}