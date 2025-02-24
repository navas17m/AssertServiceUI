import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'RedirectComponent',
    template: `<div></div>`,
})

export class RedirectComponent {
    objQeryVal;
    constructor(private activatedroute: ActivatedRoute, private _router: Router) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });


        if (this.objQeryVal.Id == 1) {
            this._router.navigate(['/pages/bulkoperation/generaldaylogjournal']);
        }

    }


}