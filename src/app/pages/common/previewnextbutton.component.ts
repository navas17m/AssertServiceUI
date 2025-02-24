import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Common } from '../common';
@Component({
    selector: 'PreviewNextbuttonButton',
    template: ` <i class="fa fa-angle-left" (click)="fnNextClick()" style="font-size:18px;color:white;cursor:pointer;padding-left:5px;padding-right:20px;" title="Newer"></i>
    <i class="fa fa-angle-right" (click)="fnPreviewClick()" style="font-size:18px;color:white;cursor:pointer;padding-left:5px;padding-right:20px;" title="Older"></i>`,

})

export class PreviewNextButtonComponent {
    @Output() PreviewClick: EventEmitter<any> = new EventEmitter();
    @Output() NextClick: EventEmitter<any> = new EventEmitter();


    fnPreviewClick() {
        this.PreviewClick.emit();
    }

    fnNextClick() {
        this.NextClick.emit();
    }


   

}