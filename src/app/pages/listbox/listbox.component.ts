
import { AfterViewChecked, Component, Input, ViewChild } from '@angular/core';
import { ListBoxOptions } from './listbox';

@Component({
    selector: 'ListBoxUC',
    templateUrl: './listbox.component.template.html',
    styleUrls: ['../styles.css'],

})

export class ListBoxUCComponet implements AfterViewChecked {

    //  objListBoxDTO: ListBoxDTO = new ListBoxDTO();
    objListBoxOptionsList: ListBoxOptions[] = [];
    @ViewChild('selectList') selectElRef;
    lstoption;
    selectedValues = [];
    selectedrtnValues = [];
    @Input()
    set listoptions(option: any) {
        this.lstoption = option;
    }

    get listoptions(): any {
        return this.getReturnValue();
    }



    @Input()
    set SelectedValue(SelectedVal: any) {
        this.selectedValues = SelectedVal;
        if (SelectedVal != null) {
            SelectedVal.split(',').forEach(data => {
                this.selectedrtnValues.push(data);
            });
        }

    }

    get SelectedValue(): any {
        return this.getListBoxSelectVal(this.selectedValues);
    }

    rtnalue;
    getReturnValue() {
        return this.selectedValues;
    }

    constructor() {
        //   console.clear();
    }

    change(options) {
        this.selectedrtnValues = Array.apply(null, options)  // convert to real Array
            .filter(option => option.selected)
            .map(option => option.value)
    }

    listValue = "";
    temSelectedValue = [];
    getListBoxSelectVal(val) {
        this.temSelectedValue = [];

        if (this.selectedrtnValues != null && this.selectedrtnValues[0] != null) {
            this.listValue = "";
            this.selectedrtnValues.forEach(data => {
                this.temSelectedValue.push(data);
                let index = this.temSelectedValue.filter(x => x == data);
                if (index.length == 1) {
                    this.listValue += data + ",";
                }
            });

            return this.listValue.substring(0, this.listValue.length - 1);
        }
    }

    ngAfterViewChecked() {

        // this.updateSelectList();
    }

    exists(id) {
        if (this.selectedValues != null) {
            return this.selectedValues.indexOf(id) > -1 ? true : null
        }

    }


}


