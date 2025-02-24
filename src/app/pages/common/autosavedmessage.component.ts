import { Component,Input,OnInit } from '@angular/core';
import { PagesComponent } from '../pages.component';
@Component({
    selector: 'AutoSavedMessage',
    template: `<div style="text-align:right" *ngIf="showAutoSave && isVisible">
                <b>{{saveDraftText}}  {{draftSavedTime | date: 'HH:mm'}}</b>
               </div>`,

})



export class AutoSavedMessageComponent implements OnInit {

    @Input()
    set Text(val:string)
    {
      this.saveDraftText=val;
    }

    @Input()
    set Time(val:string)
    {
      this.draftSavedTime=val;
    }

    @Input()
    set Visible(val:any)
    {
      this.showAutoSave=val;
    }

    isVisible:boolean=true;
    saveDraftText:string;
    draftSavedTime:any;
    showAutoSave = false;
    constructor() {
           this.isVisible=true;
    }

    ngOnInit() {
        //Subject subscribe from pages component page for checking internet connection
        PagesComponent.InternetConnectionStatus.subscribe((val)=>{
           if(val.status=="0")
            this.isVisible=false;
           else  if(val.status=="1")
              this.isVisible=true;
        });
    }

}
