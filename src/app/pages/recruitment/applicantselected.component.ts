import { Component, Input } from '@angular/core';
import { Common } from '../common';
@Component({
    selector: 'CarerHeaderold',
    templateUrl: './applicantselected.component.template.html',
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
            this.selectName = Common.GetSession("CarerName");
            this.SelectCode = Common.GetSession("CarerCode");
            this.CarerStatusName = Common.GetSession("CarerStatusName");
            if (Common.GetSession("CarerId") != "0" && Common.GetSession("CarerParentId") != "0" && Common.GetSession("CarerId") != null && Common.GetSession("CarerParentId") != null)
                this.isVisible = true;
            else
                this.isVisible = false;

        }
    }
}