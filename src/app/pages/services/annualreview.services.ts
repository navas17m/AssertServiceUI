
//import {Http, Response, Headers, RequestOptions, Jsonp} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError as observableThrowError } from 'rxjs';
import { Base } from './base.service';



@Injectable()

export class AnnualReviewService {

    constructor(public _http: HttpClient ) { }
    retval;

    GetByParentId(objStatutory) {

        return this._http.post(Base.GetUrl() + '/api/CarerAnnualReview/GetByParentId', JSON.stringify(objStatutory), Base.GetHeader())
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }

    getListByCarerParentId(id: number) {

        return this._http.post(Base.GetUrl() + "/api/CarerAnnualReview/GetListByCarerParentId/" + id, Base.GetHeader())
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }


    getDynamicControl(objStatutory) {
       // console.log(objStatutory);
        return this._http.post(Base.GetUrl() + '/api/CarerAnnualReview/GetDynamicControls', JSON.stringify(objStatutory), Base.GetHeader())
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }

    getByUserId(objStatutory) {

        return this._http.post(Base.GetUrl() + '/api/CarerAnnualReview/GetByUserId', JSON.stringify(objStatutory), Base.GetHeader())
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }



    post(config, type) {
        if (type == "save") {
            return this._http.post(Base.GetUrl() + '/api/CarerAnnualReview/Save', JSON.stringify(config), Base.GetHeader())
                .toPromise()
                .then(this.handleResponse)
                .catch(this.handleError);
        }
        else if (type == "update") {
            return this._http.patch(Base.GetUrl() + '/api/CarerAnnualReview/Save', JSON.stringify(config), Base.GetHeader()).toPromise()
                .then(this.handleResponse)
                .catch(this.handleError);
        }
        else if (type == "delete") {
           // console.log(config);
            return this._http.post(Base.GetUrl() + '/api/CarerAnnualReview/Delete', JSON.stringify(config), Base.GetHeader()).toPromise()
                .then(this.handleResponse)
                .catch(this.handleError);
        }
        // return this.retval;
    }

    private handleResponse(data: any) {

        return data;
    }

    private handleError(error: Response) {
        console.error(error);
        return observableThrowError(error || 'Server error');
    }
}









