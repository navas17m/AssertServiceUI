
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError as observableThrowError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Base } from './base.service';



@Injectable()

export class ChildHealthHospitalisationInfoService {


    constructor(public _http: HttpClient) { }

    getChildHealthHospitalisationInfoList(ChildId: number) {
        return this._http.get(Base.GetUrl() + "/api/ChildHealthHospitalisationInfo/GetAllByChildId/" + ChildId).pipe(
            map((res: Response) => res.json()));

    }
    getByFormCnfgId(FormCnfgId) {
        return this._http.post(Base.GetUrl() + '/api/ChildHealthHospitalisationInfo/GetDynamicControls', JSON.stringify(FormCnfgId), Base.GetHeader()).toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }

    retval;
    post(carer, type) {
        
        if (type == "save") {
            return this._http.post(Base.GetUrl() + '/api/ChildHealthHospitalisationInfo/Save', JSON.stringify(carer), Base.GetHeader()).toPromise()
                .then(this.handleResponse)
                .catch(this.handleError);
        }
        else if (type == "update") {
            return this._http.patch(Base.GetUrl() + '/api/ChildHealthHospitalisationInfo/Save', JSON.stringify(carer), Base.GetHeader()).toPromise()
                .then(this.handleResponse)
                .catch(this.handleError);
        }
        else if (type == "delete") {
            return this._http.post(Base.GetUrl() + '/api/ChildHealthHospitalisationInfo/Delete/', JSON.stringify(carer), Base.GetHeader()).toPromise()
                .then(this.handleResponse)
                .catch(this.handleError);
        }


    }


    private handleResponse(data: any) {

        return data;
    }

    private handleError(error: Response) {
        // console.error(error);
        return observableThrowError(error || 'Server error');
    }



}


