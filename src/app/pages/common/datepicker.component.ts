import { Directive, ElementRef, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';
declare var $: any;

@Directive({
    selector: '[datepicker]',
    providers: [{
        provide: NG_VALUE_ACCESSOR, useExisting:
        forwardRef(() => DatepickerDirective),
        multi: true
    }]
})
export class DatepickerDirective implements ControlValueAccessor {
    value: string;

    constructor(protected _elementRef: ElementRef) { }


    ngOnInit() {
        var ele: any = this._elementRef.nativeElement;
        //console.log($(ele))
        $(this._elementRef.nativeElement).datetimepicker({
            formatDate: 'Y-m-d',
            format: 'd/m/Y',
            changeMonth: true,
            changeYear: true,
            timepicker: false,
            scrollMonth: false,
            scrollInput: false
            //onChangeDateTime: function (dp, $input) {
            //    this.onModelChange($input.val())
            //},
        }).on('change', e => this.onModelChange(e.target.value));

        var re = /-/;
        if (ele.value != '' && ele.value != null && ele.value.search(re) == -1) {
           // console.log("Does not contain -");
            $(ele).val(ele.value);
        }
        else if (ele.value != '' && ele.value != null)
        { //  console.log("Contains -");
            $(ele).val(moment(ele.value).format("DD/MM/YYYY"));
        }
    }



    onModelChange: Function = () => { };

    onModelTouched: Function = () => { };

    writeValue(val: string): void {
        //this.value = val.replace(' ', 'T');
        this.value = val;
    }


    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }
}
