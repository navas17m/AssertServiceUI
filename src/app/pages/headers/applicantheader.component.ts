import { Component, Input } from '@angular/core';
import { Common } from '../common';
//import { UploadDocumentsService } from '../services/uploaddocuments.service';
import { CarerParentDTO } from '../recruitment/DTO/carerparent';
import { APICallService } from '../services/apicallservice.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'CarerHeader',
   templateUrl: './applicantheader.component.template.html',
})
export class ApplicantHeaderComponet {

    IsShow = false;
    //@Input()
    //set IsShowControl(value: any) {
    //    this.IsShow = value;
    //}
    @Input()
    set ApplicantProfile(value: any) {

        if (value.PCFullName != null) {
            this.insCarerDetails = value;
        }
    }
    insCarerDetails: CarerParentDTO = new CarerParentDTO();
    srcPath = environment.photonotavail_url;
    constructor(private apiService: APICallService) {

        //  console.log("Application Header");
        //  console.log(JSON.parse(Common.GetSession("SelectedApplicantProfile")));

        if (Common.GetSession("SelectedApplicantProfile") != "0" && Common.GetSession("SelectedApplicantProfile") != null) {
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
            this.IsShow = true;
            this.fnShowImage(this.insCarerDetails.PersonalInfo.ImageId);
        }

    }
    public fnShowImage(ImageId) {
        if (ImageId != null) {
            this.apiService.get("UploadDocuments", "GetImageById", ImageId).then(data => {
                //this.uploadServie.GetImageById(ImageId).then(data => {
                this.srcPath = "data:image/jpeg;base64," + data;
            });
        }
        else {
            //this.srcPath = "../../../assets/img/app/Photonotavail.png";
            this.srcPath = environment.photonotavail_url;
        }
    }

}
