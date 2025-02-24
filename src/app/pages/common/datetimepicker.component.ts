import { Directive, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';
declare var $: any;

@Directive({
    selector: '[datetimepicker]',
    providers: [{
        provide: NG_VALUE_ACCESSOR, useExisting:
        forwardRef(() => DateTimepickerDirective),
        multi: true
    }]
})
export class DateTimepickerDirective implements ControlValueAccessor {
    value: string;

    constructor(protected _elementRef: ElementRef) { }


    ngOnInit() {
        var ele: any = this._elementRef.nativeElement;

        $(this._elementRef.nativeElement).datetimepicker({
            formatDate: 'Y-m-d',
            formatTime: 'H:i',
            format: 'd/m/Y H:i',
            changeMonth: true,
            changeYear: true,
            scrollMonth: false,
            scrollInput: false
        }).on('change', e => this.onModelChange(e.target.value));
        //$(this._elementRef.nativeElement).datepicker("setDate", new Date(this._elementRef.nativeElement.value));
        //   if (ele.value != '' && ele.value != null)
        //     $(ele).val(moment(ele.value).format("DD/MM/YYYY HH:mm"));

        var re = /-/;
        if (ele.value != '' && ele.value != null && ele.value.search(re) == -1) {
            // console.log("Does not contain - ");
            //$(ele).val(ele.value);
            ele.value = ele.value;
        }
        else if (ele.value != '' && ele.value != null) {
            // console.log("Contains - ");
            ele.value = moment(ele.value).format("DD/MM/YYYY HH:mm");
        }
    }

    onModelChange: Function = () => { };

    onModelTouched: Function = () => { };

    writeValue(val: string): void {
        this.value = val;
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }
}
