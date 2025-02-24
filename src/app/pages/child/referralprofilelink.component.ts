
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';

@Component
    ({
        template:``,
        selector: 'childc',    
    
    })

export class ReferralProfileLinkComponent {
    objQeryVal;
    constructor(private _router: Router, private route: ActivatedRoute) {
        this.route.params.subscribe(data => this.objQeryVal = data);

        if (this.objQeryVal.mid == 16) {
            if (Common.GetSession("status") != null) {
                if (Common.GetSession("status") != "18") {
                    Common.SetSession("status", "18");
                    sessionStorage.removeItem("ChildId");
                }
                this._router.navigate(['/pages/referral/childprofilelist/0/16']);
            }
            else
            {
                Common.SetSession("status", "18");
                sessionStorage.removeItem("ChildId");
                this._router.navigate(['/pages/referral/childprofilelist/0/16']);
            }
           
        }
        else {
            if (Common.GetSession("status") != null) {
                if (Common.GetSession("status") != "19") {
                    Common.SetSession("status", "19");
                    sessionStorage.removeItem("ChildId");
                }
                this._router.navigate(['/pages/referral/childprofilelist/1/4']);
            }
            else
            {
                Common.SetSession("status", "19");
                sessionStorage.removeItem("ChildId");
                this._router.navigate(['/pages/referral/childprofilelist/1/4']);
            }
            
        }
    }   

}