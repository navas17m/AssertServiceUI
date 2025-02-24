
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError as observableThrowError } from 'rxjs';
import { Base } from './base.service';


@Injectable()

export class DashboardService {

    constructor(public _http: HttpClient) { }


    GetDashboardInfo(obj) {

        return this._http.post(Base.GetUrl() + '/api/Dashboard/GetDashboardInfo', JSON.stringify(obj), Base.GetHeader()).toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }




    private handleResponse(data: any) {
        return data;
    }

    private handleError(error: Response) {
        return observableThrowError(error || 'Server error');
    }


}


