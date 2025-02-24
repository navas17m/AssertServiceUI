import { Component, Input } from '@angular/core';
import { Common } from '../common';
@Component({
    selector: 'ApprovedCarerHeaderold',
    templateUrl: './approvedcarerselected.component.template.html',
})



export class ApplicantSelectedComponet {
    selectName;
    SelectCode;
    CarerStatusName;
    isVisible = false;
    @Input()
    set Name(val: any) {
        // this.selectName = val;
        // if (val != null && val != '')
        //   this.isVisible = true;
    }

    @Input()
    set Code(val: any) {
        // this.SelectCode = val;
    }

    constructor() {

        if (this.selectName == null) {
            this.selectName = Common.GetSession("ACarerName");
            this.SelectCode = Common.GetSession("ACarerCode");
            this.CarerStatusName = Common.GetSession("ACarerStatusName");
            if (Common.GetSession("ACarerId") != "0" && Common.GetSession("ACarerParentId") != "0" && Common.GetSession("ACarerId") != null && Common.GetSession("ACarerParentId") != null)
                this.isVisible = true;
            else
                this.isVisible = false;

        }
    }
}