import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Common } from '../common'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PagesComponent } from '../pages.component'
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablename';
import { EventsGalleryDTO } from '../uploaddocument/DTO/uploaddocumentsdto'
import { NgxSpinnerService } from "ngx-spinner";
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';

@Component({
  selector: 'ChildGallry',
  templateUrl: './childgallery.component.template.html',
  styles: [`
    .modal-content {
      position: relative;
      display: -webkit-box;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      flex-direction: column;
      width: 150% !important;
      margin-left: -30%;
      height: 50%;
      pointer-events: auto;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 0.3rem;
      outline: 0;
  }   
    
    .masonry-item { width: 250px; }
   
    .overlay {
      position: absolute; 
      bottom: 0; 
      background: rgb(0, 0, 0);
      background: rgba(0, 0, 0, 0.5); /* Black see-through */
      color: #f1f1f1; 
      width: 92%;
      transition: .5s ease;
      opacity:0;
      color: white;
      font-size: 15px;
      padding: 10px;
      text-align: center;
    }    
    
    .top-left {
      position: absolute;
      top: 10px;
      left: 10px;
      background-color: #ddd;
      width: 40px;      
    }
    .top-right {
      top: 10px;
      right: 10px;
      /* background-color: #ddd; */
      /* width: 40px; */
      text-align: right;
      color: red;
    }

    .centered {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);     
      font-size: 90px;
      color: #ddd; 
    }
    
    .ng-image-slider .ng-image-slider-container .main .main-inner .img-div img.ratio, .ng-image-slider .ng-image-slider-container .main .main-inner .img-div video.ratio {
      width: auto;
      height: 200px;
      max-width: 100%;
      max-height: 100%;
  }

    .container {
      position: relative;    
    }
    
    .container:hover .overlay {
      opacity: 1;
    }

    .buttoncls {
        cursor: pointer;
        width: 35%;
        height: 45px;
        background: #f1f1f1;
        border: 1px solid #ddd;
        border-radius: 5px;       
    }
    .card .card-footer {
      background: white;
   }
    /* Reset CSS */

img , video{
	max-width: 100%;
	height: auto;
	vertical-align: middle;
	display: inline-block;
}

`]
})

export class ChildGallryComponent {
  _Form: FormGroup;
  objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
  @ViewChild('btnDeleteModel') infobtnDelete: ElementRef;
  @ViewChild('btnDetailsModel') infobtnDetailsModel: ElementRef;
  lstEventGallery = [];
  ChildId; objQeryVal;
  objEventsGalleryDTO = new EventsGalleryDTO();
  objEventsGalleryDetailsDTO = new EventsGalleryDTO();
  totalcount = 0;
  lstCategory = [];
  insDetailLinkId = 0;
  objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
  FormCnfgId=315;
  constructor(private spinner: NgxSpinnerService, private apiService: APICallService, private _formBuilder: FormBuilder, private _router: Router, private modal: PagesComponent,
    private renderer: Renderer2, private route: ActivatedRoute) {
    this.spinner.show();
    this.route.params.subscribe(data => this.objQeryVal = data);
    if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != "null") {
      this.ChildId = parseInt(Common.GetSession("ChildId"));
      this.objEventsGalleryDTO.ChildId = this.ChildId;
      this.objEventsGalleryDTO.Skip = 0;
      this.objEventsGalleryDTO.CategoryId = 0;
      // this.objEventsGalleryDTO.Take=this.objQeryVal.take;
      this.fnbindEventGallery();
      this.CheckFormAccess();

      this.objConfigTableNamesDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
      this.objConfigTableNamesDTO.Name = "Events Gallery Category"
      this.apiService.post("ConfigTableValues", "GetByTableNamesId", this.objConfigTableNamesDTO).then(data => { this.lstCategory = data; });
    }
    else {
      Common.SetSession("UrlReferral", "pages/child/childgallry/4");
      this._router.navigate(['/pages/child/childprofilelist/1/4']);
    }

    this._Form = _formBuilder.group({
      CategoryId: ['0'],
      Title: []
    });

