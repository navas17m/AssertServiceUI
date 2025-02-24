//import { ControlPosition } from '@agm/core';
import { Component,OnInit,Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import {EventsGalleryDTO} from '../uploaddocument/DTO/uploaddocumentsdto'
@Component({
    selector: 'ChildGalleryDetails',
    templateUrl: './childgallerydetails.component.template.html',
    styles:[`
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
      left: 26px;
      background-color: #ddd;
      width: 40px;
      border-radius: 5px;
    }
    .top-right {
      position: absolute;
      top: 8px;
      right: 26px;
      background-color: #ddd;
      width: 70px;
      border-radius: 5px;
    }

    .centered {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
     
      font-size: 90px;
      color: #ddd; 
    }

    .container {
      position: relative;
    
    }
    
    .container:hover .overlay {
      opacity: 1;
    }

    .buttoncls {
        cursor: pointer;
        width: 40%;
        height: 50px;
        background: #f1f1f1;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin: 50px;
    }
    /* Reset CSS */

img , video{
	max-width: 100%;
	height: auto;
	vertical-align: middle;
	display: inline-block;
}

/* Main CSS */
.grid-wrapper > div {
	display: flex;
	justify-content: center;
	align-items: center;
 
}
.grid-wrapper > div > img,video {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 5px;
  
}

.grid-wrapper {
	display: grid;
	grid-gap: 10px;
	grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
	grid-auto-rows: 200px;
	grid-auto-flow: dense;
}



      `]
})
export class ChildGalleryDetailsComponent   {  
    
  @Input()
  set LinkId(val:any)
  {
    this.objEventsGalleryDTO.LinkId=val;
    this.fnBindDetails(); 
  }
  
    lstGalleryDetails=[];
    objQeryVal;
    ChildId;
    objEventsGalleryDTO=new EventsGalleryDTO();
    imageObject: Array<object> = [];
    constructor(private apiService:APICallService, private modal: PagesComponent, private _router: Router, private route: ActivatedRoute) {       
        this.route.params.subscribe(data => this.objQeryVal = data);

        this.objEventsGalleryDTO.LinkId=this.objQeryVal.id;
        this.fnBindDetails();  
      
    }

    fnBindDetails()
    {
      this.imageObject=[];
      this.apiService.post("EventsGallery","GetById",this.objEventsGalleryDTO).then(data=>{
        this.lstGalleryDetails=data;
       
        data.forEach(element => {
          if(element.FileType==1)
          {
            let imageObjectTemp ={
              image:'data:image/jpeg;base64,'+ element.FileData,
              thumbImage:'data:image/jpeg;base64,'+ element.FileData,
              alt: element.FileName,
              title:element.FileName,
            };
            this.imageObject.push(imageObjectTemp);
          }
          else  if(element.FileType==2)
          {
            let imageObjectTemp ={
              video: 'data:video/mp4;base64,'+element.FileData,
              alt: element.FileName,
              title:element.FileName,
            };
            this.imageObject.push(imageObjectTemp);
          }
        });
      })

    }
   
    fnback(){
      this._router.navigate(['/pages/child/childgallry/4',this.objQeryVal.take]);
    }
}