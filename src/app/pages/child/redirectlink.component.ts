
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component
    ({
        template: ``,
        selector: 'redirect',

    })

export class RedirectLink {

    objQeryVal;
    constructor(private _router: Router, private route: ActivatedRoute) {
        this.route.params.subscribe(data => this.objQeryVal = data);
        
        switch (this.objQeryVal.Id) {
            case "1":
                {
                    this._router.navigate(['/pages/referral/childplacement/16']);
                    break;
                }
            case "2":
                {
                    this._router.navigate(['/pages/referral/childrespite/16']);
                    break;
                }
            case "3":
                {
                    this._router.navigate(['/pages/referral/childdischarge/16']);
                    break;
                }

        }
        
    }

}