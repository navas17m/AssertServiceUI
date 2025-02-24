
import { Injectable } from '@angular/core';
import {  Resolve } from '@angular/router';
import { Common} from '../common'
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class ChildGetByIdResolver implements Resolve<any> {
    ChildId: number; objQeryVal;
    constructor(private route: ActivatedRoute,) {    
        this.route.params.subscribe(data => {
            this.objQeryVal = data;
        });        
    }

    resolve() {              
            if (Common.GetSession("ChildId") != null) {
                this.ChildId = parseInt(Common.GetSession("ChildId"));
                return null;//this._childService.getAllByChildId(this.ChildId);
            }
            else
                return null;       
    } 
}
