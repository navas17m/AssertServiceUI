
import { Component} from '@angular/core';
import { Router } from '@angular/router'

@Component
    ({
        template:``,
        selector: 'childc',    
    
    })

export class ChildProfileLinkComponent {
  
    constructor( private _router: Router) {
        this._router.navigate(['/pages/referral/childprofilelist/1/4']);
    }   

}