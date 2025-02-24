
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

            if (this.objQeryVal.mid == 3)
                this._router.navigate(['/pages/fostercarer/personaldetails/3']);

            if (this.objQeryVal.mid == 13)
                this._router.navigate(['/pages/recruitment/personaldetails/13']);
        }
        else if (this.objQeryVal.Id == 2) {

            if (this.objQeryVal.mid == 3)
                this._router.navigate(['/pages/fostercarer/fcinitialenquiry/0/3']);

            if (this.objQeryVal.mid == 13)
                this._router.navigate(['/pages/recruitment/initialenquiry/0/13']);
        }
        else if (this.objQeryVal.Id == 3) {

            if (this.objQeryVal.mid == 3)
                this._router.navigate(['/pages/fostercarer/fccarerinitialhomevisit/3']);

            if (this.objQeryVal.mid == 13)
                this._router.navigate(['/pages/recruitment/carerinitialhomevisit/13']);
        }
        else if (this.objQeryVal.Id == 4) {
            this._router.navigate(['/pages/recruitment/carerapplication/13']);
        }
        else if (this.objQeryVal.Id == 5) {
        //    console.log(this.objQeryVal.Id);
            this._router.navigate(['/pages/recruitment/carerstatuschange/13']);
        }
        else if (this.objQeryVal.Id ==6) {

            if (this.objQeryVal.mid == 36)
                this._router.navigate(['/pages/fostercarer/uploadformfdocuments/36']);

            if (this.objQeryVal.mid == 37)
                this._router.navigate(['/pages/recruitment/uploadformfdocuments/37']);
        }
        else if (this.objQeryVal.Id == 7) {
          this._router.navigate(['/pages/recruitment/carerapplicationnew/13']);
        }
    }


}
