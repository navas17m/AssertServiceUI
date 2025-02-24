
import { Component, Input } from '@angular/core';
import { ChildProfile } from '../child/DTO/childprofile';
import { Common } from '../common';
//import { UploadDocumentsService } from '../services/uploaddocuments.service';
import { APICallService } from '../services/apicallservice.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'Child-Header',
    templateUrl: './childprofileheader.component.template.html',
})
export class ChildProfileHeaderComponet {

    IsShow = false;
    @Input()
    set IsShowControl(value: any) {
        this.IsShow = value;
    }
    @Input()
    set ChildProfile(value: any) {
        this.insChildProfileDTO = value;

    }
    insChildProfileDTO: ChildProfile = new ChildProfile();
    srcPath = environment.photonotavail_url;
    constructor(private apiService: APICallService) {

        if (Common.GetSession("SelectedChildProfile") != null) {
            this.insChildProfileDTO = JSON.parse(Common.GetSession("SelectedChildProfile"));
            this.IsShow = true;
            this.fnShowImage(this.insChildProfileDTO.PersonalInfo.ImageId);
        }

    }
    public fnShowImage(ImageId) {
        if (ImageId != null && ImageId > 0) {
            
            this.apiService.get("UploadDocuments", "GetImageById", ImageId).then(data => {
                // this.uploadServie.GetImageById(ImageId).then(data => {
                //console.log(data);
                this.srcPath = "data:image/jpeg;base64," + data;
            });
        }
        else {
            //this.srcPath = "../../../assets/img/app/Photonotavail.png";
            this.srcPath = environment.photonotavail_url;
        }
    }

}
