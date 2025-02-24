
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError as observableThrowError } from 'rxjs';
import { Base } from './base.service';


@Injectable()

export class ChildProfileService {


    constructor(public _http: HttpClient) { }

    GetAllByChildStatusId(StatusId) {
        return this._http.get(Base.GetUrl() + "/api/ChildProfile/GetAllByChildStatusId/" + StatusId, Base.GetHeader())
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }

    getAll(insChildProfileDTO) {
        return this._http.post(Base.GetUrl() + '/api/ChildProfile/GetAll', JSON.stringify(insChildProfileDTO), Base.GetHeader()).toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }
    GetAllForPlacement(insChildProfileDTO) {
        return this._http.post(Base.GetUrl() + '/api/ChildProfile/GetAllForPlacement', JSON.stringify(insChildProfileDTO), Base.GetHeader()).toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }    
    getChildStatus() {
        return this._http.get(Base.GetUrl() + '/api/ChildProfile/GetChildStatus').toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }
    getAllForTransferRespiteDischarge(insChildProfileDTO) {
        return this._http.post(Base.GetUrl() + '/api/ChildProfile/GetAllForTransferRespiteDischarge', JSON.stringify(insChildProfileDTO), Base.GetHeader()).toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }
    getAllForRespiteDischarge(insChildProfileDTO) {
        return this._http.post(Base.GetUrl() + '/api/ChildProfile/GetAllForRespiteDischarge', JSON.stringify(insChildProfileDTO), Base.GetHeader()).toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }
    GetAllForSiblingNParent(insChildProfileDTO) {
        return this._http.post(Base.GetUrl() + '/api/ChildProfile/GetAllForSiblingNParent', JSON.stringify(insChildProfileDTO), Base.GetHeader()).toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);

    }
    GetChildReferralNDynamicControls(insChildProfileRefDTO) {
        return this._http.post(Base.GetUrl() + '/api/ChildReferral/GetChildReferralNDynamicControls', JSON.stringify(insChildProfileRefDTO), Base.GetHeader()).toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }

    GetAllPlacedChildByAgencyId(AgencyId) {
        return this._http.get(Base.GetUrl() + "/api/ChildProfile/GetAllPlacedChildByAgencyId/" + AgencyId)
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }
    getAllByChildId(ChildId: number) {
        return this._http.get(Base.GetUrl() + "/api/ChildProfile/GetById/" + ChildId)
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }
    getAllByChildProfileId(ChildId) {
        return this._http.get(Base.GetUrl() + "/api/ChildOriginalReferral/GetById/" + ChildId)
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }
    GetAllChildSiblingNParentMapping(Id: number) {
        return this._http.get(Base.GetUrl() + "/api/ChildProfile/GetAllChildSiblingNParentMapping/" + Id)
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }
    getSiblingsNParentsByChildId(child) {

        return this._http.post(Base.GetUrl() + '/api/ChildProfile/GetSiblingsNParentsByChildId', JSON.stringify(child), Base.GetHeader()).toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);

    }

    retval;
    post(child, type) {

        if (type == "save") {
            return this._http.post(Base.GetUrl() + '/api/ChildProfile/Save', JSON.stringify(child), Base.GetHeader()).toPromise()
                .then(this.handleResponse)
                .catch(this.handleError);
        }
        else if (type == "update") {
            return this._http.patch(Base.GetUrl() + '/api/ChildProfile/Save', JSON.stringify(child), Base.GetHeader()).toPromise()
                .then(this.handleResponse)
                .catch(this.handleError);
        }
        else if (type == "delete") {
            return this._http.delete(Base.GetUrl() + '/api/ChildProfile/Save/' + child).toPromise()
                .then(this.handleResponse)
                .catch(this.handleError);
        }
    }
    saveChildReferral(child) {
        return this._http.post(Base.GetUrl() + '/api/ChildReferral/Save', JSON.stringify(child), Base.GetHeader()).toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }

    private handleResponse(data: any) {

        return data;
    }

    private handleError(error: Response) {
        // console.error(error);
        return observableThrowError(error || 'Server error');
    }

    movetoCurrentReferral(child) {
        
        return this._http.post(Base.GetUrl() + '/api/ChildProfile/MoveToCurrentReferral', JSON.stringify(child), Base.GetHeader()).toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }
}


