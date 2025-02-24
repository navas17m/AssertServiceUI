
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'UploadFormFRedirectComponent',
    template: `<div></div>`,
})

export class FCUploadFormFRedirectComponent {
    objQeryVal;
    constructor(private activatedroute: ActivatedRoute, private _router: Router) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

        if (this.objQeryVal.Id == 1) {
            this._router.navigate(['/pages/fostercarer/uploadformfdocuments', this.objQeryVal.mid]);
        }
    }
}