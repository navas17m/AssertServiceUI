import { Component, EventEmitter, forwardRef, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
//import { SignaturePad } from 'angular2-signaturepad/signature-pad';
declare var window: any;

import { SignaturePadComponent } from '@almothafar/angular-signature-pad';

@Component({
    selector: 'SignaturePad',
    template: `<div>
                     <signature-pad #signature [options]="signaturePadOptions" (drawStart)="drawBegin()"
                       (drawEnd)="drawComplete()"></signature-pad> 

                    <label class="class1" style="border-top: 2px solid black;width: 50%;padding-top: 10px;">Please sign here :&nbsp;&nbsp;<span (click)="clear()" style="color:blue;cursor:pointer">Clear</span></label><br>

                </div>`,

    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SignatureComponent),
            multi: true,
        },
    ],
})
//<button id="save"(click) = "drawComplete()" > Save < /button>
export class SignatureComponent implements ControlValueAccessor {
  //  @ViewChild(SignaturePad,{static:false}) public signaturePad: SignaturePad;

    @ViewChild('signature')
    public signaturePad: SignaturePadComponent;
    @Output() changesign: EventEmitter<any> = new EventEmitter();

    //@Input()
    //set SetSignature(value: any) {
    //    this.signaturePad.fromDataURL(value);

    //}

    public options: Object = {};

    signaturePadOptions = {// passed through to szimek/signature_pad constructor
        'minWidth': 2,
        'canvasWidth': (window.innerWidth / 100) * 38,
        'canvasHeight': (window.innerHeight / 100) * 50,
        'penColor': "rgb(0, 0, 0)",
        "backgroundColor": 'rgb(255, 255, 255)',
        "allowEdit": true,
    };

    public _signature: any = null;

    public propagateChange: Function = null;



    get signature(): any {
        return this._signature;
    }

    set signature(value: any) {
        this._signature = value;
        //console.log('set signature to ' + this._signature);
        //  console.log('signature data :');
        // console.log(this.signaturePad.toData());
        this.propagateChange(this.signature);

    }

    public writeValue(value: any): void {
        if (!value) {
            return;
        }
        this._signature = value;
        this.signaturePad.fromDataURL(this.signature);
    }

    public registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    public registerOnTouched(): void {
        // no-op
    }

    public ngAfterViewInit(): void {
        //  this.signaturePad.clear();
    }

    public drawBegin(): void {
        // console.log('Begin Drawing');
    }
    listValue
    public drawComplete() {
        // console.log('Begin Complete');
        // console.log(this.signaturePad.toDataURL());

        //  this.signature = this.signaturePad.toDataURL();
        //console.log("toDataURL");
        // console.log(this.signaturePad.toDataURL('image/jpeg', 0.5))
        this.changesign.emit(this.signaturePad.toDataURL('image/jpeg', 0.5));
        //this.returnSign();
    }

    public clear(): void {
        this.signaturePad.clear();
        this.signature = '';
    }
}
