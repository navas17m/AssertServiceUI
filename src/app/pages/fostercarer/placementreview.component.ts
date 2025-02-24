
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { AnnualReviewService } from '../services/annualreview.services';
@Component({
    selector: 'PlacementReview',
    templateUrl: './placementreview.component.template.html',
    providers: [AnnualReviewService],
    styles: [`[required]  {
        border-left: 5px solid blue;
    }

    .ng-valid[required], .ng-valid.required  {
            border-left: 5px solid #42A948; /* green */
}
    .ng-invalid:not(form)  {
        border-left: 5px solid #a94442; /* red */
}`]
})
export class PlacementReviewComponet {
    CarerInfos
    objQeryVal;
    _Form: FormGroup;
    constructor(public _formBuilder: FormBuilder, public location: Location,
        private activatedroute: ActivatedRoute,
        private _router: Router, private annualreviServices: AnnualReviewService) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3]);
        }
    }



    GetAnualReviewDetails() {

        if (this.objQeryVal.id)
        {
            this.annualreviServices.GetByParentId(3).then(data => this.CarerInfos = data);

        }

    }

}
