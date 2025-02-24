import { Component, EventEmitter, Input, Output,OnInit } from '@angular/core';
import { Common } from '../common';
import { PagesComponent } from '../pages.component'
declare var $: any;
@Component({
    selector: 'SubmitButton',
    template: `<span *ngIf="!isLoadingValue && !isDisable"><button style="cursor:pointer;" *ngIf="insColor !='red' && insVisible" id="btnSubmit" [ladda]="isLoadingValue" class="btn btn-success expand-right" (click)="fnClick()">{{insText}}</button>
               <button style="cursor:pointer;"  *ngIf="insColor =='red' && insVisible" id="btnSubmit" [ladda]="isLoadingValue" class="btn btn-danger expand-right" (click)="fnClick()">{{insText}}</button>
              </span>
              <span *ngIf="isLoadingValue && !isDisable"><button style="cursor: no-drop;" *ngIf="insColor !='red' && insVisible" id="btnSubmit" [ladda]="isLoadingValue" class="btn btn-success expand-right">{{insText}}</button>
               <button style="cursor: no-drop;"  *ngIf="insColor =='red' && insVisible" id="btnSubmit" [ladda]="isLoadingValue" class="btn btn-danger expand-right">{{insText}}</button>
              </span>
              <span *ngIf="isDisable">
              <button style="cursor: no-drop;" [disabled]="isDisable" *ngIf="insColor !='red' && insVisible" id="btnSubmit"  class="btn btn-success expand-right">{{insText}}</button>
              <button style="cursor: no-drop;" [disabled]="isDisable"  *ngIf="insColor =='red' && insVisible" id="btnSubmit"  class="btn btn-danger expand-right">{{insText}}</button>
             </span>`,

})

export class SubmitButtonComponent implements OnInit {
    @Output() Click: EventEmitter<any> = new EventEmitter();
    insVisible = true;
    insText = "Submit";
    insFormCnfgId;
    insSize = "";
    insFormRoleAccessMapping = [];
    UserProfileId;
    isLoadingValue: boolean = false;
    insColor;
    isDisable:boolean=false;
    @Input()
    set IsDiasable(value: boolean) {        
            this.isDisable = value;
    }
    @Input()
    set IsLoading(value: boolean) {
        this.isLoadingValue = value;
        //var $input = $('button');
        //if (value == true) {
        //    $input.attr("disabled", true);
        //}
        //else {
        //    $input.removeAttr("disabled");
        //}
    }
    @Input()
    set Text(value: any) {
        if (value != null && value != '')
            this.insText = value;
    }

    @Input()
    set FormCnfgId(value: any) {
        this.insFormCnfgId = value;
        this.CheckFormAccess(value);
    }


    @Input()
    set Size(value: any) {
        if (value == 's' || value == 'S')
            this.insSize = "btn-xs";
    }

    @Input()
    set Color(value: any) {
        if (value == 'red' || value == 'Red')
            this.insColor = "red";
    }


    ngOnInit(): void {
        
        PagesComponent.InternetConnectionStatus.subscribe((val)=>{
            if(val.status=="0")
             this.isDisable=true;
            else  if(val.status=="1")
               this.isDisable=false;        
         });
    }

    fnClick() {
        this.Click.emit();
    }

    CheckFormAccess(FormId) {
        this.insFormRoleAccessMapping = JSON.parse(Common.GetSession("FormRoleAccessMapping"));

        this.UserProfileId = Common.GetSession("UserProfileId");
        if (this.UserProfileId == 1) {
            this.insVisible = true;
        }
        else if (FormId != null && this.insFormRoleAccessMapping != null) {
            let check = this.insFormRoleAccessMapping.filter(data => data.FormCnfgId == FormId && data.AccessCnfgId == 2);
            if (check.length > 0) {
                this.insVisible = true;
            }
            else {
                this.insVisible = false;
            }
        }
    }



}