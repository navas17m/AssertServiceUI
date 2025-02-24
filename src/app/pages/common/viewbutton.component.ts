import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Common } from '../common';
@Component({
    selector: 'ViewButton',
    template: `<button  style="cursor:pointer;" data-toggle="tooltip" data-animation="false"
                        data-placement="bottom" title="View"  *ngIf="insVisible" class="btn btn-info btn-xs {{insSize}}" (click)="fnClick()"><i style="font-size:20px" class="fa fa-file-o"></i></button>`,

})

export class ViewButtonComponent {
    @Output() Click: EventEmitter<any> = new EventEmitter();
    insVisible = false;
    insText = "View";
    insFormCnfgId;
    insSize = "";
    insFormRoleAccessMapping = [];
    UserProfileId;

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


    fnClick() {

      //  Common.SetSession("ViweDisable", null);
        Common.SetSession("ViweDisable", "1");
      //  console.log("set");
        this.Click.emit();
    }


    CheckFormAccess(FormId) {
        this.insFormRoleAccessMapping = JSON.parse(Common.GetSession("FormRoleAccessMapping"));

        this.UserProfileId = Common.GetSession("UserProfileId");
        if (this.UserProfileId == 1) {
            this.insVisible = true;
        }
        else if (FormId != null && this.insFormRoleAccessMapping != null) {
            let check = this.insFormRoleAccessMapping.filter(data => data.FormCnfgId == FormId && data.AccessCnfgId == 1);
            if (check.length > 0) {
                this.insVisible = true;
            }
            else {
                this.insVisible = false;
            }
        }
    }

}