    this.objUserAuditDetailDTO.ActionId = 5;
    this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    this.objUserAuditDetailDTO.UserAuditHistoryId = parseInt(Common.GetSession("UserAuditHistoryId"));
    this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
    this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
    this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildId;
    this.objUserAuditDetailDTO.RecordNo = 0;
    Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
  }

  fnClickSearch() {
    this.objEventsGalleryDTO.Skip = 0;
    this.fnbindEventGallery();
  }

  fnbindEventGallery() {
    this.spinner.show()
    this.lstEventGallery = [];
    this.apiService.post("EventsGallery", "GetAll", this.objEventsGalleryDTO).then(data => {
      this.responseEventsGallery(data);
    });
  }

  fnShowMoreImage() {
    this.spinner.show();
    // this.lstEventGallery=[];
    this.objEventsGalleryDTO.Skip = this.objEventsGalleryDTO.Skip + 40;
    this.apiService.post("EventsGallery", "GetAll", this.objEventsGalleryDTO).then(data => {
      this.responseEventsGallery(data);
    });

  }

  fnMouserEnter(item) {
    item.Visible = true;
  }

  fnMouserLeave(item) {
    item.Visible = false;
  }

  updateMasonryLayout = false;
  responseEventsGallery(data) {
    data.map(item => {
      item.Visible = false;
    })
    this.spinner.hide()
    this.objEventsGalleryDTO.Take = 0;
    // return ;
    if (this.objEventsGalleryDTO.Skip == 0) {
      this.lstEventGallery = data;
    }
    else {
      data.forEach(element => {
        this.lstEventGallery.push(element);
      });      
      this.updateMasonryLayout = true;
    }
    this.totalcount = data[0].TotalCount;
  }

  fnAddData() {
    this._router.navigate(['/pages/child/childgallrydata/4']);
  }

  imageObject: Array<object> = [];
  lstGalleryDetails = [];
  fnViewDetail(id) {
    this.insDetailLinkId = id;
    this.objEventsGalleryDetailsDTO.LinkId = id;
    this.apiService.post("EventsGallery", "GetById", this.objEventsGalleryDetailsDTO).then(data => {
      this.lstGalleryDetails = data;
      this.responeseDetail(data);
    })
    //this._router.navigate(['/pages/child/childgallrydetails/',id,this.lstEventGallery.length]);
  }

  responeseDetail(data) {
    this.imageObject = [];
    data.forEach(element => {
      if (element.FileType == 1) {
        let imageObjectTemp = {
          image: 'data:image/jpeg;base64,' + element.FileData,
          thumbImage: 'data:image/jpeg;base64,' + element.FileData,
          alt: element.FileName,
          title: element.FileName,
        };
        this.imageObject.push(imageObjectTemp);
      }
      else if (element.FileType == 2) {
        let imageObjectTemp = {
          video: 'data:video/mp4;base64,' + element.FileData,
          alt: element.FileName,
          title: element.FileName,
        };
        this.imageObject.push(imageObjectTemp);
      }
    });

    let event = new MouseEvent('click', { bubbles: true });
    this.infobtnDetailsModel.nativeElement.dispatchEvent(event);
  }

  insLinkId;
  fnDelete(id) {
    this.insLinkId = id;
    let event = new MouseEvent('click', { bubbles: true });
    this.infobtnDelete.nativeElement.dispatchEvent(event);
  }
  fnConrirmDelete() {
    let obj = new EventsGalleryDTO();
    obj.LinkId = this.insLinkId;
    this.apiService.post("EventsGallery", "Delete", obj).then(data => {
      this.responseDelete(data);
    });
  }

  responseDelete(data) {
    if (data.IsError == true) {
      this.modal.alertDanger(data.ErrorMessage);
    }
    else if (data.IsError == false) {
      this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);

      this.objEventsGalleryDTO.Take = this.lstEventGallery.length;
      this.lstEventGallery = [];
      this.fnbindEventGallery();
    }

  }

  insFormRoleAccessMapping = [];
  UserProfileId;
  insVisible = false;
  CheckFormAccess() {
    this.insFormRoleAccessMapping = JSON.parse(Common.GetSession("FormRoleAccessMapping"));
    this.UserProfileId = Common.GetSession("UserProfileId");
    if (this.UserProfileId == 1) {
      this.insVisible = true;
    }
    else if (this.insFormRoleAccessMapping != null) {
      let check = this.insFormRoleAccessMapping.filter(data => data.FormCnfgId == 315 && data.AccessCnfgId == 4);
      if (check.length > 0) {
        this.insVisible = true;
      }
      else {
        this.insVisible = false;
      }
    }
  }
}
